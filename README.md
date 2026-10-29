# London Hotel Group website

A static website for London Hotel Group (LHG), built with plain HTML, CSS and vanilla JavaScript. It has no framework, no build step and no npm: the files in this repository are the website, and they deploy to GitHub Pages as they are.

## What's where

```
index.html                    Home
about.html                    About LHG
hotels.html                   Our Hotels (carousel, hotel list, "Also in the collection")
hotels/*.html                 One page per hotel
coming-soon.html              Tooting Street Aparthotel
group-bookings.html           Group Bookings (includes an inline inquiry form)
social-responsibility.html    Social Responsibility
news.html, news/*.html        News & Insights and one page per article
careers.html                  Careers
contact.html                  Contact Us (includes an inline inquiry form)
privacy.html                  Privacy, Cookies and Terms
404.html                      "Page not found" (GitHub Pages uses it automatically)
assets/css/styles.css         All styles. Brand colours and fonts are CSS variables at the top
assets/js/partials.js         Header, slide-out menu, footer, inquiry panel and form (defined once)
assets/js/main.js             All behaviour, plus the FORM_ENDPOINT setting at the top
assets/images/                Logo, icons and photos (see IMAGE-LIST.md)
sitemap.xml, robots.txt       For search engines
.nojekyll                     Tells GitHub Pages to serve the files as they are
```

Every link is relative, so the site works at `https://<user>.github.io/<repo>/` and on a custom domain.

## Previewing locally

From the repository folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening the HTML files straight from disk also mostly works, but some browsers restrict scripts on `file://` pages, so the local server is more reliable.

## Editing copy

Page text lives in that page's HTML file. Open it in any text editor, find the sentence, change it and save. Each section is a `<section>` with an `id` (for example `id="welcome"`), and the text inside follows the same pattern: a gold label (`<span class="label">`), a heading (`<h2 class="h2">`), then paragraphs in `<div class="body">`.

**Shared parts** (header, menu, footer, inquiry panel) are in `assets/js/partials.js`, not in the pages:

- Contact details and social links: `CONTACT` and `SOCIAL` at the top.
- The hotel list used by the menu, footer and the form's "Preferred hotel" list: `HOTELS`.
- Menu and header navigation, including dropdown sub-items: `NAV`.

**Placeholder copy** is marked in two ways: an HTML comment beginning `<!-- TODO:` sits beside it, and it shows on the page with a small dashed "Placeholder" tag (the `todo` class). When the approved text arrives, replace the text, delete the comment and remove `todo` from the element's `class`. To list everything still outstanding:

```bash
grep -rn "TODO" --include=*.html .
```

Spelling: use "Inquire / Inquiry / Inquiries" (American) for anything about inquiries; everything else is British English.

**Adding a hotel:** copy one of the files in `hotels/`, change its text, add it to `HOTELS` in `partials.js`, then add a card to the carousel and a row to the list in `hotels.html`. Update each hotel page's "Next property" block so the chain still loops, and add the new page to `sitemap.xml`.

**Adding a news article:** copy a file in `news/`, change the text, then add a card to the News section of `index.html` and a row to `news.html`, and add it to `sitemap.xml`.

## Swapping in photos

At the moment every photo is a stone-coloured placeholder. Each one looks like this:

```html
<div class="img"><!-- IMAGE: hotel-wembley.jpg · 1:1 · 1600×1600 --><div class="ph" data-img="hotel-wembley.jpg" data-alt="London Wembley Hotel" aria-hidden="true"></div></div>
```

1. Save the photo in `assets/images/` using the file name in the comment. `assets/images/IMAGE-LIST.md` lists every expected file, its shape, a suggested size and where it appears.
2. Replace the inner placeholder (`<div class="ph" … ></div>`, or `<span class="ph" …></span>` in gallery buttons) with an `<img>`, keeping the alt text from `data-alt`:

   ```html
   <div class="img"><img src="assets/images/hotel-wembley.jpg" alt="London Wembley Hotel" width="1600" height="1600" loading="lazy" decoding="async"></div>
   ```

   On pages inside `hotels/` and `news/`, start the path with `../` (`../assets/images/…`).
3. The first photo on each page (the large band under the page title) should not have `loading="lazy"`; use `fetchpriority="high"` instead. The comment beside each band says so.
4. The photos on the Home "Responsibility" tabs carry two extra attributes so the tabs can switch between them. Keep them on the `<img>`: `class="tab-img"` (plus `on` for the first one) and `data-tab-img="…"`.
5. Gallery lightbox images are listed in a hidden `<div id="home-gallery">` / `<div id="about-gallery">` near the gallery section. Swap those placeholders in the same way.

The `.img` box sets each photo's shape, and the photo fills it with `object-fit: cover`. Any size will fit, but keep the subject near the centre. Export at the suggested size and around 80% JPG/WebP quality so the pages stay fast.

Only use photos LHG owns or has licensed.

## Inquiry forms (FORM_ENDPOINT)

GitHub Pages can't process form submissions, so the forms post to an outside form service. Set the address once, at the top of `assets/js/main.js`:

```js
const FORM_ENDPOINT = "https://formspree.io/f/your-form-id";
```

- **With an endpoint:** forms are sent with `fetch` as standard form data (`Accept: application/json`). This works with Formspree and similar services. Visitors see a thank-you message on success, or an error message with an email link if sending fails.
- **Without an endpoint** (`""`, the current setting): submitting opens the visitor's email app with a pre-filled message to sales@lhg.co.uk.

The same setting is used by the "Stories of LHG" newsletter sign-up on the Home page.

To set up Formspree: create a free form at formspree.io, set its email to sales@lhg.co.uk, copy the form URL into `FORM_ENDPOINT`, then send a test inquiry from the live site.

Every "Inquire" button opens the slide-in panel. Its title and pre-selected options come from attributes on the button:

```html
<button class="ob" type="button" data-inquire="Inquire about London Wembley Hotel" data-type="Group accommodation" data-hotel="London Wembley Hotel">Inquire</button>
```

## Deploying to GitHub Pages

1. Push this repository to GitHub, with these files on the `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Source: Deploy from a branch**, then **Branch: `main`** and folder **`/ (root)`**, and click **Save**.
4. After a minute or two the site is live at `https://<user>.github.io/<repo>/`.

**Site address in SEO tags.** `sitemap.xml`, `robots.txt` and each page's `<link rel="canonical">` and `og:` tags use the full address `https://mirandadlp.github.io/LHG-site-demo/`. If the site moves (for example to a custom domain), find and replace that address in every file.

**Custom domain:** in Settings → Pages, enter the domain under **Custom domain** and follow GitHub's DNS instructions, then update the site address as above.

## Design system

- Colours are CSS variables at the top of `styles.css`: heritage green, forest, sage, ivory, paper, stone, gold, gold-text and charcoal. `--gold-text` is set to `#836B44`, a slightly darker version of the brand's `#8A7148`, so that 12px labels meet WCAG AA contrast.
- Fonts come from Google Fonts: Montserrat for titles and headings; Inter for body text, navigation, buttons and labels.
- Reusable section layouts: `.b-sq`, `.b-pair`, `.b-feature`, `.b-collage`, `.b-edit`, `.b-gallery` and `.b-stories`. Below 900px they all stack into one column.
- Animations: add `rv` to a section to have it reveal on scroll. Everything respects the visitor's reduced-motion setting.
