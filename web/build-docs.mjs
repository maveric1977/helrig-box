// Builds the docs site: README.md and docs/**/*.md (one level up from web/) become static pages under web/docs/, in the flasher's look.
// Run by Vercel as part of the build (web/vercel.json) and locally with `node build-docs.mjs` after `npm install`.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const WEB = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(WEB, "..");
const GITHUB = "https://github.com/maveric1977/helrig-box/blob/main/";
const OUT = join(WEB, "docs");

if (!existsSync(join(ROOT, "README.md")) || !existsSync(join(ROOT, "docs"))) {
  console.error("build-docs: README.md and docs/ are not next to web/. In the Vercel project, turn on " +
    "\"Include source files outside of the Root Directory in the Build Step\" (Settings → General).");
  process.exit(1);
}

// Markdown sources, as repo-relative posix paths, and the site URL each one gets.
const sources = ["README.md"];
(function walk(dir) {
  for (const name of readdirSync(join(ROOT, dir)).sort()) {
    const p = posix.join(dir, name);
    if (statSync(join(ROOT, p)).isDirectory()) walk(p);
    else if (name.endsWith(".md")) sources.push(p);
  }
})("docs");
(function walk(dir) {   // the 3D-printable case's pages
  if (!existsSync(join(ROOT, dir))) return;
  for (const name of readdirSync(join(ROOT, dir)).sort()) {
    const p = posix.join(dir, name);
    if (statSync(join(ROOT, p)).isDirectory()) walk(p);
    else if (name.endsWith(".md")) sources.push(p);
  }
})("hardware");
// A README.md is its folder's index page; the top-level one is the site root.
const isIndex = src => posix.basename(src) === "README.md";
const urlOf = src => isIndex(src) ? (posix.dirname(src) === "." ? "/" : "/" + posix.dirname(src) + "/") : "/" + src.replace(/\.md$/, "");
const fileOf = src => isIndex(src) ? join(WEB, posix.dirname(src) === "." ? "" : posix.dirname(src), "index.html") : join(WEB, src.replace(/\.md$/, ".html"));
// Each page's <title> and meta description. `title` is the full <title>; pages without `full` get " · Helrig Box" appended.
// og: overrides the social card's title/description (the Overview has its own wording). Pages not listed keep `legacy` and the fallback description.
const SUFFIX = " · Helrig Box";
const FALLBACK_DESCRIPTION = "A small DIY box that puts your Line 6 Helix or HX on your Wi-Fi for the Helrig apps.";
const pages = {
  "README.md": {
    title: "Helrig Box: put your Helix or HX on Wi-Fi (DIY build)", full: true,
    description: "Build a small box that puts your Line 6 Helix or HX on Wi-Fi, so the Helrig apps edit it without a cable. Waveshare board, browser flasher, 3D-printed case.",
    og: { title: "Helrig Box: your pedal, on your Wi-Fi", description: "A DIY box that puts your Helix or HX on your Wi-Fi. Flash it from your browser in about 2 minutes, print the case, and edit your pedal from the Helrig apps." },
  },
  "flash.template.html": {
    title: "Install the Helrig Box firmware in your browser", full: true,
    description: "Flash the Helrig Box firmware onto a Waveshare ESP32-P4-NANO from desktop Chrome or Edge. Nothing to install, about 2 minutes.",
  },
  "docs/flashing.md": {
    title: "Install the firmware: step by step",
    description: "What you need, how to flash the ESP32-P4-NANO from your browser, USB drivers, and what to do when flashing fails.",
  },
  "docs/setup.md": {
    title: "Set up a Helrig Box on your Wi-Fi",
    description: "Join the box's own Wi-Fi, enter your home network, connect your pedal and find the box in Helrig. Includes factory reset. 2.4 GHz only.",
  },
  "hardware/casing/README.md": {
    title: "3D-printable case for the Helrig Box", full: true,
    description: "STL files for a Helrig Box case in single colour or multi colour, sized for the Waveshare ESP32-P4-NANO. M2×7 screws, CC BY 4.0.",
  },
  "docs/dev/architecture.md": {
    title: "How the Helrig Box works: ToneRelay and Helrig",
    description: "How the Helrig Box relays a Helix pedal's USB traffic over Wi-Fi with ToneRelay, what Helrig handles, and how to build the firmware from source.",
  },
};
const legacyTitles = {
  "docs/dev/build.md": "Build from source", "docs/dev/releasing.md": "Releasing",
  "docs/dev/measurements.md": "What has been measured", "docs/dev/setup-page.md": "The setup page",
  "hardware/casing/ATTRIBUTION.md": "Case attribution",
  "hardware/casing/single-colour/README.md": "Case: single colour", "hardware/casing/multi-colour/README.md": "Case: multi colour",
};

