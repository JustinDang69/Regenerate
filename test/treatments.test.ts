/* =============================================================================
   Treatment steps — locked to the client's list of 28 Sep 2026 (Treatments.pdf).
   Exact wording, count and duration for the four step-list treatments.
   ========================================================================== */
import test from "node:test";
import assert from "node:assert/strict";
import { treatmentBySlug, treatmentMeta } from "@/content/treatments";

const expected: Record<string, { name: string; duration: string; steps: string[] }> = {
  facespa: {
    name: "UltraFACIAL",
    duration: "50 minutes",
    steps: [
      "Makeup/ sunscreen/ debris Removal", "Toner Exfoliation", "Steam", "Oxygenated Essence Water",
      "Deep-cleanse", "Face & Neck Massage", "Ultrasonic Exfoliation", "Toner Neutralisation",
      "Hydrodermabrasion Treatment", "Serum Highfrequency Treatment", "Serum Ultrasound Treatment",
      "Moisturiser Pore Miniature Treatment",
    ],
  },
  scalpspa: {
    name: "UltraSCALP",
    duration: "50 minutes",
    steps: [
      "Toner Exfoliation", "Steam", "Oxygenated Essence Water", "Cleansing", "Scalp & Neck Massage",
      "Ultrasonic Exfoliation", "Toner Neutralisation", "Hydrodermabrasion Treatment",
      "Serum Highfrequency Treatment", "Serum Ultrasound Treatment", "Serum Pore Miniature Treatment",
      "LED Light Treatment",
    ],
  },
  hydrafacial: {
    name: "MedicalFACIAL",
    duration: "65 minutes",
    steps: [
      "Scan & Consultation", "Makeup/ sunscreen/ debris Removal", "Toner Exfoliation", "Steam",
      "Oxygenated Essence Water", "Deep-cleanse", "Face & Neck Massage", "Ultrasonic Exfoliation & Extraction",
      "Toner Neutralisation", "Hydrodermabrasion Treatment", "Serum Highfrequency Treatment",
      "Serum Electroporosis (Electrical Microneedling) Treatment", "Serum Ultrasound Treatment",
      "Serum Radiofrequency Treatment", "Moisturiser Pore Miniature Treatment", "Light Therapy Treatment",
      "Sun Protection",
    ],
  },
  "hydrascalp-therapy": {
    name: "MedicalSCALP",
    duration: "65 minutes",
    steps: [
      "Scan & Consultation", "Toner Exfoliation", "Steam", "Natural oils Exfoliation",
      "Oxygenated Essence Water", "Deep-cleanse", "Scalp Massage", "Neck Massage",
      "Ultrasonic Exfoliation & Extraction", "Toner Neutralisation", "Hydrodermabrasion Treatment",
      "Serum Highfrequency Treatment", "Serum Electroporosis (Electrical Microneedling) Treatment",
      "Serum Ultrasound Treatment", "Serum Radiofrequency Treatment", "Moisturiser Pore Miniature Treatment",
      "Light Therapy Treatment",
    ],
  },
};

for (const [slug, exp] of Object.entries(expected)) {
  test(`${exp.name}: ${exp.steps.length} steps, ${exp.duration}, client wording`, () => {
    const t = treatmentBySlug(slug);
    assert.ok(t, `${slug} missing`);
    assert.equal(t.name, exp.name, "canonical name casing must not change");
    assert.equal(t.duration, exp.duration);
    assert.deepEqual(t.process?.steps.map((s) => s.title), exp.steps);
    assert.equal(treatmentMeta(t), `${exp.steps.length} steps · ${exp.duration}`);
    // Every step carries its description, so the accordion is expandable.
    for (const s of t.process!.steps) assert.ok(s.body.trim().length > 0, `${exp.name}: "${s.title}" has no body`);
  });
}

test("the same step title has the same description in every treatment", () => {
  const seen = new Map<string, string>();
  for (const slug of Object.keys(expected)) {
    for (const s of treatmentBySlug(slug)!.process!.steps) {
      if (seen.has(s.title)) assert.equal(s.body, seen.get(s.title), `"${s.title}" differs between treatments`);
      else seen.set(s.title, s.body);
    }
  }
});

test("the Medical treatments keep their benefits, aftercare and recommendation", () => {
  for (const slug of ["hydrafacial", "hydrascalp-therapy"]) {
    const t = treatmentBySlug(slug)!;
    assert.ok(t.benefits && t.benefits.length > 0, `${slug} lost benefits`);
    assert.ok(t.aftercare && t.aftercare.length > 0, `${slug} lost aftercare`);
    assert.ok(t.recommendation, `${slug} lost recommendation`);
    assert.ok(t.overview && t.preProcedure && t.during && t.postProcedure, `${slug} lost a section`);
  }
});
