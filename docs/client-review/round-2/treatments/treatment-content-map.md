# Treatment content map — round 2

How the two Word documents relate to what is **already on the website**, and exactly
what was changed on the way to the proposed public copy.

> **Important framing:** these are **not four new services.** Micro-needling, Face
> Mesotherapy, Scalp Mesotherapy and Hydra already exist in `src/content/packages.ts`,
> and LED already exists as a technology in `src/content/technologies.ts`. The
> documents are best understood as **much richer detail for services already offered**.

---

## 1. Source → current site → proposal

| Word-document content | Current website status | Proposed treatment |
| --- | --- | --- |
| **Microneedling / The Collagen Booster** | `Micro-needling` exists as a single treatment ($270) and inside *Skin Reclaim* / *Forever Twenty* packages | Expand into a full detail page. No price change. |
| **Mesotherapy / The Biorevitalisation** (face + scalp) | `Face Mesotherapy` ($290) and `Scalp Mesotherapy` ($290) both exist | One detail page with Face and Scalp sections — **or** two pages. Client decision. |
| **LED Light Therapy** | Exists as a *technology* (`led`), used inside other treatments. Not bookable, no price. | Client decision: keep as a modality, or promote to a bookable service. |
| **HydraFacial** | `Hydra` exists ($139). Whether it is the same service is **unconfirmed**. | Client decision: same service (rename?) or a separate, additional treatment. |

---

## 2. Three layers, kept deliberately separate

Per the brief, every piece of content sits in exactly one of these:

### Layer 1 — Client source
What the Word document literally says.

### Layer 2 — Proposed web copy
What is recommended for public display. Softened to supportive, consultation-led
framing consistent with the rest of the site (“designed to support”, “results vary”,
“confirmed in consultation”).

### Layer 3 — Clinical / legal review required
Held back from the mockups entirely. Listed below so nothing is quietly lost.

---

## 3. Layer 3 — held back from public copy

| # | Item | Source | Why it is held back |
| --- | --- | --- | --- |
| 1 | **Two named prescription medicines** in the scalp-mesotherapy passage | Clinic.docx | TGA guidance: prescription medicines generally cannot be advertised to the Australian public, and promoting a health service by referring to them — directly or indirectly — can itself constitute prohibited advertising. Kept as an internal clinical note only. **The names are not reproduced in these artifacts.** |
| 2 | **“300% to 500%” improved product absorption** | Clinic.docx | Ahpra prohibits advertising that creates unreasonable expectations of beneficial treatment. Needs supporting evidence and sign-off before any public use. |
| 3 | **Any absolute “safe” / “pain-free” / guaranteed-result phrasing** | Both | Same Ahpra basis. Softened to “comfort levels vary between individuals”. |
| 4 | **A price for LED Light Therapy or HydraFacial** | Neither document sets one | No public price invented. Existing prices left untouched. |
| 5 | **Assuming `Hydra` = `HydraFacial`** | — | Not established. Flagged as a client question rather than silently merged. |
| 6 | **Practitioner qualifications** | — | Still unconfirmed from round one. |

---

## 4. Copy softening — worked examples

| Source phrasing | Proposed public copy | Why |
| --- | --- | --- |
| “naturally helps your skin to boost collagen and elastin production resulting in skin remodelling” | “designed to support skin renewal, texture and collagen-related remodelling” | Removes the implied guaranteed physiological result. |
| “Discomfort during the procedure is minimal to none” | “Comfort levels vary between individuals and are discussed beforehand” | Avoids an absolute comfort promise. |
| “You will start to notice result after 5 days” | “Many people notice a change once flaking has settled” | Removes the guaranteed timeline. |
| “helps not only to make your skin glow but also improve skin laxity, reduce fine lines, fade pigmentation” | “designed to support glow, skin laxity, the appearance of fine lines and evenness of tone, depending on the products selected” | Shifts from claimed effects to intended support; adds the product-dependent caveat. |
| “Used cosmetically for uneven tone, but clinical evidence is less established” (green LED) | **Kept verbatim in substance** | The client's own document is appropriately cautious. Preserved rather than flattened. |
| Emoji (😊, ✨) and “Your Skin. Your Glow. Your Treatment.” | Removed | The stated goal this round is to move the impression away from beauty-salon toward restrained clinic. |

---

## 5. Aftercare and scheduling — carried across intact

These are practical instructions, not marketing claims, so they transfer with only
light rewording:

**Microneedling** — days 0–2 avoid touching the face, sun, strenuous exercise,
swimming, sauna, steam, make-up · days 0–4 gentle cleanser, hyaluronic-acid serum,
moisturiser, mineral SPF · days 5–7 reintroduce actives gradually.
Course: **3–6 sessions, 4–6 weeks apart**, maintenance every **3–4 months**.

**Mesotherapy** — as above, plus for scalp: no hair washing for 24 hours, avoid
scratching or pressure, no dye or chemical treatments for a week, clean pillowcase.
Course: **3–8 sessions, 2–6 weeks apart**, maintenance every **3–4 months**.
Pre-treatment: avoid blood thinners and alcohol 24–72 hours beforehand; skin must be
free of active infection, sunburn or irritation; no retinoids, peels or certain laser
for at least 7 days.

**HydraFacial** — first 24–48 hours avoid heat, saunas, steam, intense exercise and
harsh exfoliants; gentle products and daily SPF 30+.
Frequency: commonly **every 4–6 weeks**; intensive goals **2–4 weeks**; long-term
maintenance **1–3 months**.

---

## 6. Open questions for the client

1. Is **Hydra** the same service as **HydraFacial**? Should the public name change?
2. Are **The Collagen Booster** and **The Biorevitalisation** public-facing subtitles,
   or internal document headings only?
3. **One** Mesotherapy page with Face + Scalp sections, or **two** separate pages?
4. Is **LED Light Therapy** a standalone bookable service, or a modality within other
   treatments?
5. Which clinical claims and aftercare instructions have been **signed off** for
   publication?
6. Are current site prices and durations still approved?
7. Should `/treatments` eventually enter primary navigation, or stay linked from
   Skin / Hair / Pricing?
