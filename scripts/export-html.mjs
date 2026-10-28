// Exports the built site as standalone .html files (one per page) into ./html-export.
// Each file has its CSS and images embedded, so it opens directly in a browser with no server.
// Fonts load from Google Fonts. Usage: npm run build && npm run export:html
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "html-export");
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

// ---------- Helpers ----------
/** "/" -> "index.html", "/about/our-story" -> "about-our-story.html" */
const fileFor = (path) => (path === "/" ? "index.html" : path.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-") + ".html");

const mime = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
const dataUris = new Map();
function dataUri(publicPath) {
  if (!dataUris.has(publicPath)) {
    const ext = publicPath.split(".").pop().toLowerCase();
    const bytes = readFileSync(join(ROOT, "public", decodeURIComponent(publicPath)));
    dataUris.set(publicPath, `data:${mime[ext] ?? "application/octet-stream"};base64,${bytes.toString("base64")}`);
  }
  return dataUris.get(publicPath);
}

/** Resolves next/image URLs (/_next/image?url=...) and plain /images/... paths to embedded data URIs. */
function imageSrc(src) {
  const decoded = src.replace(/&amp;/g, "&");
  if (decoded.startsWith("/_next/image")) return dataUri(new URL(decoded, BASE).searchParams.get("url"));
  return dataUri(decoded);
}

function rewriteHref(href) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [path, hash] = href.split("#");
  return fileFor(path || "/") + (hash ? `#${hash}` : "");
}

// ---------- Navigation data for the vanilla-JS menu ----------
const navigation = read("navigation.json");
const properties = read("properties.json").properties;
const site = read("site.json");
const homepage = read("homepage.json");
const contact = read("contact.json");

function resolveNav(item) {
  const out = { label: item.label };
  if (item.href) out.href = rewriteHref(item.href);
  const children =
    item.autoChildren === "properties"
      ? properties.map((p) => ({ label: p.name, href: `/hotels/${p.slug}` }))
      : item.children;
  if (children) out.children = children.map(resolveNav);
  return out;
}

const runtimeData = {
  nav: navigation.primary.map(resolveNav),
  labels: { close: navigation.closeLabel, back: navigation.backLabel, overview: navigation.viewAllLabel },
  cta: { label: navigation.headerCta.label, href: rewriteHref(navigation.headerCta.href) },
  contact: site.contact,
  shortName: site.shortName,
  slides: homepage.hero.slides.map((s) => ({ src: imageSrc(s.src), alt: s.alt })),
  interval: homepage.hero.slideIntervalSeconds * 1000,
  formMessage: contact.form.messages.notConfigured,
};

const runtimeJs = readFileSync(join(ROOT, "scripts/export-runtime.js"), "utf8");

// ---------- Export ----------
await waitForServer();

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
routes.push("/brand-guide");

const firstHtml = await (await fetch(BASE)).text();
const cssHrefs = [...firstHtml.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
let css = "";
for (const href of cssHrefs) css += await (await fetch(BASE + href)).text();
// Drop the self-hosted @font-face rules (they point at files that aren't exported) and use Google Fonts instead.
css = css.replace(/@font-face\{[^}]*\}/g, "");
css += `:root{--font-cormorant:"Cormorant Garamond";--font-inter:"Inter"}`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const fonts =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500&display=swap">';

let total = 0;
for (const route of routes) {
  let html = await (await fetch(BASE + route)).text();

  html = html
    // Next.js runtime scripts, preloads, stylesheets, icon and canonical (all served by the Next server)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<link\b[^>]*>/g, "")
    // Scroll-reveal start states; without the React runtime these would stay hidden
    .replace(/ style="opacity:0;transform:translate[XY]\([^)]*\)"/g, "")
    .replace(/ style="opacity:0"/g, "")
    // The cookie banner isn't needed: this version sets no cookies and loads no analytics
    .replace(/<li><button type="button" class="[^"]*">Cookie Settings<\/button><\/li>/g, "")
    // Images -> embedded data URIs; internal links -> sibling .html files
    .replace(/ (src)="([^"]+)"/g, (m, attr, src) => (src.startsWith("/") ? ` ${attr}="${imageSrc(src)}"` : m))
    .replace(/ srcSet="[^"]*"/gi, "")
    .replace(/ href="([^"]*)"/g, (_, href) => ` href="${rewriteHref(href)}"`);

  html = html.replace(
    "</head>",
    `${fonts}<style>${css}</style></head>`
  );
  html = html.replace(
    "</body>",
    `<script>window.__LHG__=${JSON.stringify({ ...runtimeData, page: fileFor(route) }).replace(/</g, "\\u003c")};</script><script>${runtimeJs}</script></body>`
  );

  writeFileSync(join(OUT, fileFor(route)), html);
  total += html.length;
}

stop();
console.log(`✓ Exported ${routes.length} pages to html-export/ (${(total / 1024 / 1024).toFixed(1)} MB). Open html-export/index.html.`);
process.exit(0);
