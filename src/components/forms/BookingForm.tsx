/* =============================================================================
   BookingForm — customer-facing Microsoft Bookings workflow (client component).
   -----------------------------------------------------------------------------
   Three server endpoints, no Microsoft UI and no redirect to
   bookings.cloud.microsoft:

     GET  /api/bookings/services       → the dropdown
     POST /api/bookings/availability   → the time list for service + date
     POST /api/bookings/create         → the appointment

   Nothing sensitive reaches the browser: the server returns service ids and
   display names only — never staff ids, staff names, mailboxes or tokens.

   Preselection: `?service=` accepts a website treatment slug (e.g.
   "scalp-mesotherapy") and is resolved against the live service list, so no
   Bookings GUID is hard-coded here. An unknown or absent value simply leaves
   the dropdown empty.

   Styling deliberately mirrors ContactForm so the two flows look identical.
   ========================================================================== */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";
import { resolveServiceId, type ServiceLike } from "@/lib/bookings/service-map";
import { composeAppointmentNotes } from "@/lib/bookings/notes";

type Service = ServiceLike & { durationMinutes: number | null; appointmentMinutes: number };

type ServicesState = "loading" | "ready" | "error";
type SlotsState = "idle" | "loading" | "ready" | "error";
type Submit = "idle" | "submitting" | "success" | "error";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  /* Optional medical profile. Free text: the clinic reads these, nothing
     computes with them, and a customer may leave any of them blank. */
  age: string;
  height: string;
  weight: string;
  notes: string;
};

type Confirmation = {
  serviceName: string;
  date: string;
  time: string;
  endTime: string;
};

const EMPTY: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  serviceId: "",
  date: "",
  time: "",
  age: "",
  height: "",
  weight: "",
  notes: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MELBOURNE_TZ = "Australia/Melbourne";
const MAX_DAYS_AHEAD = 90;

/* --- Melbourne-aware date helpers (the visitor may be in any timezone) ----- */

