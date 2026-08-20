# Regenerate — Round 3 client review artifact

**Palette C applied · logo system · healthcare positioning · hero & motion concept**

> **Nothing here is implemented or deployed.** The production site is untouched — no
> design tokens, logo wiring, navigation, treatment routes or content have changed.
> This is a review artifact only.

**Checkpoint before this round: `a6b0805`** — undo everything with
`git reset --hard a6b0805`
Branch: `client-review/round-3-motion`

---

## Where to open it

```bash
node docs/client-review/.server.mjs
```
Then open:

```
http://localhost:4322/round-3/index.html
```

Motion has to be seen live — scroll it, hover the nav, open the mobile menu. The
still screenshots in `shots/` are for sending to the client; the URL above is for
judging the motion.

### Recommended viewports

| | Size | Why |
| --- | --- | --- |
| **Mobile (priority)** | **390 × 844** | iPhone 14/15/16 class. The client asked for mobile specifically — lead with these. 375 × 812 also verified. |
| **Desktop** | **1440 × 900** | Shows the full two-column hero and the white-space hierarchy. |
| Tablet | 768 × 1024 | Verified, no separate shots — the layout is a clean two-column step. |

Verified for horizontal overflow at 320 / 360 / 375 / 390 / 430 / 768 / 1024 / 1440 — **zero at every width.**

### Screenshots for the client — `shots/`

**Mobile (send these first)**
`mobile-full` · `mobile-01-hero` · `mobile-02-healthcare` · `mobile-03-cards` ·
`mobile-04-architecture` · `mobile-05-footer` · `mobile-06-menu`

**Desktop**
`desktop-full` · `desktop-01-hero` · `desktop-02-healthcare` · `desktop-03-cards` · `desktop-04-footer`

**Motion**
`hero-motion-sequence` — the hero reveal captured at 0.26s / 0.62s / 1.50s, since
motion cannot be judged from a settled still.

All also exported as `.webp`.

---

## What changed from round 2

### Palette C, applied with restraint
White is now the ground everywhere. Olive-gold appears **only** where it earns its place:
buttons, the small uppercase labels, nav hover/active underlines, the thin rule that
marks each list item, and the numerals in the mobile menu. Cards, the value strip and
the treatment-architecture panels are all white or near-white with a hairline border.

There is **one deliberate warm surface** — the healthcare positioning section
(`--surface-sunken`, `#fbf8f1`). It is the only cream field on the page, which is what
makes it read as intentional rather than decorative.

### Logo system
- **Circular logo is the main identity** — in the header at 58px, shrinking to 48px on
  scroll. Legible at both.
- **Full R + dandelion emblem** is the background artwork. The standalone dandelion is
  gone entirely.
- **Emblem sits behind text, never under an image** — exactly as the client asked. It
  appears behind the healthcare statement, behind the footer identity, and in the corner
  of the mobile menu. It is nowhere near a photo placeholder.
- **Footer is the emblem + brand identity lockup**, centred, as the clinic's sign-off.

### Healthcare positioning section
The supplied paragraph appears **word for word**. Nothing was rewritten, corrected or
paraphrased. Only typography, line breaks and spacing were designed:

- *"Skincare and haircare are healthcare."* is pulled out as the large serif statement.
- The remainder runs as the body paragraph.
- *"Start today!"* is set in olive-gold as the closing beat.

Placed **after** the hero and value strip, **before** the treatment pathways — so the
visitor meets the clinic, then the position, then the treatments.

### Image placeholders
Deliberately plain — a hairline border, a near-white fill and a label. No emblem behind
them, no branded treatment. They are sized so real photography or video drops in without
any structural change.

---

## Hero and motion

### Hero media architecture
The hero contains a **real `<video>` element**, currently hidden, with the `<source>`
commented out. When the clinic film arrives:

```html
<source src="media/clinic-hero-10s.mp4" type="video/mp4">
```
…un-hide the video, delete the `.mock` div. No layout change.

The placeholder inside is a slow-drifting architectural light study — deliberately **not**
stock photography, and labelled *"Clinic film — placeholder"* so it can never be mistaken
for final media. It demonstrates the behaviour the real footage will inherit: slow
movement, seamless loop, cinematic restraint.

