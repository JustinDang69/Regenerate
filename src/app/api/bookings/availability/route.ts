/* =============================================================================
   POST /api/bookings/availability — bookable start times for one day.
   -----------------------------------------------------------------------------
   Input : { serviceId: string, date: "YYYY-MM-DD" }   (date is Melbourne)
   Output: { success: true, date, timeZone, durationMinutes, slots: ["09:30", …] }

   serviceId is validated against the live Bookings service list; the staff
   assigned to that service are queried via getStaffAvailability; only slots
   where at least one of them is free for the whole 50-minute block are
   returned. Practitioner identities never leave the server.
   ========================================================================== */
import { findBookableService } from "@/lib/bookings/graph";
import { computeSlots, isDateInBookingWindow, MAX_DAYS_AHEAD, parseLocalDate, SLOT_MINUTES } from "@/lib/bookings/availability";
import { bookingsConfigured, fail, logSafe, notConfigured, ok, readJson, str, upstreamError } from "@/lib/bookings/http";
import { localDateString, MELBOURNE_TZ } from "@/lib/bookings/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!bookingsConfigured()) return notConfigured();

  const body = await readJson(req);
  if (!body) return fail(400, "invalid_json", "Request body must be a JSON object.");

  const serviceId = str(body.serviceId, 200);
  const date = parseLocalDate(body.date);
  if (!serviceId) return fail(422, "service_required", "Please choose a treatment.");
  if (!date) return fail(422, "date_invalid", "Please choose a valid date (YYYY-MM-DD).");
  if (!isDateInBookingWindow(date)) {
    return fail(422, "date_out_of_range", `Please choose a date within the next ${MAX_DAYS_AHEAD} days.`);
  }

  try {
    const service = await findBookableService(serviceId);
    if (!service) return fail(404, "service_not_found", "That treatment is not available for online booking.");

    const slots = await computeSlots(service, date);
    logSafe("info", "bookings: availability", { serviceId, date: localDateString(date), slotCount: slots.length });

    return ok({
      date: localDateString(date),
      timeZone: MELBOURNE_TZ,
      durationMinutes: SLOT_MINUTES,
      slots: slots.map((s) => s.time),
    });
  } catch (err) {
    return upstreamError("bookings/availability", err);
  }
}
