// Generates the art-directed SVG placeholder "photographs" in public/images/placeholders.
// These stand in for real LHG photography until it is supplied. Re-run with:
//   node scripts/generate-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public/images/placeholders");
mkdirSync(OUT, { recursive: true });

const W = 1600;
const H = 1000;

const grain = `
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer>
    <feBlend in2="SourceGraphic" mode="multiply"/>
  </filter>
  <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
    <stop offset="60%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
  </radialGradient>`;

function svg(name, defs, body, label = "Placeholder image") {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
<defs>${grain}${defs}</defs>
<g filter="url(#grain)">${body}</g>
<rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;
  writeFileSync(join(OUT, `${name}.svg`), content);
}

const range = (n) => Array.from({ length: n }, (_, i) => i);

// 1. Classical facade with arched windows and an illuminated entrance canopy.
{
  const bays = range(6);
  const bayW = W / 6;
  const windows = bays
    .filter((i) => i !== 2 && i !== 3)
    .map((i) => {
      const x = i * bayW + bayW * 0.22;
      const w = bayW * 0.56;
      return `
      <path d="M${x} 330 v-40 a${w / 2} ${w / 2} 0 0 1 ${w} 0 v40 z" fill="#4a4741" opacity="0.75"/>
      <rect x="${x}" y="350" width="${w}" height="300" fill="#d9d6cf"/>
      <rect x="${x + 10}" y="360" width="${w - 20}" height="280" fill="url(#sheer)"/>
      <line x1="${x + w / 2}" y1="350" x2="${x + w / 2}" y2="650" stroke="#f3f1ec" stroke-width="6"/>
      <line x1="${x}" y1="500" x2="${x + w}" y2="500" stroke="#f3f1ec" stroke-width="6"/>
      <rect x="${x - 14}" y="${330 - w / 2 - 70}" width="${w + 28}" height="22" fill="#cfcac0"/>`;
    })
    .join("");
  const columns = [2.05, 2.45, 3.55, 3.95]
    .map((b) => `<rect x="${b * bayW - 28}" y="160" width="56" height="560" fill="url(#column)"/>
      <rect x="${b * bayW - 40}" y="150" width="80" height="26" fill="#d6d1c6"/>`)
    .join("");
  const railing = range(160)
    .map((i) => `<line x1="${i * 10}" y1="700" x2="${i * 10}" y2="790" stroke="#1b1d1b" stroke-width="2.5"/>`)
    .join("");
  const bulbs = range(11)
    .map((i) => {
      const x = 2.2 * bayW + 30 + i * ((1.6 * bayW - 60) / 10);
      return `<line x1="${x}" y1="560" x2="${W / 2 + (x - W / 2) * 0.6}" y2="610" stroke="#ffd9a0" stroke-width="5" opacity="0.9"/>`;
    })
    .join("");
  svg(
    "facade",
    `<linearGradient id="stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e6df"/><stop offset="1" stop-color="#c9c4b9"/></linearGradient>
     <linearGradient id="column" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bfb9ad"/><stop offset="0.45" stop-color="#f2efe8"/><stop offset="1" stop-color="#b3ada1"/></linearGradient>
     <linearGradient id="sheer" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8ebee"/><stop offset="0.5" stop-color="#cfd5da"/><stop offset="1" stop-color="#e8ebee"/></linearGradient>
     <radialGradient id="glow" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.9"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#stone)"/>
     ${range(14).map((i) => `<line x1="0" y1="${120 + i * 45}" x2="${W}" y2="${120 + i * 45}" stroke="#bdb7ab" stroke-width="1.5" opacity="0.6"/>`).join("")}
     <rect x="0" y="0" width="${W}" height="70" fill="#d4cfc4"/>
     <rect x="0" y="70" width="${W}" height="12" fill="#bab4a8"/>
     ${windows}${columns}
     <rect x="${2.15 * bayW}" y="520" width="${1.7 * bayW}" height="40" fill="#121412"/>
     <rect x="${2.3 * bayW}" y="560" width="${1.4 * bayW}" height="180" fill="#151714"/>
     <rect x="${2.3 * bayW}" y="560" width="${1.4 * bayW}" height="160" fill="url(#glow)"/>
     ${bulbs}
     <rect x="0" y="790" width="${W}" height="70" fill="#a9a59d"/>
     ${railing}
     <rect x="0" y="698" width="${W}" height="6" fill="#1b1d1b"/>
     <rect x="0" y="860" width="${W}" height="140" fill="#6f6d68"/>
     <rect x="0" y="905" width="${W}" height="5" fill="#d8cfa0" opacity="0.7"/>
     <ellipse cx="${2.2 * bayW}" cy="720" rx="34" ry="80" fill="#2f4a33"/>
     <ellipse cx="${3.8 * bayW}" cy="720" rx="34" ry="80" fill="#2f4a33"/>`
  );
}

