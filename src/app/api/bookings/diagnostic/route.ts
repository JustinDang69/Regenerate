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
    return NextResponse.json(
      { success: true, temporary: true, count: businesses.length, bookingBusinesses: businesses },
      { headers: HEADERS }
    );
  } catch (err) {
    if (err instanceof GraphAuthError) return fail(err.status, "auth", err.code ?? "token_error", err.message);
    if (err instanceof GraphRequestError) return fail(err.status, "graph", err.code, err.message);
    return fail(500, "graph", "internal", err instanceof Error ? err.message : "Unknown error");
  }
}
