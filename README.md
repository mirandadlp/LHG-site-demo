# London Hotel Group — Website

The website for **London Hotel Group (LHG)**: an editorial, green-led luxury hospitality site with full-screen photography, a left-hand slide-out menu with nested submenus, and every word, image and link editable from simple content files.

> **Status: draft build.** No LHG facts have been verified yet. The build environment could not reach lhg.co.uk or the reference site, so all company details, hotels and photography are clearly marked placeholders. See **[CONTENT-STATUS.md](CONTENT-STATUS.md)** for what needs supplying before launch.

| Document | For |
|---|---|
| [CONTENT-GUIDE.md](CONTENT-GUIDE.md) | Editors: changing text, images, hotels, menu items and pages |
| [CONTENT-STATUS.md](CONTENT-STATUS.md) | What's verified, what's placeholder, the provisional navigation tree, launch checklist |
| [BRAND-GUIDE.md](BRAND-GUIDE.md) and `/brand-guide` | Colour, typography, buttons, cards, photography and spacing |

## Tech stack

- **Next.js 16** (App Router, React 19, Cache Components) with **TypeScript**
- **Tailwind CSS 4** with brand tokens in `app/globals.css`
- **Framer Motion** for the menu, slideshow and scroll reveals (respects reduced-motion settings)
- **Lucide** icons
- **Zod** to validate content files and form submissions
- Fonts: Cormorant Garamond + Inter via `next/font` (self-hosted at build time)

Every page is pre-rendered as static HTML. The only server code is the enquiry form endpoint.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload (content edits appear instantly) |
| `npm run build` | Checks content, then builds the production site |
| `npm run start` | Serves the production build |
| `npm run lint` / `npm run typecheck` | Code quality checks |
| `npm run check:content` | Checks every internal link, image path and page path in `content/` |
| `npm run generate:placeholders` | Regenerates the illustrated placeholder images |

## Standalone HTML version

To get plain `.html` files that open straight from disk, with no Node.js or server needed (for example, to email, review or upload to basic hosting):

```bash
npm run build && npm run export:html
```

This writes one self-contained file per page to `html-export/` (`index.html` is the homepage). CSS and images are embedded and pages link to each other, so keep the files together in one folder. Fonts load from Google Fonts. The menu, slideshow, header and gallery work through a small script (`scripts/export-runtime.js`). Because there's no server, the enquiry form shows the "not yet connected" message instead of sending. Re-run the command after editing content.

## Project structure

```
app/                     Routes (one folder per URL)
  page.tsx               Homepage
  about/ hotels/ hotels/[slug]/ services/ contact/
  social-responsibility/ social-responsibility/[slug]/
  [...slug]/             Every page defined in content/pages.json and legal.json
  brand-guide/           Visual brand guide (not indexed)
  api/contact/route.ts   Enquiry form endpoint
  sitemap.ts robots.ts not-found.tsx layout.tsx globals.css
components/
  layout/                Header, NavDrawer (slide-out menu), Footer, Logo
  sections/              Hero slideshow, page hero, section renderer, cards, gallery, contact
  forms/                 Contact form
  privacy/               Cookie consent + consent-gated analytics
  ui/                    Buttons, images, reveal animation, notices
content/                 ALL editable content (JSON) — see CONTENT-GUIDE.md
lib/
  schema.ts              Content schemas (what each JSON file may contain)
  content.ts             Loads + validates content; the single place to swap in a CMS
  enquiry.ts             Form validation rules
public/images/           Images (placeholders in public/images/placeholders)
scripts/                 Content checker, placeholder generator
```

## How content works

