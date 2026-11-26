// Prerender the tool cards and comparison table into index.html so crawlers and
// AI chatbots that don't run JavaScript see the full comparison, and regenerate
// llms-full.txt from data.js. Run: node scripts/prerender.js [YYYY-MM-DD]
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "data.js"));
require(path.join(root, "render.js"));
require(path.join(root, "guides.js")); // homepage guide cards; see field docs at the top of guides.js
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
put("guides", window.CTP_GUIDES.render(checked));
fs.writeFileSync(idx, html);

// ---- Pricing guide page (ai-coding-tool-pricing/) ----
const fmtYear = (pl) => (pl.annual == null ? "Not listed" : pl.annual === 0 ? "$0" : `$${pl.annual.toLocaleString("en-US")}${pl.seat ? "/seat" : ""}/yr (≈$${Math.ceil(pl.annual / 12)}${pl.seat ? "/seat" : ""}/mo)`);
const num = (n) => (n % 1 ? n.toFixed(2) : String(n));
const fmtMonth = (pl) => {
  if (pl.monthly === 0) return "$0";
  const seat = pl.seat ? "/seat" : "";
  if (pl.minimum != null) return `$${num(pl.minimum)}/mo minimum; $${num(pl.monthly)}${seat}/mo`;
  return `${pl.base ? `$${pl.base}/mo + ` : ""}$${num(pl.monthly)}${seat}/mo`;
};
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
  "See also: https://codetoolpicker.com/ai-coding-tool-pricing/ (all 41 plans across 9 tools, which one you need, cost calculator, pricing change log)",
  "See also: https://codetoolpicker.com/cursor-bundle-alternatives/ (Cursor bundle vs Claude Code vs Copilot)",
  "See also: https://codetoolpicker.com/cursor-vs-copilot/ (Cursor vs GitHub Copilot)",
  "See also: https://codetoolpicker.com/switch-from-copilot-to-cursor/ (switch from Copilot to Cursor without losing your setup)",
  "See also: https://codetoolpicker.com/lovable-vs-bolt/ (Lovable vs Bolt.new)",
  "See also: https://codetoolpicker.com/devin-vs-windsurf/ (Devin vs Windsurf, re-checked Nov 26, 2026: Cognition acquired Windsurf July 14, 2025 and renamed it Devin Desktop June 2, 2026; one price list, Teams a flat $80/month in shared credits for up to 100 members since Nov 18 (no $40 seat fee); IDE vs Devin Cloud; Nov 12 Teams admin changes; SWE-2 free-until conflict with docs; Devin Apps launched Nov 13)",
  "See also: https://codetoolpicker.com/cursor-vs-windsurf/ (Cursor vs Windsurf, now Devin Desktop)",
  "See also: https://codetoolpicker.com/claude-code-vs-cursor/ (Claude Code vs Cursor)",
  "See also: https://codetoolpicker.com/copilot-vs-claude-code/ (GitHub Copilot vs Claude Code: $10 credits vs $20 five-hour limits, teams of 5)",
  "See also: https://codetoolpicker.com/claude-code-vs-codex/ (Claude Code vs OpenAI Codex, with 30 days of status-page incident data)",
  "See also: https://codetoolpicker.com/cursor-vs-antigravity/ (Cursor vs Google Antigravity, with what switching actually costs)",
  "See also: https://codetoolpicker.com/gemini-cli-vs-claude-code/ (Gemini CLI vs Claude Code: Gemini CLI is now API-key and Code Assist only for individuals; Claude Pro $20; Antigravity CLI and Codex three-way note)",
  "See also: https://codetoolpicker.com/usage-limits-compared/ (usage limits compared: five-hour windows, weekly pools, monthly credits and daily quotas across Claude Code, Codex, Cursor, Copilot, Gemini CLI and Antigravity; what happens at the limit; estimated cost per task at API prices)",
  "See also: https://codetoolpicker.com/codex-vs-cursor/ (OpenAI Codex vs Cursor: GPT-6.1 Sol in ChatGPT Plus $20 vs Cursor Plus $8 Grok-only; Cursor lists no GPT-6 models; the Codex extension runs inside Cursor; teams of 5; estimated cost per task by route)",
  "See also: https://codetoolpicker.com/free-ai-coding-tools/ (free AI coding tools: every free plan checked Oct 27, 2026, the catch on each, who trains on free-tier code, cheapest upgrades, and Antigravity Free losing Claude Sonnet/Opus 4.6 on Nov 30, 2026, date re-checked Nov 22, 2026)",
  "See also: https://codetoolpicker.com/claude-code-alternatives/ (Claude Code alternatives checked Oct 28, 2026: which tools still give you Claude Opus 5.5 and Sonnet 5.5 and at what price, Copilot Pro $10 with Sonnet 5.5, Google AI Pro $19.99 and Kiro Pro $20 with Opus 5.5, Codex Plus $20 without Claude, open-source BYOK agents, tools that reuse your Claude plan limits, and teams of 5)",
  "See also: https://codetoolpicker.com/codex-usage-limits/ (Codex usage limits explained, checked Nov 13, 2026: Codex did not go unlimited; the Nov 12 banked reset is a one-time refill you redeem once an allowance is below 80%; Plus has 5-hour plus weekly limits, Pro weekly only (10x/20x/50x Plus per OpenAI Codex lead Tibo Sottiaux); starting in December ChatGPT and Codex share one token-based allowance on Plus, Pro and Business, Instant chat excluded, exact date unpublished; tips to stretch limits; vs Claude Code and Copilot)",
  "See also: https://codetoolpicker.com/gpt-6-2-limits-40-percent-faster/ (GPT-6.2 limits now hit 40% faster, checked Nov 26, 2026: OpenAI Codex lead Tibo Sottiaux posted Nov 25, 2026 at 9:50 PM ET that a billing mistake at the GPT-6.2 launch discounted Astra and Sol usage for most users; compared to the prior week you reach limits 40% faster on GPT-6.2 Astra and 25% faster on GPT-6.2 Sol; other models unaffected; no charge for past usage; one banked reset for everyone on Go, Plus, Pro and Business, online Nov 26 at 2:26 AM ET; pricing page estimates unchanged at 6-50 Astra and 17-180 Sol local messages per 5 hours on Plus; December shared ChatGPT and Codex token allowance is a separate change; calculator for messages per window now and the Astra/Sol mix that wins it back)",
  "See also: https://codetoolpicker.com/codex-usage-correction-gpt-6-2/ (Codex limits hitting sooner? The GPT-6.2 usage fix, checked Nov 25, 2026: an OpenAI email posted by users says some GPT-6.2 Astra and Sol requests, including Ultrafast, used less allowance than intended and that this is corrected, so limits may hit sooner; subscription price unchanged; pricing page still estimates 6-50 Astra and 17-180 Sol local messages per 5 hours on Plus and Standard Business; Fast still 2x and Ultrafast still 6x on included GPT-6.2 usage; OpenAI has not published how much changed; changelog latest entry still Codex CLI 0.172.0 on Nov 24; in-browser pace estimator)",
  "See also: https://codetoolpicker.com/copilot-cli-vs-claude-code-vs-codex-cli/ (Same model, different harness: Copilot CLI vs Claude Code vs Codex CLI, checked Nov 24, 2026: GitHub's Copilot benchmarks site added a Harnesses view on Nov 17 comparing Copilot CLI with Claude Code (Claude models) and Codex CLI (OpenAI models) on the same model at medium effort across DeepSWE 1.1, Terminal-Bench 4.0 and Terminal-Bench-Science 0.1; in 20 of 21 pairs resolution differed by 4 points or less; Copilot CLI cost 7% to 21% more per task than Claude Code in 6 of 9 Claude pairs (e.g. DeepSWE Sonnet 5.5 $0.40 vs $0.37) but less than Codex CLI in 11 of 12 GPT pairs (2% to 55%); Opus 5.5 on DeepSWE 72.0% vs 69.0% at $1.65 each; GPT-6 Luna DeepSWE 49.4% vs 36.6% at 47% higher cost; Codex CLI costs are GitHub estimates from OpenAI API prices; vendor-run, provisional; cost calculator with Copilot credit coverage)",
  "See also: https://codetoolpicker.com/chatgpt-business-1-seat-codex/ (ChatGPT Business with 1 seat for Codex, checked Nov 23, 2026: OpenAI's Business overview, sign-up and billing help pages now say a new workspace can start with 1 paid Standard or Premium seat, but the single-seat article says availability is limited and the pricing pages still say 2+ users; Standard $25/mo or $20 yearly gets the same Codex 5-hour estimates as Plus ($20); Premium $125/mo or $100 yearly is 5x Standard with no 5-hour limit (Oct 29 doubling, no new figure); Pro 100 is $100 and 10x Plus per Tibo; API credits $20 Standard / $100 Premium per seat, not usable for Codex; seat cuts apply next term with no automatic refund; plan picker)",
  "See also: https://codetoolpicker.com/gemini-subscription-dec-2/ (Gemini subscription on Dec 2: what\'s confirmed vs rumored, checked Nov 22, 2026: on Nov 20 at 1:00 AM ET Logan Kilpatrick replied \"December 2nd we take the first step\" after Kun Chen asked Google to allow Gemini subscriptions in any harness; he did not name Claude Code, Codex, Cursor or any plan; Antigravity FAQ still treats a consumer login in third-party tools as a terms violation; Neon already runs in Antigravity on paid Google AI Pro $19.99 and Ultra, Copilot Pro+ and up, Cursor Premium and up from prepaid credit, and the paid Gemini API at $3/$0.15/$15; Carbon and Argon still rise from $2/$10 to $4/$20 on Dec 1, a separate confirmed date; wait-or-switch picker and API cost calculator)",
  "See also: https://codetoolpicker.com/gemini-4-neon-vs-opus-5-5-vs-gpt-6-2-astra/ (Gemini 4 Neon vs Claude Opus 5.5 vs GPT-6.2 Astra, cost per coding task, checked Nov 20, 2026: Neon released Nov 18 at $3/$0.15/$15 per 1M tokens (Opus 5.5 $4/$20, Astra $8/$40); Artificial Analysis Coding Agent Index v2.1: Antigravity CLI + Neon xhigh 59 at $6.86 and 30.5 min a task, Claude Code + Opus 5.5 max 58 at $12.61, Fable 5.2 high 58 at $7.51, Codex + Astra max 53 at $5.12 and xhigh 53 at $3.20; Neon uses about 3x Astra's tokens; in Antigravity on paid Google AI Pro $19.99 and Ultra (512K context), Copilot Pro+ and up, Cursor Premium+ via prepaid credit; cheaper per token than Carbon from Dec 1; cost calculator and picker)",
  "See also: https://codetoolpicker.com/mai-code-2-vs-code-2-flash/ (MAI Code 2 vs Code 2 Flash in GitHub Copilot, checked Nov 19, 2026: launched Nov 17; Copilot per 1M tokens MAI Code 2 $0.50/$0.025/$2.50 and Flash $0.05/$0.005/$0.25 at a 50% promo until May 17, 2027, then $1/$0.05/$5 and $0.10/$0.01/$0.50; Code 2 on Pro, Pro+, Max, Business, Enterprise; Flash also Free and Student (auto model selection only); legacy annual multipliers 1x and 0.33x; Microsoft says not yet tuned for very long-horizon agent work; Flash in limited Foundry preview; credits calculator)",
  "See also: https://codetoolpicker.com/gpt-6-2-astra-vs-sol/ (GPT-6.2 Astra vs Sol for coding, checked Nov 18, 2026: launched Nov 17 in ChatGPT Work, Codex and the API, not regular Chat; Plus estimates 6-50 Astra vs 17-180 Sol local messages per 5 hours; API Astra $8/$0.40/$40, Sol $2/$0.10/$10 per million tokens; Copilot Pro+, Max, Business, Enterprise at list price; not in Cursor, which lists no GPT-6 models; no GPT-6.2 Luna)",
  "See also: https://codetoolpicker.com/tokeneconomizer-claude-code-codex/ (TokenEconomizer for Claude Code and Codex, checked Nov 17, 2026: free MIT plugin from UC Berkeley and Microsoft Research; tool pruning and a loop guard on by default; 18.4-30.9% lower mean cost per task in the researchers' SWE-Bench tests, less on web dev and new repos; tested on Claude Code 2.1.300-2.1.310, Codex 0.153.1-0.164.0, Copilot CLI 1.0.83-1.0.102 while current releases are 2.1.326, 0.169.0, 1.0.112; subscriptions save no dollars but stretch limits; savings calculator)",
  "See also: https://codetoolpicker.com/gemini-4-carbon-vs-hydrogen/ (Gemini 4 Carbon vs Hydrogen for coding, checked Nov 16, 2026: Hydrogen $1.50/$7.50 per million tokens with an API free tier, for everyday coding; Carbon and Argon $2/$10 through Nov 30, then $4/$20 from Dec 1, the same per-token price as Claude Opus 5.5; Carbon in Antigravity on Google AI Ultra at launch (paid Pro too as of Nov 26), Hydrogen on every plan as of Nov 26; Copilot Carbon on Pro+ and up, Hydrogen on Pro and up; Cursor Premium and up via prepaid credit; Copilot retires Argon and Gemini 3.8 Flash Dec 14 (replacements Carbon and Hydrogen); cost-per-task calculator)",
  "See also: https://codetoolpicker.com/claude-code-down-backup/ (Claude Code is down? Your backup plan, checked Nov 15, 2026: two Nov 13 incidents, logins 4:58-6:58 AM ET and API plus Claude Code 8:09-10:38 AM ET, root cause unpublished; how to check status.claude.com; local vs outage; backups ranked by switch speed: Codex, Cursor, Copilot, Devin Desktop, Antigravity/Gemini CLI, Aider with a non-Anthropic key; keep AGENTS.md and a second CLI ready)",
  "See also: https://codetoolpicker.com/claude-code-secrets-check/ (Claude Code secrets check: \"don't ask again\" can save passwords and tokens in .claude/settings.local.json (checked Nov 12, 2026); Apiiro found 1,122 of 104,185 public GitHub copies with secrets (1,379 distinct; 215 files missed by gitleaks and TruffleHog); Claude Code only adds the file to your global git excludes, not the repo .gitignore; free in-browser checker, 4 git commands, rotate first; no fix shipped as of Nov 12)",
  "See also: https://codetoolpicker.com/claude-fable-5-2-vs-opus-5-5/ (Claude Fable 5.2 vs Opus 5.5 in Claude Code, checked Nov 11, 2026: Fable 5.2 is $8/$40 per million vs Opus 5.5 $4/$20, cache reads $0.20 on both; Claude Pro gets Fable included only until Nov 16, 2026 11:59 PM PT, then usage credits; Max and Ultra include it up to 50% of weekly limits plus 1 to 3 resets; needs Claude Code 2.1.321+; keep Opus as default, use Fable for root-cause hunts, outages, architecture and big migrations; switching mid-session loses the cache; Copilot Pro+ and Cursor bill it at list price)",
  "See also: https://codetoolpicker.com/jetbrains-air-subscriptions/ (JetBrains Air: which AI subscription to bring, checked Nov 10, 2026: since Nov 3 GitHub Copilot runs in Air on your Copilot plan, locally and in Air Teams cloud tasks (business customers only); Copilot Pro $10 is 1,500 credits, about $15 of usage, vs JetBrains AI Pro $10 at 10 credits ($10); ChatGPT Plus/Pro/team plans work for Codex; Claude plans only work in the terminal tab, the Claude Agent chat needs JetBrains AI or an API key; Cursor needs a paid plan; Air cannot show or cap Copilot usage; Junie Lite free for a limited time)",
  "See also: https://codetoolpicker.com/cursor-live-apps-vs-lovable-bolt/ (Cursor Live Apps vs Lovable vs Bolt, checked Nov 9, 2026: Cursor cloud agents can build, host and share web apps with Postgres and Cursor sign-in since Nov 5; needs Premium $30+ (not Plus $8); deploys existing GitHub repos; hosting limits, prices and custom domains not published; Lovable Pro and Bolt Pro $25, Bolt $18/mo annual; use Live Apps for internal tools if you already pay for Cursor, Lovable or Bolt for customer-facing apps)",
  "See also: https://codetoolpicker.com/swe-2-flash-vs-swe-2/ (SWE-2 Flash vs SWE-2, checked Nov 6, 2026: Cognition's Nov 4 model for Devin Desktop and CLI, not Devin Cloud; free until Dec 4, 2026 18:00 UTC, then $0.10/$0.01/$0.125/$0.50 per million input, cache read, cache write, and output; SWE-2 free on self-serve Desktop/CLI through Nov 30, then $3/$15/$0.30; Medium on Free, High and Max need a paid plan; medium-task estimate about $0.04 vs about $1.23; blog says 3x speed and one-fifth the price, speed demo is a simulated 200 vs 60 tok/s replay, self-serve list rates are one-thirtieth)",
  "See also: https://codetoolpicker.com/claude-max-vs-ultra/ (Claude Max vs Ultra, checked Nov 4, 2026: Ultra $200 is 10x Pro per week with no five-hour limit for verified accounts vs Max $100 at 5x Pro every five hours and every week; the $100/$200 monthly API credits do not work in Claude Code; which limit you hit decides the plan; what going from $100 to $200 buys in Codex, Cursor, Google Antigravity, Kiro, Copilot and Devin)",
  "See also: https://codetoolpicker.com/jules-alternatives/ (Jules alternatives, checked Nov 3, 2026: Google Jules is read-only after Nov 11, 2026 and shuts down Dec 31; what to export; Antigravity has no Google-hosted cloud runs yet and no separate task pool; hosted background agents compared: Copilot Pro $10, Codex on ChatGPT Plus $20, Claude Code cloud sessions on Claude Pro $20, Cursor Cloud Agents from Premium $30, Devin Pro $20; Cursor Agent SDK GA)",
  "See also: https://codetoolpicker.com/chatgpt-pro-codex-limits/ (ChatGPT Pro Codex limits, checked Oct 30, 2026: OpenAI canceled the planned Pro 200 cut on Oct 29 and doubled Work and Codex usage on Pro 100 and Pro 500; 20x to 10x multiples were never official; Pro gets $100/$200/$500 a month in API credits and Business $20/$100 per seat up to $500, which do not add signed-in Codex usage; what to do now and cheaper options)",
  "See also: https://codetoolpicker.com/ai-coding-cost-per-task/ (what one AI coding task really costs, checked Oct 29, 2026: Artificial Analysis Coding Agent Index costs per hard task at API prices, Claude Code with Opus 5.5 $11.42, Sonnet 5.5 $13.30, Antigravity CLI with Gemini 4 Argon $11.73, Codex with GPT-6 Astra $7.04 and GPT-6.1 Sol $1.50; why everyday tasks cost $0.10 to $1.40; how to cut cost per task)",
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
function ensureIcons(rootDir) {
  const tags = [
    '<link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />',
    '<link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />',
    '<link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
    '<link rel="icon" href="/favicon.ico" sizes="48x48" />',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    '<link rel="manifest" href="/site.webmanifest" />',
  ];
  const block = "  " + tags.join("\n  ") + "\n";
  let updated = 0;
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      if (name === ".git" || name === "node_modules") continue;
      const pth = path.join(dir, name);
      const st = fs.statSync(pth);
      if (st.isDirectory()) walk(pth);
      else if (name.endsWith(".html")) {
        let html = fs.readFileSync(pth, "utf8");
        const orig = html;
        // Rebuild on every run so new pages picked up by prerender get the same tags.
        const linkRe = /\n?[ \t]*<link rel="(?:icon|apple-touch-icon|shortcut icon|manifest)"[^>]*>[ \t]*/gi;
        html = html.replace(linkRe, "");
        if (/[ \t]*<meta name="theme-color"/i.test(html)) {
          html = html.replace(/[ \t]*<meta name="theme-color"/i, block + '  <meta name="theme-color"');
        } else if (/[ \t]*<link rel="stylesheet"/i.test(html)) {
          html = html.replace(/[ \t]*<link rel="stylesheet"/i, block + '  <link rel="stylesheet"');
        } else if (/<\/head>/i.test(html)) {
          html = html.replace(/<\/head>/i, block + "</head>");
        } else {
          throw new Error(`ensureIcons: no insertion point in ${path.relative(rootDir, pth)}`);
        }
        if (html !== orig) {
          fs.writeFileSync(pth, html);
          updated++;
        }
      }
    }
  };
  walk(rootDir);
  return updated;
}

