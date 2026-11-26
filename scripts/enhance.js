// Turns every guide page into the scannable, interactive layout (run by prerender.js;
// can also run alone: node scripts/enhance.js). Safe to run again and again.
// What it does, all in static HTML so crawlers and AI bots still see every word:
//  - links ../ui.css and ../ui.js
//  - TL;DR verdict card under the h1 (data: scripts/guide-tldr.js) with the category image
//  - folds the long hero paragraphs and dated notes into small <details>
//  - sticky "On this page" chips
//  - each panel section becomes a <details> accordion (first content section, calculators
//    and verdicts open), h3 groups become side-by-side cards, FAQ becomes Q&A toggles
//  - "Pick X if..." lists get data-pick so ui.js can build a "Pick for me" checklist
//  - table cells get data-label so tables stack into cards on phones
// Page copy itself is never rewritten here.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const VOID = new Set(["br", "img", "input", "meta", "link", "hr", "source", "wbr", "col", "area", "base", "embed", "param", "track"]);
const TOKEN = /<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*?(\/?)>/g;

// Top-level nodes of an HTML fragment: [{type:'el', tag, start, openEnd, closeStart, end} | {type:'text', start, end}]
function children(html) {
  const out = [];
  let depth = 0, cur = null, last = 0, m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(html))) {
    const [all, close, tagRaw, selfClose] = m;
    if (!tagRaw) { // comment/script/style
      if (depth === 0) {
        if (m.index > last) out.push({ type: "text", start: last, end: m.index });
        out.push({ type: "raw", start: m.index, end: m.index + all.length });
        last = m.index + all.length;
      }
      continue;
    }
    const tag = tagRaw.toLowerCase();
    if (all.startsWith("<script") || all.startsWith("<style")) continue;
    if (!close) {
      if (depth === 0) {
        if (m.index > last) out.push({ type: "text", start: last, end: m.index });
        cur = { type: "el", tag, start: m.index, openEnd: m.index + all.length };
      }
      if (VOID.has(tag) || selfClose) {
        if (depth === 0) { cur.closeStart = cur.openEnd; cur.end = cur.openEnd; out.push(cur); last = cur.end; cur = null; }
      } else depth++;
    } else {
      depth--;
      if (depth < 0) throw new Error("unbalanced html near " + html.slice(Math.max(0, m.index - 80), m.index + 40));
      if (depth === 0 && cur) { cur.closeStart = m.index; cur.end = m.index + all.length; out.push(cur); last = cur.end; cur = null; }
    }
  }
  if (depth !== 0) throw new Error("unclosed html: depth " + depth);
  if (last < html.length) out.push({ type: "text", start: last, end: html.length });
  return out;
}
const openTag = (html, n) => html.slice(n.start, n.openEnd);
const inner = (html, n) => html.slice(n.openEnd, n.closeStart);
const outer = (html, n) => html.slice(n.start, n.end);
const text = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&[a-z#0-9]+;/g, "").replace(/\s+/g, " ").trim();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };
const addClass = (tag, cls) => (/\sclass="/.test(tag) ? tag.replace(/\sclass="([^"]*)"/, (a, c) => ` class="${c} ${cls}"`) : tag.replace(/^<([a-z0-9]+)/i, `<$1 class="${cls}"`));
const slugify = (s) => s.toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

// Short chip label from an h2
function chipLabel(h2) {
  let t = text(h2).replace(/\s*(New|Estimate|Updated)$/i, "");
  const special = [[/^FAQ/i, "FAQ"], [/^Ready to try/i, "Try one"], [/^Verdict/i, "Verdict"], [/^Side by side/i, "Side by side"], [/team of 5/i, "Team of 5"], [/^Related/i, "Related"]];
  for (const [re, l] of special) if (re.test(t)) return l;
  if (t.includes(":") && t.split(":")[0].split(" ").length <= 4) t = t.split(":")[0];
  t = t.replace(/\(.*?\)/g, "").replace(/[?.]$/, "").trim();
  const w = t.split(" ");
  return w.length > 4 ? w.slice(0, 4).join(" ") + "…" : t;
}

// Add data-label to body cells so ui.css can stack tables on phones.
function labelTables(html) {
  return html.replace(/<table\b[^>]*>[\s\S]*?<\/table>/g, (tbl) => {
    if (/data-label=/.test(tbl)) return /class="[^"]*ui-stack/.test(tbl.slice(0, 200)) ? tbl : tbl.replace(/^<table\b([^>]*)>/, (a, rest) => addClass(`<table${rest}>`, "ui-stack"));
    if (/colspan|rowspan/.test(tbl)) return tbl;
    const head = tbl.match(/<thead[\s\S]*?<\/thead>/);
    if (!head) return tbl;
    const labels = [...head[0].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
    if (labels.length < 3) return tbl;
    let out = tbl.replace(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/, (body) => body.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/g, (row) => {
      let i = 0;
      return row.replace(/<(td|th)\b([^>]*)>/g, (a, tag, rest) => {
        const l = labels[i++];
        return l ? `<${tag}${rest} data-label="${esc(l)}">` : a;
      });
    }));
    return out.replace(/^<table\b([^>]*)>/, (a, rest) => addClass(`<table${rest}>`, "ui-stack"));
  });
}

// Group top-level h3 blocks into cards; FAQ h3 blocks into <details>.
function groupH3(body, mode) {
  const kids = children(body);
  const firstH3 = kids.findIndex((k) => k.type === "el" && k.tag === "h3");
  if (firstH3 < 0) return { html: body, picks: 0 };
  const blocks = [];
  let cur = null;
  const intro = kids.slice(0, firstH3).map((k) => outer(body, k)).join("");
  for (const k of kids.slice(firstH3)) {
    if (k.type === "el" && k.tag === "h3") { cur = { h3: k, rest: [] }; blocks.push(cur); }
    else cur.rest.push(k);
  }
  if (mode !== "faq" && blocks.length < 2) return { html: body, picks: 0 };
  // a trailing sources/meta paragraph after the last block stays outside the cards
  let tail = "";
  const lastB = blocks[blocks.length - 1];
  while (lastB.rest.length) {
    const k = lastB.rest[lastB.rest.length - 1];
    const s = outer(body, k);
    if (k.type === "text" && !s.trim()) { tail = s + tail; lastB.rest.pop(); continue; }
    if (k.type === "el" && k.tag === "p" && /class="[^"]*(meta|note|sources)/.test(openTag(body, k)) && mode !== "faq" && lastB.rest.length > 1) { tail = s + tail; lastB.rest.pop(); continue; }
    break;
  }
  let picks = 0;
  if (mode === "faq") {
    const html = intro + blocks.map((b) => {
      const q = outer(body, b.h3);
      const a = b.rest.map((k) => outer(body, k)).join("");
      return `\n      <details class="ui-faq"><summary>${q}</summary><div class="ui-faq-a">${a}</div></details>`;
    }).join("") + tail;
    return { html, picks };
  }
  const heavy = blocks.some((b) => b.rest.some((k) => k.type === "el" && (k.tag === "table" || k.tag === "pre" || (k.tag === "div" && /table-scroll|calc/.test(openTag(body, k))))));
  if (heavy) return { html: body, picks };
  const cards = blocks.map((b) => {
    const h3 = outer(body, b.h3);
    const t = text(h3);
    const pm = t.match(/^(?:Pick|Choose|Stay on|Stay with|Switch to|Go with|Use|Get)\s+(.+?)\s+(?:instead\s+)?if\b/i);
    let rest = b.rest.map((k) => outer(body, k)).join("");
    let cls = "ui-card";
    if (pm) {
      const ul = b.rest.find((k) => k.type === "el" && k.tag === "ul");
      if (ul) {
        const o = openTag(body, ul);
        if (!/data-pick=/.test(o)) rest = rest.replace(o, () => o.replace(/^<ul/, () => `<ul data-pick="${esc(pm[1])}"`));
        picks++;
        cls += " ui-pickcard";
      }
    }
    return `\n        <div class="${cls}">${h3}${rest}</div>`;
  }).join("");
  return { html: `${intro}\n      <div class="ui-cards${blocks.length === 2 ? " ui-cards-2" : ""}">${cards}\n      </div>${tail}`, picks };
}