// 2. Lounge: sheer curtains, curved sofa, warm lamp light.
{
  const folds = range(40)
    .map((i) => `<rect x="${i * 42}" y="0" width="22" height="${H}" fill="#ffffff" opacity="${0.08 + (i % 3) * 0.05}"/>`)
    .join("");
  svg(
    "lounge",
    `<linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4ece0"/><stop offset="0.6" stop-color="#e6dccd"/><stop offset="1" stop-color="#d8ccb9"/></linearGradient>
     <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cbbfac"/><stop offset="1" stop-color="#a99a84"/></linearGradient>
     <linearGradient id="sofa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eadfcd"/><stop offset="1" stop-color="#c8b89f"/></linearGradient>
     <radialGradient id="lamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe2a8" stop-opacity="0.95"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#wall)"/>
     ${folds}
     <rect x="1050" y="120" width="180" height="300" fill="#fbf8f2" stroke="#ddd3c3" stroke-width="3"/>
     <rect x="1300" y="90" width="200" height="340" fill="#fbf8f2" stroke="#ddd3c3" stroke-width="3"/>
     <rect x="0" y="690" width="${W}" height="310" fill="url(#floor)"/>
     <circle cx="760" cy="420" r="200" fill="url(#lamp)"/>
     <rect x="700" y="360" width="120" height="110" rx="6" fill="#f0c98a"/>
     <rect x="752" y="470" width="16" height="120" fill="#5b3e2a"/>
     <path d="M480 640 C 480 520, 600 500, 760 520 C 900 500, 1010 520, 1010 640 L 1010 820 L 480 820 Z" fill="url(#sofa)"/>
     <path d="M520 700 L 980 700 L 980 820 L 520 820 Z" fill="#dccdb6"/>
     <rect x="560" y="610" width="120" height="110" rx="18" fill="#8d9b7f"/>
     <rect x="820" y="610" width="120" height="110" rx="18" fill="#bfae94"/>
     <ellipse cx="420" cy="880" rx="260" ry="54" fill="#5b4535"/>
     <ellipse cx="420" cy="870" rx="240" ry="44" fill="#d9cbb3"/>
     <rect x="1180" y="700" width="140" height="200" rx="60" fill="#a8916f"/>
     <ellipse cx="1250" cy="700" rx="110" ry="20" fill="#c9b18a"/>`
  );
}

// 3. Bedroom: upholstered headboard, crisp linen, window light.
svg(
  "bedroom",
  `<linearGradient id="wall3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ece6da"/><stop offset="1" stop-color="#d3c9b8"/></linearGradient>
   <linearGradient id="light3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
   <linearGradient id="linen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfaf7"/><stop offset="1" stop-color="#e2ddd3"/></linearGradient>`,
  `<rect width="${W}" height="${H}" fill="url(#wall3)"/>
   <rect x="80" y="80" width="360" height="620" fill="#f6f4ef"/>
   <rect x="80" y="80" width="360" height="620" fill="url(#light3)"/>
   ${range(9).map((i) => `<rect x="${86 + i * 40}" y="80" width="18" height="620" fill="#ffffff" opacity="0.35"/>`).join("")}
   <polygon points="440,700 900,1000 80,1000 80,700" fill="#ffffff" opacity="0.18"/>
   <rect x="560" y="260" width="820" height="360" rx="12" fill="#3f5a4a"/>
   ${range(9).map((i) => `<rect x="${574 + i * 90}" y="274" width="76" height="332" rx="8" fill="#47634f"/>`).join("")}
   <rect x="0" y="760" width="${W}" height="240" fill="#9d8a72"/>
   <rect x="520" y="560" width="900" height="300" rx="16" fill="url(#linen)"/>
   <rect x="600" y="520" width="230" height="110" rx="26" fill="#f7f5f0"/>
   <rect x="1110" y="520" width="230" height="110" rx="26" fill="#f7f5f0"/>
   <rect x="520" y="700" width="900" height="70" fill="#a7b8a5"/>
   <rect x="1440" y="560" width="140" height="220" fill="#6b5240"/>
   <circle cx="1510" cy="470" r="60" fill="#f5d7a1" opacity="0.9"/>
   <rect x="1500" y="520" width="20" height="40" fill="#3a2c22"/>`
);

