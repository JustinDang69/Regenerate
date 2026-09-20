# Clinic photography — source manifest

Client-supplied images (client's SECOND email set + Ken portrait + flower table),
mapped per the client's explicit instructions of 16 Sep 2026. The FIRST email's
image set is ignored per the client. Do not remap by aesthetics.

| File in `public/media/clinic/` | Client source filename | Content | Used for |
| --- | --- | --- | --- |
| `reception-logo-wall.jpg` | `reclinicphotoss/original-16FED9D4-CC15-4F6B-9760-44C9E235BC71.jpeg` | Regenerate wall logo, armchair, floor lamp, flower stand (portrait 3:4) | **Homepage primary / hero visual** (temporary until the clinic video arrives) |
| `practitioner-ken.jpg` | `reclinicphotoss/original-148414D9-2DA2-4BEE-B32E-1C42AEB95564.jpeg` | Ken, portrait (1:1) | **Practitioner** — homepage preview + About team. Role: Medical Director / Head of Practice |
| `practitioner-david-nguyen.jpg` | client upload, 20 Sep 2026 (`1.jpg`) | David Nguyen, portrait (1280×1830, 7:10) | **Practitioner** — About team. Role: Clinical Director / Facial Surgeon. Served unoptimised like the rest of this folder. |
| `clinic-space-flower-table.jpg` | `reclinicphotoss/original-E7EBDED9-8DFC-4236-922C-0E4697D326D5.jpeg` | Flower table / floral stand, kitchen beyond (portrait 3:4) | **About — Clinic Space** |
| `treatment-room-one-bed.jpg` | `reclinicphotos/original-67C78903-A07B-4EFF-9BC2-6CE0AB0B90FA.jpeg` | One-bed treatment room, basin with gold tap (4:3) | **About — Private Treatment Room** AND **Homepage — Skin Treatment Room** (client-confirmed intentional reuse) |
| `treatment-room-three-bed.jpg` | `reclinicphotos/original-B444F4F2-5033-408F-B68F-59ECBECB061B.jpeg` | Three-bed treatment room, fireplace, wardrobes (4:3) | **Homepage — Hair Treatment Room** |
| `waiting-room-sofa.jpg` | `reclinicphotos/original-6A38BC69-C46D-4CCA-8C7E-ADA926398D55.jpeg` | Full sofa + armchair seating, wall logo, flowers at edge (4:3) | **About — Waiting Room** (the image with the most complete view of the sofas) |
| `treatment-room-two-bed.jpg` | `reclinicphotos/original-2A0A4231-D01E-418A-A58C-0D833473BFD2.jpeg` | Two-bed treatment room, gold pendant (4:3) | **Skin — Acne & Congestion imagery** (explicit client instruction; NOT used as homepage Skin Treatment Room) |

## Notes

- Two images contain sofa + wall logo. The client's Waiting Room instruction
  ("choose the image with the most complete view of the sofas") distinguishes
  between them, which places the full-sofa image at Waiting Room and the
  centred-logo image as the hero. This is also the only assignment that uses
  all seven supplied images with the one reuse the client called out.
- Holders were adapted to the photographs where the original placeholder shape
  would have cropped aggressively (Waiting Room: landscape not tall; Acne:
  landscape not portrait arch; Clinic Space: 3:4 to match the photo exactly).
- When the clinic video arrives, set `HERO_VIDEO = true` in
  `src/components/sections/HeroMedia.tsx`; the hero image is replaced without
  any layout change.