// "Prices verified" stamps: every <span data-pricing-checked>...</span> on any page shows window.PRICING_CHECKED.
// Only bump PRICING_CHECKED in data.js after a real recheck of every plan on the official pages.
function stampChecked(rootDir) {
  const [y, m, d] = window.PRICING_CHECKED.split("-").map(Number);
  const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  let count = 0;
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      if (name === ".git" || name === "node_modules") continue;
      const pth = path.join(dir, name);
      if (fs.statSync(pth).isDirectory()) walk(pth);
      else if (name.endsWith(".html")) {
        const html = fs.readFileSync(pth, "utf8");
        const out = html.replace(/<span data-pricing-checked>[^<]*<\/span>/g, () => (count++, `<span data-pricing-checked>${label}</span>`));
        if (out !== html) fs.writeFileSync(pth, out);
      }
    }
  };
  walk(rootDir);
  return { label, count };
}
const stamped = stampChecked(root);
console.log(`pricing-checked stamp ${stamped.label} on ${stamped.count} spots`);
const n = require(path.join(__dirname, "funnels.js"))(root);
const iconsUpdated = ensureIcons(root);
console.log(`funnels wired on ${n} pages`);
console.log(`icon tags updated on ${iconsUpdated} pages`);
console.log(`prerendered ${tools.length} tools, checked ${checked}`);
// Last step: TL;DR cards, jump chips, accordions on every guide page (see scripts/enhance.js).
require(path.join(__dirname, "enhance.js")).run();