// 4. Restaurant & bar: deep green banquettes, pendants, warm light.
{
  const pendants = range(5)
    .map((i) => {
      const x = 260 + i * 280;
      return `<line x1="${x}" y1="0" x2="${x}" y2="300" stroke="#b59a68" stroke-width="3"/>
        <circle cx="${x}" cy="330" r="120" fill="url(#pglow)"/>
        <path d="M${x - 46} 330 a46 46 0 0 1 92 0 z" fill="#d8b778"/>`;
    })
    .join("");
  const tables = range(4)
    .map((i) => {
      const x = 380 + i * 300;
      return `<ellipse cx="${x}" cy="720" rx="110" ry="26" fill="#c9b48c"/>
        <rect x="${x - 8}" y="720" width="16" height="140" fill="#3a2c1e"/>
        <ellipse cx="${x}" cy="860" rx="60" ry="12" fill="#2a2016"/>
        <rect x="${x - 25}" y="680" width="10" height="38" fill="#f2efe8" opacity="0.8"/>`;
    })
    .join("");
  svg(
    "dining",
    `<linearGradient id="dwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#173b2c"/><stop offset="1" stop-color="#0d261c"/></linearGradient>
     <radialGradient id="pglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd38f" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd38f" stop-opacity="0"/></radialGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#dwall)"/>
     ${range(20).map((i) => `<rect x="${i * 80}" y="0" width="2" height="600" fill="#b59a68" opacity="0.18"/>`).join("")}
     <rect x="0" y="560" width="${W}" height="200" fill="#1f4a37"/>
     ${range(16).map((i) => `<rect x="${i * 100 + 6}" y="575" width="88" height="170" rx="40" fill="#24543f"/>`).join("")}
     <rect x="0" y="760" width="${W}" height="240" fill="#3b2b1f"/>
     ${range(30).map((i) => `<line x1="${i * 60}" y1="760" x2="${i * 60 - 200}" y2="1000" stroke="#2b1f16" stroke-width="2"/>`).join("")}
     ${pendants}${tables}`
  );
}

// 5. Colonnade / courtyard arches.
{
  const arch = (cx, w, h, depth) => {
    const t = 1 - depth * 0.22;
    return `<path d="M${cx - w / 2} ${H} V${H - h} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${H} z" fill="none" stroke="#a69c8b" stroke-width="${40 * t}" opacity="${0.55 + depth * 0.1}"/>`;
  };
  svg(
    "arches",
    `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fbcd1"/><stop offset="1" stop-color="#e8e2d4"/></linearGradient>
     <linearGradient id="pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d7466"/><stop offset="0.5" stop-color="#b8ad9a"/><stop offset="1" stop-color="#6e6659"/></linearGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#sky)"/>
     <rect x="0" y="380" width="${W}" height="620" fill="#e3d9c6"/>
     ${range(10).map((i) => `<rect x="${i * 170 + 30}" y="420" width="70" height="140" rx="35" fill="#cfc2aa"/>`).join("")}
     <rect x="0" y="600" width="${W}" height="400" fill="#d9ccb2"/>
     ${arch(800, 420, 560, 3)}${arch(800, 300, 420, 4)}${arch(800, 200, 300, 5)}
     <rect x="0" y="820" width="${W}" height="180" fill="#c4b59a"/>
     ${range(14).map((i) => `<line x1="${800 + (i - 7) * 30}" y1="820" x2="${800 + (i - 7) * 220}" y2="${H}" stroke="#ad9f84" stroke-width="2"/>`).join("")}
     <path d="M0 0 H560 V${H} H420 V300 a 140 140 0 0 0 -280 0 V${H} H0 Z" fill="#8a8072"/>
     <path d="M${W} 0 H1040 V${H} H1180 V300 a 140 140 0 0 1 280 0 V${H} H${W} Z" fill="#8a8072"/>
     <rect x="420" y="160" width="140" height="${H}" fill="url(#pillar)"/>
     <rect x="1040" y="160" width="140" height="${H}" fill="url(#pillar)"/>
     <line x1="800" y1="0" x2="800" y2="90" stroke="#3a332a" stroke-width="4"/>
     <circle cx="800" cy="125" r="38" fill="#f4efe6" stroke="#3a332a" stroke-width="4"/>
     <ellipse cx="300" cy="930" rx="160" ry="90" fill="#3d5a35"/>
     <ellipse cx="1300" cy="930" rx="160" ry="90" fill="#3d5a35"/>`
  );
}

