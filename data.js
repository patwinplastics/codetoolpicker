// Pricing verified 2026-10-19 on official pages; Antigravity, Codex and Cursor re-checked 2026-10-20 (antigravity.google/pricing + docs/plans + docs/models, gemini.google/subscriptions, developers.openai.com/codex/pricing, docs.x.ai/x-subscription/pricing, docs.github.com Copilot plans, claude.com/pricing, devin.ai/pricing, bolt.new/pricing, lovable.dev/pricing).
// Note: Windsurf was renamed Devin Desktop by Cognition on 2026-06-02; windsurf.com now redirects to devin.ai. id stays "windsurf" for quiz/anchor stability.
window.TOOL_DATA = [
  {
    id: "cursor",
    name: "Cursor",
    category: "ai-ide",
    tagline: "AI-first IDE with agents, cloud agents, and multi-model chat",
    bestFor: "Daily coding in a full IDE with agents and cloud work",
    website: "https://cursor.com",
    pricingUrl: "https://cursor.com/pricing",
    startingPaid: 8,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "Limited usage" },
      { name: "Plus", price: 8, note: "Grok models only; $80/yr" },
      { name: "Premium", price: 30, note: "4x Plus; Claude/GPT etc. billed separately at API list price; $300/yr" },
      { name: "Super", price: 100, note: "15x Plus; $1000/yr" },
      { name: "Ultra", price: 200, note: "50x Plus; $2000/yr" },
      { name: "Teams", price: 30, note: "From $30/seat (Premium/Super/Ultra seats)" }
    ],
    strengths: ["Full IDE", "Cloud agents", "Strong agent workflows", "Multi-model (Premium+)"],
    limits: ["Third-party models (Claude, GPT, etc.) are not in included usage: billed at API list price from first use (Premium+ only; not on Plus)", "Usage pool shared with Grok, refreshes weekly", "Legacy Cursor Pro/Pro+ plans continue for existing subscribers; switching optional"],
    formFactor: "Desktop IDE",
    models: "Grok + Composer included; Claude/GPT/Gemini on Premium+ billed separately at API list price",
    affiliate: false,
    sponsorFit: "high"
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    category: "ai-ide",
    tagline: "AI pair programmer inside VS Code, JetBrains, and GitHub",
    bestFor: "GitHub-centric teams who want completions plus chat and agents",
    website: "https://github.com/features/copilot",
    pricingUrl: "https://docs.github.com/en/copilot/get-started/plans",
    startingPaid: 10,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "Limited AI credits, auto model only" },
      { name: "Pro", price: 10, note: "1,500 AI credits / mo" },
      { name: "Pro+", price: 39, note: "7,000 AI credits / mo" },
      { name: "Max", price: 100, note: "20,000 AI credits / mo" },
      { name: "Business", price: 19, note: "Per seat, 1,900 credits" },
      { name: "Enterprise", price: 39, note: "Per seat, 3,900 credits" }
    ],
    strengths: ["Deep GitHub integration", "Works in many IDEs", "Team admin controls", "Usage-based credits"],
    limits: ["Credits run out on heavy agent use", "Less of a standalone agent IDE than Cursor/Devin Desktop"],
    formFactor: "IDE extension + GitHub",
    models: "Selection of models; premium models on higher tiers",
    affiliate: false,
    sponsorFit: "high"
  },
  {
    id: "claude-code",
    name: "Claude Code",
    category: "agent",
    tagline: "Anthropic's terminal and IDE coding agent",
    bestFor: "Terminal-native agentic coding on Claude models",
    website: "https://claude.com/product/claude-code",
    pricingUrl: "https://claude.com/pricing?mode=code",
    startingPaid: 20,
    freeTier: false,
    plans: [
      { name: "Pro", price: 20, note: "Claude Code included; $17/mo billed annually" },
      { name: "Max 5x", price: 100, note: "5x Pro usage" },
      { name: "Max 20x", price: null, note: "20x Pro usage; price not shown on claude.com/pricing (Max listed 'from $100')" },
      { name: "API", price: null, note: "Pay-as-you-go Console tokens" }
    ],
    strengths: ["Strong reasoning models", "Terminal-first agent", "Shared plan with Claude chat"],
    limits: ["No free Claude Code tier", "Usage shared with Claude chat", "Claude-only models"],
    formFactor: "Terminal / IDE agent",
    models: "Claude Sonnet, Opus, and related Claude models",
    affiliate: false,
    sponsorFit: "high"
  },
  {
    id: "windsurf",
    name: "Devin Desktop (formerly Windsurf)",
    category: "ai-ide",
    tagline: "Cognition's AI IDE (formerly Windsurf) with an Agent Command Center for local and cloud Devin agents",
    bestFor: "Engineers who want a Cursor-class IDE that manages many local and cloud agents",
    website: "https://devin.ai",
    pricingUrl: "https://devin.ai/pricing",
    startingPaid: 20,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "Light agent quota, unlimited Tab and inline edits" },
      { name: "Pro", price: 20, note: "Increased quotas + frontier models, Devin Cloud access" },
      { name: "Max", price: 200, note: "Significantly higher quotas" },
      { name: "Teams", price: 80, note: "$80/mo team plan + $40/mo per full dev seat, up to 200 users" }
    ],
    strengths: ["Agent Command Center (local + cloud agents)", "Devin Cloud included on paid plans", "Competitive Pro price", "Extra usage at API price"],
    limits: ["Quotas can bite power users", "Renamed from Windsurf in June 2026; some docs and extensions still say Windsurf"],
    formFactor: "Desktop IDE",
    models: "Frontier OpenAI, Claude, Gemini, SpaceXAI + open-source and SWE models",
    affiliate: false,
    sponsorFit: "medium"
  },
  {
    id: "lovable",
    name: "Lovable",
    category: "builder",
    tagline: "Chat-to-app builder for shipping web apps fast",
    bestFor: "Non-engineers and vibe coders who want a working web app from chat",
    website: "https://lovable.dev",
    pricingUrl: "https://lovable.dev/pricing",
    startingPaid: 25,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "5 daily build credits (up to 30/mo) + 20 Cloud credits/mo" },
      { name: "Pro", price: 25, note: "100 monthly credits + daily grants, custom domains; $21/mo billed yearly" },
      { name: "Business", price: 50, note: "100 monthly credits, SSO, team workspace, unlimited users; $42/mo billed yearly" }
    ],
    strengths: ["Fast chat-to-app", "Hosting included", "Great for prototypes", "Affiliate-friendly category"],
    limits: ["Less control than a real IDE", "Credit math on bigger apps", "Web-first"],
    formFactor: "Browser builder",
    models: "Managed builder models",
    affiliate: true,
    affiliateNote: "Reportedly pays up to ~$100 per subscriber (verify on their partner page)",
    sponsorFit: "high"
  },
  {
    id: "bolt",
    name: "Bolt.new",
    category: "builder",
    tagline: "In-browser AI app builder on StackBlitz WebContainers",
    bestFor: "Code-visible chat-to-app with real project files in the browser",
    website: "https://bolt.new",
    affiliateUrl: "https://bolt.cello.so/aLdglbfmlfZ",
    pricingUrl: "https://bolt.new/pricing",
    startingPaid: 25,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "300K tokens/day, 1M/mo, Bolt branding" },
      { name: "Pro", price: 25, note: "From 10M tokens/mo, custom domain, no branding; $18/mo billed annually" },
      { name: "Teams", price: 30, note: "Per member / mo; $27/mo billed annually" }
    ],
    strengths: ["Real code in browser", "Hosting + DB options", "Token rollover on paid", "Affiliate potential"],
    limits: ["Token limits on free", "Browser sandbox constraints", "Not a full desktop IDE"],
    formFactor: "Browser IDE / builder",
    models: "Managed builder models",
    affiliate: true,
    affiliateNote: "Bolt referral link live (Earn $50 / Cello); may earn a commission",
    sponsorFit: "high"
  },
  {
    id: "codex",
    name: "OpenAI Codex",
    category: "agent",
    tagline: "OpenAI's coding agent in the ChatGPT desktop app, on the web, in the CLI, an IDE extension and iOS",
    bestFor: "ChatGPT users who want a coding agent with cloud tasks and automatic PR reviews",
    website: "https://developers.openai.com/codex",
    pricingUrl: "https://developers.openai.com/codex/pricing",
    startingPaid: 8,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "Limited Codex in the desktop app on GPT-6 Luna, subject to rollout" },
      { name: "Go", price: 8, note: "Lightweight Codex in the desktop app on GPT-6 Luna" },
      { name: "Plus", price: 20, note: "Web, CLI, IDE extension, iOS; cloud tasks, automatic code review, Slack" },
      { name: "Pro", price: 100, note: "Pro at $100, $200 or $500; no five-hour Codex limit right now (weekly limits apply)" },
      { name: "Business", price: 25, note: "Per user; $20/user/mo billed annually, 2+ users" }
    ],
    strengths: ["Free and $8 entry tiers", "Cloud tasks and automatic GitHub code review on Plus", "No five-hour cap on Pro plans (weekly limits apply)", "Works with an API key in the CLI, SDK and IDE extension"],
    limits: ["OpenAI models only on ChatGPT plans", "Usage shared with ChatGPT Work", "GPT-5.5 retired from Codex with ChatGPT sign-in on Oct 14, 2026"],
    formFactor: "Desktop app / CLI / IDE agent",
    models: "GPT-6.1 Sol, GPT-6 Sol and GPT-6 Luna on Plus; GPT-6 Astra on Pro",
    affiliate: false,
    sponsorFit: "high"
  },
  {
    id: "antigravity",
    name: "Google Antigravity",
    category: "agent",
    tagline: "Google's agent-first coding platform: a desktop agent app, its own IDE, a CLI and editor extensions",
    bestFor: "Developers who want Gemini and Claude models in one $20 plan, across app, IDE and terminal",
    website: "https://antigravity.google",
    pricingUrl: "https://antigravity.google/pricing",
    startingPaid: 19.99,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "Basic weekly limit, unlimited Tab and Command requests, Gemini 3.8 Flash" },
      { name: "Google AI Pro", price: 19.99, note: "Quota refreshes every 5 hours up to a weekly limit; Gemini 4 Argon, Claude Opus/Sonnet 5.5 (paid, not trial)" },
      { name: "Google AI Ultra 5x", price: 99.99, note: "5x the Pro quota" },
      { name: "Google AI Ultra 20x", price: 199.99, note: "20x the Pro quota, highest weekly limits" },
      { name: "Gemini Enterprise", price: 30, note: "Teams via Google Cloud: Standard/Plus from $30/seat, or pay-as-you-go with $0 seat fee" }
    ],
    strengths: ["Claude Opus and Sonnet 5.5 included in the $19.99 Pro quota", "Free tier with unlimited Tab completions", "Agent app, own IDE, CLI, and extensions for VS Code, JetBrains, Zed and Xcode"],
    limits: ["Quotas aren't published as numbers", "No bring-your-own API key", "Individual plans need a personal Google account; teams go through Google Cloud", "Gemini 4 Argon isn't in the standalone Antigravity IDE (App, CLI and extensions only)"],
    formFactor: "Agent app + IDE + CLI",
    models: "Gemini 4 Argon and 3.8 Flash, plus Claude Opus/Sonnet 5.5 on Pro and Ultra",
    affiliate: false,
    sponsorFit: "high"
  }
];

