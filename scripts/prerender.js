// Prerender the tool cards and comparison table into index.html so crawlers and
// AI chatbots that don't run JavaScript see the full comparison, and regenerate
// llms-full.txt from data.js. Run: node scripts/prerender.js [YYYY-MM-DD]
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "data.js"));
require(path.join(root, "render.js"));
const tools = window.TOOL_DATA;
const R = window.CTP_RENDER;
const P = window.PRICING;
const checked = process.argv[2] || new Date().toISOString().slice(0, 10);
const money = (n) => (n == null ? "Usage-based" : n === 0 ? "Free" : `$${n}/mo`);

const cards = tools.map((t) => R.card(t, "")).join("");
const table = tools.map(R.glanceRow).join("");

const idx = path.join(root, "index.html");
let html = fs.readFileSync(idx, "utf8");
const put = (name, content) => {
  const re = new RegExp(`<!-- PRERENDER:${name} -->[\\s\\S]*?<!-- /PRERENDER:${name} -->`);
  if (!re.test(html)) throw new Error(`marker ${name} missing`);
  html = html.replace(re, `<!-- PRERENDER:${name} -->${content}\n      <!-- /PRERENDER:${name} -->`);
};
put("cards", cards);
put("table", table);
fs.writeFileSync(idx, html);

