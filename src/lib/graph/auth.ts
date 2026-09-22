/* =============================================================================
   Microsoft Graph — server-only authentication (OAuth 2.0 client credentials).
   -----------------------------------------------------------------------------
   Obtains an application access token for Microsoft Graph from an Entra ID
   app registration. Credentials come ONLY from environment variables:

     GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET

   `import "server-only"` makes any accidental import from a client component
   a build error, so the secret can never reach the browser bundle.

   The token is cached in module memory until shortly before it expires, so a
   burst of requests on one warm instance shares a single token call.

   NOTHING here ever logs or returns the token, the secret, the tenant ID or
   the client ID. Errors are reduced to a status code and a scrubbed message.
   ========================================================================== */
import "server-only";

const TOKEN_ENDPOINT = (tenant: string) =>
  `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`;
const GRAPH_SCOPE = "https://graph.microsoft.com/.default";

/** Refresh this many seconds before the token actually expires. */
const EXPIRY_SKEW_S = 120;

export class GraphAuthError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "GraphAuthError";
    this.status = status;
    this.code = code;
  }
}

type GraphCredentials = { tenant: string; clientId: string; secret: string };

function credentials(): GraphCredentials | null {
  const tenant = process.env.GRAPH_TENANT_ID;
  const clientId = process.env.GRAPH_CLIENT_ID;
  const secret = process.env.GRAPH_CLIENT_SECRET;
  if (!tenant || !clientId || !secret) return null;
  return { tenant, clientId, secret };
}

/** True when all three Graph credentials are present. Reveals nothing else. */
export function isGraphConfigured(): boolean {
  return credentials() !== null;
}

/* GUIDs (tenant / client IDs) and anything that looks like a bearer token or
   secret must never leave the server, even inside an error message. Entra's
   AADSTS messages routinely embed the application ID, so scrub defensively. */
const GUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const LONG_TOKEN_RE = /\b[A-Za-z0-9\-_~.]{40,}\b/g;

export function scrubSensitive(text: string): string {
  return text.replace(GUID_RE, "[redacted-id]").replace(LONG_TOKEN_RE, "[redacted]");
}

let cached: { token: string; expiresAt: number } | null = null;

/**
 * Returns a valid Graph application access token, requesting a new one via
 * the client-credentials grant when none is cached or it is about to expire.
 * Throws GraphAuthError (never containing credentials) on failure.
 */
export async function getGraphAccessToken(): Promise<string> {
  const cfg = credentials();
  if (!cfg) {
    throw new GraphAuthError("Microsoft Graph credentials are not configured.", 503, "not_configured");
  }

  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.token;

  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.secret,
    scope: GRAPH_SCOPE,
    grant_type: "client_credentials",
  });

  let res: Response;
  try {
    res = await fetch(TOKEN_ENDPOINT(cfg.tenant), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
  } catch (err) {
    throw new GraphAuthError(
      `Could not reach the Microsoft identity platform: ${scrubSensitive(err instanceof Error ? err.message : "network error")}`,
      502,
      "token_network"
    );
  }

  type TokenJson = {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  const json = (await res.json().catch(() => ({}))) as TokenJson;

  if (!res.ok || !json.access_token) {
    const description = json.error_description ?? json.error ?? `HTTP ${res.status}`;
    // Keep only the first line — Entra appends trace/correlation IDs and timestamps.
    const firstLine = description.split(/\r?\n/)[0] ?? description;
    throw new GraphAuthError(scrubSensitive(firstLine), res.status || 502, json.error ?? "token_error");
  }

  const ttlS = typeof json.expires_in === "number" ? json.expires_in : 3600;
  cached = {
    token: json.access_token,
    expiresAt: now + Math.max(ttlS - EXPIRY_SKEW_S, 60) * 1000,
  };
  return cached.token;
}
