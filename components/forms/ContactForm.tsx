"use client";

import Link from "next/link";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Contact } from "@/lib/schema";
import type { EnquiryResponse } from "@/lib/enquiry";

type Status = { state: "idle" } | { state: "submitting" } | { state: "success" } | { state: "error"; message: string };

const inputClass =
  "mt-2 block w-full border-0 border-b border-forest/25 bg-transparent px-0 py-3 text-base text-charcoal placeholder:text-muted/60 transition-colors focus:border-heritage focus:outline-none focus:ring-0 aria-[invalid=true]:border-error";

export function ContactForm({
  form,
  properties,
}: {
  form: Contact["form"];
  properties: { slug: string; name: string }[];
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const { labels, messages } = form;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus({ state: "submitting" });
    setErrors({});

    let result: EnquiryResponse;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name") ?? "",
          email: data.get("email") ?? "",
          phone: data.get("phone") ?? "",
          enquiryType: data.get("enquiryType") ?? "",
          property: data.get("property") ?? "",
          message: data.get("message") ?? "",
          consent: data.get("consent") === "on",
          website: data.get("website") ?? "",
          startedAt: startedAt.current,
        }),
      });
      result = (await res.json()) as EnquiryResponse;
    } catch {
      result = { ok: false, code: "delivery_failed" };
    }

    if (result.ok) {
      setStatus({ state: "success" });
      (e.target as HTMLFormElement).reset();
    } else {
      const message =
        result.code === "validation"
          ? messages.validation
          : result.code === "not_configured"
            ? messages.notConfigured
            : result.code === "rate_limited"
              ? messages.rateLimited
              : messages.error;
      setErrors(result.fieldErrors ?? {});
      setStatus({ state: "error", message });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const field = (name: string) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });
  const error = (name: string) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-2 text-sm text-error">
        {errors[name]}
      </p>
    ) : null;

  if (status.state === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex items-start gap-4 border border-success/30 bg-paper p-8 focus:outline-none">
        <CircleCheck className="mt-1 size-6 shrink-0 text-success" strokeWidth={1.25} aria-hidden />
        <div>
          <p className="font-serif text-2xl text-forest">Thank you</p>
          <p className="mt-2 text-muted">{messages.success}</p>
          <button type="button" onClick={() => setStatus({ state: "idle" })} className="eyebrow mt-6 text-heritage underline underline-offset-4">
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {status.state === "error" && (
          <p role="alert" className="flex items-start gap-3 border border-error/30 bg-error/5 p-4 text-sm text-error">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {status.message}
          </p>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="eyebrow text-forest">
            {labels.name} *
          </label>
          <input {...field("name")} type="text" autoComplete="name" required maxLength={120} className={inputClass} />
          {error("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="eyebrow text-forest">
            {labels.email} *
          </label>
          <input {...field("email")} type="email" autoComplete="email" required maxLength={200} className={inputClass} />
          {error("email")}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="eyebrow text-forest">
            {labels.phone}
          </label>
          <input {...field("phone")} type="tel" autoComplete="tel" maxLength={40} className={inputClass} />
          {error("phone")}
        </div>
        <div>
          <label htmlFor={`${id}-enquiryType`} className="eyebrow text-forest">
            {labels.enquiryType} *
          </label>
          <select {...field("enquiryType")} required defaultValue="" className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>
              Please select
            </option>
            {form.enquiryTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {error("enquiryType")}
        </div>
        {properties.length > 0 && (
          <div className="md:col-span-2">
            <label htmlFor={`${id}-property`} className="eyebrow text-forest">
              {labels.property}
            </label>
            <select {...field("property")} defaultValue="" className={`${inputClass} cursor-pointer`}>
              <option value="">{labels.propertyAny}</option>
              {properties.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            {error("property")}
          </div>
        )}
        <div className="md:col-span-2">
          <label htmlFor={`${id}-message`} className="eyebrow text-forest">
            {labels.message} *
          </label>
          <textarea {...field("message")} required rows={5} maxLength={5000} className={`${inputClass} resize-y`} />
          {error("message")}
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive technology */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-4 text-sm leading-relaxed text-muted">
          <input
            {...field("consent")}
            type="checkbox"
            required
            className="mt-1 size-4 shrink-0 accent-heritage"
          />
          <span>
            {labels.consent}{" "}
            <Link href="/privacy-policy" className="text-heritage underline underline-offset-4">
              {labels.privacyLink}
            </Link>
            .
          </span>
        </label>
        {error("consent")}
      </div>

      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="eyebrow inline-flex min-h-12 items-center gap-3 bg-heritage px-9 text-ivory transition-colors duration-500 hover:bg-forest disabled:cursor-wait disabled:opacity-70"
      >
        {status.state === "submitting" && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        {status.state === "submitting" ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
