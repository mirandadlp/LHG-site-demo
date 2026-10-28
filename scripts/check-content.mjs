// Checks every internal link in /content resolves to a real page.
// Run with: npm run check:content  (also runs automatically before `npm run build`).
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "content");
const read = (f) => {
  const text = readFileSync(join(dir, f), "utf8");
  try {
    return JSON.parse(text);
  } catch (error) {
    // Translate the parser's character position into a line number editors can find.
    const pos = Number(/position (\d+)/.exec(error.message)?.[1]);
    const line = Number.isFinite(pos) ? text.slice(0, pos).split("\n").length : "?";
    console.error(`\n✖ content/${f} is not valid JSON (around line ${line}): ${error.message}`);
    console.error("  Check for a missing or extra comma, quotation mark or bracket near that line.\n");
    process.exit(1);
  }
};

const properties = read("properties.json");
const sr = read("social-responsibility.json");
const routes = new Set([
  "/",
  read("about.json").path,
  properties.page.path,
  ...properties.properties.map((p) => `/hotels/${p.slug}`),
  read("services.json").page.path,
  sr.overview.path,
  ...sr.subpages.map((p) => p.path),
  read("contact.json").page.path,
  ...read("pages.json").pages.map((p) => p.path),
  ...read("legal.json").pages.map((p) => p.path),
  "/brand-guide",
]);

const anchors = new Map([["/services", new Set(read("services.json").services.map((s) => s.id))]]);

const problems = [];
const seen = new Map();
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const walk = (node, trail) => {
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${trail}[${i}]`));
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        if ((k === "href" || k === "path") && typeof v === "string" && v.startsWith("/")) {
          const [path, hash] = v.split("#");
          const clean = path.replace(/\/$/, "") || "/";
          if (k === "href" && !routes.has(clean)) problems.push(`${file} ${trail}.${k}: "${v}" does not match any page`);
          if (k === "href" && hash && anchors.has(clean) && !anchors.get(clean).has(hash))
            problems.push(`${file} ${trail}.${k}: anchor "#${hash}" not found on ${clean}`);
          if (k === "path") {
            if (seen.has(v)) problems.push(`${file} ${trail}.path: "${v}" is also defined in ${seen.get(v)}`);
            seen.set(v, file);
          }
        } else if ((k === "src" || k === "srcOnDark" || k === "ogImage") && typeof v === "string" && v.startsWith("/")) {
          try {
            readFileSync(join(process.cwd(), "public", v));
          } catch {
            problems.push(`${file} ${trail}.${k}: image "${v}" not found in /public`);
          }
        } else walk(v, `${trail}.${k}`);
      }
    }
  };
  walk(read(file), "");
}

const slugs = properties.properties.map((p) => p.slug);
for (const s of slugs.filter((s, i) => slugs.indexOf(s) !== i)) problems.push(`properties.json: duplicate slug "${s}"`);

if (problems.length) {
  console.error(`\n✖ Content check found ${problems.length} problem(s):\n  • ${problems.join("\n  • ")}\n`);
  process.exit(1);
}
console.log(`✓ Content check passed — ${routes.size} pages, all internal links and images resolve.`);
