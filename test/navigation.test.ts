/* =============================================================================
   Navigation — locks the client-confirmed menu (brief, 28 Sep 2026).
   -----------------------------------------------------------------------------
   The drawer's 01, 02 … numbering is the array position in primaryNav, so the
   order asserted here IS the numbering visitors see.
   ========================================================================== */
import test from "node:test";
import assert from "node:assert/strict";

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
