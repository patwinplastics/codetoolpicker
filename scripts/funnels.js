// Build step: wires every page to the link map (window.LINKS in data.js).
// - "Ready to try one?" verdict CTA panel on comparison pages (before the FAQ)
// - "Ship your app" stack section (before Related guides, or before the newsletter on the homepage)
// - rewrites every <a data-link="id"> href/rel (+ "referral" tag) from LINKS
// - regenerates each page's editorial disclosure from the affiliate links actually on the page
// - Advertise link in nav, footer and sponsor slots; Stripe checkout buttons on /advertise/
// Idempotent: safe to run on every build. Called from scripts/prerender.js.
const fs = require("fs");
const path = require("path");

module.exports = function funnels(root) {
  const R = window.CTP_RENDER;
  const L = window.LINKS;
  const CHECKOUT = window.CHECKOUT || {};
  const DEV = ["Code review", "Hosting", "Database and auth", "Domain name"];
  const BUILDER = ["Domain name", "Database and auth", "Hosting", "Code review"];
  const PAGES = {
    "index.html": { base: "", stack: ["Hosting", "Database and auth", "Code review", "Domain name"], stackBefore: '<section class="panel" id="newsletter">' },
    "ai-coding-tool-pricing/index.html": { base: "../", stack: DEV },
    "lovable-vs-bolt/index.html": { base: "../", tools: ["lovable", "bolt"], stack: BUILDER },
    "cursor-vs-windsurf/index.html": { base: "../", tools: ["cursor", "windsurf"], stack: DEV },
    "claude-code-vs-cursor/index.html": { base: "../", tools: ["claude-code", "cursor"], stack: DEV },
    "claude-code-vs-codex/index.html": { base: "../", tools: ["claude-code", "codex"], stack: DEV },
    "codex-vs-cursor/index.html": { base: "../", tools: ["codex", "cursor"], stack: DEV },
    "ai-coding-cost-per-task/index.html": { base: "../", tools: ["claude-code", "codex", "antigravity", "copilot"], stack: DEV },
    "claude-code-alternatives/index.html": { base: "../", tools: ["copilot", "antigravity", "codex", "claude-code"], stack: DEV },
    "free-ai-coding-tools/index.html": { base: "../", tools: ["copilot", "antigravity", "codex", "windsurf", "bolt", "lovable"], stack: DEV },
    "copilot-vs-claude-code/index.html": { base: "../", tools: ["copilot", "claude-code"], stack: DEV },
    "cursor-vs-antigravity/index.html": { base: "../", tools: ["cursor", "antigravity"], stack: DEV },
    "gemini-cli-vs-claude-code/index.html": { base: "../", tools: ["claude-code", "gemini-cli", "antigravity"], stack: DEV },
    "usage-limits-compared/index.html": { base: "../", tools: ["claude-code", "codex", "copilot"], stack: DEV },
    "cursor-vs-copilot/index.html": { base: "../", tools: ["cursor", "copilot"], stack: DEV },
    "cursor-bundle-alternatives/index.html": { base: "../", tools: ["cursor", "claude-code", "copilot"], stack: DEV },
    "switch-from-copilot-to-cursor/index.html": { base: "../", tools: ["cursor"], stack: DEV },
    "advertise/index.html": { base: "../", advertise: true }
  };
  const block = (html, name, content, before) => {
    const re = new RegExp(`\\n?\\s*<!-- PRERENDER:${name} -->[\\s\\S]*?<!-- /PRERENDER:${name} -->\\n?`);
    const b = `\n    <!-- PRERENDER:${name} -->${content}\n    <!-- /PRERENDER:${name} -->\n`;
    if (re.test(html)) return html.replace(re, b);
    const i = html.indexOf(before);
    if (i < 0) throw new Error(`funnels: anchor for ${name} not found: ${before}`);
    return html.slice(0, i).replace(/\s*$/, "") + b + "\n    " + html.slice(i);
  };
  const rewriteLinks = (html) => html.replace(/<a\b([^>]*?)\bdata-link="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (m, a, id, b, inner) => {
    const l = R.link(id);
    if (!l) throw new Error(`funnels: data-link "${id}" has no LINKS entry`);
    const attrs = (a + " " + b).replace(/\s*\bhref="[^"]*"/, "").replace(/\s*\brel="[^"]*"/, "").replace(/\s+/g, " ").trim();
    inner = inner.replace(/\s*<span class="tag ref">referral<\/span>/g, "").replace(/\s*\(referral link\)/g, "");
    return `<a href="${l.href}" rel="${l.rel}"${attrs ? " " + attrs : ""} data-link="${id}">${inner}${l.aff ? " " + R.refTag : ""}</a>`;
  });
  const affNames = (html) => {
    const names = new Set();
    html.replace(/<a\b[^>]*data-link="([^"]+)"[^>]*>/g, (m, id) => { const l = R.link(id); if (l && l.aff) names.add(l.name); });
    return [...names];
  };
  const list = (a) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);

  for (const [rel, cfg] of Object.entries(PAGES)) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, "utf8");
    const base = cfg.base;
    if (cfg.tools) html = block(html, "try", R.tryPanel(cfg.tools, base), '<section class="panel" id="faq">');
    if (cfg.stack) html = block(html, "stack", R.stack(base, cfg.stack), cfg.stackBefore || '<section class="panel" id="related">');
    // Advertise in nav
    if (!/<nav>[\s\S]*?advertise\/[\s\S]*?<\/nav>/.test(html)) html = html.replace(/(\n\s*)<\/nav>/, `$1  <a href="${base}advertise/">Advertise</a>$1</nav>`);
    // Sponsor slots and policy links point at /advertise/
    html = html.replace(/<a href="https:\/\/github\.com\/patwinplastics\/codetoolpicker\/blob\/main\/SPONSOR\.md" rel="noopener">(Media kit|Advertise)<\/a>/g, (m, t) => `<a href="${base}advertise/">${t === "Advertise" ? "Advertise" : "See packages"}</a>`);
    html = html.replace(/https:\/\/github\.com\/patwinplastics\/codetoolpicker\/blob\/main\/SPONSOR\.md#editorial-policy" rel="noopener"/g, `${base}advertise/#policy"`);
    // Footer advertise link
    if (!/<footer>[\s\S]*?advertise\/[\s\S]*?<\/footer>/.test(html)) html = html.replace(/(<p>Contact, sponsorships, and corrections: <a href="mailto:sponsors@codetoolpicker\.com">sponsors@codetoolpicker\.com<\/a>)(<\/p>)/, `$1 · <a href="${base}advertise/">Advertise with us</a>$2`);
    html = rewriteLinks(html);
    // Editorial disclosure, generated from what's actually on the page
    const affs = affNames(html);
    const disc = `<p><strong>Rankings are not for sale.</strong> Sponsored placements and affiliate links are always labeled, and they never change our recommendations, quiz results, prices, or comparison data. ${affs.length
      ? `<strong>Links marked "referral" are affiliate links (${list(affs)}):</strong> if you buy through them, we may earn a commission at no extra cost to you. Every other link is a plain link that pays us nothing`
      : "None of the links on this page are affiliate links: no vendor here pays us"}, and pricing source links are never affiliate links. <a href="${base}advertise/#policy">Editorial policy</a>.</p>`;
    html = html.replace(/(<section class="panel" id="disclosure"[^>]*>\s*<h2>Editorial disclosure<\/h2>\s*)<p>[\s\S]*?<\/p>/, `$1${disc}`);
    if (rel === "index.html") {
      const allAff = Object.values(L).filter((l) => l.affiliate).map((l) => l.name);
      html = html.replace(/<p>CodeToolPicker is an independent comparison site\.[\s\S]*?<\/p>/, `<p>CodeToolPicker is an independent comparison site. ${allAff.length ? `${list(allAff)} buttons are referral links (marked "referral"), so we may earn a commission at no extra cost to you.` : ""} Other tool links are plain links. Cursor, GitHub Copilot, Claude Code and most IDE vendors don't offer public affiliate programs.</p>`);
    }
    if (cfg.advertise) {
      html = html.replace(/<div class="cta-row" data-pkg="([^"]+)" data-mailto="([^"]+)">[\s\S]*?<\/div>/g, (m, key, mailto) => {
        const pay = CHECKOUT[key];
        const inner = pay
          ? `<a class="btn btn-primary" href="${pay}" rel="noopener">Book and pay by card</a> <a class="btn" href="${mailto}">Questions? Email us</a>`
          : `<a class="btn btn-primary" href="${mailto}">${key === "newsletter" ? "Email to reserve" : "Email to book"}</a>`;
        return `<div class="cta-row" data-pkg="${key}" data-mailto="${mailto}">${inner}</div>`;
      });
      const any = Object.values(CHECKOUT).some(Boolean);
      html = html.replace(/<!-- PRERENDER:checkout -->[\s\S]*?<!-- \/PRERENDER:checkout -->/, `<!-- PRERENDER:checkout --><p class="meta" style="margin-top:12px">${any ? "Pay by card through Stripe, or email us for an invoice." : "Email to book: we confirm your slot, then send a card payment link (Stripe) or an invoice."} Prices in USD, billed monthly, cancel before your next month starts.</p><!-- /PRERENDER:checkout -->`);
    }
    fs.writeFileSync(file, html);
  }
  // Analytics: GoatCounter (no cookies) on every HTML page, including pages not in PAGES
  // (new pages get it automatically on the next build). Idempotent.
  const GC = '<script data-goatcounter="https://codetoolpicker.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>';
  const GC_NOTE = '<p class="meta" id="analytics-note">We use GoatCounter, a privacy-friendly counter with no cookies, to count visits.</p>';
  const htmlFiles = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "scripts") continue;
      const f = path.join(dir, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name.endsWith(".html")) htmlFiles.push(f);
    }
  };
  walk(root);
  for (const file of htmlFiles) {
    let html = fs.readFileSync(file, "utf8");
    const before = html;
    html = html.split("\n").filter((l) => !l.includes("gc.zgo.at/count.js")).join("\n");
    if (!/<\/body>/.test(html)) continue;
    html = html.replace(/\n?<\/body>/, `\n  ${GC}\n</body>`);
    if (!html.includes('id="analytics-note"')) html = html.replace(/(\n\s*)<\/footer>/, `$1  ${GC_NOTE}$1</footer>`);
    if (html !== before) fs.writeFileSync(file, html);
  }
  return Object.keys(PAGES).length;
};
