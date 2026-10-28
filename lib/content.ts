import "server-only";
import type { z } from "zod";
import {
  ContactSchema,
  FooterSchema,
  HomepageSchema,
  NavigationSchema,
  PageSchema,
  PagesFileSchema,
  PropertiesFileSchema,
  ServicesSchema,
  SiteSchema,
  SocialResponsibilitySchema,
  type NavItem,
  type Page,
} from "./schema";

import siteJson from "@/content/site.json";
import navigationJson from "@/content/navigation.json";
import homepageJson from "@/content/homepage.json";
import aboutJson from "@/content/about.json";
import propertiesJson from "@/content/properties.json";
import servicesJson from "@/content/services.json";
import socialJson from "@/content/social-responsibility.json";
import contactJson from "@/content/contact.json";
import footerJson from "@/content/footer.json";
import pagesJson from "@/content/pages.json";
import legalJson from "@/content/legal.json";

/**
 * All site content is loaded from /content/*.json through this module.
 * Swapping to a headless CMS later only requires changing these loaders.
 */
function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Content error in content/${file}:\n${issues}`);
  }
  return result.data;
}

export const site = parse(SiteSchema, siteJson, "site.json");
export const navigation = parse(NavigationSchema, navigationJson, "navigation.json");
export const homepage = parse(HomepageSchema, homepageJson, "homepage.json");
export const aboutPage = parse(PageSchema, aboutJson, "about.json");
export const propertiesContent = parse(PropertiesFileSchema, propertiesJson, "properties.json");
export const servicesContent = parse(ServicesSchema, servicesJson, "services.json");
export const socialResponsibility = parse(SocialResponsibilitySchema, socialJson, "social-responsibility.json");
export const contact = parse(ContactSchema, contactJson, "contact.json");
export const footer = parse(FooterSchema, footerJson, "footer.json");
const genericPages = parse(PagesFileSchema, pagesJson, "pages.json").pages;
const legalPages = parse(PagesFileSchema, legalJson, "legal.json").pages;

export const properties = propertiesContent.properties;

export function getProperty(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function getSocialSubpage(slug: string) {
  return socialResponsibility.subpages.find((p) => p.slug === slug);
}

/** Pages served by the catch-all route (pages.json + legal.json). */
export const catchAllPages: Page[] = [...genericPages, ...legalPages];

export function getCatchAllPage(path: string) {
  return catchAllPages.find((p) => p.path === path);
}

/** Expands `autoChildren` entries (e.g. the hotel list) so the menu stays in sync with properties.json. */
function resolveNavItem(item: NavItem): NavItem {
  if (item.autoChildren === "properties") {
    return {
      ...item,
      children: properties.map((p) => ({ label: p.name, href: `/hotels/${p.slug}` })),
    };
  }
  return item.children ? { ...item, children: item.children.map(resolveNavItem) } : item;
}

export const resolvedNavigation = {
  ...navigation,
  primary: navigation.primary.map(resolveNavItem),
};

/** Every internal route the site serves. Used by the sitemap and the link checker. */
export function allRoutes(): string[] {
  return [
    "/",
    aboutPage.path,
    propertiesContent.page.path,
    ...properties.map((p) => `/hotels/${p.slug}`),
    servicesContent.page.path,
    socialResponsibility.overview.path,
    ...socialResponsibility.subpages.map((p) => p.path),
    contact.page.path,
    ...catchAllPages.map((p) => p.path),
  ];
}

/** Page titles by path, used to build breadcrumbs. */
const titles = new Map<string, string>([
  ["/", "Home"],
  [aboutPage.path, aboutPage.hero.title],
  [propertiesContent.page.path, propertiesContent.page.hero.title],
  ...properties.map((p) => [`/hotels/${p.slug}`, p.name] as const),
  [servicesContent.page.path, servicesContent.page.hero.title],
  [socialResponsibility.overview.path, socialResponsibility.overview.meta.title],
  ...socialResponsibility.subpages.map((p) => [p.path, p.hero.title] as const),
  [contact.page.path, contact.page.hero.title],
  ...catchAllPages.map((p) => [p.path, p.hero.title] as const),
]);

export function breadcrumbsFor(path: string) {
  const segments = path.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", href: "/" }];
  segments.forEach((_, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = titles.get(href);
    if (label) crumbs.push({ label, href });
  });
  return crumbs;
}