- All copy, images, navigation, hotels and footer links live in `content/*.json`.
- `lib/content.ts` loads and validates each file against `lib/schema.ts` at build time. A typo produces a readable error naming the file and field, instead of a broken page.
- `npm run check:content` (also run automatically before every build) verifies that every internal link points at a real page and every image exists.
- Pages are assembled from reusable **section types** (`text`, `split`, `cards`, `list`, `gallery`, `links`, `cta`, `properties`, `legal`), so new pages need no code.
- The "Our Hotels" menu, homepage cards, hotel pages, the form's hotel dropdown and the sitemap are all generated from `properties.json`.

### Adding a CMS later

All components receive content through `lib/content.ts`. To move to a headless CMS (Sanity, Contentful, Payload, Storyblok…), model the same shapes as `lib/schema.ts`, fetch them in `lib/content.ts`, and keep the Zod validation. No page or component needs to change. Until then, editors can edit the JSON directly in GitHub's web editor, and the hosting provider rebuilds automatically on each commit (with a preview deployment per branch, so changes can be checked before they go live).

## Enquiry form

`POST /api/contact` validates every field on the server (Zod), then delivers the enquiry. Spam and abuse protection:

- hidden honeypot field
- minimum fill time (3 seconds)
- same-origin check
- request size limit (20 KB)
- per-IP rate limit (5 per 10 minutes, in memory, per server instance; use a shared store such as Upstash Redis if you run several instances)

**Delivery** is configured with environment variables. Set **one** option:

| Option | Variables |
|---|---|
| Webhook (Zapier, Make, Power Automate, CRM…) | `CONTACT_WEBHOOK_URL`, optional `CONTACT_WEBHOOK_SECRET` (sent as a Bearer token) |
| Email via [Resend](https://resend.com) | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` |

If neither is set, the form **does not pretend to succeed**: it tells visitors the form isn't connected yet and points them to the phone and email details. If delivery fails, visitors see an error and nothing is lost silently.

For stronger bot protection, Cloudflare Turnstile or hCaptcha can be added to `components/forms/ContactForm.tsx` and verified in `app/api/contact/route.ts`.

## Cookies & analytics

- A consent banner appears on the first visit (Accept all / Necessary only / Manage). The choice is stored for 180 days in the `lhg_consent` cookie; "Cookie Settings" in the footer reopens it.
- Google Analytics 4 loads **only** if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set **and** the visitor accepted analytics. Other tools can be gated the same way in `components/privacy/Analytics.tsx`.

## SEO & accessibility

- Unique title, description, canonical URL and Open Graph data per page, all from content files
- `sitemap.xml` generated from content; `robots.txt` blocks indexing unless `ALLOW_INDEXING=true` (so previews are never indexed)
- Semantic landmarks, skip link, breadcrumbs, visible focus states, alt text on every image
- Menu: focus trap, Escape to close, click-outside to close, focus returned to the menu button, scroll lock
- Slideshow can be paused; all animation is disabled for reduced-motion users
- Colour pairs meet WCAG AA (see BRAND-GUIDE.md)
- Security headers set in `next.config.ts`

## Deployment

The simplest route is **Vercel** (the makers of Next.js):

1. Import the GitHub repository at vercel.com/new. No build settings need changing.
2. Add the environment variables from `.env.example` (Production and Preview).
3. Only on Production: set `ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL` to the live domain.
4. Add the custom domain.

Each push to the main branch deploys the live site; every other branch gets its own preview URL.

It also runs anywhere Node.js runs (`npm run build && npm run start`, port 3000), including Netlify, AWS Amplify, Azure Static Web Apps (hybrid) and Docker.

## Testing performed

On this build:

- every route in the sitemap returns 200, and unknown URLs return a real 404
- every page title is unique
- no horizontal scrolling at 360px width on all pages
- no browser console errors
- menu open/close/Escape/outside-click/focus-trap/focus-return, plus three-level drill-down and back
- slideshow pause, gallery lightbox (keyboard), cookie banner and settings
- enquiry form: field errors, "not configured" message, and successful delivery to a test webhook
- API responses for validation errors, honeypot, too-fast submissions, cross-origin requests, malformed JSON and rate limiting