// 6. London rooftops at dusk.
{
  let x = 0;
  let roofs = "";
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  while (x < W) {
    const w = 80 + rnd() * 160;
    const h = 260 + rnd() * 260;
    roofs += `<rect x="${x}" y="${H - h}" width="${w + 2}" height="${h}" fill="#1d2b25"/>`;
    if (rnd() > 0.4) roofs += `<rect x="${x + w * 0.2}" y="${H - h - 40}" width="18" height="40" fill="#1d2b25"/><rect x="${x + w * 0.2 + 24}" y="${H - h - 30}" width="14" height="30" fill="#1d2b25"/>`;
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < Math.floor(w / 40); c++)
        if (rnd() > 0.55) roofs += `<rect x="${x + 12 + c * 40}" y="${H - h + 40 + r * 60}" width="14" height="22" fill="#f1c77d" opacity="0.8"/>`;
    x += w;
  }
  svg(
    "city",
    `<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22423a"/><stop offset="0.55" stop-color="#7e8d7c"/><stop offset="1" stop-color="#e8c99a"/></linearGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#dusk)"/>
     <circle cx="1180" cy="520" r="70" fill="#f6dfb2" opacity="0.6"/>
     <path d="M1000 ${H} V360 l30 -60 l30 60 V${H} z" fill="#2b3b34"/>
     <rect x="1012" y="380" width="36" height="36" fill="#e9d29c" opacity="0.7"/>
     <path d="M300 ${H} V420 q80 -120 160 0 V${H} z" fill="#2b3b34"/>
     ${roofs}`
  );
}

// 7. Botanical / nature, for responsibility content.
{
  let leaves = "";
  let seed = 3;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) {
    const cx = rnd() * W;
    const cy = rnd() * H;
    const s = 60 + rnd() * 160;
    const rot = rnd() * 360;
    const shade = ["#2f5b43", "#3e6e52", "#557f63", "#7f9c84", "#a7b8a5", "#1f4433"][Math.floor(rnd() * 6)];
    leaves += `<g transform="translate(${cx} ${cy}) rotate(${rot})"><path d="M0 0 C ${s * 0.35} ${-s * 0.3}, ${s * 0.8} ${-s * 0.2}, ${s} 0 C ${s * 0.8} ${s * 0.2}, ${s * 0.35} ${s * 0.3}, 0 0 z" fill="${shade}" opacity="0.92"/><line x1="0" y1="0" x2="${s * 0.95}" y2="0" stroke="#0f2a1e" stroke-width="2" opacity="0.4"/></g>`;
  }
  svg(
    "botanical",
    `<radialGradient id="sun" cx="70%" cy="20%" r="80%"><stop offset="0" stop-color="#e9efd9"/><stop offset="1" stop-color="#244a37"/></radialGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#sun)"/>${leaves}`
  );
}

// 8. Meeting room: long table, chairs, tall windows.
svg(
  "meeting",
  `<linearGradient id="mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe9de"/><stop offset="1" stop-color="#ddd5c6"/></linearGradient>`,
  `<rect width="${W}" height="${H}" fill="url(#mw)"/>
   ${range(4).map((i) => `<rect x="${140 + i * 360}" y="80" width="240" height="520" fill="#f9f8f4" stroke="#cfc6b4" stroke-width="4"/><line x1="${260 + i * 360}" y1="80" x2="${260 + i * 360}" y2="600" stroke="#cfc6b4" stroke-width="4"/>`).join("")}
   <rect x="0" y="640" width="${W}" height="360" fill="#b19f84"/>
   <polygon points="300,700 1300,700 1500,860 100,860" fill="#4e3a2b"/>
   <polygon points="300,690 1300,690 1500,850 100,850" fill="#6b5240"/>
   ${range(6).map((i) => `<rect x="${330 + i * 165}" y="610" width="90" height="90" rx="20" fill="#3f5a4a"/>`).join("")}
   ${range(7).map((i) => `<rect x="${170 + i * 195}" y="860" width="120" height="110" rx="24" fill="#2f4a3c"/>`).join("")}
   ${range(5).map((i) => `<circle cx="${420 + i * 190}" cy="740" r="10" fill="#f2efe8"/>`).join("")}`
);

// 9. Detail: marble staircase and brass handrail.
svg(
  "detail",
  `<linearGradient id="marble" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3efe7"/><stop offset="1" stop-color="#cfc6b6"/></linearGradient>`,
  `<rect width="${W}" height="${H}" fill="url(#marble)"/>
   ${range(12).map((i) => `<rect x="${i * 90}" y="${H - (i + 1) * 80}" width="${W}" height="80" fill="${i % 2 ? "#e7e1d5" : "#ddd5c6"}"/><line x1="${i * 90}" y1="${H - (i + 1) * 80}" x2="${W}" y2="${H - (i + 1) * 80}" stroke="#b9ae9b" stroke-width="3"/>`).join("")}
   ${range(9).map((i) => `<path d="M${i * 200 - 100} 0 C ${i * 200} 300, ${i * 200 - 160} 600, ${i * 200 + 60} ${H}" stroke="#a69a86" stroke-width="2" fill="none" opacity="0.35"/>`).join("")}
   <path d="M0 ${H - 60} L ${W} ${-60}" stroke="#b59a68" stroke-width="16" stroke-linecap="round"/>
   <path d="M0 ${H - 40} L ${W} ${-40}" stroke="#7c6640" stroke-width="4" opacity="0.6"/>`
);

console.log("Placeholders written to", OUT);
