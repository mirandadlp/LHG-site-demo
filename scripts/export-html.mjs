// Exports the built site as plain HTML that opens directly in a browser, with no server.
//
//   npm run export:html          -> html-export/pages/<page>.html  (one self-contained file per page)
//   npm run export:html:single   -> lhg-website.html  (the whole site in ONE file, committed so it is in GitHub downloads)
//
// CSS and images are embedded; fonts load from Google Fonts. Run `npm run build` first.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "html-export");
const SINGLE = process.argv.includes("--single");
const PORT = 3456;
const BASE = `http://localhost:${PORT}`;
const read = (f) => JSON.parse(readFileSync(join(ROOT, "content", f), "utf8"));

// ---------- Start the production server ----------
const server = spawn(join(ROOT, "node_modules/.bin/next"), ["start", "-p", String(PORT)], { stdio: "ignore" });
const stop = () => server.kill();
process.on("exit", stop);

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Server did not start. Did you run `npm run build` first?");
}

// ---------- Links ----------
/** Multi-file: "/" -> "index.html", "/about/our-story" -> "about-our-story.html" */
const fileFor = (path) => (path === "/" ? "index.html" : path.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-") + ".html");

function rewriteHref(href) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [path, hash] = href.split("#");
  if (SINGLE) return `#${path || "/"}${hash ? `#${hash}` : ""}`;
  return fileFor(path || "/") + (hash ? `#${hash}` : "");
}

// ---------- Images ----------
const mime = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
const images = new Map(); // public path -> { key, uri }

/** Resolves next/image URLs (/_next/image?url=...) and /images/... paths to an embedded image. */
function image(src) {
  const decoded = src.replace(/&amp;/g, "&");
  const publicPath = decoded.startsWith("/_next/image") ? new URL(decoded, BASE).searchParams.get("url") : decoded;
  if (!images.has(publicPath)) {
    const ext = publicPath.split(".").pop().toLowerCase();
    const bytes = readFileSync(join(ROOT, "public", decodeURIComponent(publicPath)));
    images.set(publicPath, {
      key: `i${images.size}`,
      uri: `data:${mime[ext] ?? "application/octet-stream"};base64,${bytes.toString("base64")}`,
    });
  }
  return images.get(publicPath);
}

/** Cleans Next.js output so it works without the React runtime. */
function clean(html) {
  return (
    html
      // Next.js runtime scripts, preloads, stylesheets, icon and canonical (all served by the Next server)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<link\b[^>]*>/g, "")
      // Scroll-reveal start states; without the React runtime these would stay hidden
      .replace(/ style="opacity:0;transform:translate[XY]\([^)]*\)"/g, "")
      .replace(/ style="opacity:0"/g, "")
      // No cookie banner needed: the HTML version sets no cookies and loads no analytics
      .replace(/<li><button type="button" class="[^"]*">Cookie Settings<\/button><\/li>/g, "")
      // Images: embedded once per file (single mode stores them in a shared map)
      .replace(/ src="(\/[^"]+)"/g, (_, src) => (SINGLE ? ` data-img="${image(src).key}"` : ` src="${image(src).uri}"`))
      .replace(/ srcSet="[^"]*"/gi, "")
      .replace(/ href="([^"]*)"/g, (_, href) => ` href="${rewriteHref(href)}"`)
  );
}

const between = (html, start, end) => {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i);
  if (i < 0 || j < 0) throw new Error(`Could not find ${start}`);
  return html.slice(i + start.length, j);
};
const escAttr = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;").replace(/"/g, "&quot;");

// ---------- Data for the vanilla-JS runtime ----------
const navigation = read("navigation.json");
const properties = read("properties.json").properties;
const site = read("site.json");
const homepage = read("homepage.json");
const contact = read("contact.json");

function resolveNav(item) {
  const out = { label: item.label };
  if (item.href) out.href = rewriteHref(item.href);
  const children =
    item.autoChildren === "properties" ? properties.map((p) => ({ label: p.name, href: `/hotels/${p.slug}` })) : item.children;
  if (children) out.children = children.map(resolveNav);
  return out;
}

