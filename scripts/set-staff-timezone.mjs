/* =============================================================================
   ONE-TIME MAINTENANCE — set the Bookings practitioners' time zone.
   -----------------------------------------------------------------------------
   Run locally, never deployed. There is deliberately NO API route for this:
   it changes the clinic's Microsoft data and must not be reachable from the
   internet.

       node scripts/set-staff-timezone.mjs            # dry run, changes nothing
       node scripts/set-staff-timezone.mjs --apply    # performs the PATCH

   WHY: the practitioners have no timeZone set, so Microsoft Graph evaluates
   their 09:30–20:30 working hours in UTC. getStaffAvailability therefore
   reports them free 19:30–06:30 Melbourne and out of office through the whole
   working day. Setting the zone to "AUS Eastern Standard Time" makes those
   hours mean what the clinic intends.

   WHAT IT TOUCHES: the `timeZone` property only. displayName, emailAddress,
   role, useBusinessHours, workingHours and service assignments are never sent.

   OUTPUT: positional aliases only (staff-1, staff-2). It never prints a name,
   an email address, a staff id, a token or any credential.

   CREDENTIALS: read from the environment, or from .env.local (which is
   gitignored via `.env*`). Nothing is written to disk and nothing is logged.
   ========================================================================== */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TARGET_TIME_ZONE = "AUS Eastern Standard Time";
/* Match on given name only — surnames may differ from what the clinic told us. */
const WANTED = [/\bkendall\b/i, /\bwilliam\b/i];

const APPLY = process.argv.includes("--apply");

/* --- Environment ----------------------------------------------------------- */

function loadEnvLocal() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}
loadEnvLocal();

const TENANT = process.env.GRAPH_TENANT_ID;
const CLIENT_ID = process.env.GRAPH_CLIENT_ID;
const SECRET = process.env.GRAPH_CLIENT_SECRET;
const BUSINESS = process.env.BOOKINGS_BUSINESS_ID;

if (!TENANT || !CLIENT_ID || !SECRET || !BUSINESS) {
  console.error(
    [
      "Missing credentials. This script needs, in the environment or .env.local:",
      "  GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET, BOOKINGS_BUSINESS_ID",
      "",
      "If the project is linked to Vercel:  npx vercel env pull .env.local",
      "(.env.local is gitignored — do not commit it, and do not paste values here.)",
    ].join("\n")
  );
  process.exit(1);
}

/* --- Graph ----------------------------------------------------------------- */

const GRAPH = "https://graph.microsoft.com/v1.0";
const BASE = `${GRAPH}/solutions/bookingBusinesses/${encodeURIComponent(BUSINESS)}`;

async function token() {
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(TENANT)}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    // Never print the response body: Entra errors embed the application id.
    throw new Error(`Token request failed (HTTP ${res.status}).`);
  }
  return json.access_token;
}

async function graph(bearer, path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${bearer}`,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code = json?.error?.code ?? `http_${res.status}`;
    const message = String(json?.error?.message ?? "")
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "[redacted-id]")
      .split(/\r?\n/)[0];
    throw new Error(`Graph ${code}: ${message}`);
  }
  return json;
}

/* --- Run -------------------------------------------------------------------- */

const bearer = await token();

const listed = await graph(bearer, "/staffMembers");
const all = listed?.value ?? [];

/* Match by name, then immediately reduce each person to an alias. The name is
   used for matching and never printed. */
const matched = [];
for (const pattern of WANTED) {
  const hits = all.filter((s) => pattern.test(String(s.displayName ?? "")));
  if (hits.length === 0) {
    console.error(`No staff member matched ${pattern}. Nothing has been changed.`);
    process.exit(1);
  }
  if (hits.length > 1) {
    console.error(`${hits.length} staff members matched ${pattern} — too ambiguous to patch safely. Nothing changed.`);
    process.exit(1);
  }
  const s = hits[0];
  if (matched.some((m) => m.id === s.id)) {
    console.error("Both patterns matched the same person. Nothing has been changed.");
    process.exit(1);
  }
  matched.push({ id: s.id, before: { timeZone: s.timeZone ?? "", useBusinessHours: s.useBusinessHours ?? null } });
}

console.log(`Bookings staff found: ${all.length}. Matched for update: ${matched.length}.`);
matched.forEach((m, i) =>
  console.log(`  staff-${i + 1}  before: timeZone="${m.before.timeZone}" useBusinessHours=${m.before.useBusinessHours}`)
);

if (!APPLY) {
  console.log(`\nDRY RUN — nothing was changed. Re-run with --apply to set timeZone="${TARGET_TIME_ZONE}".`);
  process.exit(0);
}

for (let i = 0; i < matched.length; i++) {
  const alias = `staff-${i + 1}`;
  try {
    await graph(bearer, `/staffMembers/${encodeURIComponent(matched[i].id)}`, {
      method: "PATCH",
      body: JSON.stringify({ timeZone: TARGET_TIME_ZONE }),
    });
    console.log(`${alias} timezone updated`);
  } catch (err) {
    console.error(`${alias} update FAILED: ${err.message}`);
    process.exitCode = 1;
  }
}

/* --- Verify ----------------------------------------------------------------- */

console.log("\nVerifying…");
const after = (await graph(bearer, "/staffMembers"))?.value ?? [];
let ok = true;
matched.forEach((m, i) => {
  const s = after.find((x) => x.id === m.id);
  const tz = s?.timeZone ?? "";
  const ubh = s?.useBusinessHours ?? null;
  const good = tz === TARGET_TIME_ZONE && ubh === true;
  if (!good) ok = false;
  console.log(`  staff-${i + 1}  timeZone="${tz}"  useBusinessHours=${ubh}  ${good ? "OK" : "UNEXPECTED"}`);
});

console.log(ok ? "\nAll matched practitioners are set correctly." : "\nOne or more practitioners are not as expected.");
if (!ok) process.exitCode = 1;
