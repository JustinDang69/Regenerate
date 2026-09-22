/* =============================================================================
   GET /api/bookings/diagnostic — TEMPORARY connectivity check.
   -----------------------------------------------------------------------------
   Confirms that the Entra app registration can authenticate to Microsoft
   Graph and read the tenant's Bookings businesses:

     GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses

   Requires the Graph APPLICATION permission `Bookings.Read.All` (or
   `BookingsAppointment.ReadWrite.All`) with admin consent granted. Without it
   Graph answers 403 and this route reports that code — which is itself the
   useful diagnostic.

   Returns ONLY: success, and each business's displayName + id. It never
   returns tokens, secrets, tenant/client IDs or any environment variable.
   Remove this route once the real Bookings integration is in place.
   ========================================================================== */
import { NextResponse } from "next/server";
import { getGraphAccessToken, GraphAuthError, isGraphConfigured, scrubSensitive } from "@/lib/graph/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRAPH_BOOKING_BUSINESSES = "https://graph.microsoft.com/v1.0/solutions/bookingBusinesses";

/* Never index or cache a diagnostic endpoint. */
const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

type BookingBusiness = { id?: string; displayName?: string };
type GraphError = { error?: { code?: string; message?: string } };

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

  let token: string;
  try {
    token = await getGraphAccessToken();
  } catch (err) {
    if (err instanceof GraphAuthError) return fail(err.status, "auth", err.code ?? "token_error", err.message);
    return fail(502, "auth", "token_error", err instanceof Error ? err.message : "Unknown token error");
  }

  let res: Response;
  try {
    res = await fetch(GRAPH_BOOKING_BUSINESSES, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
  } catch (err) {
    return fail(502, "graph", "network", err instanceof Error ? err.message : "Could not reach Microsoft Graph.");
  }

  const json = (await res.json().catch(() => ({}))) as { value?: BookingBusiness[] } & GraphError;

  if (!res.ok) {
    return fail(res.status, "graph", json.error?.code ?? `http_${res.status}`, json.error?.message ?? `Microsoft Graph returned HTTP ${res.status}.`);
  }

  const businesses = (json.value ?? []).map((b) => ({
    id: b.id ?? null,
    displayName: b.displayName ?? null,
  }));

  return NextResponse.json(
    { success: true, count: businesses.length, bookingBusinesses: businesses },
    { headers: HEADERS }
  );
}
