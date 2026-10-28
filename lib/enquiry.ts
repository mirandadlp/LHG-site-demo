import { z } from "zod";

/** Server-side validation rules for the enquiry form. */
export const EnquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[0-9+()\-.\s]*$/, "Please enter a valid telephone number")
    .optional()
    .default(""),
  enquiryType: z.string().trim().min(1, "Please choose an enquiry type"),
  property: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(10, "Please enter a message of at least 10 characters").max(5000),
  consent: z.literal(true, { error: "Please confirm you agree so we can respond" }),
  // Spam protection: a hidden field people never fill in, and the time the form was opened.
  website: z.string().max(0).optional().default(""),
  startedAt: z.number().int(),
});

export type Enquiry = z.infer<typeof EnquirySchema>;

export type EnquiryResponse =
  | { ok: true }
  | {
      ok: false;
      code: "validation" | "not_configured" | "rate_limited" | "delivery_failed" | "bad_request";
      fieldErrors?: Record<string, string>;
    };