// A panel with more than one top-level h2 ("Where X wins" / "Where Y wins") becomes side-by-side cards.
function splitH2(body, firstTitle) {
  const kids = children(body);
  const idx = kids.map((k, i) => (k.type === "el" && k.tag === "h2" ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return null;
  const blocks = [];
  blocks.push({ head: `<p class="ui-card-h" aria-hidden="true">${esc(firstTitle)}</p>`, nodes: kids.slice(0, idx[0]) });
  idx.forEach((i, j) => blocks.push({ head: outer(body, kids[i]), nodes: kids.slice(i + 1, idx[j + 1] || kids.length) }));
  const html = `\n      <div class="ui-cards${blocks.length === 2 ? " ui-cards-2" : ""}">` + blocks.map((b) => `\n        <div class="ui-card">${b.head}${b.nodes.map((k) => outer(body, k)).join("")}</div>`).join("") + `\n      </div>`;
  return { html, picks: 0 };
}

function enhancePage(file, slug, tldr, guide, cats) {
  let html = fs.readFileSync(file, "utf8");
  const orig = html;
  // 1. assets
  if (!html.includes('href="../ui.css"')) html = html.replace(/(<link rel="stylesheet" href="\.\.\/styles\.css" \/>)/, `$1\n  <link rel="stylesheet" href="../ui.css" />`);
  if (!html.includes('src="../ui.js"')) html = html.replace(/<\/body>/, `  <script src="../ui.js" defer></script>\n</body>`);

  const aStart = html.indexOf("<article>");
  const aEnd = html.lastIndexOf("</article>");
  if (aStart < 0 || aEnd < 0) { console.warn("enhance: no <article> in", slug); return false; }
  let art = html.slice(aStart + 9, aEnd);
  let kids = children(art);
  const sections = kids.filter((k) => k.type === "el" && k.tag === "section");
  const hero = sections.find((s) => /class="[^"]*\bhero\b/.test(openTag(art, s)));
  const panels = sections.filter((s) => /class="[^"]*\bpanel\b/.test(openTag(art, s)));
  const hasCalc = (s) => /<input\b|<select\b|<textarea\b|class="[^"]*\bcalc\b/.test(outer(art, s));

  // 2. panels -> accordions (process from the end so offsets stay valid)
  const SKIP = /^(try|ship)$/;
  const CLOSED = /^(related|disclosure|extension-check)$/;
  let firstContent = panels.find((p) => !CLOSED.test(attr(openTag(art, p), "id") || "") && !/stack|try/.test(attr(openTag(art, p), "class")));
  const jump = [];
  let totalPicks = 0, calcId = null;
  const edits = [];
  for (const p of panels) {
    let o = openTag(art, p);
    let id = attr(o, "id");
    const body = inner(art, p);
    const bk = children(body);
    const h2n = bk.find((k) => k.type === "el");
    if (!h2n) continue;
    let h2;
    if (h2n.tag === "h2") h2 = outer(body, h2n);
    else if (h2n.tag === "details" && /\bui-acc\b/.test(o)) { const m = body.match(/<summary class="ui-sum">(<h2\b[\s\S]*?<\/h2>)/); if (!m) continue; h2 = m[1]; }
    else continue;
    if (!id) { id = slugify(text(h2)); o = o.replace(/^<section/, () => `<section id="${id}"`); }
    const calc = hasCalc(p);
    if (calc && !calcId) calcId = id;
    if (!/^(related|disclosure|ship)$/.test(id)) jump.push({ id, label: chipLabel(h2), calc, faq: id === "faq", verdict: /^verdict|^pick|who should pick/i.test(text(h2)) });
    if (/\bui-acc\b/.test(o)) { // already enhanced; count picks for the TL;DR button
      totalPicks += (body.match(/data-pick=/g) || []).length;
      continue;
    }
    if (SKIP.test(id || "") || /\bstack\b|\btry\b/.test(attr(o, "class") || "")) continue;
    let rest = body.slice(h2n.end);
    const isFaq = id === "faq";
    const g = splitH2(rest, text(h2)) || groupH3(rest, isFaq ? "faq" : "cards");
    rest = labelTables(g.html);
    totalPicks += g.picks;
    const tags = [];
    if (calc) tags.push('<span class="ui-tag ui-tag-calc">Interactive</span>');
    if (/<table\b/.test(rest)) tags.push('<span class="ui-tag">Table</span>');
    if (isFaq) tags.push(`<span class="ui-tag">${(rest.match(/class="ui-faq"/g) || []).length} questions</span>`);
    const open = p === firstContent || calc || isFaq || g.picks > 0 || /^verdict/i.test(text(h2));
    const newSec = `${addClass(o, "ui-acc")}\n      <details class="ui-d"${open ? " open" : ""}><summary class="ui-sum">${h2}<span class="ui-tags">${tags.join("")}</span><span class="ui-chev" aria-hidden="true"></span></summary>\n      <div class="ui-body">${rest}</div></details>\n    </section>`;
    edits.push([p.start, p.end, newSec]);
  }
  for (const [s, e, r] of edits.sort((a, b) => b[0] - a[0])) art = art.slice(0, s) + r + art.slice(e);

  // 3. hero: TL;DR card + fold long paragraphs and notes
  kids = children(art);
  const heroN = kids.find((k) => k.type === "el" && k.tag === "section" && /\bhero\b/.test(openTag(art, k)));
  if (heroN) {
    let hb = inner(art, heroN);
    hb = hb.replace(/\n?\s*<!-- UI:tldr -->[\s\S]*?<!-- \/UI:tldr -->/, "");
    if (!/ui-full/.test(hb)) {
      const hk = children(hb);
      const lead = [], notes = [];
      for (const k of hk) {
        if (k.type !== "el" || k.tag !== "p") continue;
        const cls = attr(openTag(hb, k), "class") || "";
        if (!cls) lead.push(k);
        else if (/\bnote\b/.test(cls)) notes.push(k);
      }
      const rm = lead.concat(notes).sort((a, b) => b.start - a.start);
      const leadHtml = lead.map((k) => outer(hb, k)).join("\n        ");
      const notesHtml = notes.map((k) => outer(hb, k)).join("\n        ");
      // anchor point: right after the last removed element that comes before the cta-row
      for (const k of rm) hb = hb.slice(0, k.start).replace(/[ \t]*$/, "") + hb.slice(k.end).replace(/^[ \t]*\n/, "");
      let folded = "";
      if (lead.length) folded += `\n      <details class="ui-full"><summary>Read the full short answer</summary>\n        ${leadHtml}\n      </details>`;
      if (notes.length) folded += `\n      <details class="ui-updates"><summary><span class="ui-dot"></span>${notes.length} update${notes.length > 1 ? "s" : ""} since this was published</summary>\n        ${notesHtml}\n      </details>`;
      hb = hb.replace(/(<\/h1>)/, (m0) => `${m0}<!-- UI:folds -->${folded}<!-- /UI:folds -->`);
    }
    // TL;DR
    let card = "";
    const cat = guide && cats[guide.cat];
    const imgKey = guide ? { versus: "head-to-head" }[guide.cat] || guide.cat : null;
    if (tldr) {
      const btns = [];
      if (totalPicks >= 2) btns.push(`<a class="btn btn-primary" href="#ui-pick" data-ui-open>🎯 Pick for me</a>`);
      if (calcId) btns.push(`<a class="btn${btns.length ? "" : " btn-primary"}" href="#${calcId}" data-ui-open>🧮 Open the calculator</a>`);
      const v = jump.find((j) => j.verdict);
      if (v && btns.length < 2) btns.push(`<a class="btn" href="#${v.id}" data-ui-open>Jump to the verdict</a>`);
      card = `
      <div class="ui-tldr${cat ? " g-" + guide.cat : ""}">
        <div class="ui-tldr-main">
          <p class="ui-kicker">TL;DR${cat ? ` · ${cat.icon} ${cat.label}` : ""}</p>
          <p class="ui-win"><span aria-hidden="true">🏆</span> ${esc(tldr.win)}</p>
          <p class="ui-verdict">${esc(tldr.verdict)}</p>
          <div class="ui-stats">${tldr.stats.map(([v2, l]) => `<div class="ui-stat"><b>${esc(v2)}</b><span>${esc(l)}</span></div>`).join("")}</div>
          ${btns.length ? `<div class="cta-row ui-tldr-cta">${btns.join(" ")}</div>` : ""}
        </div>
        ${imgKey ? `<img class="ui-tldr-art" src="../img/cat-${imgKey}-sm.webp" srcset="../img/cat-${imgKey}-sm.webp 480w, ../img/cat-${imgKey}.webp 960w" sizes="(max-width: 700px) 92vw, 300px" width="480" height="270" alt="${esc(cat.label)} guide illustration: abstract glowing code editor windows" fetchpriority="high" />` : ""}
      </div>`;
    }
    if (card) hb = hb.replace(/(<\/h1>)/, (m0) => `${m0}\n      <!-- UI:tldr -->${card}\n      <!-- /UI:tldr -->`);
    art = art.slice(0, heroN.openEnd) + hb + art.slice(heroN.closeStart);
  }

  // 4. jump nav after the hero
  art = art.replace(/\n?\s*<!-- UI:jump -->[\s\S]*?<!-- \/UI:jump -->/, "");
  if (jump.length >= 3) {
    const chips = jump.map((j) => `<a href="#${j.id}" class="ui-chip${j.calc ? " ui-chip-calc" : ""}">${j.calc ? "🧮 " : j.verdict ? "🏆 " : ""}${esc(j.label)}</a>`).join("");
    const nav = `\n    <!-- UI:jump --><nav class="ui-jump" aria-label="On this page"><div class="ui-jump-in">${chips}</div><button type="button" class="ui-expand" hidden>Expand all</button></nav><!-- /UI:jump -->`;
    kids = children(art);
    const h = kids.find((k) => k.type === "el" && k.tag === "section" && /\bhero\b/.test(openTag(art, k)));
    if (h) art = art.slice(0, h.end) + nav + art.slice(h.end);
  }

  html = html.slice(0, aStart + 9) + art + html.slice(aEnd);
  if (html !== orig) fs.writeFileSync(file, html);
  return html !== orig;
}

function run() {
  global.window = global.window || {};
  if (!window.GUIDES) require(path.join(root, "guides.js"));
  const TLDR = require("./guide-tldr.js");
  const bySlug = Object.fromEntries(window.GUIDES.map((g) => [g.slug, g]));
  const dirs = fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, "index.html")) && d !== "advertise");
  let n = 0;
  for (const d of dirs) {
    if (!TLDR[d]) console.warn(`enhance: no TL;DR for ${d} (add one to scripts/guide-tldr.js)`);
    if (enhancePage(path.join(root, d, "index.html"), d, TLDR[d], bySlug[d], window.GUIDE_CATS)) n++;
  }
  console.log(`enhance: ${n} of ${dirs.length} guide pages updated`);
}
module.exports = { run, children, groupH3 };
if (require.main === module) run();