// ---- Pricing guide page (ai-coding-tool-pricing/) ----
const fmtYear = (pl) => (pl.annual == null ? "Not listed" : pl.annual === 0 ? "$0" : `$${pl.annual.toLocaleString("en-US")}${pl.seat ? "/seat" : ""}/yr (≈$${Math.ceil(pl.annual / 12)}${pl.seat ? "/seat" : ""}/mo)`);
const num = (n) => (n % 1 ? n.toFixed(2) : String(n));
const fmtMonth = (pl) => (pl.monthly === 0 ? "$0" : `${pl.base ? `$${pl.base}/mo + ` : ""}$${num(pl.monthly)}${pl.seat ? "/seat" : ""}/mo`);
const planSections = tools.map((t) => {
  const p = P[t.id];
  return `
    <section class="panel" id="plans-${t.id}">
      <h2>${t.name}: which plan do you need?</h2>
      <p class="meta"><span class="badge best">${p.bestBadge}</span> &nbsp;Pricing source: <a href="${t.pricingUrl}" rel="noopener">${t.pricingUrl.replace("https://", "")}</a></p>
      <div class="table-scroll"><table class="plan-table">
        <thead><tr><th>Plan</th><th>Monthly billing</th><th>Annual billing</th><th>What you get</th></tr></thead>
        <tbody>${p.plans.map((pl) => `<tr><td>${pl.name}</td><td>${fmtMonth(pl)}</td><td>${fmtYear(pl)}</td><td>${pl.note || ""}</td></tr>`).join("")}</tbody>
      </table></div>
      <h3>Which plan you actually need</h3>
      <ul>${p.guide.map(([n, w]) => `<li><strong>${n}:</strong> ${w}</li>`).join("")}</ul>
      <p class="meta"><strong>Not included:</strong> ${p.extraCost}</p>
      <p class="skip"><strong>Skip ${R.short(t.name)} if:</strong> ${p.skipIf}</p>
      <div class="cta-row" style="margin-top:12px">
        ${R.tryBtn(t.id, `${t.freeTier ? "Try" : "Get"} ${R.short(t.name)}${t.freeTier ? " free" : ""}`, "btn-primary")}
        <a class="btn" href="#calc" data-calc="${t.id}">Estimate ${R.short(t.name)} cost</a>
      </div>
      ${R.disclosure([t.id])}
    </section>`;
}).join("");
const log = window.PRICE_LOG.map((e) => `<li><time datetime="${e.date}">${e.date}</time>${e.text} <a href="${e.src}" rel="noopener">Source</a></li>`).join("");
const pg = path.join(root, "ai-coding-tool-pricing", "index.html");
if (fs.existsSync(pg)) {
  let ph = fs.readFileSync(pg, "utf8");
  const putP = (name, content) => {
    const re = new RegExp(`<!-- PRERENDER:${name} -->[\\s\\S]*?<!-- /PRERENDER:${name} -->`);
    if (!re.test(ph)) throw new Error(`pricing marker ${name} missing`);
    ph = ph.replace(re, `<!-- PRERENDER:${name} -->${content}\n      <!-- /PRERENDER:${name} -->`);
  };
  putP("table", table.replace(/href="#tool-/g, 'href="#plans-'));
  putP("plans", planSections);
  putP("log", log);
  fs.writeFileSync(pg, ph);
}

const lines = [
  "# CodeToolPicker: full text",
  `Independent AI coding tool comparison. Source: https://codetoolpicker.com/ . Data checked ${checked} on official vendor pricing pages; confirm prices on vendor sites.`,
  "",
  "Editorial policy: rankings are not for sale. Sponsors and affiliate links are labeled and never change recommendations, quiz logic, or comparison data.",
  "Contact (sponsorships, corrections): sponsors@codetoolpicker.com",
  "",
  "See also: https://codetoolpicker.com/ai-coding-tool-pricing/ (all 40 plans across 9 tools, which one you need, cost calculator, pricing change log)",
  "See also: https://codetoolpicker.com/cursor-bundle-alternatives/ (Cursor bundle vs Claude Code vs Copilot)",
  "See also: https://codetoolpicker.com/cursor-vs-copilot/ (Cursor vs GitHub Copilot)",
  "See also: https://codetoolpicker.com/switch-from-copilot-to-cursor/ (switch from Copilot to Cursor without losing your setup)",
  "See also: https://codetoolpicker.com/lovable-vs-bolt/ (Lovable vs Bolt.new)",
  "See also: https://codetoolpicker.com/cursor-vs-windsurf/ (Cursor vs Windsurf, now Devin Desktop)",
  "See also: https://codetoolpicker.com/claude-code-vs-cursor/ (Claude Code vs Cursor)",
  "See also: https://codetoolpicker.com/copilot-vs-claude-code/ (GitHub Copilot vs Claude Code: $10 credits vs $20 five-hour limits, teams of 5)",
  "See also: https://codetoolpicker.com/claude-code-vs-codex/ (Claude Code vs OpenAI Codex, with 30 days of status-page incident data)",
  "See also: https://codetoolpicker.com/cursor-vs-antigravity/ (Cursor vs Google Antigravity, with what switching actually costs)",
  "See also: https://codetoolpicker.com/gemini-cli-vs-claude-code/ (Gemini CLI vs Claude Code: Gemini CLI is now API-key and Code Assist only for individuals; Claude Pro $20; Antigravity CLI and Codex three-way note)",
  "See also: https://codetoolpicker.com/advertise/ (sponsor packages and the editorial policy)",
  "",
  "Note: Windsurf was renamed Devin Desktop by Cognition on 2026-06-02 (same IDE, plans, and pricing); windsurf.com redirects to devin.ai.",
];
for (const t of tools) {
  lines.push("", `## ${t.name}`,
    `- tagline: ${t.tagline}`, `- category: ${t.category}`, `- formFactor: ${t.formFactor}`,
    `- models: ${t.models}`, `- bestFor: ${t.bestFor}`,
    `- strengths: ${JSON.stringify(t.strengths)}`, `- limits: ${JSON.stringify(t.limits)}`,
    `- website: ${t.website}`);
  if (t.affiliateUrl) lines.push(`- affiliate / referral CTA (disclosed on site): ${t.affiliateUrl}`);
  lines.push(`- pricing source: ${t.pricingUrl}`);
  for (const p of t.plans) lines.push(`- plan ${p.name}: ${p.price == null ? "see vendor" : `$${p.price}/mo`}: ${p.note}`);
  const pr = P[t.id];
  if (pr) {
    lines.push(`- best for (badge): ${pr.bestBadge}`);
    for (const pl of pr.plans) lines.push(`- price ${pl.name}: monthly ${fmtMonth(pl)}; annual ${fmtYear(pl)}${pl.note ? `; ${pl.note}` : ""}`);
    for (const [n, w] of pr.guide) lines.push(`- which plan: ${n}: ${w}`);
    lines.push(`- not included: ${pr.extraCost}`);
    lines.push(`- skip it if: ${pr.skipIf}`);
  }
}
lines.push("", "## Ship your app: the rest of the stack (prices checked 2026-10-20)");
for (const g of window.STACK) {
  lines.push(`### ${g.group}: ${g.why}`);
  for (const it of g.items) lines.push(`- ${window.LINKS[it.id].name} (${window.LINKS[it.id].url}): ${it.fit}. ${it.price}`);
  if (g.note) lines.push(`- Note: ${g.note}`);
}
lines.push("", "## Pricing change log");
for (const e of window.PRICE_LOG) lines.push(`- ${e.date}: ${e.text} (source: ${e.src})`);
fs.writeFileSync(path.join(root, "llms-full.txt"), lines.join("\n") + "\n");
const n = require(path.join(__dirname, "funnels.js"))(root);
console.log(`funnels wired on ${n} pages`);
console.log(`prerendered ${tools.length} tools, checked ${checked}`);
