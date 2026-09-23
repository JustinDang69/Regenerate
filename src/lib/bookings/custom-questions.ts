/* =============================================================================
   Bookings — optional medical profile as Bookings custom questions.
   -----------------------------------------------------------------------------
   Age, Height and Weight are collected on the website and sent to Microsoft
   Bookings as answers to the business's own custom questions, so they appear
   on the appointment in the Bookings calendar rather than only inside a note.

   The clinic must create the three questions in Bookings, named EXACTLY:

       Age        Height        Weight

   Matching is by display name (trimmed, case-insensitive) because Graph's
   question ids are opaque GUIDs that would otherwise have to be hard-coded.
   Those ids are server-side only and never reach the browser.

   NOTHING HERE MAY BREAK A BOOKING. A question the clinic has not created yet
   simply produces no answer, and the value falls back into the appointment
   notes so the customer's information is never silently lost.

   Plain module (no React, no server-only) so it is unit-testable.
   ========================================================================== */

/** The three optional fields, in the order they appear on the form. */
export const PROFILE_FIELDS = ["Age", "Height", "Weight"] as const;
export type ProfileLabel = (typeof PROFILE_FIELDS)[number];

export type MedicalProfile = {
  age?: string;
  height?: string;
  weight?: string;
};

/** Just enough of Graph's bookingCustomQuestion for matching. */
export type CustomQuestionLike = { id: string; displayName: string };

/** The shape Graph expects inside customers[].customQuestionAnswers. */
export type BookingQuestionAnswer = {
  "@odata.type": "#microsoft.graph.bookingQuestionAnswer";
  questionId: string;
  question: string;
  answerInputType: "text";
  answerOptions: string[];
  isRequired: false;
  answer: string;
  selectedOptions: string[];
};

export type BuiltAnswers = {
  /** Ready to send as customers[0].customQuestionAnswers. */
  answers: BookingQuestionAnswer[];
  /**
   * Labels the customer answered but Bookings has no question for. The caller
   * puts these in the notes instead, and logs the names — never the values.
   */
  unmapped: { label: ProfileLabel; value: string }[];
};

function normalise(s: string) {
  return s.trim().toLowerCase();
}

/**
 * Builds the custom-question answers for the values a customer supplied.
 * Blank, whitespace-only and absent fields produce no answer at all.
 */
export function buildCustomQuestionAnswers(
  profile: MedicalProfile,
  questions: CustomQuestionLike[]
): BuiltAnswers {
  const byName = new Map<string, CustomQuestionLike>();
  for (const q of questions) {
    if (!q?.id || typeof q.displayName !== "string") continue;
    const key = normalise(q.displayName);
    // First match wins, so a duplicate question cannot shadow the original.
    if (!byName.has(key)) byName.set(key, q);
  }

  const supplied: { label: ProfileLabel; value: string }[] = [];
  const push = (label: ProfileLabel, raw: string | undefined) => {
    const value = (raw ?? "").trim();
    if (value) supplied.push({ label, value });
  };
  push("Age", profile.age);
  push("Height", profile.height);
  push("Weight", profile.weight);

  const answers: BookingQuestionAnswer[] = [];
  const unmapped: { label: ProfileLabel; value: string }[] = [];

  for (const { label, value } of supplied) {
    const question = byName.get(normalise(label));
    if (!question) {
      unmapped.push({ label, value });
      continue;
    }
    answers.push({
      "@odata.type": "#microsoft.graph.bookingQuestionAnswer",
      questionId: question.id,
      question: label,
      answerInputType: "text",
      answerOptions: [],
      isRequired: false,
      answer: value,
      selectedOptions: [],
    });
  }

  return { answers, unmapped };
}

/** Names of the expected questions Bookings is missing. Safe to log. */
export function missingQuestionNames(questions: CustomQuestionLike[]): ProfileLabel[] {
  const present = new Set(questions.map((q) => normalise(q.displayName ?? "")));
  return PROFILE_FIELDS.filter((label) => !present.has(normalise(label)));
}
