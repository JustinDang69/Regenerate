/* =============================================================================
   POST /api/bookings/availability — bookable start times for one day.
   -----------------------------------------------------------------------------
   Input : { serviceId: string, date: "YYYY-MM-DD" }   (date is Melbourne)
   Output: { success: true, date, timeZone, durationMinutes, slots: ["09:30", …],
             price: { price, normalPrice, discounted, offerLabel } | null }

   The date is checked against booking-calendar.ts FIRST (opening date, rolling
   two-month window, closures) — before Microsoft Bookings is touched — and
   rejected with 422 and a customer-readable message.

   `price` is calculated here, on the server, from the treatment and the
   APPOINTMENT date (booking-pricing.ts). The form only displays it.

   serviceId is validated against the live Bookings service list; the staff
   assigned to that service are queried via getStaffAvailability; only slots
   where at least one of them is free for the whole 50-minute block are
   returned. Practitioner identities never leave the server.
   ========================================================================== */
import { findBookableService } from "@/lib/bookings/graph";
import { computeSlots, parseLocalDate, SLOT_MINUTES } from "@/lib/bookings/availability";
import { checkAppointmentDate } from "@/lib/bookings/booking-calendar";
import { quotePrice, toPublicPrice } from "@/lib/bookings/booking-pricing";
import { customerFacingName } from "@/lib/bookings/service-map";
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
  const dateCheck = checkAppointmentDate(localDateString(date));
  if (!dateCheck.ok) return fail(422, dateCheck.code, dateCheck.message);

  try {
    const service = await findBookableService(serviceId);
    if (!service) return fail(404, "service_not_found", "That treatment is not available for online booking.");

    const slots = await computeSlots(service, date);
    logSafe("info", "bookings: availability", { serviceId, date: localDateString(date), slotCount: slots.length });

    const quote = quotePrice(customerFacingName(service.displayName), localDateString(date));

    return ok({
      date: localDateString(date),
      timeZone: MELBOURNE_TZ,
      durationMinutes: SLOT_MINUTES,
      slots: slots.map((s) => s.time),
      price: quote ? toPublicPrice(quote) : null,
    });
  } catch (err) {
    return upstreamError("bookings/availability", err);
  }
}
