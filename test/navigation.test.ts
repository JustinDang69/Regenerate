/* =============================================================================
   Navigation — locks the client-confirmed menu (brief, 28 Sep 2026).
   -----------------------------------------------------------------------------
   The drawer's 01, 02 … numbering is the array position in primaryNav, so the
   order asserted here IS the numbering visitors see.
   ========================================================================== */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

import { primaryNav, footerNav, bookHrefFor, cta } from "@/lib/site";
import { selectableConcerns, concernsInGroup } from "@/content/concern-selector";
import { skinConcerns, hairConcerns } from "@/content/concerns";

function group(label: string) {
  const g = primaryNav.find((n) => n.label === label);
  assert.ok(g, `nav group "${label}" must exist`);
  return g;
}
const childLabels = (label: string) => (group(label).children ?? []).map((c) => c.label);

test("top-level order and numbering: 01 Home … 08 About", () => {
  const numbered = primaryNav.map((n, i) => `${String(i + 1).padStart(2, "0")} ${n.label}`);
  assert.deepEqual(numbered, [
    "01 Home",
    "02 Concerns",
    "03 Skin",
    "04 Hair",
    "05 Skin Treatments",
    "06 Hair Treatments",
    "07 Pricing",
    "08 About",
  ]);
});

test("02 Concerns: renamed from Treatments, no 'All Treatments'", () => {
  assert.equal(group("Concerns").href, "/concerns");
  assert.deepEqual(childLabels("Concerns"), ["Skin Concerns", "Hair Concerns", "Skin and Scalp Technologies"]);
  assert.ok(!primaryNav.some((n) => n.label === "Treatments"));
  assert.ok(!primaryNav.flatMap((n) => n.children ?? []).some((c) => c.label === "All Treatments"));
});

test("03 Skin: Skin Treatments, then the four concerns in client order", () => {
  assert.deepEqual(childLabels("Skin"), [
    "Skin Treatments",
    "Rejuvenation & Aging",
    "Scarring & Texture",
    "Pigmentation & Brightening",
    "Acne & Congestion",
  ]);
});

test("04 Hair: Hair Treatments, then the three concerns in client order", () => {
  assert.deepEqual(childLabels("Hair"), [
    "Hair Treatments",
    "Hair thinning + Hair loss",
    "Scalp health",
    "Hair greying",
  ]);
});

test("05 / 06 open the dedicated treatment pages, which exist as routes", () => {
  assert.equal(group("Skin Treatments").href, "/skin-treatments");
  assert.equal(group("Hair Treatments").href, "/hair-treatments");
  assert.ok(existsSync("src/app/skin-treatments/page.tsx"), "/skin-treatments route is missing");
  assert.ok(existsSync("src/app/hair-treatments/page.tsx"), "/hair-treatments route is missing");
});

test("05 / 06: the eight treatments, by their canonical names, to existing pages", () => {
  assert.deepEqual(childLabels("Skin Treatments"), [
    "Facial Microneedling",
    "Facial Mesotherapy",
    "MedicalFACIAL",
    "UltraFACIAL",
  ]);
  assert.deepEqual(childLabels("Hair Treatments"), [
    "Scalp Microneedling",
    "Scalp Mesotherapy",
    "MedicalSCALP",
    "UltraSCALP",
  ]);
  // Treatment detail pages did NOT move — the booking CTAs live there.
  for (const g of ["Skin Treatments", "Hair Treatments"]) {
    for (const c of group(g).children ?? []) assert.match(c.href, /^\/treatments\/[a-z-]+$/);
  }
});

test("Skin/Hair concern anchors in the nav exist as concern slugs on those pages", () => {
  const skinSlugs = new Set(skinConcerns.map((c) => c.slug));
  const hairSlugs = new Set(hairConcerns.map((c) => c.slug));
  for (const c of group("Skin").children ?? []) {
    const hash = c.href.split("#")[1];
    if (hash) assert.ok(skinSlugs.has(hash), `/skin#${hash} has no section`);
  }
  for (const c of group("Hair").children ?? []) {
    const hash = c.href.split("#")[1];
    if (hash) assert.ok(hairSlugs.has(hash), `/hair#${hash} has no section`);
  }
});

test("the Skin and Hair pages list the client's concerns first, in order", () => {
  assert.deepEqual(skinConcerns.slice(0, 4).map((c) => c.title), [
    "Rejuvenation & Aging",
    "Scarring & Texture",
    "Pigmentation & Brightening",
    "Acne & Congestion",
  ]);
  assert.deepEqual(hairConcerns.slice(0, 3).map((c) => c.title), [
    "Hair thinning + Hair loss",
    "Scalp health",
    "Hair greying",
  ]);
});

