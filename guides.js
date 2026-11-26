// Homepage guide cards. scripts/prerender.js turns this list into the
// "Comparisons and guides" grid in index.html (between the PRERENDER:guides markers).
//
// HOW TO ADD A NEW PAGE (daily runs): add ONE object at the TOP of the list.
//   slug   folder name of the page, no slashes, e.g. "gpt-6-2-astra-vs-sol"
//   title  short card title, max about 6 words
//   hook   ONE punchy line, max about 10 words. Lead with a number when you can
//          ("$6.86 vs $12.61 a task", "Scores tie. Bills don't."). No em dashes.
//   cat    one of: pricing, models, versus, limits, news, alternatives (see CATS)
//   tools  1 to 4 keys from TOOL_BADGES (logo chips on the card)
//   date   YYYY-MM-DD the page went live. Cards dated within 7 days of the
//          prerender date get a "New" badge; the 4 newest become the big featured row.
//   icon   optional emoji for the card art (defaults to the category icon)
// Then run: node scripts/prerender.js
window.GUIDE_CATS = {
  pricing: { label: "Pricing", icon: "💸" },
  models: { label: "Models", icon: "🧠" },
  versus: { label: "Head-to-head", icon: "🥊" },
  limits: { label: "Limits", icon: "⏳" },
  news: { label: "News", icon: "📰" },
  alternatives: { label: "Alternatives", icon: "🔀" },
};

window.TOOL_BADGES = {
  cursor: { label: "Cursor", short: "Cu", color: "#e8eef7", bg: "#2a3342" },
  copilot: { label: "GitHub Copilot", short: "GH", color: "#ffffff", bg: "#6e40c9" },
  claude: { label: "Claude / Claude Code", short: "Cl", color: "#1a0f08", bg: "#d97757" },
  codex: { label: "OpenAI Codex / ChatGPT", short: "AI", color: "#062016", bg: "#10a37f" },
  gemini: { label: "Google Gemini / Antigravity", short: "G", color: "#ffffff", bg: "#4285f4" },
  windsurf: { label: "Windsurf / Devin", short: "Dv", color: "#062016", bg: "#67e8f9" },
  lovable: { label: "Lovable", short: "Lv", color: "#ffffff", bg: "#e5486e" },
  bolt: { label: "Bolt.new", short: "Bt", color: "#ffffff", bg: "#1d4ed8" },
  jules: { label: "Google Jules", short: "Ju", color: "#ffffff", bg: "#7c3aed" },
  mai: { label: "Microsoft MAI", short: "MS", color: "#ffffff", bg: "#0078d4" },
  jetbrains: { label: "JetBrains", short: "JB", color: "#ffffff", bg: "#e8457c" },
  all: { label: "All tools", short: "All", color: "#062016", bg: "#6ee7b7" },
};

