/* =============================================================================
   Microsoft Graph — server-only JSON request helper (v1.0 endpoints only).
   -----------------------------------------------------------------------------
   Wraps fetch with the client-credentials bearer token from ./auth and turns
   Graph error envelopes into GraphRequestError { status, code, message }.
   Messages are scrubbed of GUIDs / token-like strings before they exist as an
   Error, so nothing sensitive can be logged or returned by accident.
   ========================================================================== */
import "server-only";
import { getGraphAccessToken, scrubSensitive } from "@/lib/graph/auth";

const GRAPH_V1 = "https://graph.microsoft.com/v1.0";

export class GraphRequestError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(scrubSensitive(message));
    this.name = "GraphRequestError";
    this.status = status;
    this.code = code;
  }
}

type GraphErrorEnvelope = { error?: { code?: string; message?: string } };

/**
 * Performs a Graph v1.0 request and returns the parsed JSON body.
 * `path` is relative to /v1.0 (e.g. "/solutions/bookingBusinesses").
 * Throws GraphAuthError (from ./auth) or GraphRequestError.
 */
export async function graphRequest<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<T> {
  const token = await getGraphAccessToken();
  const method = init.method ?? "GET";

  let res: Response;
  try {
    res = await fetch(`${GRAPH_V1}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    throw new GraphRequestError(502, "network", err instanceof Error ? err.message : "Could not reach Microsoft Graph.");
  }

  if (res.status === 204) return undefined as T;

  const json = (await res.json().catch(() => ({}))) as T & GraphErrorEnvelope;
  if (!res.ok) {
    throw new GraphRequestError(
      res.status,
      json.error?.code ?? `http_${res.status}`,
      json.error?.message ?? `Microsoft Graph returned HTTP ${res.status}.`
    );
  }
  return json;
}
