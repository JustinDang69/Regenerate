/* =============================================================================
   Header — sticky, scroll-aware navigation with dropdowns + mobile drawer.
   Concern-led nav (Home · Skin · Hair · Pricing · About) + persistent Book CTA.
   Accessible: keyboard-operable dropdowns, focus-visible, aria-expanded, ESC to
   close the mobile drawer, body scroll lock while open.
   ========================================================================== */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import { primaryNav, cta } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Scroll-aware surface (transparent-ish at top → solid on scroll).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the drawer/dropdown on route change. Adjusting state during render
     (React's documented pattern for "reset state when a value changes") rather
     than in an effect — avoids the extra commit and cascading re-render. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(false);
    setOpenDropdown(null);
  }

  // Body scroll lock + ESC handling for the mobile drawer.
  useEffect(() => {
    if (!openMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md shadow-[var(--shadow-xs)]"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-6 px-[var(--gutter)] py-3.5">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const hasChildren = !!item.children?.length;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasChildren && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  aria-expanded={hasChildren ? openDropdown === item.label : undefined}
                  className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-4 py-2 text-[0.9rem] font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-accent-contrast"
                      : "text-primary/80 hover:text-accent-contrast"
                  }`}
                >
                  {item.label}
                  {hasChildren && (
                    <svg viewBox="0 0 10 6" className="h-2 w-2 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path d="M1 1l4 4 4-4" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>

                {hasChildren && openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <ul className="w-64 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface p-2 shadow-[var(--shadow-md)]">
                      {item.children!.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="flex flex-col gap-0.5 rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors hover:bg-accent-soft/50"
                          >
                            <span className="text-[0.88rem] font-medium text-primary">{child.label}</span>
                            {child.hint && (
                              <span className="text-[0.74rem] text-muted">{child.hint}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Visibility is controlled on this wrapper, not on Button itself —
              Button's base `inline-flex` would otherwise override `hidden`.
              The sticky mobile CTA covers booking below the `sm` breakpoint. */}
          <span className="hidden sm:inline-flex">
            <Button href={cta.bookHref} size="sm">
              {cta.book}
            </Button>
          </span>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={openMenu ? "Close menu" : "Open menu"}
            aria-expanded={openMenu}
            onClick={() => setOpenMenu((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-300 ${openMenu ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition-opacity duration-300 ${openMenu ? "opacity-0" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-full bg-current transition-transform duration-300 ${openMenu ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Mobile drawer — rendered as a SIBLING of <header>, NOT a descendant.
          The header uses backdrop-blur, which establishes a containing block for
          fixed-position descendants; keeping the drawer outside lets its
          `fixed inset-0` fill the actual viewport. */}
      <div
        className={`fixed inset-0 top-0 z-[60] lg:hidden ${openMenu ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!openMenu}
      >
        <div
          className={`absolute inset-0 bg-overlay transition-opacity duration-300 ${openMenu ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpenMenu(false)}
        />
        <nav
          aria-label="Mobile"
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col gap-1 overflow-y-auto bg-background px-6 pb-10 pt-6 shadow-[var(--shadow-lg)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-soft)] ${
            openMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* The drawer overlays the header, so it carries the logo itself —
              keeps the brand present throughout the mobile navigation. */}
          <div className="mb-4 flex justify-start border-b border-border pb-5">
            <Logo />
          </div>

          {primaryNav.map((item) => (
            <div key={item.label} className="border-b border-border py-1">
              <Link
                href={item.href}
                className="block py-3 font-serif text-[1.4rem] text-primary"
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="mb-2 flex flex-col gap-1 pl-1">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="block py-1.5 text-[0.9rem] text-secondary">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Button href={cta.bookHref} size="lg" className="mt-6 w-full">
            {cta.book}
          </Button>
          <Button href={cta.enquireHref} variant="secondary" size="lg" className="mt-3 w-full">
            {cta.enquire}
          </Button>
        </nav>
      </div>
    </>
  );
}