const runtimeData = () => ({
  single: SINGLE,
  nav: navigation.primary.map(resolveNav),
  labels: { close: navigation.closeLabel, back: navigation.backLabel, overview: navigation.viewAllLabel },
  cta: { label: navigation.headerCta.label, href: rewriteHref(navigation.headerCta.href) },
  contact: site.contact,
  shortName: site.shortName,
  slides: homepage.hero.slides.map((s) => ({ src: SINGLE ? image(s.src).key : image(s.src).uri, alt: s.alt })),
  interval: homepage.hero.slideIntervalSeconds * 1000,
  formMessage: contact.form.messages.notConfigured,
  ...(SINGLE ? { images: Object.fromEntries([...images.values()].map((v) => [v.key, v.uri])) } : {}),
});

const runtimeJs = readFileSync(join(ROOT, "scripts/export-runtime.js"), "utf8");
const script = (data) =>
  `<script>window.__LHG__=${JSON.stringify(data).replace(/</g, "\\u003c")};</script><script>${runtimeJs}</script>`;

// ---------- Export ----------
await waitForServer();

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
routes.push("/brand-guide");

const firstHtml = await (await fetch(BASE)).text();
const cssHrefs = [...firstHtml.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
let css = "";
for (const href of cssHrefs) css += await (await fetch(BASE + href)).text();
// Drop the self-hosted @font-face rules (their files aren't exported) and use Google Fonts instead.
css = css.replace(/@font-face\{[^}]*\}/g, "");
css += `:root{--font-cormorant:"Cormorant Garamond";--font-inter:"Inter"}`;

const head =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500&display=swap">' +
  `<style>${css}</style>`;

if (SINGLE) {
  const templates = [];
  for (const route of routes) {
    const html = await (await fetch(BASE + route)).text();
    const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? site.name;
    const main = clean(between(html, '<main id="main" class="flex-1">', "</main>"));
    templates.push(`<template data-route="${route}" data-title="${escAttr(title)}">${main}</template>`);
  }

  // Unknown links show the same "not found" design as app/not-found.tsx.
  templates.push(
    `<template data-route="/404" data-title="Page not found | ${site.name}"><section class="flex min-h-[80svh] items-center bg-forest pt-24 text-ivory"><div class="container-luxe max-w-3xl text-center"><p class="eyebrow text-gold">Page not found</p><h1 class="display-xl mt-6">We couldn’t find that page</h1><p class="mx-auto mt-6 max-w-xl text-ivory/75">The page may have moved or no longer exists. Use the menu to continue exploring, or return to the homepage.</p><div class="mt-10 flex flex-wrap justify-center gap-4"><a href="#/" class="${"group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors duration-500 bg-ivory text-forest border border-ivory hover:bg-transparent hover:text-ivory"}">Return Home</a></div></div></section></template>`
  );

  // Shell: the homepage's <head>, header and footer, with an empty <main> the router fills in.
  let shell = clean(firstHtml);
  const mainStart = shell.indexOf('<main id="main" class="flex-1">') + '<main id="main" class="flex-1">'.length;
  const mainEnd = shell.indexOf("</main>", mainStart);
  shell =
    shell.slice(0, mainStart) +
    '<noscript><p style="padding:8rem 1.5rem;text-align:center">Please enable JavaScript to view this website.</p></noscript>' +
    shell.slice(mainEnd);
  shell = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${site.name}</title>`);
  shell = shell.replace("</head>", `${head}</head>`);
  shell = shell.replace("</body>", `${templates.join("")}${script(runtimeData())}</body>`);

  const file = join(ROOT, "lhg-website.html");
  writeFileSync(file, shell);
  stop();
  console.log(`✓ Exported ${routes.length} pages into ONE file: lhg-website.html (${(shell.length / 1024 / 1024).toFixed(1)} MB).`);
  process.exit(0);
}

const PAGES = join(OUT, "pages");
rmSync(PAGES, { recursive: true, force: true });
mkdirSync(PAGES, { recursive: true });
let total = 0;
for (const route of routes) {
  let html = clean(await (await fetch(BASE + route)).text());
  html = html.replace("</head>", `${head}</head>`);
  html = html.replace("</body>", `${script({ ...runtimeData(), page: fileFor(route) })}</body>`);
  writeFileSync(join(PAGES, fileFor(route)), html);
  total += html.length;
}

stop();
console.log(`✓ Exported ${routes.length} pages to html-export/pages/ (${(total / 1024 / 1024).toFixed(1)} MB). Open html-export/pages/index.html.`);
process.exit(0);