test("Concerns page selectors: 4 skin (2 × 2) and 3 hair, in client order", () => {
  assert.deepEqual(concernsInGroup("skin").map((c) => c.label), [
    "Rejuvenation & Aging",
    "Scarring & Texture",
    "Pigmentation & Brightening",
    "Acne & Congestion",
  ]);
  assert.deepEqual(concernsInGroup("hair").map((c) => c.label), [
    "Hair thinning + Hair loss",
    "Scalp health",
    "Hair greying",
  ]);
  // Every recommended treatment is a real, bookable page.
  for (const c of selectableConcerns) {
    for (const slug of c.treatmentSlugs) assert.notEqual(bookHrefFor(slug), cta.bookHref, `${slug} must preselect`);
  }
});

/* Ids are read from the page SOURCE (literal id="…" on sections and on the
   components that forward it), so a renamed or removed section fails here
   rather than silently breaking a menu link. The production-build crawl
   checks the rendered DOM as well. */
function sectionIds(pageFile: string) {
  return new Set([...readFileSync(pageFile, "utf8").matchAll(/\bid="([a-z0-9-]+)"/g)].map((m) => m[1]));
}

test("/concerns: every expected hash is a real section id on the page", () => {
  const ids = sectionIds("src/app/concerns/page.tsx");
  for (const hash of [
    "skin-concerns",
    "hair-concerns",
    "technologies",
    "skin-treatments",
    "hair-scalp-treatments",
    // Legacy anchors kept for old links.
    "concerns",
    "advanced-compounds",
    "shared-information",
  ]) {
    assert.ok(ids.has(hash), `/concerns#${hash} has no matching section id`);
  }
});

test("every /concerns#… link in the nav or footer points at a real section", () => {
  const ids = sectionIds("src/app/concerns/page.tsx");
  const hrefs = [
    ...primaryNav.flatMap((n) => [n.href, ...(n.children ?? []).map((c) => c.href)]),
    ...Object.values(footerNav).flat().map((l) => l.href),
  ];
  for (const h of hrefs.filter((x) => x.startsWith("/concerns#"))) {
    assert.ok(ids.has(h.split("#")[1]), `${h} has no matching section id`);
  }
});

test("cross-page anchors are not undone by a global ScrollTrigger refresh on leaving Home", () => {
  /* Regression lock for the /concerns#technologies bug: HealthcareStatement's
     unmount cleanup called ScrollTrigger.refresh(), which restored the cached
     Home scroll offset over the top of Next's hash scroll. See the component. */
  const src = readFileSync("src/components/sections/HealthcareStatement.tsx", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/ScrollTrigger\s*\.\s*refresh\s*\(/.test(src), "HealthcareStatement must not call ScrollTrigger.refresh()");
});

test("route-change anchor scrolls are instant: <html data-scroll-behavior> is set", () => {
  /* Next.js 16 only disables CSS smooth scrolling for a route change's
     hash scroll when this attribute is on <html>. Without it, cross-page
     anchors glided ~1s from the previous page's offset. */
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /<html[\s\S]*?data-scroll-behavior="smooth"/);
});

test("smooth scrolling is scoped to after hydration, so opening a #link is instant", () => {
  /* An unscoped `html { scroll-behavior: smooth }` also animated the
     browser's own jump when a page is opened at an anchor. */
  const css = readFileSync("src/app/globals.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/(^|[\s,}])html\s*\{[^}]*scroll-behavior:\s*smooth/.test(css), "bare html { scroll-behavior: smooth } is back");
  assert.match(css, /html\.js\s*\{[^}]*scroll-behavior:\s*smooth/);
});

test("no nav or footer link targets the old /treatments index", () => {
  const hrefs = [
    ...primaryNav.flatMap((n) => [n.href, ...(n.children ?? []).map((c) => c.href)]),
    ...Object.values(footerNav).flat().map((l) => l.href),
  ];
  for (const h of hrefs) assert.ok(!/^\/treatments(#|$)/.test(h), `stale link: ${h}`);
});

test("no concern copy makes a guaranteed-outcome claim", () => {
  const banned = /\b(cure|cures|guarantee|guaranteed|permanent(ly)?|eliminat\w*|remove[sd]?)\b/i;
  const copy = [
    ...selectableConcerns.map((c) => c.description),
    ...[...skinConcerns, ...hairConcerns].flatMap((c) => [c.summary, c.problem, c.approach, c.benefits]),
  ];
  for (const text of copy) assert.ok(!banned.test(text), `overclaim in: ${text}`);
});
