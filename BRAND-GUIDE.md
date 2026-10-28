# LHG Website Brand Guide

A live, visual version of this guide is built into the site at **`/brand-guide`** (hidden from search engines). Design tokens are defined once in `app/globals.css` (`@theme`) and used everywhere through Tailwind classes such as `bg-heritage` and `text-gold-deep`.

## Positioning

Sophisticated, established, contemporary and calm: a London hospitality group with its own green identity. Premium without excess: generous space, editorial typography, restrained motion, real photography.

## Logo

- Use only the official LHG logo files. Never redraw, stretch, recolour, outline or add effects.
- Supply a **dark** version (for ivory backgrounds) and a **light** version (for photography and green backgrounds), ideally as SVG.
- Clear space: at least the height of the "L" on all sides. Minimum on-screen width: 120px.
- The typographic "LHG / London Hotel Group" mark currently shown is a **placeholder** until the files are added (see CONTENT-GUIDE.md).

## Colour

| Name | Token | Hex | Use |
|---|---|---|---|
| Heritage Green | `heritage` | `#00452D` | Primary brand colour: buttons, solid header CTA, feature panels |
| Deep Forest | `forest` | `#002E21` | Navigation drawer, footer, dark sections |
| Forest Deep | `forest-deep` | `#00221A` | Image overlays, scrims |
| Sage Green | `sage` | `#A7B8A5` | Supporting accents on dark backgrounds |
| Sage Light | `sage-light` | `#DFE6DC` | Tinted section backgrounds |
| Soft Ivory | `ivory` | `#F7F5EF` | Main background; text on dark |
| Paper | `paper` | `#FCFBF8` | Raised surfaces: cards, forms, alternating sections |
| Mist | `mist` | `#ECE8DF` | Secondary surfaces, image loading background |
| Warm Stone | `stone` | `#DDD8CE` | Borders, dividers |
| Champagne Gold | `gold` | `#B59A68` | Rules, icons, eyebrows on Deep Forest. Decorative only on light backgrounds |
| Light Gold | `gold-light` | `#C6AD7E` | Gold text on Heritage Green / Deep Forest |
| Antique Gold | `gold-deep` | `#7D6438` | Gold text on light backgrounds |
| Charcoal | `charcoal` | `#242A26` | Body text |
| Muted | `muted` | `#5B625D` | Secondary text and long-form paragraphs |

**Refinements to the proposed palette:** the brief's seven colours are kept as specified. Three supporting tones were added for accessibility and depth: *Antique Gold* and *Light Gold* (so gold-toned text meets WCAG AA, since Champagne Gold measures only 2.5:1 on ivory and 4.1:1 on Heritage Green), and *Muted* for comfortable long-form reading. *Paper*, *Mist* and *Sage Light* give subtle layering between sections.

**Measured contrast (WCAG 2.1):** Ivory on Heritage 10.2:1 · Ivory on Deep Forest 13.6:1 · Charcoal on Ivory 13.4:1 · Muted on Ivory 5.8:1 · Antique Gold on Ivory 5.1:1 · Light Gold on Heritage 5.1:1 · Champagne Gold on Deep Forest 5.5:1 · Sage on Deep Forest 7.1:1.

**Proportion:** roughly 60% ivory/paper, 30% greens, 10% gold and stone accents. Gold is an accent, never a fill for large areas.

## Typography

| Role | Typeface | Style |
|---|---|---|
| Display / headings | **Cormorant Garamond** | Light (300) for large display, Regular (400) for smaller headings. Tight leading (~1.0), slight negative tracking |
| Body | **Inter** | Regular 16–17px, line-height 1.8, Muted colour for long text |
| Eyebrow labels, navigation controls, buttons | **Inter** | Medium 11–12px, UPPERCASE, 0.2–0.24em tracking |
| Menu items | **Cormorant Garamond** | Light, 30–38px at the top level |

Scale (fluid): Display XL 44→104px · Display L 36→68px · Display M 28→44px.
Editorial accent: the homepage introduction uses an all-caps serif title, inspired by classic hotel signage.

## Buttons & links

- **Primary:** Heritage Green fill, ivory label; hover deepens to Deep Forest.
- **Secondary:** thin Heritage outline; fills green on hover.
- **On imagery/green:** ivory outline or ivory fill.
- **Text link:** uppercase label with a drawn underline and an arrow that nudges right on hover.
- Square corners throughout; the rounded pill is reserved for the header "Enquire" button.
- Minimum touch target: 44–48px high.

## Cards

- **Property card:** 4:5 portrait image → location eyebrow (Antique Gold) → serif name → short summary → "View Property". The whole card is one link; the image zooms gently (1.06) over 1.6s on hover.
- **Service card:** full-bleed image with a forest gradient and text at the base; description reveals on hover on desktop.
- **Content card:** 4:3 image or a short gold rule, serif title, short text.

## Photography

- Natural, warm light; calm compositions with room for type; real LHG architecture, interiors, food and details.
- Avoid heavy filters, crowds, generic stock and wide-angle distortion.
- Heroes: 16:9 or wider, subject away from the lower-left (where the headline sits). Cards: 4:5. Editorial splits: 5:4.
- Supply at least 2400px wide (JPG/WebP). The site generates responsive sizes and AVIF/WebP automatically.
- Always write meaningful alt text.
- A dark green scrim is applied automatically wherever text sits on an image.

The illustrated scenes in `public/images/placeholders/` are stand-ins created for this build. Replace them with LHG-owned photography.

## Spacing & layout

- Content container: max 1408px, side gutters 20px (mobile) / 40px (tablet) / 64px (desktop).
- Section padding: 80px mobile → 112–128px desktop.
- 12-column grid; editorial layouts deliberately offset images and overlap panels.
- Generous whitespace is part of the brand. When in doubt, add space rather than content.

## Motion

- Slow, eased (cubic-bezier 0.22, 1, 0.36, 1), 0.5–1.2s. Content fades up gently on scroll; images zoom subtly on hover; the menu slides in from the left.
- The hero slideshow cross-fades every 7 seconds with a slow push-in and can be paused.
- All motion is disabled automatically for visitors who prefer reduced motion.
