/* =============================================================================
   Bookings — appointment notes composition.
   -----------------------------------------------------------------------------
   Microsoft Bookings has no dedicated age/height/weight fields on an
   appointment, so until they are deliberately mapped they travel in the
   customer notes, one labelled line each:

       Age: 32
       Height: 175 cm
       Weight: 70 kg
       Customer notes: Sensitive skin, please patch test

   All three are OPTIONAL. Only values the customer actually supplied appear,
   and their own note always keeps the last position. When nothing but the
   note is given, the note is sent on its own with no "Customer notes:" prefix,
   so a plain message reads exactly as they typed it.

   Plain module (no React, no server-only) so it is unit-testable.
   ========================================================================== */

export type MedicalProfile = {
  age?: string;
  height?: string;
  weight?: string;
  notes?: string;
};

export function composeAppointmentNotes(p: MedicalProfile): string {
  const lines: string[] = [];
  const add = (label: string, value: string | undefined) => {
    const v = (value ?? "").trim();
    if (v) lines.push(`${label}: ${v}`);
  };

  add("Age", p.age);
  add("Height", p.height);
  add("Weight", p.weight);

  const own = (p.notes ?? "").trim();
  if (own) lines.push(lines.length > 0 ? `Customer notes: ${own}` : own);

  return lines.join("\n");
}
