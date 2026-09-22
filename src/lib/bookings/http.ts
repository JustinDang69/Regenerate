/* =============================================================================
   Bookings — shared route helpers (responses, error mapping, safe logging).
   -----------------------------------------------------------------------------
   Customer-facing routes return GENERIC messages. Graph error detail (already
   scrubbed of ids/tokens) goes to the server log only.
   ========================================================================== */
import "server-only";
import { NextResponse } from "next/server";
import { GraphAuthError, isGraphConfigured } from "@/lib/graph/auth";
import { GraphRequestError } from "@/lib/graph/client";
import { bookingsBusinessId } from "@/lib/bookings/graph";
import { logSafe } from "@/lib/bookings/log";

/* Re-exported so route files keep a single import for their helpers. */
export { logSafe };

export const NO_STORE = { "Cache-Control": "no-store" } as const;

export const UNAVAILABLE_MESSAGE =
  "Online booking is temporarily unavailable. Please call the clinic to book.";

export function ok<T extends object>(body: T, status = 200) {
  return NextResponse.json({ success: true, ...body }, { status, headers: NO_STORE });
}

export function fail(status: number, code: string, message: string, extra: object = {}) {
  return NextResponse.json({ success: false, error: { code, message }, ...extra }, { status, headers: NO_STORE });
}

/** True when both the Graph credentials and the business id are present. */
export function bookingsConfigured() {
  return isGraphConfigured() && bookingsBusinessId() !== null;
}

export function notConfigured() {
  logSafe("warn", "bookings: not configured");
  return fail(503, "not_configured", UNAVAILABLE_MESSAGE);
}

/** Maps any thrown error to a safe customer response, logging safe detail. */
export function upstreamError(context: string, err: unknown) {
  if (err instanceof GraphAuthError) {
    logSafe("error", `${context}: graph auth failed`, { status: err.status, code: err.code, message: err.message });
    return fail(502, "upstream_auth", UNAVAILABLE_MESSAGE);
  }
  if (err instanceof GraphRequestError) {
    logSafe("error", `${context}: graph request failed`, { status: err.status, code: err.code, message: err.message });
    return fail(502, "upstream", UNAVAILABLE_MESSAGE);
  }
  logSafe("error", `${context}: unexpected error`, { message: err instanceof Error ? err.message : String(err) });
  return fail(500, "internal", UNAVAILABLE_MESSAGE);
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const v = (await req.json()) as unknown;
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Trims, caps length and strips control characters from a string input. */
export function str(v: unknown, max: number) {
  if (typeof v !== "string") return "";
  const stripped = v.replace(/[\x00-\x1F\x7F]/g, " ");
  return stripped.trim().slice(0, max);
}
