/* =============================================================================
   GET /api/bookings/diagnostic — *** TEMPORARY *** connectivity check.
   -----------------------------------------------------------------------------
   TODO(remove): delete this route once the booking UI is live. It exists only
   to confirm the Entra app registration can authenticate to Microsoft Graph
   and read the tenant's Bookings businesses:

     GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses

   Requires the Graph APPLICATION permission `Bookings.Read.All` (or
   `BookingsAppointment.ReadWrite.All`) with admin consent.

   Returns ONLY: success, and each business's displayName + id. It never
   returns tokens, secrets, tenant/client IDs or any environment variable.
   Error messages are scrubbed of GUIDs / token-like strings before leaving.
   ========================================================================== */
import { NextResponse } from "next/server";
import { GraphAuthError, isGraphConfigured, scrubSensitive } from "@/lib/graph/auth";
import { graphRequest, GraphRequestError } from "@/lib/graph/client";
import { bookingsBusinessId, getBusiness } from "@/lib/bookings/graph";
import { candidateStartsFrom, SLOT_MINUTES } from "@/lib/bookings/availability";
import { melbourneDate, melbourneHM } from "@/lib/bookings/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Never index or cache a diagnostic endpoint. */
const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

type BookingBusiness = { id?: string; displayName?: string };

function fail(status: number, stage: "config" | "auth" | "graph", code: string, message: string) {
  return NextResponse.json(
    { success: false, stage, status, error: { code, message: scrubSensitive(message) } },
    { status, headers: HEADERS }
  );
}

export async function GET() {
  if (!isGraphConfigured()) {
    return fail(503, "config", "not_configured", "Microsoft Graph credentials are not configured in this environment.");
  }

  try {
    const json = await graphRequest<{ value?: BookingBusiness[] }>("/solutions/bookingBusinesses");
    const businesses = (json.value ?? []).map((b) => ({
      id: b.id ?? null,
      displayName: b.displayName ?? null,
    }));

    /* Configured opening hours and the 50-minute rhythm they produce. Opening
       hours are published on the website already, so nothing here is private —
       and no staff, customer or appointment data is touched. This answers the
       common question "why does the site not offer the times I expect?": the
       rhythm below is what the clinic is OPEN for, before staff working hours,
       time off and existing appointments narrow it. */
    let schedule: unknown = null;
    if (bookingsBusinessId()) {
      const business = await getBusiness();
      const date = melbourneDate(Date.now());
      schedule = {
        businessHours: (business.businessHours ?? []).map((h) => ({
          day: h.day,
          timeSlots: (h.timeSlots ?? []).map((t) => `${t.startTime}–${t.endTime}`),
        })),
        rhythmToday: {
          date: `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`,
          slotMinutes: SLOT_MINUTES,
          candidateStarts: candidateStartsFrom(business.businessHours, date).map(melbourneHM),
        },
      };
    }

    return NextResponse.json(
      { success: true, temporary: true, count: businesses.length, bookingBusinesses: businesses, schedule },
      { headers: HEADERS }
    );
  } catch (err) {
    if (err instanceof GraphAuthError) return fail(err.status, "auth", err.code ?? "token_error", err.message);
    if (err instanceof GraphRequestError) return fail(err.status, "graph", err.code, err.message);
    return fail(500, "graph", "internal", err instanceof Error ? err.message : "Unknown error");
  }
}
