import { z } from "zod";

/**
 * Content schemas. Every JSON file in /content is validated against these at
 * build time, so a typo in a content file produces a clear error instead of a
 * broken page. See CONTENT-GUIDE.md for how to edit the files.
 */

/** "verified" = confirmed from an official LHG source; anything else still needs sign-off. */
export const ContentStatus = z.enum(["verified", "provisional", "placeholder"]);

export const ImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
});

export const LinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const MetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const TextSection = z.object({
  type: z.literal("text"),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  paragraphs: z.array(z.string()),
  align: z.enum(["left", "center"]).optional(),
});

const SplitSection = z.object({
  type: z.literal("split"),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  paragraphs: z.array(z.string()),
  image: ImageSchema,
  reverse: z.boolean().optional(),
  link: LinkSchema.optional(),
});

const CardsSection = z.object({
  type: z.literal("cards"),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(
    z.object({
      title: z.string(),
      text: z.string(),
      image: ImageSchema.optional(),
      href: z.string().optional(),
      linkLabel: z.string().optional(),
    })
  ),
});

const ListSection = z.object({
  type: z.literal("list"),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string(),
  intro: z.string().optional(),
  items: z.array(z.string()),
});

const GallerySection = z.object({
  type: z.literal("gallery"),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  images: z.array(ImageSchema),
});

const LinksSection = z.object({
  type: z.literal("links"),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  items: z.array(LinkSchema.extend({ description: z.string().optional() })),
});

const CtaSection = z.object({
  type: z.literal("cta"),
  id: z.string().optional(),
  heading: z.string(),
  text: z.string().optional(),
  link: LinkSchema,
  tone: z.enum(["green", "ivory"]).optional(),
});

const PropertiesSection = z.object({
  type: z.literal("properties"),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

const LegalSection = z.object({
  type: z.literal("legal"),
  id: z.string().optional(),
  lastUpdated: z.string().optional(),
  clauses: z.array(z.object({ heading: z.string(), paragraphs: z.array(z.string()) })),
});

export const SectionSchema = z.discriminatedUnion("type", [
  TextSection,
  SplitSection,
  CardsSection,
  ListSection,
  GallerySection,
  LinksSection,
  CtaSection,
  PropertiesSection,
  LegalSection,
]);

export const PageSchema = z.object({
  path: z.string().startsWith("/"),
  status: ContentStatus,
  meta: MetaSchema,
  hero: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    intro: z.string().optional(),
    image: ImageSchema.optional(),
  }),
  sections: z.array(SectionSchema),
});

export const PagesFileSchema = z.object({ pages: z.array(PageSchema) });

export const PropertySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  status: ContentStatus,
  name: z.string(),
  location: z.string(),
  summary: z.string(),
  description: z.array(z.string()),
  image: ImageSchema,
  gallery: z.array(ImageSchema),
  highlights: z.array(z.string()),
  details: z.object({
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    bookingUrl: z.string().optional(),
  }),
  meta: MetaSchema,
});

export const PropertiesFileSchema = z.object({
  page: PageSchema,
  properties: z.array(PropertySchema),
});

type NavItemShape = {
  label: string;
  href?: string;
  description?: string;
  autoChildren?: "properties";
  children?: NavItemShape[];
};

export const NavItemSchema: z.ZodType<NavItemShape> = z.lazy(() =>
  z.object({
    label: z.string(),
    href: z.string().optional(),
    description: z.string().optional(),
    autoChildren: z.literal("properties").optional(),
    children: z.array(NavItemSchema).optional(),
  })
);

export const NavigationSchema = z.object({
  status: ContentStatus,
  note: z.string().optional(),
  menuLabel: z.string(),
  closeLabel: z.string(),
  backLabel: z.string(),
  viewAllLabel: z.string(),
  headerCta: LinkSchema,
  primary: z.array(NavItemSchema),
});

export const SocialSchema = z.object({
  platform: z.enum(["instagram", "facebook", "linkedin", "x", "youtube", "tiktok"]),
  href: z.string().url(),
});

export const SiteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  tagline: z.string(),
  logo: z.object({
    src: z.string(),
    srcOnDark: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  defaultMeta: MetaSchema,
  ogImage: z.string(),
  showContentStatusNotices: z.boolean(),
  contact: z.object({
    phone: z.string(),
    email: z.string(),
    address: z.array(z.string()),
  }),
  social: z.array(SocialSchema),
});

export const HomepageSchema = z.object({
  status: ContentStatus,
  meta: MetaSchema,
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    intro: z.string(),
    primaryLink: LinkSchema,
    scrollLabel: z.string(),
    slideIntervalSeconds: z.number().positive(),
    slides: z.array(ImageSchema).min(1),
  }),
  introduction: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    paragraphs: z.array(z.string()),
    image: ImageSchema,
    secondaryImage: ImageSchema,
    link: LinkSchema,
  }),
  properties: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
    link: LinkSchema,
    limit: z.number().int().positive(),
  }),
  about: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    paragraphs: z.array(z.string()),
    image: ImageSchema,
    highlights: z.array(z.object({ value: z.string(), label: z.string() })),
    link: LinkSchema,
  }),
  services: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
    items: z.array(
      z.object({ title: z.string(), text: z.string(), image: ImageSchema, href: z.string() })
    ),
  }),
  socialResponsibility: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    paragraphs: z.array(z.string()),
    backgroundImage: ImageSchema,
    image: ImageSchema,
    links: z.array(LinkSchema),
  }),
  contact: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
  }),
});

export const ContactSchema = z.object({
  page: PageSchema,
  details: z.object({
    heading: z.string(),
    company: z.string(),
    address: z.array(z.string()),
    phone: z.string(),
    email: z.string(),
    hours: z.string(),
  }),
  form: z.object({
    heading: z.string(),
    intro: z.string(),
    enquiryTypes: z.array(z.string()).min(1),
    labels: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      enquiryType: z.string(),
      property: z.string(),
      propertyAny: z.string(),
      message: z.string(),
      consent: z.string(),
      privacyLink: z.string(),
      submit: z.string(),
      submitting: z.string(),
    }),
    messages: z.object({
      success: z.string(),
      notConfigured: z.string(),
      validation: z.string(),
      rateLimited: z.string(),
      error: z.string(),
    }),
  }),
});

export const SocialResponsibilitySchema = z.object({
  overview: PageSchema,
  subpages: z.array(PageSchema.extend({ slug: z.string(), summary: z.string(), image: ImageSchema })),
});

export const ServicesSchema = z.object({
  page: PageSchema,
  services: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      paragraphs: z.array(z.string()),
      image: ImageSchema,
    })
  ),
});

export const FooterSchema = z.object({
  tagline: z.string(),
  columns: z.array(z.object({ heading: z.string(), links: z.array(LinkSchema) })),
  contactHeading: z.string(),
  legal: z.array(LinkSchema),
  cookieSettingsLabel: z.string(),
  copyright: z.string(),
});

export type Image = z.infer<typeof ImageSchema>;
export type Link = z.infer<typeof LinkSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type NavItem = NavItemShape;
export type Navigation = z.infer<typeof NavigationSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Homepage = z.infer<typeof HomepageSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type SocialResponsibility = z.infer<typeof SocialResponsibilitySchema>;
export type Services = z.infer<typeof ServicesSchema>;
export type Footer = z.infer<typeof FooterSchema>;
export type ContentStatusValue = z.infer<typeof ContentStatus>;