window.QUIZ = [
  {
    id: "role",
    q: "What are you mainly doing?",
    options: [
      { id: "ship-app", label: "Ship a web app fast from chat", scores: { lovable: 3, bolt: 3, cursor: 0, windsurf: 0, copilot: 0, "claude-code": 0, codex: 0, antigravity: 1 } },
      { id: "daily-code", label: "Write and refactor code every day", scores: { cursor: 3, windsurf: 3, copilot: 2, "claude-code": 2, lovable: 0, bolt: 0, codex: 2, antigravity: 2 } },
      { id: "agent-heavy", label: "Hand big tasks to an agent", scores: { cursor: 3, "claude-code": 3, windsurf: 2, copilot: 1, lovable: 1, bolt: 1, codex: 3, antigravity: 3 } },
      { id: "github-team", label: "Work with a team on GitHub", scores: { copilot: 3, cursor: 2, windsurf: 1, "claude-code": 1, lovable: 0, bolt: 0, codex: 2, antigravity: 1 } }
    ]
  },
  {
    id: "budget",
    q: "What's your monthly budget?",
    options: [
      { id: "free", label: "Free or under $15", scores: { copilot: 2, cursor: 2, windsurf: 1, lovable: 1, bolt: 1, "claude-code": 0, codex: 2, antigravity: 2 } },
      { id: "mid", label: "About $20–40", scores: { cursor: 2, windsurf: 3, copilot: 2, "claude-code": 3, lovable: 2, bolt: 2, codex: 3, antigravity: 3 } },
      { id: "power", label: "$100+ for heavy use", scores: { cursor: 3, "claude-code": 3, windsurf: 2, copilot: 2, lovable: 1, bolt: 1, codex: 3, antigravity: 2 } }
    ]
  },
  {
    id: "surface",
    q: "Where do you want to work?",
    options: [
      { id: "desktop-ide", label: "Desktop IDE", scores: { cursor: 3, windsurf: 3, copilot: 2, "claude-code": 1, lovable: 0, bolt: 0, codex: 1, antigravity: 2 } },
      { id: "terminal", label: "Terminal", scores: { "claude-code": 3, cursor: 1, windsurf: 1, copilot: 1, lovable: 0, bolt: 0, codex: 3, antigravity: 2 } },
      { id: "browser", label: "Browser only", scores: { lovable: 3, bolt: 3, cursor: 0, windsurf: 0, copilot: 1, "claude-code": 0, codex: 1, antigravity: 0 } },
      { id: "any", label: "Whatever works", scores: { cursor: 2, copilot: 2, windsurf: 2, "claude-code": 1, lovable: 1, bolt: 1, codex: 1, antigravity: 2 } }
    ]
  }
];