window.GUIDES = [
  { slug: "gpt-6-2-limits-40-percent-faster", title: "GPT-6.2 limits: 40% faster now", hook: "Astra burns 40% faster, Sol 25%. Free reset.", cat: "limits", tools: ["codex"], date: "2026-11-26", icon: "🔥" },
  { slug: "codex-usage-correction-gpt-6-2", title: "Codex limits hitting sooner?", hook: "Price unchanged. Ultrafast is still 6x.", cat: "limits", tools: ["codex"], date: "2026-11-25", icon: "⏳" },
  { slug: "copilot-cli-vs-claude-code-vs-codex-cli", title: "Copilot CLI vs Claude Code vs Codex", hook: "Same model, 21 matchups. Scores tie. Bills don't.", cat: "versus", tools: ["copilot", "claude", "codex"], date: "2026-11-24", icon: "⚔️" },
  { slug: "chatgpt-business-1-seat-codex", title: "1-seat ChatGPT Business for Codex?", hook: "$25 a month for the same Codex as Plus", cat: "pricing", tools: ["codex"], date: "2026-11-23", icon: "💼" },
  { slug: "gemini-subscription-dec-2", title: "Gemini sub on Dec 2: what's real", hook: "\"First step\" is not a promise. What's confirmed.", cat: "news", tools: ["gemini", "claude", "codex"], date: "2026-11-22", icon: "📅" },
  { slug: "gemini-4-neon-vs-opus-5-5-vs-gpt-6-2-astra", title: "Neon vs Opus 5.5 vs Astra", hook: "$6.86 vs $12.61 a task, tied score", cat: "models", tools: ["gemini", "claude", "codex"], date: "2026-11-20", icon: "🧪" },
  { slug: "mai-code-2-vs-code-2-flash", title: "MAI Code 2 vs Code 2 Flash", hook: "1/4 the price of Sol in Copilot", cat: "models", tools: ["mai", "copilot"], date: "2026-11-19" },
  { slug: "gpt-6-2-astra-vs-sol", title: "GPT-6.2 Astra vs Sol", hook: "One Astra message costs about 3 Sol", cat: "models", tools: ["codex", "copilot"], date: "2026-11-18" },
  { slug: "tokeneconomizer-claude-code-codex", title: "TokenEconomizer: cut your agent bill?", hook: "18 to 31% cheaper in tests. One catch.", cat: "pricing", tools: ["claude", "codex"], date: "2026-11-17", icon: "✂️" },
  { slug: "gemini-4-carbon-vs-hydrogen", title: "Gemini 4 Carbon vs Hydrogen", hook: "Carbon doubles to $4/$20 on Dec 1", cat: "models", tools: ["gemini", "copilot", "cursor"], date: "2026-11-16" },
  { slug: "claude-code-down-backup", title: "Claude Code down? Backup plan", hook: "2 outages in one morning. Switch in minutes.", cat: "alternatives", tools: ["claude", "codex", "copilot"], date: "2026-11-15", icon: "🚨" },
  { slug: "devin-vs-windsurf", title: "Devin vs Windsurf", hook: "Not rivals anymore. Teams from $80.", cat: "versus", tools: ["windsurf"], date: "2026-11-13" },
  { slug: "codex-usage-limits", title: "Codex usage limits explained", hook: "No, Codex did not go unlimited", cat: "limits", tools: ["codex"], date: "2026-11-13" },
  { slug: "claude-code-secrets-check", title: "Claude Code secrets check", hook: "1,122 public repos leaked secrets", cat: "news", tools: ["claude"], date: "2026-11-12", icon: "🔐" },
  { slug: "claude-fable-5-2-vs-opus-5-5", title: "Fable 5.2 vs Opus 5.5", hook: "Fable costs 2x Opus per token", cat: "models", tools: ["claude"], date: "2026-11-11" },
  { slug: "jetbrains-air-subscriptions", title: "JetBrains Air subscriptions", hook: "Copilot now runs in Air on your plan", cat: "pricing", tools: ["jetbrains", "claude", "codex"], date: "2026-11-10" },
  { slug: "cursor-live-apps-vs-lovable-bolt", title: "Cursor Live Apps vs Lovable vs Bolt", hook: "Cursor now hosts apps on $30+ plans", cat: "versus", tools: ["cursor", "lovable", "bolt"], date: "2026-11-09" },
  { slug: "swe-2-flash-vs-swe-2", title: "SWE-2 Flash vs SWE-2", hook: "Free until Dec 4, then $0.10/M", cat: "models", tools: ["windsurf"], date: "2026-11-06" },
  { slug: "cursor-openai-cutoff", title: "Cursor's OpenAI cutoff", hook: "GPT leaves Cursor's Agent. How to keep it.", cat: "news", tools: ["cursor", "codex", "copilot"], date: "2026-11-05", icon: "✂️" },
  { slug: "claude-max-vs-ultra", title: "Claude Max vs Ultra", hook: "$200 gets 2x weekly, no 5-hour cap", cat: "pricing", tools: ["claude"], date: "2026-11-04" },
  { slug: "jules-alternatives", title: "Jules alternatives", hook: "Jules shuts down Dec 31. Where to go.", cat: "alternatives", tools: ["jules", "codex", "windsurf"], date: "2026-11-03" },
  { slug: "chatgpt-pro-codex-limits", title: "ChatGPT Pro Codex limits", hook: "The Pro 200 Codex cut is canceled", cat: "limits", tools: ["codex"], date: "2026-10-30" },
  { slug: "ai-coding-cost-per-task", title: "What one AI task really costs", hook: "$0.16 to $13.30 per task", cat: "pricing", tools: ["all"], date: "2026-10-29", icon: "🧾" },
  { slug: "claude-code-alternatives", title: "Claude Code alternatives", hook: "Who still gives you Opus 5.5", cat: "alternatives", tools: ["claude", "copilot", "cursor"], date: "2026-10-28" },
  { slug: "free-ai-coding-tools", title: "Free AI coding tools", hook: "Every free plan and its catch", cat: "pricing", tools: ["all"], date: "2026-10-27", icon: "🆓" },
  { slug: "codex-vs-cursor", title: "OpenAI Codex vs Cursor", hook: "$20 for GPT-6.1 vs $8 Grok-only", cat: "versus", tools: ["codex", "cursor"], date: "2026-10-26" },
  { slug: "usage-limits-compared", title: "Usage limits compared", hook: "5-hour vs weekly vs monthly credits", cat: "limits", tools: ["all"], date: "2026-10-23" },
  { slug: "gemini-cli-vs-claude-code", title: "Gemini CLI vs Claude Code", hook: "Gemini CLI dropped Google AI plans", cat: "versus", tools: ["gemini", "claude"], date: "2026-10-22" },
  { slug: "copilot-vs-claude-code", title: "Copilot vs Claude Code", hook: "$10 credits vs $20 with 5-hour limits", cat: "versus", tools: ["copilot", "claude"], date: "2026-10-21" },
  { slug: "cursor-vs-antigravity", title: "Cursor vs Antigravity", hook: "$19.99 Gemini + Claude vs $30", cat: "versus", tools: ["cursor", "gemini"], date: "2026-10-20" },
  { slug: "claude-code-vs-codex", title: "Claude Code vs Codex", hook: "Same $20 price, different limits", cat: "versus", tools: ["claude", "codex"], date: "2026-10-20" },
  { slug: "ai-coding-tool-pricing", title: "AI coding tool pricing 2026", hook: "All 41 plans on one page", cat: "pricing", tools: ["all"], date: "2026-10-19", icon: "📊" },
  { slug: "lovable-vs-bolt", title: "Lovable vs Bolt.new", hook: "Credits vs tokens for app builders", cat: "versus", tools: ["lovable", "bolt"], date: "2026-10-19" },
  { slug: "cursor-vs-windsurf", title: "Cursor vs Windsurf", hook: "Windsurf is now Devin Desktop", cat: "versus", tools: ["cursor", "windsurf"], date: "2026-10-19" },
  { slug: "claude-code-vs-cursor", title: "Claude Code vs Cursor", hook: "Terminal agent vs AI IDE", cat: "versus", tools: ["claude", "cursor"], date: "2026-10-19" },
  { slug: "cursor-vs-copilot", title: "Cursor vs GitHub Copilot", hook: "Plans, models and editors side by side", cat: "versus", tools: ["cursor", "copilot"], date: "2026-10-19" },
  { slug: "switch-from-copilot-to-cursor", title: "Switch from Copilot to Cursor", hook: "Move over without losing your setup", cat: "alternatives", tools: ["copilot", "cursor"], date: "2026-10-19", icon: "🧳" },
  { slug: "cursor-bundle-alternatives", title: "Cursor's new bundle: switch?", hook: "Claude Code or Copilot instead?", cat: "alternatives", tools: ["cursor", "claude", "copilot"], date: "2026-10-16" },
];