The label also records the spec: **~10s seamless loop, gimbal, 4K source, compressed for
fast load** — the client's own note that it must not be heavy or slow to load.

### Motion language
Built on the project's **real stack** — GSAP + ScrollTrigger + Lenis, copied from
`node_modules` into `vendor/`. What the client approves here is what ships.

| Where | What happens |
| --- | --- |
| Hero | Media reveals with a slow clip-path wipe; headline lines rise out of their own masks; lead and CTAs follow. ~1.5s total, unhurried. |
| Hero media | Very gentle scroll parallax, stops at the section edge. |
| Section headers | Staged rise on entry, one element at a time. |
| Healthcare statement | Line-by-line masked reveal — the strongest moment on the page, matching its importance. |
| Dividers | Hairlines draw in from the left rather than appearing. |
| Cards / value strip / flow | Grouped stagger on entry. |
| Card hover | Border warms to olive, lifts 4px, arrow slides. No scaling. |
| Navigation | Hover underline sweeps in from the left; active section is tracked while scrolling. |
| Mobile menu | Full-screen clip-path wipe, then items stagger in with their numerals. |
| Background emblem | Extremely slow scroll-linked drift. **No loop** — it only stops the composition feeling static. |

**Reduced motion is fully respected** — Lenis is not instantiated at all, GSAP
enhancement is skipped, and every element renders in its final state.

---

## What the client needs to approve

1. **Palette C application** — is the balance right across the whole page?
2. **White / clinical balance** — enough white, or still too warm?
3. **Amount of olive-gold** — buttons, small labels, nav accents, list rules. Too much, too little?
4. **Circular main logo** — size and presence in the header.
5. **R + dandelion background emblem** — placement behind text, opacity, frequency.
6. **Footer branding** — emblem + brand identity lockup.
7. **Healthcare statement placement** — after hero and value strip, before treatments.
8. **Hero visual composition** — two-column, large type, tall media.
9. **Hero motion** — pacing of the reveal. *(view live)*
10. **Scroll / section animation style** — amount and speed of reveals. *(view live)*
11. **Navigation motion** — hover, active state, mobile menu entrance. *(view live)*
12. **Mobile presentation** — the priority for this round.

---

## Still pending from the client

| # | Item | Blocking |
| --- | --- | --- |
| 1 | **Finalised treatment list** | Treatment detail pages. Architecture is approved and the template is ready, but no production routes will be created until the list arrives. |
| 2 | **Clinic hero video** (~10s, 4K, gimbal) | Final hero. Architecture is ready for drop-in. |
| 3 | **Clinic photography** — treatment rooms, reception, practitioners, space | Every image placeholder on the site. |
| 4 | **Practitioner details** — names, roles, qualifications, AHPRA registration | Practitioner section. |
| 5 | **Public phone number** | Still the `(03) 0000 0000` placeholder. |
| 6 | **Clinical sign-off** on which claims and aftercare instructions may be published | Treatment content. |
| 7 | **Hydra vs HydraFacial** — same service? Rename? | Treatment naming. |
| 8 | **LED** — standalone bookable service, or a modality? | Treatment list and pricing. |
| 9 | **Legal copy** — privacy, terms, cancellation | Legal pages, still placeholders. |
| 10 | **Button contrast decision** — white on `#8c7a45` is ≈4.21:1 vs the 4.5:1 AA target | Carried over from round 2. Unresolved, and unchanged here because the client asked to keep the button colour. |

---

## Isolation

- Everything is inside `docs/client-review/round-3/`. Nothing is imported by the Next.js
  app, and `docs` is already excluded from `tsconfig.json`.
- **No production file was modified this round.** `git diff a6b0805 -- src public scripts`
  returns nothing.
- To remove entirely: `rm -rf docs/client-review/round-3`.
- Typecheck, lint and build were verified passing before and after.

### What was NOT done, on purpose

- No treatment pages built, no treatment list guessed, no prices or durations invented,
  no clinical wording altered, `HydraFacial` not renamed.
- The client-supplied healthcare paragraph was not edited in any way.
- The logo typography was not touched. *(The earlier question about the logo's last line
  is closed and is not raised again.)*
- Cellora was used only as an art-direction reference for pacing and spatial composition.
  Nothing was copied from it — no layout, no assets, no copy.