// Titles stay within 60 characters and descriptions within 165, so search results and link previews don't cut them off.
const MAX_TITLE = 60, MAX_DESCRIPTION = 165;
function meta(src) {
  const p = pages[src] ?? { title: legacyTitles[src] ?? src, description: FALLBACK_DESCRIPTION };
  const title = p.full ? p.title : p.title + SUFFIX;
  return {
    title,
    description: p.description,
    ogTitle: p.og?.title ?? (title.endsWith(SUFFIX) ? title.slice(0, -SUFFIX.length) : title),
    ogDescription: p.og?.description ?? p.description,
  };
}
const tooLong = [];
for (const src of [...sources, "flash.template.html"]) {
  const m = meta(src);
  if (m.title.length > MAX_TITLE) tooLong.push(`${src}: title is ${m.title.length} characters (limit ${MAX_TITLE})`);
  if (m.description.length > MAX_DESCRIPTION) tooLong.push(`${src}: description is ${m.description.length} characters (limit ${MAX_DESCRIPTION})`);
}
if (tooLong.length) { console.error("build-docs: " + tooLong.join("\nbuild-docs: ")); process.exit(1); }

// The <head> tags every page shares, docs and flasher alike: title, description, canonical, icons, theme colour, Open Graph and Twitter.
const ORIGIN = "https://box.helrig.com";
const THEME_COLOR = "#060406";   // --bg in site.css
const OG_IMAGE_ALT = "The Helrig Box, a small black case with the Helrig logo, next to the words Helrig Box";
// Brand exports made in Figma. Each is linked only once its file is in brand/, so no tag points at a missing file.
const EXPORTS = ["og.png", "favicon.ico", "apple-touch-icon.png", "icon-192.png", "icon-512.png"];
const have = Object.fromEntries(EXPORTS.map(f => [f, existsSync(join(ROOT, "brand", f))]));
function headTags(src, url) {
  const m = meta(src), abs = ORIGIN + url;
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    `<link rel="canonical" href="${abs}">`,
    have["favicon.ico"] && `<link rel="icon" href="/favicon.ico" sizes="32x32">`,
    `<link rel="icon" href="/icon.svg" type="image/svg+xml">`,
    have["apple-touch-icon.png"] && `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
    have["icon-192.png"] && have["icon-512.png"] && `<link rel="manifest" href="/site.webmanifest">`,
    `<meta name="theme-color" content="${THEME_COLOR}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Helrig Box">`,
    `<meta property="og:url" content="${abs}">`,
    `<meta property="og:title" content="${esc(m.ogTitle)}">`,
    `<meta property="og:description" content="${esc(m.ogDescription)}">`,
    have["og.png"] && `<meta property="og:image" content="${ORIGIN}/og.png">`,
    have["og.png"] && `<meta property="og:image:width" content="1200">`,
    have["og.png"] && `<meta property="og:image:height" content="630">`,
    have["og.png"] && `<meta property="og:image:alt" content="${esc(OG_IMAGE_ALT)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    have["og.png"] && `<meta name="twitter:image" content="${ORIGIN}/og.png">`,
  ];
  return tags.filter(Boolean).join("\n");
}

// Copies the brand exports that exist next to the site, and writes the manifest when both its icons exist.
for (const f of EXPORTS) if (have[f]) copyFileSync(join(ROOT, "brand", f), join(WEB, f));
if (have["icon-192.png"] && have["icon-512.png"]) {
  writeFileSync(join(WEB, "site.webmanifest"), JSON.stringify({
    name: "Helrig Box", short_name: "Helrig Box", display: "browser",
    theme_color: THEME_COLOR, background_color: THEME_COLOR,
    icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
  }, null, 2) + "\n");
}

