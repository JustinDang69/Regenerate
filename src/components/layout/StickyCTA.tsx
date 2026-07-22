/* =============================================================================
   StickyCTA — tasteful mobile-only booking bar. Appears after the user scrolls
   past the hero, hides near the footer. Never covers content on desktop.
   ========================================================================== */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cta } from "@/lib/site";

export default function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom =
        window.innerHeight + y > document.body.scrollHeight - 320;
      setShow(y > 640 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 p-3 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-[var(--radius-pill)] border border-border bg-background/90 p-2 pl-5 shadow-[var(--shadow-lg)] backdrop-blur-md">
        <span className="text-[0.85rem] font-medium text-primary">
          Ready when you are
        </span>
        <Link
          href={cta.bookHref}
          className="ml-auto rounded-[var(--radius-pill)] bg-accent px-5 py-2.5 text-[0.85rem] font-semibold text-on-accent"
        >
          {cta.book}
        </Link>
      </div>
    </div>
  );
}
