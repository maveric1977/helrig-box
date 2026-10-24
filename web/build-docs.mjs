// Builds the docs site: README.md and docs/**/*.md (one level up from web/) become static pages under web/docs/, in the flasher's look.
// Run by Vercel as part of the build (web/vercel.json) and locally with `node build-docs.mjs` after `npm install`.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
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
const urlOf = src => src === "README.md" ? "/" : "/" + src.replace(/\.md$/, "");
const fileOf = src => src === "README.md" ? join(WEB, "index.html") : join(WEB, src.replace(/\.md$/, ".html"));
const titles = {
  "README.md": "Overview", "docs/flashing.md": "Install the firmware", "docs/setup.md": "Set up a Helrig Box",
  "docs/dev/architecture.md": "How it fits together", "docs/dev/build.md": "Build from source", "docs/dev/releasing.md": "Releasing",
  "docs/dev/measurements.md": "What has been measured", "docs/dev/setup-page.md": "The setup page",
};

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
  if (sources.includes(target)) return urlOf(target) + frag;
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

const nav = [["/", "Overview"], ["/flash", "Install"], ["/docs/flashing", "Guide"], ["/docs/setup", "Setup"], ["/docs/dev/architecture", "Developers"]];
const CSS = `
*{box-sizing:border-box}body{margin:0;font-size:17px;line-height:1.6}
header{border-bottom:1px solid var(--line)}header div{max-width:46rem;margin:0 auto;padding:.8rem 1rem;display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
header img{height:2rem;width:2rem}header a{color:var(--muted);text-decoration:none;font-size:.95rem}header a:hover{color:var(--text)}header a.brand{color:var(--text);font-weight:700;display:flex;gap:.5rem;align-items:center;margin-right:auto}
main{max-width:46rem;margin:0 auto;padding:1.5rem 1rem 4rem}
h1,h2,h3{line-height:1.25}h1{font-size:1.9rem}h2{font-size:1.35rem;margin-top:2.2rem}h3{font-size:1.1rem}
p,li{color:#d9d5cc}strong{color:var(--text)}a{color:var(--accent)}
code{background:#222;border-radius:4px;padding:.05em .35em;font-size:.88em}
pre{background:#000;border:1px solid var(--line);border-radius:10px;padding:.9rem 1rem;overflow:auto;line-height:1.45}pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;display:block;overflow:auto}th,td{border:1px solid var(--line);padding:.45rem .7rem;text-align:left;vertical-align:top}th{background:var(--panel)}
img{max-width:100%}hr{border:0;border-top:1px solid var(--line)}
a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
footer{max-width:46rem;margin:0 auto;padding:0 1rem 3rem;font-size:.85rem;color:#7d7a74}footer a{color:#a39f97}
@media(max-width:34rem){body{font-size:16px}h1{font-size:1.6rem}}`;

function page(src, body) {
  const title = titles[src] ?? src;
  const links = nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Helrig Box</title><link rel="icon" href="/icon.svg"><link rel="stylesheet" href="/site.css"><style>${CSS}</style></head>
<body><header><div><a class="brand" href="/"><img src="/icon.svg" alt=""> Helrig Box</a>${links}</div></header>
<main>${body}</main>
<footer>Source: <a href="${GITHUB}${src}">${esc(src)}</a> on GitHub.</footer></body></html>
`;
}

mkdirSync(OUT, { recursive: true });
for (const src of sources) {
  const file = fileOf(src);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(src, render(src)));
  console.log(`build-docs: ${src} -> ${relative(WEB, file)}`);
}