const slug = s => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9 _-]/g, "").trim().replace(/ /g, "-");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Turns a link or image address found in `from` (repo-relative) into one that works on the site.
function fix(href, from) {
  if (!href || href.startsWith("/") || /^([a-z][a-z0-9+.-]*:|#)/i.test(href)) return href; // absolute, external or in-page: leave it
  const [pathPart, hash = ""] = href.split("#");
  const frag = hash ? "#" + hash : "";
  if (!pathPart) return href;
  const target = posix.normalize(posix.join(posix.dirname(from), pathPart));
  if (target === "brand/helrig-box-icon.svg") return "/icon.svg";
  if (/^(brand|hardware)\/.+\.(svg|png)$/.test(target) && existsSync(join(ROOT, target))) {   // images the docs show: copy them next to the site
    mkdirSync(dirname(join(WEB, target)), { recursive: true });
    copyFileSync(join(ROOT, target), join(WEB, target));
    return "/" + target + frag;
  }
  if (sources.includes(target)) return urlOf(target) + frag;
  const folderIndex = posix.join(target.replace(/\/$/, ""), "README.md");   // a link to a folder goes to its README page
  if (sources.includes(folderIndex)) return urlOf(folderIndex) + frag;
  if (existsSync(join(ROOT, target))) return GITHUB + target + frag;
  console.warn(`build-docs: ${from}: link target not found: ${href}`);
  return href;
}

function render(src) {
  const md = new Marked({ gfm: true });
  const seen = new Map();
  md.use({
    walkTokens(t) { if (t.type === "link" || t.type === "image") t.href = fix(t.href, src); },
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slug(text), n = seen.get(id) ?? 0;
        seen.set(id, n + 1); if (n) id += "-" + n;
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });
  let html = md.parse(readFileSync(join(ROOT, src), "utf8"));
  // Raw HTML in the Markdown (the README's centred logo) is passed through; fix its addresses too.
  html = html.replace(/(\s(?:src|href)=")([^"]+)(")/g, (_, a, h, b) => a + fix(h, src) + b);
  return html;
}

// The navbar: label, address, and which page addresses count as "this item" (the current one is highlighted).
const nav = [
  ["Overview", "/", u => u === "/"],
  ["Install", "/flash", u => u === "/flash"],
  ["Guide", "/docs/flashing", u => u === "/docs/flashing"],
  ["Setup", "/docs/setup", u => u === "/docs/setup"],
  ["Case", "/hardware/casing/", u => u.startsWith("/hardware/")],
  ["Developers", "/docs/dev/architecture", u => u.startsWith("/docs/dev/")],
];
function header(url) {
  const links = nav.map(([label, href, here]) => `<a href="${href}"${here(url) ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<header class="site-header"><div><a class="brand" href="/"><img src="/icon.svg" alt=""> Helrig Box</a>${links}</div></header>`;
}
const CSS = `
*{box-sizing:border-box}body{margin:0;font-size:15px;line-height:1.65}
main{max-width:46rem;margin:0 auto;padding:1.5rem 1rem 4rem}
h1,h2,h3{line-height:1.25}h1{font-size:1.75rem}h2{font-size:1.2rem;margin-top:2.2rem}h3{font-size:1rem}
p,li{color:#d9d5cc}strong{color:var(--text)}a{color:var(--accent)}
code{background:#222;border-radius:4px;padding:.05em .35em;font-size:.88em}
pre{background:#000;border:1px solid var(--line);border-radius:10px;padding:.9rem 1rem;overflow:auto;line-height:1.45}pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;display:block;overflow:auto}th,td{border:1px solid var(--line);padding:.4rem .65rem;text-align:left;vertical-align:top;font-size:.9em}strong,th{font-weight:600}th{background:var(--panel)}
img{max-width:100%}hr{border:0;border-top:1px solid var(--line)}
a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
footer{max-width:46rem;margin:0 auto;padding:0 1rem 3rem;font-size:.8rem;color:#7d7a74}footer a{color:#a39f97}
@media(max-width:34rem){h1{font-size:1.5rem}}`;

// Links to other sites open in a new tab (box.helrig.com's own pages stay in this one).
const SITE_HOST = "box.helrig.com";
function externalInNewTab(html) {
  return html.replace(/<a\s([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/g, (m, pre, href, post) => {
    let host = ""; try { host = new URL(href).hostname; } catch (_) {}
    if (host === SITE_HOST || /\btarget=/.test(pre + post)) return m;
    return `<a ${pre}href="${href}"${post} target="_blank" rel="noopener noreferrer">`;
  });
}

function page(src, body) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${headTags(src, urlOf(src))}
<link rel="stylesheet" href="/site.css"><style>${CSS}</style></head>
<body>${header(urlOf(src))}
<main>${body}</main>
<footer>Source: <a href="${GITHUB}${src}">${esc(src)}</a> on GitHub.</footer></body></html>
`;
}

mkdirSync(OUT, { recursive: true });
for (const src of sources) {
  const file = fileOf(src);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, externalInNewTab(page(src, render(src))));
  console.log(`build-docs: ${src} -> ${relative(WEB, file)}`);
}

// The flasher page is a template (flash.template.html) so it gets the same navbar as the docs.
const tpl = join(WEB, "flash.template.html");
if (existsSync(tpl)) {
  writeFileSync(join(WEB, "flash.html"), readFileSync(tpl, "utf8").replace("<!--HEAD-->", headTags("flash.template.html", "/flash")).replace("<!--HEADER-->", header("/flash")));
  console.log("build-docs: flash.template.html -> flash.html");
}
