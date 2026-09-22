/* =============================================================================
   Bookings — safe server-side logging.
   -----------------------------------------------------------------------------
   Deliberately free of any Next.js import so the booking logic that uses it
   stays unit-testable outside the framework.

   WHAT MAY BE LOGGED: service ids, appointment ids, dates, local slot times,
   counts, HTTP status codes, Graph error codes, already-scrubbed messages,
   and POSITIONAL staff aliases ("staff-1", "staff-2").

   WHAT MAY NEVER BE LOGGED: a practitioner's name, email or Microsoft staff
   id; a customer's name, email, phone or notes; access tokens; the client
   secret; tenant or client ids; any environment variable.
   ========================================================================== */

export function logSafe(level: "info" | "warn" | "error", event: string, data: Record<string, unknown> = {}) {
  const line = JSON.stringify({ event, ...data });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}
