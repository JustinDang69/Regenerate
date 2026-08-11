# Treatment migration plan — round 2

What would actually happen **after** the client approves the treatment architecture.
Nothing in this plan has been implemented.

---

## 1. Proposed URL architecture

```
/treatments                        index
/treatments/microneedling
/treatments/mesotherapy            (Face + Scalp sections on one page)
/treatments/led-light-therapy
/treatments/hydrafacial
```

If the client prefers Mesotherapy split:

```
/treatments/face-mesotherapy
/treatments/scalp-mesotherapy
```

**Navigation:** `/treatments` is deliberately **not** proposed for the primary nav yet.
The site's information architecture is concern-led (Skin / Hair / Pricing), and adding a
fifth device-led item would work against that. The recommendation is to link into
`/treatments/*` from the existing Skin, Hair and Pricing pages first, and only promote it
to the top level if the client wants it there.

---

## 2. New files

```
src/content/treatments.ts            treatment data (mirrors concerns.ts / packages.ts)
src/app/treatments/page.tsx          index
src/app/treatments/[slug]/page.tsx   detail, generateStaticParams over the slugs
```

A working detail template already exists at
[`treatment-detail-sample.tsx`](./treatment-detail-sample.tsx) — it uses only components
already in the repo, so **no new design system work is required**.

---

## 3. Files that would change

| File | Change |
| --- | --- |
| `src/content/packages.ts` | Cross-link existing treatments to their new detail pages. Prices unchanged. |
| `src/content/technologies.ts` | If LED becomes bookable, it gains a treatment entry as well as its technology entry. |
| `src/content/concerns.ts` | `relatedPackages` could gain `relatedTreatments`. |
| `src/app/skin/page.tsx`, `hair/page.tsx` | "Learn more" links into the relevant detail pages. |
| `src/app/pricing/page.tsx` | Treatment cards link to detail pages. |
| `src/app/sitemap.ts` | Add the new routes. |
| `src/lib/site.ts` | Only if `/treatments` enters navigation. |

---

## 4. Suggested data shape

```ts
export type Treatment = {
  slug: string;
  name: string;
  eyebrow: string;
  subtitle?: string;            // "The Collagen Booster" — pending client confirmation
  category: "skin" | "hair" | "both";
  intro: string;
  pathway: { concern: string; technology: string; benefit: string };
  before: string[];
  during: string[];
  after: string[];
  aftercare: { window: string; items: string[] }[];
  schedule: string;
  relatedPackages: string[];    // existing package slugs
  priceFrom?: number;           // omitted where no price is established
  reviewFlag?: string;          // compliance note, never rendered publicly
};
```

This mirrors the existing content modules, so the same swap-the-data-not-the-UI
principle continues to hold.

---

## 5. Sequence

1. Client approves architecture (one vs two Mesotherapy pages, LED bookable or not,
   Hydra vs HydraFacial naming).
2. Client signs off which clinical claims and aftercare instructions may be published.
3. Create `src/content/treatments.ts` with the approved copy only.
4. Add the two routes; reuse `PageHero`, `Section`, `SectionHeader`, `Reveal`,
   `CTABlock`, `Divider`.
5. Cross-link from Skin, Hair and Pricing.
6. Add routes to `sitemap.ts`.
7. Run typecheck, lint, build.
8. QA at 375 / 768 / 1024 / 1440; keyboard navigation; focus states; contrast.
9. Vercel preview → client final approval → merge.

---

## 6. Risks to watch

- **Duplicate content.** Micro-needling would then be described in three places
  (Skin concerns, Pricing, and its detail page). Each needs a distinct job:
  concern-led framing, price, and full detail respectively — not three copies of the
  same paragraph.
- **Navigation bloat.** Adding `/treatments` to the top level risks re-introducing the
  device-led IA the original brief explicitly moved away from.
- **Price drift.** Detail pages should read price from `packages.ts` rather than
  restating numbers, so there is only ever one source of truth.
- **Compliance regression.** The held-back items in
  [`treatment-content-map.md`](./treatment-content-map.md) must not be reintroduced when
  copy is finalised.
