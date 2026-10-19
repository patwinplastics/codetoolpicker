// Pricing verified 2026-10-19 on official pages (cursor.com/pricing, docs.x.ai/x-subscription/pricing, docs.github.com Copilot plans, claude.com/pricing, devin.ai/pricing, bolt.new/pricing, lovable.dev/pricing).
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
    models: "Frontier OpenAI, Claude, Gemini, xAI + open-source and SWE models",
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
      { name: "Free", price: 0, note: "5 daily build credits (capped monthly)" },
      { name: "Paid", price: 25, note: "From ~$25/mo; credit-based (check live page)" }
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
    pricingUrl: "https://bolt.new/pricing",
    startingPaid: 25,
    freeTier: true,
    plans: [
      { name: "Free", price: 0, note: "300K tokens/day, 1M/mo, Bolt branding" },
      { name: "Pro", price: 25, note: "From 10M tokens/mo, custom domain, no branding" },
      { name: "Teams", price: 30, note: "Per member / mo" }
    ],
    strengths: ["Real code in browser", "Hosting + DB options", "Token rollover on paid", "Affiliate potential"],
    limits: ["Token limits on free", "Browser sandbox constraints", "Not a full desktop IDE"],
    formFactor: "Browser IDE / builder",
    models: "Managed builder models",
    affiliate: true,
    affiliateNote: "Reportedly ~15% affiliate (capped; verify on partner page)",
    sponsorFit: "high"
  }
];

window.QUIZ = [
  {
    id: "role",
    q: "What are you mainly doing?",
    options: [
      { id: "ship-app", label: "Ship a web app fast from chat", scores: { lovable: 3, bolt: 3, cursor: 0, windsurf: 0, copilot: 0, "claude-code": 0 } },
      { id: "daily-code", label: "Write and refactor code every day", scores: { cursor: 3, windsurf: 3, copilot: 2, "claude-code": 2, lovable: 0, bolt: 0 } },
      { id: "agent-heavy", label: "Hand big tasks to an agent", scores: { cursor: 3, "claude-code": 3, windsurf: 2, copilot: 1, lovable: 1, bolt: 1 } },
      { id: "github-team", label: "Work with a team on GitHub", scores: { copilot: 3, cursor: 2, windsurf: 1, "claude-code": 1, lovable: 0, bolt: 0 } }
    ]
  },
  {
    id: "budget",
    q: "What's your monthly budget?",
    options: [
      { id: "free", label: "Free or under $15", scores: { copilot: 2, cursor: 2, windsurf: 1, lovable: 1, bolt: 1, "claude-code": 0 } },
      { id: "mid", label: "About $20–40", scores: { cursor: 2, windsurf: 3, copilot: 2, "claude-code": 3, lovable: 2, bolt: 2 } },
      { id: "power", label: "$100+ for heavy use", scores: { cursor: 3, "claude-code": 3, windsurf: 2, copilot: 2, lovable: 1, bolt: 1 } }
    ]
  },
  {
    id: "surface",
    q: "Where do you want to work?",
    options: [
      { id: "desktop-ide", label: "Desktop IDE", scores: { cursor: 3, windsurf: 3, copilot: 2, "claude-code": 1, lovable: 0, bolt: 0 } },
      { id: "terminal", label: "Terminal", scores: { "claude-code": 3, cursor: 1, windsurf: 1, copilot: 1, lovable: 0, bolt: 0 } },
      { id: "browser", label: "Browser only", scores: { lovable: 3, bolt: 3, cursor: 0, windsurf: 0, copilot: 1, "claude-code": 0 } },
      { id: "any", label: "Whatever works", scores: { cursor: 2, copilot: 2, windsurf: 2, "claude-code": 1, lovable: 1, bolt: 1 } }
    ]
  }
];
