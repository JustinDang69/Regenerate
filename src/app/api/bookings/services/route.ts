/* =============================================================================
   GET /api/bookings/services — bookable services from Microsoft Bookings.
   -----------------------------------------------------------------------------
   Graph: GET /v1.0/solutions/bookingBusinesses/{BOOKINGS_BUSINESS_ID}/services

   Returns only what the booking UI needs: id, displayName, duration, price.
   Staff assignments, hidden services and all other Bookings metadata stay
   on the server.
   ========================================================================== */
import { getBookableServices } from "@/lib/bookings/graph";
import { bookingsConfigured, logSafe, notConfigured, ok, upstreamError } from "@/lib/bookings/http";
import { SLOT_MINUTES } from "@/lib/bookings/availability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!bookingsConfigured()) return notConfigured();

  try {
    const services = (await getBookableServices()).map((s) => ({
      id: s.id,
      displayName: s.displayName,
      duration: s.defaultDuration,
      durationMinutes: s.durationMinutes,
      /** The block the website reserves — every current service is 50 min. */
      appointmentMinutes: SLOT_MINUTES,
      price: s.price,
      priceType: s.priceType,
    }));
    logSafe("info", "bookings: services listed", { count: services.length });
    return ok({ services });
  } catch (err) {
    return upstreamError("bookings/services", err);
  }
}
