/* =============================================================================
   ContactForm — enquiry form (client component).
   -----------------------------------------------------------------------------
   Submits to POST /api/enquiry, which delivers to the reception mailbox via
   Microsoft Graph. Success is shown ONLY when the server confirms delivery.

   If delivery is not yet configured (503) or fails, the form does not pretend:
   it shows an honest fallback with a ready-made email to reception — the
   visitor's message is preserved in the mailto body so nothing is lost.

   Accessible: labelled inputs, required hints, aria-live status region.
   Honeypot field present here AND validated server-side.
   ========================================================================== */
"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "unconfigured" | "error";

const interests = [
  "Skin consultation",
  "Hair consultation",
  "Packages",
  "Single treatment",
  "General enquiry",
];

/* Builds a mailto: to the enquiry mailbox carrying the visitor's details, so
   the fallback path still delivers their message intact. */
function buildMailto(fields: Record<string, string>) {
  const subject = `Website enquiry — ${fields.firstName} ${fields.lastName}`.trim();
  const body = [
    `Name: ${fields.firstName} ${fields.lastName}`,
    `Email: ${fields.email}`,
    fields.phone ? `Phone: ${fields.phone}` : "",
    fields.interest ? `Interested in: ${fields.interest}` : "",
    "",
    fields.message || "",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
  return `mailto:${site.contact.enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState<string>(`mailto:${site.contact.enquiryEmail}`);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const fields = Object.fromEntries(
      [...fd.entries()].map(([k, v]) => [k, typeof v === "string" ? v.trim() : ""])
    ) as Record<string, string>;

    // Honeypot: real users never fill this hidden field.
    if (fields.company) return;

    // Client-side sanity check (the server validates again).
    if (!fields.firstName || !fields.lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      form.reportValidity();
      return;
    }

    setMailto(buildMailto(fields));
    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else if (res.status === 503) {
        setStatus("unconfigured");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3 text-[0.95rem] text-primary placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
  const labelCls = "flex flex-col gap-1.5 text-[0.82rem] font-semibold text-primary";

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-success/30 bg-success-soft/60 px-8 py-14 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="text-h3">Thank you — your enquiry has been sent</h3>
        <p className="max-w-sm text-secondary">
          It has reached our reception team, who will be in touch to help arrange your consultation.
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  /* Honest fallback: delivery isn't connected (or failed). The visitor's
     message is carried into a pre-filled email so it is never lost. */
  if (status === "unconfigured" || status === "error") {
    const failed = status === "error";
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-elevated px-8 py-12 text-center"
      >
        <span className="eyebrow text-muted">
          {failed ? "We couldn't send that just now" : "Email us directly"}
        </span>
        <h3 className="text-h3">Your message is ready to send</h3>
        <p className="max-w-md text-secondary text-pretty">
          {failed
            ? "Something went wrong on our side. Your enquiry has not been sent — please use the button below to email it to us directly, or call the clinic."
            : "Online enquiries aren't connected yet. Your enquiry has not been sent — please use the button below to email it to us directly, or call the clinic."}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <Button href={mailto}>
            Email your enquiry
          </Button>
          <Button href={`tel:${site.contact.phone}`} variant="secondary">
            Call {site.contact.phoneDisplay}
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-[0.82rem] text-muted underline underline-offset-2 hover:text-accent-contrast"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          First name<span className="text-accent"> *</span>
          <input name="firstName" required autoComplete="given-name" className={field} />
        </label>
        <label className={labelCls}>
          Last name<span className="text-accent"> *</span>
          <input name="lastName" required autoComplete="family-name" className={field} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          Email<span className="text-accent"> *</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className={labelCls}>
          Phone
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
      </div>

      <label className={labelCls}>
        I&apos;m interested in
        <select name="interest" className={field} defaultValue={interests[0]}>
          {interests.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </label>

      <label className={labelCls}>
        How can we help?
        <textarea
          name="message"
          rows={4}
          className={`${field} resize-y`}
          placeholder="Tell us a little about your skin or hair goals…"
        />
      </label>

      {/* Honeypot (visually hidden, not display:none so bots still see it) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className="text-[0.75rem] text-muted">
        By submitting, you agree to be contacted about your enquiry. We treat your
        details in line with our{" "}
        <a href="/legal/privacy" className="underline underline-offset-2">
          Privacy Policy
        </a>
        . {/* COMPLIANCE: confirm consent wording with the clinic before launch. */}
      </p>

      <div className="flex items-center gap-4">
        <Button variant="primary" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
        <span aria-live="polite" className="sr-only">
          {status === "submitting" ? "Sending your enquiry" : ""}
        </span>
      </div>
    </form>
  );
}
