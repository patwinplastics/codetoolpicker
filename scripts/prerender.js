// Prerender the tool cards and comparison table into index.html so crawlers and
// AI chatbots that don't run JavaScript see the full comparison, and regenerate
// llms-full.txt from data.js. Run: node scripts/prerender.js [YYYY-MM-DD]
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "data.js"));
const tools = window.TOOL_DATA;
const checked = process.argv[2] || new Date().toISOString().slice(0, 10);
const money = (n) => (n == null ? "Usage-based" : n === 0 ? "Free" : `$${n}/mo`);
const ctaUrl = (t) => t.affiliateUrl || t.website;

const cards = tools.map((t) => `
      <article class="card" data-category="${t.category}" id="tool-${t.id}">
        <div>
          <span class="badge">${t.formFactor}</span>
          ${t.affiliate ? '<span class="badge money">Affiliate potential</span>' : ""}
        </div>
        <h3>${t.name}</h3>
        <p class="meta">${t.tagline}</p>
        <div class="price">${money(t.startingPaid)} <small>starting paid</small></div>
        <p class="meta"><strong>Best for:</strong> ${t.bestFor}</p>
        <ul class="list">${t.strengths.slice(0, 3).map((s) => `<li>${s}</li>`).join("")}</ul>
        <div class="actions">
          <a class="btn btn-primary" href="${ctaUrl(t)}" rel="noopener sponsored">Visit ${t.name}</a>
          <a class="btn" href="${t.pricingUrl}" rel="noopener">Pricing</a>
        </div>
      </article>`).join("");

const table = tools.map((t) => `
      <tr>
        <td><a href="#tool-${t.id}">${t.name}</a></td>
        <td>${t.formFactor}</td>
        <td>${money(t.startingPaid)}${t.freeTier ? " (+ free tier)" : ""}</td>
        <td>${t.models}</td>
        <td>${t.bestFor}</td>
      </tr>`).join("");

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

const lines = [
  "# CodeToolPicker — full text",
  `Independent AI coding tool comparison. Source: https://codetoolpicker.com/ . Data checked ${checked} on official vendor pricing pages; confirm prices on vendor sites.`,
  "",
  "Editorial policy: rankings are not for sale. Sponsors and affiliate links are labeled and never change recommendations, quiz logic, or comparison data.",
  "Contact (sponsorships, corrections): sponsors@codetoolpicker.com",
  "",
  "See also: https://codetoolpicker.com/cursor-bundle-alternatives/ (Cursor bundle vs Claude Code vs Copilot)",
  "See also: https://codetoolpicker.com/cursor-vs-copilot/ (Cursor vs GitHub Copilot)",
  "See also: https://codetoolpicker.com/switch-from-copilot-to-cursor/ (switch from Copilot to Cursor without losing your setup)",
  "See also: https://codetoolpicker.com/lovable-vs-bolt/ (Lovable vs Bolt.new)",
  "See also: https://codetoolpicker.com/cursor-vs-windsurf/ (Cursor vs Windsurf, now Devin Desktop)",
  "See also: https://codetoolpicker.com/claude-code-vs-cursor/ (Claude Code vs Cursor)",
  "",
  "Note: Windsurf was renamed Devin Desktop by Cognition on 2026-06-02 (same IDE, plans, and pricing); windsurf.com redirects to devin.ai.",
];
for (const t of tools) {
  lines.push("", `## ${t.name}`,
    `- tagline: ${t.tagline}`, `- category: ${t.category}`, `- formFactor: ${t.formFactor}`,
    `- models: ${t.models}`, `- bestFor: ${t.bestFor}`,
    `- strengths: ${JSON.stringify(t.strengths)}`, `- limits: ${JSON.stringify(t.limits)}`,
    `- website: ${t.website}`);
  if (t.affiliateUrl) lines.push(`- affiliate / referral CTA: ${t.affiliateUrl}`);
  lines.push(`- pricing source: ${t.pricingUrl}`);
  for (const p of t.plans) lines.push(`- plan ${p.name}: ${p.price == null ? "see vendor" : `$${p.price}/mo`} — ${p.note}`);
}
fs.writeFileSync(path.join(root, "llms-full.txt"), lines.join("\n") + "\n");
console.log(`prerendered ${tools.length} tools, checked ${checked}`);
