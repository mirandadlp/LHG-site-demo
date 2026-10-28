import { NextResponse, type NextRequest } from "next/server";
import { contact, properties } from "@/lib/content";
import { EnquirySchema, type Enquiry, type EnquiryResponse } from "@/lib/enquiry";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 3_000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

// Best-effort, per-instance limiter. For multi-instance hosting use a shared store (e.g. Upstash Redis).
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function json(body: EnquiryResponse, status: number) {
  return NextResponse.json(body, { status });
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends the enquiry to whichever delivery service is configured. Returns false when none is. */
async function deliver(enquiry: Pick<Enquiry, "name" | "email" | "phone" | "enquiryType" | "property" | "message">): Promise<"sent" | "not_configured"> {
  const propertyName = properties.find((p) => p.slug === enquiry.property)?.name ?? "";
  const payload = { ...enquiry, propertyName, submittedAt: new Date().toISOString() };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return "sent";
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (RESEND_API_KEY && CONTACT_TO_EMAIL && CONTACT_FROM_EMAIL) {
    const rows = [
      ["Name", payload.name],
      ["Email", payload.email],
      ["Telephone", payload.phone || "—"],
      ["Enquiry type", payload.enquiryType],
      ["Hotel", propertyName || "—"],
    ]
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
      .join("");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
        reply_to: payload.email,
        subject: `Website enquiry: ${payload.enquiryType} — ${payload.name}`,
        html: `<table>${rows}</table><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>`,
      }),
    });
    if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
    return "sent";
  }

  return "not_configured";
}

export async function POST(request: NextRequest) {
  // Only accept submissions posted from this site.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return json({ ok: false, code: "bad_request" }, 403);
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, code: "bad_request" }, 413);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ ok: false, code: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "bad_request" }, 400);
  }

  const parsed = EnquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    // A filled honeypot means an automated submission: report a generic failure without detail.
    if (fieldErrors.website) return json({ ok: false, code: "bad_request" }, 400);
    return json({ ok: false, code: "validation", fieldErrors }, 422);
  }

  const { name, email, phone, enquiryType, property, message, startedAt } = parsed.data;
  const enquiry = { name, email, phone, enquiryType, property, message };
  if (Date.now() - startedAt < MIN_FILL_MS) return json({ ok: false, code: "bad_request" }, 400);

  const fieldErrors: Record<string, string> = {};
  if (!contact.form.enquiryTypes.includes(enquiry.enquiryType)) fieldErrors.enquiryType = "Please choose an enquiry type";
  if (enquiry.property && !properties.some((p) => p.slug === enquiry.property)) fieldErrors.property = "Please choose a hotel from the list";
  if (Object.keys(fieldErrors).length) return json({ ok: false, code: "validation", fieldErrors }, 422);

  try {
    const result = await deliver(enquiry);
    if (result === "not_configured") return json({ ok: false, code: "not_configured" }, 503);
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return json({ ok: false, code: "delivery_failed" }, 502);
  }
}
