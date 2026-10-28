import type { Metadata } from "next";
import { properties } from "@/lib/content";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { PropertyCard } from "@/components/sections/PropertyCard";
import { SiteImage } from "@/components/ui/SiteImage";

export const metadata: Metadata = {
  title: "Brand Guide",
  description: "LHG website visual brand guide: colour, typography, buttons, cards, photography and spacing.",
  robots: { index: false, follow: false },
};

const colours = [
  { name: "Heritage Green", token: "heritage", hex: "#00452D", use: "Primary brand colour: buttons, header on scroll, key accents.", text: "text-ivory" },
  { name: "Deep Forest", token: "forest", hex: "#002E21", use: "Navigation drawer, footer, dark sections.", text: "text-ivory" },
  { name: "Sage Green", token: "sage", hex: "#A7B8A5", use: "Supporting accents on dark backgrounds.", text: "text-forest" },
  { name: "Sage Light", token: "sage-light", hex: "#DFE6DC", use: "Tinted section backgrounds (lists, highlights).", text: "text-forest" },
  { name: "Soft Ivory", token: "ivory", hex: "#F7F5EF", use: "Main page background; text on dark.", text: "text-forest" },
  { name: "Paper", token: "paper", hex: "#FCFBF8", use: "Raised surfaces: cards, forms, alternating sections.", text: "text-forest" },
  { name: "Warm Stone", token: "stone", hex: "#DDD8CE", use: "Borders and dividers.", text: "text-forest" },
  { name: "Champagne Gold", token: "gold", hex: "#B59A68", use: "Rules, icons, eyebrows on dark. Decorative only on light backgrounds.", text: "text-forest" },
  { name: "Light Gold", token: "gold-light", hex: "#C6AD7E", use: "Gold-toned text on green backgrounds (meets WCAG AA).", text: "text-forest" },
  { name: "Antique Gold", token: "gold-deep", hex: "#7D6438", use: "Gold-toned text on light backgrounds (meets WCAG AA).", text: "text-ivory" },
  { name: "Charcoal", token: "charcoal", hex: "#242A26", use: "Body text.", text: "text-ivory" },
  { name: "Muted", token: "muted", hex: "#5B625D", use: "Secondary text and long-form paragraphs.", text: "text-ivory" },
];