// ---------------------------------------------------------------------------
// Cost calculator, at-a-glance matrix, plan guides, "skip if" notes.
// Every number re-checked 2026-10-19 on: cursor.com/pricing + docs.x.ai/x-subscription/pricing (Cursor annual + team seats),
// docs.github.com/en/copilot/get-started/plans, claude.com/pricing, devin.ai/pricing, lovable.dev/pricing (yearly toggle), bolt.new/pricing.
// monthly = price per month (per seat if seat:true) on monthly billing. annual = total per year (per seat if seat:true) on annual billing,
// or null when the vendor doesn't publish an annual price. base = flat monthly fee on top of seats (Devin Teams).
// Codex, Google Antigravity and Cursor re-checked 2026-10-20 on developers.openai.com/codex/pricing, antigravity.google/pricing,
// antigravity.google/docs/plans, antigravity.google/docs/models, gemini.google/subscriptions and cursor.com/pricing.
window.PRICING_CHECKED = "2026-10-20";
window.PRICING = {
  cursor: {
    start: 2,
    bestBadge: "Best all-round AI IDE",
    plans: [
      { name: "Free", monthly: 0, annual: 0 },
      { name: "Plus", monthly: 8, annual: 80, note: "Grok models only" },
      { name: "Premium", monthly: 30, annual: 300, note: "4x Plus usage; Claude/GPT billed extra at API list price" },
      { name: "Super", monthly: 100, annual: 1000, note: "15x Plus usage" },
      { name: "Ultra", monthly: 200, annual: 2000, note: "50x Plus usage" },
      { name: "Teams (Premium seat)", monthly: 30, annual: null, seat: true, note: "Super/Ultra seats $100/$200" }
    ],
    extraCost: "Claude, GPT and other third-party models are not included in any plan: billed at API list price on top (Premium and up).",
    glance: { free: "Yes: limited agent and chat requests", models: "Grok models included; Claude/GPT on Premium+ at extra API cost", agents: "Agent on all plans; cloud agents and Bugbot reviews on Premium+", surface: "Own desktop IDE (VS Code-based)", team: "$30/seat" },
    guide: [
      ["Free", "Try the editor and agent before paying."],
      ["Plus $8", "Only if Grok models are enough for you. Cursor itself recommends Plus for social creators with limited AI usage."],
      ["Premium $30", "Cursor's pick for new AI users. Needed for cloud agents, Bugbot code reviews, and any Claude or GPT use (billed extra)."],
      ["Super $100", "Cursor's pick for daily agent users: 15x Plus usage plus priority access at peak times."],
      ["Ultra $200", "Power users: 50x Plus usage and earliest access to new models."],
      ["Teams $30+/seat", "Centralized billing, SSO, usage analytics, team-wide privacy settings."]
    ],
    skipIf: "Claude or GPT is your daily model. In Cursor they are billed at API list price on top of a $30+ plan; Copilot and Claude Code include them in the plan price."
  },
  copilot: {
    start: 1,
    bestBadge: "Best value in your current editor",
    plans: [
      { name: "Free", monthly: 0, annual: 0, note: "2,000 completions/mo, auto model only" },
      { name: "Pro", monthly: 10, annual: null, note: "1,500 AI credits/mo" },
      { name: "Pro+", monthly: 39, annual: null, note: "7,000 AI credits/mo" },
      { name: "Max", monthly: 100, annual: null, note: "20,000 AI credits/mo" },
      { name: "Business", monthly: 19, annual: null, seat: true, note: "1,900 credits per user, pooled" },
      { name: "Enterprise", monthly: 39, annual: null, seat: true, note: "3,900 credits per user, pooled; needs GitHub Enterprise Cloud" }
    ],
    extraCost: "Org usage beyond the pooled credits is $0.01 per AI credit. Completions are unlimited on paid plans.",
    glance: { free: "Yes: 2,000 completions/mo, limited credits, auto model", models: "Claude, GPT, Gemini, Grok and more inside your credits (paid plans)", agents: "Agent mode, cloud agent, code review (limited on Free)", surface: "Extension for VS Code, JetBrains and more, plus GitHub, CLI, app", team: "$19/seat" },
    guide: [
      ["Free", "Light use: 2,000 completions a month and auto model selection only. Free for verified students too."],
      ["Pro $10", "The best value for most individuals: 1,500 AI credits and a choice of models including Claude and GPT. Verified teachers and popular open-source maintainers may get it free."],
      ["Pro+ $39", "Heavy agent users: 7,000 credits and premium models."],
      ["Max $100", "Sustained high-volume use: 20,000 credits and priority access to premium models."],
      ["Business $19/seat", "Organizations that need policy control and centralized management."],
      ["Enterprise $39/seat", "Companies on GitHub Enterprise Cloud that want a bigger credit pool."]
    ],
    skipIf: "You want a standalone agent-first IDE, or you run long agent sessions all day. Credits run out, and heavy users end up on Pro+ ($39) or Max ($100)."
  },
  "claude-code": {
    start: 0,
    bestBadge: "Best terminal coding agent",
    plans: [
      { name: "Pro", monthly: 20, annual: 200, note: "$17/mo billed annually ($200 up front)" },
      { name: "Max 5x", monthly: 100, annual: null, note: "5x Pro usage; Max 20x price not listed on claude.com/pricing" },
      { name: "Team (standard seat)", monthly: 25, annual: 240, seat: true, note: "$20/seat/mo billed annually; teams of 2 to 150" },
      { name: "Team (premium seat)", monthly: 125, annual: 1200, seat: true, note: "5x standard usage; $100/seat/mo billed annually" }
    ],
    extraCost: "Usage limits apply and are shared with Claude chat. API use is billed per token.",
    glance: { free: "No: Claude Free doesn't include Claude Code", models: "Claude only (Sonnet, Opus, Haiku) inside plan usage", agents: "Agent-first: terminal, IDE extensions, desktop", surface: "Terminal / IDE agent", team: "$25/seat ($20 billed annually)" },
    guide: [
      ["Pro $20", "Start here. Includes Claude Code with usage limits; $17/mo if you pay $200 for the year."],
      ["Max 5x from $100", "If you hit Pro limits most days. 5x Pro usage plus priority access at busy times."],
      ["Team $25/seat", "Teams of 2 to 150: standard seats are $25/mo ($20 annual); premium seats with 5x usage are $125 ($100 annual)."],
      ["API (pay per token)", "Automation and CI. Example: Sonnet 5.5 is $2 per million input tokens and $10 per million output tokens."]
    ],
    skipIf: "You want a free tier, a full visual IDE, or GPT/Gemini models. Claude Code is Claude-only and needs a paid plan."
  },
  windsurf: {
    start: 1,
    bestBadge: "Best for running many agents",
    plans: [
      { name: "Free", monthly: 0, annual: 0, note: "Light agent quota, unlimited Tab" },
      { name: "Pro", monthly: 20, annual: null, note: "Higher quotas, frontier models, Devin Cloud" },
      { name: "Max", monthly: 200, annual: null, note: "Significantly higher quotas" },
      { name: "Teams", monthly: 40, annual: null, seat: true, base: 80, note: "$80/mo team plan + $40/mo per full dev seat, up to 200 users" }
    ],
    extraCost: "Extra usage beyond quotas is billed at API pricing. Quotas aren't published as numbers.",
    glance: { free: "Yes: light agent quota, unlimited Tab and inline edits", models: "Frontier OpenAI, Claude, Gemini + SWE-2 (Pro+)", agents: "Local agents; Devin Cloud agents on Pro+", surface: "Own desktop IDE (formerly Windsurf)", team: "$80/mo + $40/seat" },
    guide: [
      ["Free", "Unlimited Tab completions and inline edits with a light agent quota."],
      ["Pro $20", "Most individuals: higher quotas, frontier models, SWE-2, and Devin Cloud agents."],
      ["Max $200", "Significantly higher quotas for all-day agent use."],
      ["Teams $80 + $40/seat", "Up to 200 users with their own quota per full seat."]
    ],
    skipIf: "You need predictable heavy usage on a fixed budget. Quotas aren't published as numbers, and overages bill at API pricing."
  },
  lovable: {
    start: 1,
    bestBadge: "Best for non-coders and groups",
    plans: [
      { name: "Free", monthly: 0, annual: 0, note: "5 credits/day (up to 30/mo)" },
      { name: "Pro", monthly: 25, annual: 252, note: "100 monthly credits + daily grants; $21/mo billed annually" },
      { name: "Business", monthly: 50, annual: 504, note: "SSO, team workspace; $42/mo billed annually" }
    ],
    extraCost: "Not priced per seat: every plan includes unlimited users sharing one credit balance. On-demand credits cost extra.",
    glance: { free: "Yes: 5 credits/day (up to 30/mo)", models: "Managed by Lovable (you don't pick)", agents: "Chat-to-app builder with hosting", surface: "Browser app builder", team: "$50/mo, unlimited users" },
    guide: [
      ["Free", "Enough to build and test a small app: 5 credits a day, up to 30 a month."],
      ["Pro $25", "Most solo builders: 100 monthly credits plus daily grants, custom domains, no Lovable badge. $21/mo billed annually. Students get up to 50% off."],
      ["Business $50", "Growing teams: SSO, team workspace, role-based access. $42/mo billed annually."]
    ],
    skipIf: "You're a developer who wants full control of the stack, or you need to keep building in an existing repo. Lovable's Git sync always creates a new repo."
  },
  bolt: {
    start: 1,
    bestBadge: "Best code-visible app builder",
    plans: [
      { name: "Free", monthly: 0, annual: 0, note: "1M tokens/mo, 300K/day, Bolt branding" },
      { name: "Pro", monthly: 25, annual: 216, note: "From 10M tokens/mo, no daily limit; $18/mo billed annually" },
      { name: "Teams", monthly: 30, annual: 324, seat: true, note: "Per member; $27/member/mo billed annually" }
    ],
    extraCost: "Token use grows with project size. Higher-token Pro tiers cost more than the base price.",
    glance: { free: "Yes: 1M tokens/mo, 300K/day, Bolt branding", models: "Newest AI models on Pro (managed by Bolt)", agents: "Chat-to-app builder with real project files", surface: "Browser IDE / app builder", team: "$30/member ($27 annual)" },
    guide: [
      ["Free", "Try it: 1M tokens a month (300K a day). Sites carry Bolt branding."],
      ["Pro $25", "Most solo builders: from 10M tokens, no daily limit, rollover, custom domain. $18/mo billed annually, the cheapest annual app-builder plan here."],
      ["Teams $30/member", "Centralized billing, admin controls, SSO. $27/member billed annually."]
    ],
    skipIf: "Your project will get big (each message syncs more files, so tokens go faster), or several people want to share one budget. Bolt Teams is priced per member."
  },
  codex: {
    start: 2,
    defaultPlan: "Plus",
    bestBadge: "Cheapest way into a coding agent",
    plans: [
      { name: "Free", monthly: 0, annual: 0, note: "Limited Codex in the desktop app (GPT-6 Luna), subject to rollout" },
      { name: "Go", monthly: 8, annual: null, note: "Lightweight Codex in the desktop app (GPT-6 Luna)" },
      { name: "Plus", monthly: 20, annual: null, note: "All surfaces, cloud tasks, automatic code review, Slack" },
      { name: "Pro $100", monthly: 100, annual: null, note: "No five-hour Codex limit right now (weekly limits apply); full GPT-6 Astra allowance" },
      { name: "Pro $200", monthly: 200, annual: null, note: "More usage than Pro $100 (OpenAI doesn't publish the multiple)" },
      { name: "Pro $500", monthly: 500, annual: null, note: "Adds Ultrafast mode" },
      { name: "Business (standard seat)", monthly: 25, annual: 240, seat: true, note: "$20/user/mo billed annually; 2+ users" }
    ],
    extraCost: "Usage beyond plan limits is paid with ChatGPT credits (Plus and up). Codex usage is shared with ChatGPT Work. API-key use is billed at API prices.",
    glance: { free: "Yes: Free and Go ($8) in the desktop app, subject to rollout", models: "OpenAI only: GPT-6.1 Sol, GPT-6 Sol, GPT-6 Luna (Astra on Pro)", agents: "Agent-first: local and cloud tasks, automatic PR reviews (Plus+)", surface: "ChatGPT desktop app, web, CLI, IDE extension, iOS", team: "$25/seat ($20 billed annually)" },
    guide: [
      ["Free", "Try Codex on quick tasks in the desktop app. Availability is subject to rollout."],
      ["Go $8", "Light coding help in the desktop app only, on GPT-6 Luna."],
      ["Plus $20", "Most developers: Codex in the CLI, IDE extension, web and iOS, plus cloud tasks and automatic code review."],
      ["Pro $100", "If you hit five-hour limits: Pro plans currently have no five-hour Codex limit, only weekly limits."],
      ["Pro $200 / $500", "All-day heavy use. $500 adds Ultrafast mode."],
      ["Business $25/seat", "Teams of 2+: SAML SSO, admin controls, no training on business data by default. $20/seat billed annually."]
    ],
    skipIf: "You want Claude or Gemini models, or a full visual IDE. Codex on ChatGPT plans runs OpenAI models only."
  },
  antigravity: {
    start: 1,
    bestBadge: "Most models in a $20 plan",
    plans: [
      { name: "Free", monthly: 0, annual: 0, note: "Basic weekly limit, unlimited Tab and Command requests" },
      { name: "Google AI Pro", monthly: 19.99, annual: null, note: "Quota refreshes every 5 hours up to a weekly limit; Claude 5.5 models on paid (not trial) plans" },
      { name: "Google AI Ultra 5x", monthly: 99.99, annual: null, note: "5x the Pro quota, priority access" },
      { name: "Google AI Ultra 20x", monthly: 199.99, annual: null, note: "20x the Pro quota, highest weekly limits" },
      { name: "Gemini Enterprise (Standard/Plus)", monthly: 30, annual: null, seat: true, note: "From $30/seat via Google Cloud; a pay-as-you-go option has a $0 seat fee" }
    ],
    extraCost: "Usage beyond your quota needs purchased AI credits at Gemini Enterprise consumption prices (you choose Never or Always). Paid tiers are Google AI subscriptions, so you can't buy Antigravity on its own.",
    glance: { free: "Yes: basic weekly limit, unlimited Tab, Gemini 3.8 Flash", models: "Gemini 4 Argon + Claude Opus/Sonnet 5.5 inside the plan quota (Pro+)", agents: "Agent-first: multi-agent app, scheduled tasks, CLI, SDK", surface: "Own agent app + IDE, CLI, extensions for VS Code, JetBrains, Zed, Xcode", team: "From $30/seat via Google Cloud" },
    guide: [
      ["Free", "Try the agent with Gemini 3.8 Flash on a weekly quota. Claude Sonnet/Opus 4.6 and GPT-OSS 120B are on Free until Google removes them on Nov 2, 2026."],
      ["Google AI Pro $19.99", "Most individuals: quota refreshes every five hours up to a weekly limit, with Gemini 4 Argon and Claude Opus/Sonnet 5.5. The Claude 5.5 models need a paid plan, not the free trial."],
      ["Google AI Ultra $99.99", "Daily drivers: 5x the Pro quota and priority access."],
      ["Google AI Ultra $199.99", "All-day agent use: 20x the Pro quota and the highest weekly limits."],
      ["Gemini Enterprise from $30/seat", "Organizations on Google Cloud. Covers the Antigravity App, CLI and IDE extensions, not the standalone Antigravity IDE."]
    ],
    skipIf: "You need a credit-card team plan with admin controls, want to bring your own API key, or sign in with a Google Workspace account. Individual plans are built for personal Google accounts, and teams go through Google Cloud."
  }
};

