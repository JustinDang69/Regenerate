/* =============================================================================
   POST /api/bookings/create — create a Microsoft Bookings appointment.
   -----------------------------------------------------------------------------
   Input : { firstName, lastName, email, phone, serviceId, date, time, notes? }
   Output: { success: true, appointment: { id, serviceName, date, time,
             endTime, durationMinutes, timeZone } }

   The availability the customer saw is NEVER trusted. This route re-queries
   Graph for the requested day, confirms the slot is on the clinic's rhythm
   and still free for the full 50 minutes for at least one assigned
   practitioner, assigns exactly that one practitioner, and only then calls
   POST /v1.0/solutions/bookingBusinesses/{id}/appointments.

   If the slot is gone → HTTP 409, no appointment created.
   ========================================================================== */
import {
  createAppointment,
  findBookableService,
  getCustomQuestions,
  getStoredAppointmentSummary,
} from "@/lib/bookings/graph";
import { buildCustomQuestionAnswers, missingQuestionNames } from "@/lib/bookings/custom-questions";
import { composeAppointmentNotes } from "@/lib/bookings/notes";
import { computeSlots, isDateInBookingWindow, MAX_DAYS_AHEAD, parseHM, parseLocalDate, SLOT_MINUTES } from "@/lib/bookings/availability";
import { bookingsConfigured, fail, logSafe, notConfigured, ok, readJson, str, upstreamError } from "@/lib/bookings/http";
import { localDateString, melbourneHM, MELBOURNE_TZ } from "@/lib/bookings/time";
import { customerFacingName } from "@/lib/bookings/service-map";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = { name: 80, email: 160, phone: 40, notes: 1000, profile: 40 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Digits, spaces, +, (), - and dots; 8–15 digits overall (E.164 upper bound). */
const PHONE_RE = /^[+\d][\d\s().-]{5,}$/;

const SLOT_TAKEN_MESSAGE = "That time has just been booked. Please choose another available time.";

export async function POST(req: Request) {
  if (!bookingsConfigured()) return notConfigured();

  const body = await readJson(req);
  if (!body) return fail(400, "invalid_json", "Request body must be a JSON object.");

  /* --- Validation ---------------------------------------------------------- */
  const firstName = str(body.firstName, MAX.name);
  const lastName = str(body.lastName, MAX.name);
  const email = str(body.email, MAX.email);
  const phone = str(body.phone, MAX.phone);
  const serviceId = str(body.serviceId, 200);
  const date = parseLocalDate(body.date);
  const time = parseHM(body.time);
  const notes = str(body.notes, MAX.notes);
  /* Optional medical profile. Free text, never validated into a number:
     "32", "about 30" and "175cm" are all acceptable to the clinic. */
  const age = str(body.age, MAX.profile);
  const height = str(body.height, MAX.profile);
  const weight = str(body.weight, MAX.profile);

  const problems: Record<string, string> = {};
  if (!firstName) problems.firstName = "First name is required.";
  if (!lastName) problems.lastName = "Last name is required.";
  if (!EMAIL_RE.test(email)) problems.email = "A valid email address is required.";
  if (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 8 || phone.replace(/\D/g, "").length > 15) {
    problems.phone = "A valid phone number is required.";
  }
  if (!serviceId) problems.serviceId = "Please choose a treatment.";
  if (!date) problems.date = "Please choose a valid date (YYYY-MM-DD).";
  else if (!isDateInBookingWindow(date)) problems.date = `Please choose a date within the next ${MAX_DAYS_AHEAD} days.`;
  if (!time) problems.time = "Please choose a time (HH:MM).";
  if (Object.keys(problems).length > 0) {
    return fail(422, "validation", "Please check the highlighted fields.", { fields: problems });
  }

  try {
    const service = await findBookableService(serviceId);
    if (!service) return fail(404, "service_not_found", "That treatment is not available for online booking.");

    /* --- Re-verify availability right now (never trust the client) --------- */
    const slots = await computeSlots(service, date!);
    const slot = slots.find((s) => s.time === time);
    if (!slot) {
      logSafe("info", "bookings: slot no longer available", { serviceId, date: localDateString(date!), time });
      return fail(409, "slot_unavailable", SLOT_TAKEN_MESSAGE);
    }

    /* --- Assign exactly one free practitioner ------------------------------ */
    const staffMemberId = slot.freeStaffIds[0];

    /* --- Optional profile → Bookings custom questions ----------------------- */
    /* Reading the questions must never stop a booking: if Graph fails here the
       appointment still goes ahead, with the values carried in the notes. */
    let questions: { id: string; displayName: string }[] = [];
    try {
      questions = await getCustomQuestions();
      const missing = missingQuestionNames(questions);
      if (missing.length > 0) {
        // Names only — never a customer's answer.
        logSafe("warn", "bookings: expected custom questions missing", { missing });
      }
    } catch (err) {
      logSafe("warn", "bookings: could not read custom questions", {
        message: err instanceof Error ? err.message : String(err),
      });
    }

    const { answers, unmapped } = buildCustomQuestionAnswers({ age, height, weight }, questions);
    /* Anything Bookings has no question for falls back into the notes, so a
       value the customer supplied is never silently dropped. */
    const composedNotes = composeAppointmentNotes({
      age: unmapped.find((u) => u.label === "Age")?.value,
      height: unmapped.find((u) => u.label === "Height")?.value,
      weight: unmapped.find((u) => u.label === "Weight")?.value,
      notes,
    });

    const created = await createAppointment({
      serviceId: service.id,
      staffMemberId,
      startUtc: slot.startUtc,
      endUtc: slot.endUtc,
      durationMinutes: SLOT_MINUTES,
      customer: { firstName, lastName, email, phone, notes: composedNotes || undefined },
      customQuestionAnswers: answers,
    });

    logSafe("info", "bookings: appointment created", {
      appointmentId: created.id,
      serviceId: service.id,
      date: localDateString(date!),
      time,
      customAnswers: answers.length,
      notesFallback: unmapped.length,
    });

    /* --- TEMPORARY read-back verification (server log only) ----------------
       TODO(remove): delete once Age/Height/Weight are confirmed visible in
       Bookings. Reads the appointment straight back from Graph and logs ONLY
       safe metadata — counts, the clinic's own question names and booleans.
       The customer's answers and notes are never logged, returned or shown.

       This distinguishes "Graph silently dropped our data" from "Bookings
       does not display it", which look identical in the clinic calendar.

       It runs AFTER the booking is confirmed and is wrapped so that a failure
       here can never affect the customer: the appointment already exists. */
    if (created.id) {
      try {
        const stored = await getStoredAppointmentSummary(created.id);
        logSafe("info", "bookings: appointment verification", {
          appointmentId: created.id,
          sentCustomAnswers: answers.length,
          sentNotes: composedNotes.length > 0,
          ...stored,
        });
      } catch (err) {
        logSafe("warn", "bookings: could not read appointment back", {
          appointmentId: created.id,
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }

    /* CONFIRMATION TIME — read this before changing it.

       The customer-facing time comes from the VALIDATED SLOT, never from the
       Graph create response. Bookings echoes the appointment back as the
       Melbourne wall-clock time but labels it timeZone "UTC"; converting that
       to Melbourne shifts it ten hours, which is why a 10:20 AM booking once
       confirmed as 8:20 PM. Microsoft's own record and email were correct —
       only our re-conversion was wrong.

       `slot` is the block we just re-verified and asked Graph to book, so its
       time IS the booked time. created.startUtc / created.endUtc are
       deliberately unused here; `created.id` is the only field we trust. */
    return ok(
      {
        appointment: {
          id: created.id,
          serviceName: customerFacingName(service.displayName),
          date: localDateString(date!),
          time: slot.time,
          endTime: melbourneHM(slot.endUtc),
          durationMinutes: SLOT_MINUTES,
          timeZone: MELBOURNE_TZ,
        },
      },
      201
    );
  } catch (err) {
    return upstreamError("bookings/create", err);
  }
}