function melbourneToday(): string {
  // en-CA gives YYYY-MM-DD directly.
  return new Intl.DateTimeFormat("en-CA", { timeZone: MELBOURNE_TZ }).format(new Date());
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

/** "13:40" → "1:40 PM". */
function to12Hour(hm: string): string {
  const [h, m] = hm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hm;
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/** "2026-09-24" → "Thursday 24 September 2026" (Melbourne calendar date). */
function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/* --- Component ------------------------------------------------------------- */

export default function BookingForm() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});

  const [services, setServices] = useState<Service[]>([]);
  const [servicesState, setServicesState] = useState<ServicesState>("loading");

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsState, setSlotsState] = useState<SlotsState>("idle");

  const [submit, setSubmit] = useState<Submit>("idle");
  const [formMessage, setFormMessage] = useState<string>("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  /* Guards against out-of-order availability responses. */
  const availabilityRun = useRef(0);
  /* Preselection must apply once, and must not fight the customer. */
  const preselected = useRef(false);

  const today = melbourneToday();
  const maxDate = addDays(today, MAX_DAYS_AHEAD);

  const set = useCallback(<K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({
      ...f,
      [key]: value,
      // Changing the treatment or the date invalidates any chosen time.
      ...(key === "serviceId" || key === "date" ? { time: "" } : {}),
    }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }, []);

  /* --- Load services, then apply ?service= preselection -------------------- */
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/bookings/services", { headers: { Accept: "application/json" } });
        const json = (await res.json().catch(() => null)) as { success?: boolean; services?: Service[] } | null;
        if (cancelled) return;
        if (!res.ok || !json?.success || !Array.isArray(json.services)) {
          setServicesState("error");
          return;
        }
        setServices(json.services);
        setServicesState("ready");

        /* Preselection happens here, in the same pass that learns the ids, so
           the dropdown never flickers from blank to chosen. A `?service=` the
           clinic no longer offers resolves to null and simply leaves it
           blank — a CTA can never preselect the wrong treatment. */
        if (!preselected.current) {
          preselected.current = true;
          const id = resolveServiceId(serviceParam, json.services);
          if (id) setFields((f) => (f.serviceId ? f : { ...f, serviceId: id }));
        }
      } catch {
        if (!cancelled) setServicesState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serviceParam]);

  /* --- Load availability whenever service or date changes ------------------ */
  const loadAvailability = useCallback(async (serviceId: string, date: string) => {
    const run = ++availabilityRun.current;
    if (!serviceId || !date) {
      setSlots([]);
      setSlotsState("idle");
      return;
    }
    setSlotsState("loading");
    setSlots([]);
    try {
      const res = await fetch("/api/bookings/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date }),
      });
      const json = (await res.json().catch(() => null)) as { success?: boolean; slots?: string[] } | null;
      if (run !== availabilityRun.current) return; // a newer request won
      if (!res.ok || !json?.success || !Array.isArray(json.slots)) {
        setSlotsState("error");
        return;
      }
      setSlots(json.slots);
      setSlotsState("ready");
    } catch {
      if (run === availabilityRun.current) setSlotsState("error");
    }
  }, []);

  /* Availability is refreshed from the change handlers rather than an effect:
     the load is a response to the customer's action, not state to synchronise.
     Each handler passes the NEW pair, so it never reads a stale value. */
  function handleServiceChange(serviceId: string) {
    set("serviceId", serviceId);
    void loadAvailability(serviceId, fields.date);
  }

  function handleDateChange(date: string) {
    set("date", date);
    void loadAvailability(fields.serviceId, date);
  }

  /* --- Validation ---------------------------------------------------------- */
  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.firstName.trim()) next.firstName = "Please enter your first name.";
    if (!fields.lastName.trim()) next.lastName = "Please enter your last name.";
    if (!EMAIL_RE.test(fields.email.trim())) next.email = "Please enter a valid email address.";
    const digits = fields.phone.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) next.phone = "Please enter a valid phone number.";
    if (!fields.serviceId) next.serviceId = "Please choose a treatment.";
    if (!fields.date) next.date = "Please choose a date.";
    if (!fields.time) next.time = "Please choose an available time.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /* --- Submit -------------------------------------------------------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormMessage("");
    if (!validate()) return;

    setSubmit("submitting");
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fields.firstName.trim(),
          lastName: fields.lastName.trim(),
          email: fields.email.trim(),
          phone: fields.phone.trim(),
          serviceId: fields.serviceId,
          date: fields.date,
          time: fields.time,
          ...(composeAppointmentNotes(fields) ? { notes: composeAppointmentNotes(fields) } : {}),
        }),
      });
      const json = (await res.json().catch(() => null)) as
        | {
            success?: boolean;
            appointment?: { serviceName?: string; date?: string; time?: string; endTime?: string };
            error?: { code?: string; message?: string };
            fields?: Record<string, string>;
          }
        | null;

      if (res.ok && json?.success && json.appointment) {
        setConfirmation({
          serviceName: json.appointment.serviceName ?? serviceName(fields.serviceId),
          date: json.appointment.date ?? fields.date,
          time: json.appointment.time ?? fields.time,
          endTime: json.appointment.endTime ?? "",
        });
        setSubmit("success");
        return;
      }

      /* The slot went while the customer was filling the form. Tell them
         plainly and put fresh times in front of them immediately. */
      if (res.status === 409) {
        setSubmit("idle");
        setFields((f) => ({ ...f, time: "" }));
        setFormMessage("That time has just been booked. Please choose another available time.");
        void loadAvailability(fields.serviceId, fields.date);
        return;
      }

      if (res.status === 422 && json?.fields) {
        const mapped: Partial<Record<keyof Fields, string>> = {};
        for (const [k, v] of Object.entries(json.fields)) {
          if (k in EMPTY) mapped[k as keyof Fields] = v;
        }
        setErrors(mapped);
        setSubmit("idle");
        setFormMessage("Please check the highlighted fields.");
        return;
      }

      setSubmit("error");
    } catch {
      setSubmit("error");
    }
  }

  function serviceName(id: string) {
    return services.find((s) => s.id === id)?.displayName ?? "";
  }

  function startAgain() {
    setFields(EMPTY);
    setErrors({});
    setSlots([]);
    setSlotsState("idle");
    setConfirmation(null);
    setFormMessage("");
    setSubmit("idle");
    preselected.current = true; // a fresh booking starts blank, by design
  }

  /* --- Shared classes (identical to ContactForm) --------------------------- */
  const field =
    "w-full rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3 text-[0.95rem] text-primary placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-muted";
  const fieldError = "border-danger focus:border-danger focus:ring-danger/25";
  const labelCls = "flex flex-col gap-1.5 text-[0.82rem] font-semibold text-primary";
  const errCls = "text-[0.78rem] font-normal text-danger";
  const cls = (key: keyof Fields) => `${field} ${errors[key] ? fieldError : ""}`;

  /* --- Confirmation -------------------------------------------------------- */
  if (submit === "success" && confirmation) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-success/30 bg-success-soft/60 px-8 py-12 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="text-h3">Your appointment is confirmed</h3>
        <p className="max-w-sm text-secondary">
          We&apos;ve sent a confirmation to <span className="break-all">{fields.email || "your email"}</span>. We look
          forward to seeing you.
        </p>

        <dl className="mt-3 w-full max-w-sm divide-y divide-border rounded-[var(--radius-md)] border border-border bg-surface text-left">
          <div className="flex items-baseline justify-between gap-4 px-5 py-3.5">
            <dt className="eyebrow text-muted">Treatment</dt>
            <dd className="text-right font-serif text-[1.05rem] text-accent-contrast">{confirmation.serviceName}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 px-5 py-3.5">
            <dt className="eyebrow text-muted">Date</dt>
            <dd className="text-right text-[0.95rem] text-primary">{longDate(confirmation.date)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 px-5 py-3.5">
            <dt className="eyebrow text-muted">Time</dt>
            <dd className="text-right text-[0.95rem] text-primary">
              {to12Hour(confirmation.time)}
              {confirmation.endTime ? ` – ${to12Hour(confirmation.endTime)}` : ""}
            </dd>
          </div>
        </dl>

        <p className="mt-1 text-[0.78rem] text-muted">
          Need to change or cancel? Call us on {site.contact.phoneDisplay}.
        </p>
        <Button variant="secondary" onClick={startAgain}>
          Book another appointment
        </Button>
      </div>
    );
  }

  /* --- Hard failure (services unavailable, or create failed) --------------- */
  if (servicesState === "error" || submit === "error") {
    const failedBooking = submit === "error";
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-elevated px-8 py-12 text-center"
      >
        <span className="eyebrow text-muted">
          {failedBooking ? "We couldn't complete that booking" : "Online booking is unavailable"}
        </span>
        <h3 className="text-h3">Let&apos;s book you in by phone</h3>
        <p className="max-w-md text-secondary text-pretty">
          {failedBooking
            ? "Something went wrong on our side and your appointment was not booked. Please try again in a moment, or call the clinic and we'll arrange your time with you."
            : "We can't load our booking calendar just now. Please try again in a moment, or call the clinic and we'll arrange your time with you."}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <Button href={`tel:${site.contact.phone}`}>Call {site.contact.phoneDisplay}</Button>
          <Button variant="secondary" onClick={() => (failedBooking ? setSubmit("idle") : window.location.reload())}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  /* --- Form ---------------------------------------------------------------- */
  const timeDisabled = !fields.serviceId || !fields.date || slotsState !== "ready" || slots.length === 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          First name<span className="text-accent"> *</span>
          <input
            name="firstName"
            autoComplete="given-name"
            value={fields.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
            className={cls("firstName")}
          />
          {errors.firstName && <span className={errCls}>{errors.firstName}</span>}
        </label>
        <label className={labelCls}>
          Last name<span className="text-accent"> *</span>
          <input
            name="lastName"
            autoComplete="family-name"
            value={fields.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
            className={cls("lastName")}
          />
          {errors.lastName && <span className={errCls}>{errors.lastName}</span>}
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          Email<span className="text-accent"> *</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            className={cls("email")}
          />
          {errors.email && <span className={errCls}>{errors.email}</span>}
        </label>
        <label className={labelCls}>
          Phone<span className="text-accent"> *</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            className={cls("phone")}
          />
          {errors.phone && <span className={errCls}>{errors.phone}</span>}
        </label>
      </div>

      <label className={labelCls}>
        Treatment<span className="text-accent"> *</span>
        <select
          name="serviceId"
          value={fields.serviceId}
          onChange={(e) => handleServiceChange(e.target.value)}
          disabled={servicesState !== "ready"}
          aria-invalid={!!errors.serviceId}
          className={cls("serviceId")}
        >
          <option value="">
            {servicesState === "loading" ? "Loading treatments…" : "Please choose a treatment"}
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.displayName}
            </option>
          ))}
        </select>
        {errors.serviceId && <span className={errCls}>{errors.serviceId}</span>}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          Date<span className="text-accent"> *</span>
          <input
            name="date"
            type="date"
            min={today}
            max={maxDate}
            value={fields.date}
            onChange={(e) => handleDateChange(e.target.value)}
            aria-invalid={!!errors.date}
            className={cls("date")}
          />
          {errors.date && <span className={errCls}>{errors.date}</span>}
        </label>

        <label className={labelCls}>
          Available time<span className="text-accent"> *</span>
          <select
            name="time"
            value={fields.time}
            onChange={(e) => set("time", e.target.value)}
            disabled={timeDisabled}
            aria-invalid={!!errors.time}
            aria-busy={slotsState === "loading"}
            className={cls("time")}
          >
            <option value="">
              {!fields.serviceId || !fields.date
                ? "Choose a treatment and date first"
                : slotsState === "loading"
                  ? "Checking availability…"
                  : slotsState === "error"
                    ? "Couldn't load times — please try again"
                    : slots.length === 0
                      ? "No appointments available on this date"
                      : "Please choose a time"}
            </option>
            {slots.map((t) => (
              <option key={t} value={t}>
                {to12Hour(t)}
              </option>
            ))}
          </select>
          {errors.time && <span className={errCls}>{errors.time}</span>}
          {!errors.time && slotsState === "ready" && slots.length === 0 && fields.date && (
            <span className="text-[0.78rem] font-normal text-muted">
              No appointments available on this date. Please try another day.
            </span>
          )}
        </label>
      </div>

      {/* Optional medical profile. Plain clinical labels, never questions.
          Three across from the small breakpoint up, stacked on a phone. */}
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 text-[0.82rem] font-semibold text-primary">
          Your details <span className="font-normal text-muted">(optional)</span>
        </legend>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className={labelCls}>
            Age
            <input
              name="age"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 32"
              value={fields.age}
              onChange={(e) => set("age", e.target.value)}
              className={field}
            />
          </label>
          <label className={labelCls}>
            Height
            <input
              name="height"
              type="text"
              autoComplete="off"
              placeholder="e.g. 175 cm"
              value={fields.height}
              onChange={(e) => set("height", e.target.value)}
              className={field}
            />
          </label>
          <label className={labelCls}>
            Weight
            <input
              name="weight"
              type="text"
              autoComplete="off"
              placeholder="e.g. 70 kg"
              value={fields.weight}
              onChange={(e) => set("weight", e.target.value)}
              className={field}
            />
          </label>
        </div>
      </fieldset>

      <label className={labelCls}>
        Anything we should know? <span className="font-normal text-muted">(optional)</span>
        <textarea
          name="notes"
          rows={3}
          value={fields.notes}
          onChange={(e) => set("notes", e.target.value)}
          className={`${field} resize-y`}
          placeholder="Allergies, past treatments, or anything you'd like us to know…"
        />
      </label>

      {formMessage && (
        <p role="alert" className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger-soft/50 px-4 py-3 text-[0.85rem] text-danger">
          {formMessage}
        </p>
      )}

      <p className="text-[0.75rem] text-muted">
        By booking, you agree to be contacted about your appointment. We treat your details in line with our{" "}
        <a href="/legal/privacy" className="underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </p>

      <div className="flex items-center gap-4">
        <Button variant="primary" size="lg" disabled={submit === "submitting"}>
          {submit === "submitting" ? "Booking…" : "Book appointment"}
        </Button>
        <span aria-live="polite" className="sr-only">
          {submit === "submitting"
            ? "Booking your appointment"
            : slotsState === "loading"
              ? "Checking availability"
              : ""}
        </span>
      </div>
    </form>
  );
}