// ---- Card renderer (used by scripts/prerender.js) ----
window.CTP_GUIDES = (function () {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const FEATURED = 4;
  const VISIBLE = 8; // grid cards shown before "Show all guides" (JS only; all links stay in the HTML)
  function card(g, isNew, featured) {
    const c = window.GUIDE_CATS[g.cat];
    if (!c) throw new Error(`guides.js: unknown cat "${g.cat}" on ${g.slug}`);
    const logos = (g.tools || []).map((k) => {
      const t = window.TOOL_BADGES[k];
      if (!t) throw new Error(`guides.js: unknown tool "${k}" on ${g.slug}`);
      return `<span class="g-logo" style="color:${t.color};background:${t.bg}" title="${esc(t.label)}">${esc(t.short)}</span>`;
    }).join("");
    return `
        <a class="g-card g-${g.cat}${featured ? " g-feat" : ""}" href="${g.slug}/" data-cat="${g.cat}">
          <span class="g-top"><span class="g-cat">${c.icon} ${c.label}</span>${isNew ? '<span class="g-new">New</span>' : ""}</span>
          ${featured ? `<span class="g-art" aria-hidden="true">${g.icon || c.icon}</span>` : ""}
          <span class="g-title">${esc(g.title)}</span>
          <span class="g-hook">${esc(g.hook)}</span>
          <span class="g-foot"><span class="g-logos">${logos}</span><span class="g-go" aria-hidden="true">→</span></span>
        </a>`;
  }
  function render(today) {
    const list = window.GUIDES.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    const t0 = new Date(today + "T00:00:00Z").getTime();
    const isNew = (g) => t0 - new Date(g.date + "T00:00:00Z").getTime() < 7 * 864e5;
    const counts = {};
    list.forEach((g) => (counts[g.cat] = (counts[g.cat] || 0) + 1));
    const chips = [`<button type="button" class="g-chip is-on" data-filter="all" aria-pressed="true">All <span>${list.length}</span></button>`]
      .concat(Object.keys(window.GUIDE_CATS).filter((k) => counts[k]).map((k) => `<button type="button" class="g-chip g-${k}" data-filter="${k}" aria-pressed="false">${window.GUIDE_CATS[k].icon} ${window.GUIDE_CATS[k].label} <span>${counts[k]}</span></button>`))
      .join("");
    const feat = list.slice(0, FEATURED).map((g) => card(g, isNew(g), true)).join("");
    const rest = list.slice(FEATURED).map((g, i) => card(g, isNew(g), false).replace('class="g-card', i >= VISIBLE ? 'class="g-more g-card' : 'class="g-card')).join("");
    return `
      <div class="g-chips" role="group" aria-label="Filter guides by category">${chips}</div>
      <div class="g-featured">${feat}
      </div>
      <div class="g-grid">${rest}
      </div>
      <p class="g-empty" hidden>No guides in this category yet.</p>
      <div class="g-more-row"><button type="button" class="btn g-showall" aria-expanded="false">Show all ${list.length} guides</button></div>`;
  }
  return { render };
})();

// ---- Filter chips and "Show all" (browser only, plain JS) ----
if (typeof document !== "undefined") {
  const init = () => {
    const box = document.getElementById("comparisons");
    if (!box) return;
    box.classList.add("g-js", "g-collapsed");
    const cards = [...box.querySelectorAll(".g-card")];
    const chips = [...box.querySelectorAll(".g-chip")];
    const more = box.querySelector(".g-showall");
    const empty = box.querySelector(".g-empty");
    chips.forEach((ch) => ch.addEventListener("click", () => {
      const f = ch.dataset.filter;
      chips.forEach((c) => { const on = c === ch; c.classList.toggle("is-on", on); c.setAttribute("aria-pressed", on); });
      let shown = 0;
      cards.forEach((c) => { const ok = f === "all" || c.dataset.cat === f; c.hidden = !ok; if (ok) shown++; });
      box.classList.toggle("g-filtered", f !== "all");
      if (empty) empty.hidden = shown > 0;
    }));
    if (more) more.addEventListener("click", () => {
      const open = box.classList.toggle("g-collapsed") === false;
      more.setAttribute("aria-expanded", open);
      more.textContent = open ? "Show fewer guides" : `Show all ${cards.length} guides`;
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