// Comparison pages, keyed by tool pair (sorted ids joined by "|").
window.COMPARE_PAGES = {
  "bolt|lovable": { url: "lovable-vs-bolt/", label: "Lovable vs Bolt.new" },
  "cursor|windsurf": { url: "cursor-vs-windsurf/", label: "Cursor vs Devin Desktop (Windsurf)" },
  "claude-code|cursor": { url: "claude-code-vs-cursor/", label: "Claude Code vs Cursor" },
  "copilot|cursor": { url: "cursor-vs-copilot/", label: "Cursor vs GitHub Copilot" },
  "claude-code|copilot": { url: "cursor-bundle-alternatives/", label: "Cursor vs Claude Code vs Copilot" },
  "claude-code|codex": { url: "claude-code-vs-codex/", label: "Claude Code vs OpenAI Codex" },
  "antigravity|cursor": { url: "cursor-vs-antigravity/", label: "Cursor vs Google Antigravity" }
};

// Dated pricing changes we track. Only sourced events.
window.PRICE_LOG = [
  { date: "2026-10-20", text: "Added OpenAI Codex (Free, Go $8, Plus $20, Pro $100/$200/$500, Business $25/seat) and Google Antigravity (Free, Google AI Pro $19.99, Ultra $99.99/$199.99, Gemini Enterprise from $30/seat) to the picker, calculator and this guide. Re-checked Cursor: unchanged.", src: "https://antigravity.google/pricing" },
  { date: "2026-10-14", text: "OpenAI retired GPT-5.5 from Codex for ChatGPT sign-in. API-key sessions weren't affected.", src: "https://developers.openai.com/codex/pricing" },
  { date: "2026-10-19", text: "Re-verified all 26 plans on official pricing pages. Added annual prices: Lovable Pro $21/mo and Business $42/mo billed annually, Bolt Pro $18/mo and Teams $27/member billed annually.", src: "https://lovable.dev/pricing" },
  { date: "2026-10-16", text: "Cursor is now sold as The X Subscription: Plus $8, Premium $30, Super $100, Ultra $200. Plus is Grok-only; Claude/GPT in Cursor cost extra at API list price. (Date we first recorded it.)", src: "https://docs.x.ai/x-subscription/pricing" },
  { date: "2026-06-02", text: "Cognition renamed Windsurf to Devin Desktop. Same IDE, plans and prices; windsurf.com redirects to devin.ai.", src: "https://devin.ai/blog/windsurf-is-now-devin-desktop" },
  { date: "2026-05-19", text: "Google added a $100/month Google AI Ultra tier (5x Pro quota for Antigravity) and cut the top Ultra tier from $250 to $200/month (20x Pro).", src: "https://antigravity.google/blog/changes-to-antigravity-plans/" }
];
