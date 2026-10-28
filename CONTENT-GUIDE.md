# Editing the Website Content

Every heading, paragraph, image, button label and menu item on the site lives in the **`content/`** folder as plain JSON files. You don't need to touch any code to change what the site says.

> **Golden rules**
> 1. Only change the text **between quotation marks** on the right-hand side — never the names on the left (`"heading":`, `"paragraphs":` …).
> 2. Keep the commas and brackets exactly as they are. If you add an item to a list, separate it from the previous one with a comma.
> 3. To use a quotation mark inside text, use typographic quotes (“ ”) or write `\"`.
> 4. After editing, run `npm run check:content` (or just build). It will tell you, in plain English, about any broken link, missing image or formatting mistake, and which file (and, for formatting mistakes, roughly which line) to fix. A full build (`npm run build`) also checks that every required field is present.

If you use GitHub's web editor, it will highlight JSON mistakes in red as you type.

---

## Which file controls what

| File | Controls |
|---|---|
| `site.json` | Company name, logo, default page description, header/footer contact details, social media links, and the draft-content banner switch |
| `navigation.json` | The slide-out menu (all levels) and the header "Enquire" button |
| `homepage.json` | Every section of the homepage |
| `properties.json` | The hotels: list page intro + every hotel's page |
| `about.json` | The About Us page |
| `services.json` | The Services & Business Areas page |
| `social-responsibility.json` | The Social Responsibility overview and its five sub-pages |
| `contact.json` | The Contact page, contact details, form labels, enquiry types and form messages |
| `pages.json` | All other pages (Offers, Dining, Meetings & Events, Experiences, Our Story, Careers, News, Press…) |
| `legal.json` | Privacy Policy, Cookie Policy, Terms & Conditions, Accessibility |
| `footer.json` | Footer link columns, footer statement, legal links, copyright line |

---

## Common tasks

### Change text
Find the text in the relevant file and edit it. Paragraphs are lists:

```json
"paragraphs": [
  "First paragraph.",
  "Second paragraph."
]
```

### Replace an image
1. Put the new photo in `public/images/` (for example `public/images/hotels/the-strand-lobby.jpg`). Use JPG or WebP, at least 2400px wide — the site creates smaller versions automatically.
2. Change the `src` to the path **after** `public` and always describe the image in `alt` (this is read aloud to visually impaired visitors and helps search engines):

```json
"image": { "src": "/images/hotels/the-strand-lobby.jpg", "alt": "The hotel lobby with marble floors and a green velvet sofa" }
```

For purely decorative background images, `"alt": ""` is correct.

### Add the official logo
Add the files to `public/brand/` and set them in `site.json`:

```json
"logo": {
  "src": "/brand/lhg-logo-dark.svg",
  "srcOnDark": "/brand/lhg-logo-light.svg",
  "alt": "London Hotel Group",
  "width": 180,
  "height": 60
}
```

`src` is used on light backgrounds (the header after scrolling); `srcOnDark` on photography and green backgrounds. Set `width`/`height` to the logo's proportions.

### Add, edit or remove a hotel
In `properties.json`, each hotel is one `{ … }` block inside `"properties": [ … ]`. Copy an existing block, paste it after the last one (add a comma between blocks) and edit it.

- `slug` becomes the web address: `"slug": "the-strand"` → `/hotels/the-strand`. Lowercase letters, numbers and hyphens only.
- `status`: `"placeholder"`, `"provisional"` or `"verified"`. Pages that aren't `"verified"` show a small draft banner.
- `details.bookingUrl` / `details.website`: leave as `""` to hide the button.
- `highlights`: leave as `[]` to hide the highlights section.

The hotel automatically appears on the homepage (first three), the Our Hotels page, the menu (Our Hotels › Browse by Hotel), the enquiry form's hotel list and the sitemap.

### Edit the menu
`navigation.json` → `primary` is the menu tree. Each item has a `label`, an optional `href` (where it goes) and optional `children` (a submenu). Submenus can be nested further.

```json
{
  "label": "Dining & Drinks",
  "href": "/dining",
  "children": [
    { "label": "Restaurants & Bars", "href": "/dining/restaurants-bars" }
  ]
}
```

- An item with `children` opens its submenu; its own `href` appears as an "Overview" link at the top of that submenu.
- `"autoChildren": "properties"` fills a submenu with the hotel list automatically.
- `menuLabel`, `closeLabel`, `backLabel`, `viewAllLabel` set the wording of the menu controls.

### Add a new page
Add a block to `pages.json`. The `path` is its web address, and it must be unique. Then link to it from `navigation.json` or `footer.json`.

```json
{
  "path": "/experiences/art-collection",
  "status": "placeholder",
  "meta": { "title": "Art Collection", "description": "Shown in Google results and when the page is shared." },
  "hero": {
    "eyebrow": "Experiences",
    "title": "Art Collection",
    "intro": "Optional short introduction.",
    "image": { "src": "/images/placeholders/detail.svg", "alt": "…" }
  },
  "sections": [ … see "Section types" below … ]
}
```

To remove a page, delete its block **and** any links pointing to it (`npm run check:content` will list them).

### Turn off the draft banners
When content is final, set `"showContentStatusNotices": false` in `site.json`, or mark individual pages `"status": "verified"`.

---

## Section types

Pages are built from a list of `sections`, displayed top to bottom. Mix and match:

| `type` | Layout | Fields |
|---|---|---|
| `text` | Heading and paragraphs | `eyebrow`, `heading`, `paragraphs`, `align` (`"left"`/`"center"`) |
| `split` | Large image beside text | `eyebrow`, `heading`, `paragraphs`, `image`, `reverse` (image on right), `link` |
| `cards` | Grid of cards (with or without images) | `eyebrow`, `heading`, `intro`, `items` → `title`, `text`, `image`, `href`, `linkLabel` |
| `list` | Numbered list on a sage background | `eyebrow`, `heading`, `intro`, `items` (text) |
| `gallery` | Photo grid with full-screen viewer | `eyebrow`, `heading`, `images` |
| `links` | Large link tiles | `eyebrow`, `heading`, `items` → `label`, `href`, `description` |
| `cta` | Call-to-action band | `heading`, `text`, `link`, `tone` (`"green"`/`"ivory"`) |
| `properties` | Hotel cards | `eyebrow`, `heading`, `intro`, `limit` |
| `legal` | Long-form legal text | `lastUpdated`, `clauses` → `heading`, `paragraphs` |

Every section also accepts an optional `id`, which lets you link straight to it (`/services#service-area-one`).

Example:

```json
"sections": [
  { "type": "text", "heading": "Our Approach", "paragraphs": ["…"], "align": "center" },
  { "type": "split", "heading": "Private Dining", "paragraphs": ["…"],
    "image": { "src": "/images/dining.jpg", "alt": "…" },
    "link": { "label": "Enquire", "href": "/contact" } },
  { "type": "cta", "heading": "Plan Your Visit", "link": { "label": "Contact Us", "href": "/contact" } }
]
```

---

## Enquiry form

In `contact.json` → `form`:
- `enquiryTypes`: the options in the "Enquiry type" dropdown.
- `labels`: field labels and button text.
- `messages`: what visitors see after submitting (success, not configured, validation, rate-limited, error).

Where enquiries are delivered is set by a developer through environment variables — see the README.
