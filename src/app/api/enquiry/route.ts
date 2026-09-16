/* =============================================================================
   POST /api/enquiry — server-side enquiry delivery.
   -----------------------------------------------------------------------------
   Sends the enquiry to the reception mailbox via Microsoft Graph using the
   OAuth 2.0 client-credentials flow (an Entra ID app registration with the
   Mail.Send application permission). No mailbox password is involved anywhere.

   Credentials come ONLY from environment variables (see .env.example). If any
   are missing this route answers 503 `{ configured: false }` and the form
   shows an honest direct-email fallback. It NEVER reports success unless
   Microsoft Graph accepted the message (HTTP 202).

   Server-side validation and honeypot live here, not just in the browser.
   ========================================================================== */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Enquiry = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interest?: string;
  message?: string;
  company?: string; // honeypot — real users never fill it
};

const MAX = { name: 80, email: 160, phone: 40, interest: 80, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

function graphConfig() {
  const tenant = process.env.GRAPH_TENANT_ID;
  const clientId = process.env.GRAPH_CLIENT_ID;
  const secret = process.env.GRAPH_CLIENT_SECRET;
  const mailbox = process.env.ENQUIRY_MAILBOX;
  if (!tenant || !clientId || !secret || !mailbox) return null;
  return { tenant, clientId, secret, mailbox };
}

async function getToken(cfg: NonNullable<ReturnType<typeof graphConfig>>) {
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.secret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });
  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(cfg.tenant)}/oauth2/v2.0/token`,
    { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  if (!res.ok) throw new Error(`token ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("token missing");
  return json.access_token;
}

export async function POST(req: Request) {
  let data: Enquiry;
  try {
    data = (await req.json()) as Enquiry;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: silently accept so bots learn nothing, but deliver nothing.
  if (clean(data.company, 200)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const firstName = clean(data.firstName, MAX.name);
  const lastName = clean(data.lastName, MAX.name);
  const email = clean(data.email, MAX.email);
  const phone = clean(data.phone, MAX.phone);
  const interest = clean(data.interest, MAX.interest);
  const message = clean(data.message, MAX.message);

  if (!firstName || !lastName || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const cfg = graphConfig();
  if (!cfg) {
    // Not configured yet — the client shows the direct-email fallback.
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  const subject = `Website enquiry — ${firstName} ${lastName}${interest ? ` · ${interest}` : ""}`;
  const rows: [string, string][] = [
    ["Name", `${firstName} ${lastName}`],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Interested in", interest || "—"],
  ];
  const html = `
    <p>New enquiry from the Regenerate website.</p>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="color:#666"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}
    </table>
    <p><b>Message</b></p>
    <p style="white-space:pre-wrap">${escapeHtml(message || "—")}</p>`;

  try {
    const token = await getToken(cfg);
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.mailbox)}/sendMail`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            subject,
            body: { contentType: "HTML", content: html },
            toRecipients: [{ emailAddress: { address: cfg.mailbox } }],
            replyTo: [{ emailAddress: { address: email, name: `${firstName} ${lastName}` } }],
          },
          saveToSentItems: true,
        }),
      }
    );
    // Graph answers 202 Accepted on success. Anything else is a failure.
    if (res.status !== 202) {
      console.error("enquiry: graph sendMail failed", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("enquiry: delivery error", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
}