const swatchBg: Record<string, string> = {
  heritage: "bg-heritage",
  forest: "bg-forest",
  sage: "bg-sage",
  "sage-light": "bg-sage-light",
  ivory: "bg-ivory",
  paper: "bg-paper",
  stone: "bg-stone",
  gold: "bg-gold",
  "gold-light": "bg-gold-light",
  "gold-deep": "bg-gold-deep",
  charcoal: "bg-charcoal",
  muted: "bg-muted",
};

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-stone py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="display-md text-forest">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{intro}</p>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export default function BrandGuidePage() {
  return (
    <>
      <section className="bg-forest pb-16 pt-36 text-ivory md:pb-24 md:pt-44">
        <div className="container-luxe">
          <p className="eyebrow flex items-center gap-4 text-gold">
            <span className="rule-gold" aria-hidden />
            Website Design System
          </p>
          <h1 className="display-xl mt-6">LHG Brand Guide</h1>
          <p className="mt-6 max-w-2xl text-ivory/75">
            The visual rules behind the London Hotel Group website. Colours and type are defined once in{" "}
            <code className="text-sage">app/globals.css</code> and reused everywhere. This page is not indexed by search engines.
          </p>
          <nav aria-label="Brand guide sections" className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {["Logo", "Colour", "Typography", "Buttons", "Cards", "Photography", "Spacing"].map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`} className="eyebrow link-draw pb-1 text-ivory/80 hover:text-ivory">
                {s}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-luxe">
        <Block
          id="logo"
          title="Logo"
          intro="Use the official LHG logo files only — never redraw, stretch, recolour or add effects. Supply a dark version (for ivory backgrounds) and a light version (for photography and green backgrounds) in content/site.json. The typographic mark shown on this draft site is a placeholder until those files are added."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex aspect-[3/2] items-center justify-center bg-ivory text-forest ring-1 ring-stone">
              <span className="text-center">
                <span className="block font-serif text-5xl font-light tracking-[0.18em]">LHG</span>
                <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.42em]">London Hotel Group</span>
              </span>
            </div>
            <div className="flex aspect-[3/2] items-center justify-center bg-forest text-ivory">
              <span className="text-center">
                <span className="block font-serif text-5xl font-light tracking-[0.18em]">LHG</span>
                <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.42em]">London Hotel Group</span>
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">Clear space: keep at least the height of the “L” free on every side. Minimum width: 120px on screen.</p>
        </Block>

        <Block
          id="colour"
          title="Colour"
          intro="A green-led palette: Heritage Green and Deep Forest carry the brand, ivory and stone give space and warmth, and Champagne Gold is used sparingly as a refined accent. Body text and buttons meet WCAG AA contrast."
        >
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {colours.map((c) => (
              <li key={c.token} className="overflow-hidden ring-1 ring-stone">
                <div className={`flex h-28 items-end p-4 ${swatchBg[c.token]} ${c.text}`}>
                  <span className="eyebrow">{c.hex}</span>
                </div>
                <div className="bg-paper p-4">
                  <p className="font-serif text-xl text-forest">{c.name}</p>
                  <p className="mt-1 font-mono text-xs text-gold-deep">{c.token}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{c.use}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
            <p className="bg-heritage p-4 text-ivory">Ivory on Heritage — 10.2 : 1</p>
            <p className="bg-ivory p-4 text-charcoal ring-1 ring-stone">Charcoal on Ivory — 13.4 : 1</p>
            <p className="bg-ivory p-4 text-gold-deep ring-1 ring-stone">Antique Gold on Ivory — 5.1 : 1</p>
          </div>
        </Block>

        <Block
          id="typography"
          title="Typography"
          intro="Cormorant Garamond (light and regular) for headings gives an editorial, heritage feel. Inter is used for body copy, navigation labels and buttons. Eyebrow labels are uppercase Inter with wide tracking."
        >
          <div className="space-y-10">
            <div>
              <p className="eyebrow text-gold-deep">Display XL · Cormorant 300 · clamp(44–104px)</p>
              <p className="display-xl mt-3 text-forest">London Hospitality</p>
            </div>
            <div>
              <p className="eyebrow text-gold-deep">Display L · Cormorant 300 · clamp(36–68px)</p>
              <p className="display-lg mt-3 text-forest">Thoughtfully Delivered</p>
            </div>
            <div>
              <p className="eyebrow text-gold-deep">Display M · Cormorant 400 · clamp(28–44px)</p>
              <p className="display-md mt-3 text-forest">Our Hotels</p>
            </div>
            <div>
              <p className="eyebrow text-gold-deep">Eyebrow · Inter 500 · 11px · 0.24em tracking · uppercase</p>
              <p className="eyebrow mt-3 text-forest">The Collection</p>
            </div>
            <div className="prose-luxe max-w-xl">
              <p className="eyebrow !text-gold-deep">Body · Inter 400 · 16–17px · 1.8 line height</p>
              <p>
                Body copy is set in Inter at a comfortable reading size with generous line height. Keep paragraphs short and
                lines under roughly 75 characters.
              </p>
            </div>
          </div>
        </Block>

        <Block
          id="buttons"
          title="Buttons & Links"
          intro="Square-cornered buttons with uppercase, tracked labels. One primary action per section. The rounded pill is reserved for the header enquiry button."
        >
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="#buttons">Primary</ButtonLink>
            <ButtonLink href="#buttons" variant="outline-dark">
              Secondary
            </ButtonLink>
            <ArrowLink href="#buttons">Text Link</ArrowLink>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 bg-forest p-8">
            <ButtonLink href="#buttons" variant="ivory">
              On Dark
            </ButtonLink>
            <ButtonLink href="#buttons" variant="outline-light">
              Outline Light
            </ButtonLink>
            <ArrowLink href="#buttons" tone="light">
              Text Link
            </ArrowLink>
          </div>
        </Block>

        <Block
          id="cards"
          title="Cards"
          intro="Property cards use a tall 4:5 image, location eyebrow, serif name and a short summary. Images zoom gently on hover; the whole card is one link."
        >
          <div className="max-w-sm">{properties[0] && <PropertyCard property={properties[0]} />}</div>
        </Block>

        <Block
          id="photography"
          title="Photography"
          intro="Natural, warm light; calm compositions with space to breathe; real architecture, interiors and details of LHG hotels. Avoid heavy filters, crowded scenes and generic stock imagery. Supply images at least 2400px wide (JPG or WebP); the site creates smaller versions automatically. Always write alt text describing the image."
        >
          <div className="grid grid-cols-3 gap-3">
            {["facade", "lounge", "detail"].map((n) => (
              <div key={n} className="relative aspect-[3/4] overflow-hidden bg-mist">
                <SiteImage image={{ src: `/images/placeholders/${n}.svg`, alt: "" }} fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-muted sm:grid-cols-2">
            <li>• Heroes: 16:9 or wider, subject away from the lower-left text area</li>
            <li>• Cards: 4:5 portrait</li>
            <li>• Editorial splits: 5:4</li>
            <li>• Dark overlays are applied automatically behind text</li>
          </ul>
        </Block>

        <Block
          id="spacing"
          title="Spacing & Layout"
          intro="Generous whitespace is part of the brand. Content sits in a 1408px container with 20px (mobile), 40px (tablet) and 64px (desktop) side margins. Sections use 80–128px vertical padding."
        >
          <div className="space-y-3">
            {[
              ["Section padding", "py-20 → md:py-28", "w-[7rem]"],
              ["Heading → body", "mt-8", "w-[2rem]"],
              ["Card gap", "gap-8", "w-[2rem]"],
              ["Eyebrow → heading", "mt-5", "w-[1.25rem]"],
            ].map(([label, token, w]) => (
              <div key={label} className="flex items-center gap-6">
                <span className={`h-4 bg-sage ${w}`} aria-hidden />
                <span className="text-sm text-forest">{label}</span>
                <code className="text-xs text-gold-deep">{token}</code>
              </div>
            ))}
          </div>
        </Block>
      </div>
    </>
  );
}
