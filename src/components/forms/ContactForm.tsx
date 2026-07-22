/* =============================================================================
   ContactForm — enquiry / booking form (client component).
   -----------------------------------------------------------------------------
   FOUNDATION ONLY: this validates and simulates submission on the client.
   TODO(client/dev): wire to a real handler — a Next.js Route Handler + email
   service (e.g. Resend), a CRM, or the clinic's booking platform. Add spam
   protection (honeypot present below + server-side check) before going live.

   Accessible: labelled inputs, required hints, aria-live status region.
   ========================================================================== */
"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

const interests = [
  "Skin consultation",
  "Hair consultation",
  "Packages",
  "Single treatment",
  "General enquiry",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot: real users never fill this hidden field.
    if ((form.elements.namedItem("company") as HTMLInputElement)?.value) {
      return;
    }

    setStatus("submitting");
    try {
      // TODO(dev): replace with real POST to /api/enquiry (or booking platform).
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      form.reset();
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
        <h3 className="text-h3">Thank you — your enquiry is on its way</h3>
        <p className="max-w-sm text-secondary">
          A member of the Regenerate team will be in touch shortly to help arrange your consultation.
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send another enquiry
        </Button>
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
        <span aria-live="polite" className="text-[0.85rem] text-secondary">
          {status === "error" && "Something went wrong — please try again or email us."}
        </span>
      </div>
    </form>
  );
}
