// CodeToolPicker cost calculator. Data: window.TOOL_DATA + window.PRICING (data.js).
// State is mirrored in the URL hash (#cost=...) so an estimate can be shared.
(function () {
  const root = document.getElementById("cost-calc");
  if (!root || !window.PRICING) return;
  const tools = window.TOOL_DATA;
  const P = window.PRICING;
  const base = root.dataset.base || "";
  const fmt = (n) => "$" + (Math.round(n * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const state = { bill: "monthly", rows: {} };
  tools.forEach((t) => (state.rows[t.id] = { on: false, plan: defaultPlan(t.id), seats: 1 }));

  function defaultPlan(id) {
    if (P[id].defaultPlan) return P[id].defaultPlan;
    const pl = P[id].plans;
    const paid = pl.find((p) => p.monthly > 0 && !p.seat);
    return (paid || pl[0]).name;
  }
  const PRESETS = [
    { label: "Solo dev on a budget", set: { copilot: ["Pro", 1] } },
    { label: "Cursor + Claude Code", set: { cursor: ["Premium", 1], "claude-code": ["Pro", 1] } },
    { label: "Compare the $20 agents", set: { "claude-code": ["Pro", 1], codex: ["Plus", 1], antigravity: ["Google AI Pro", 1] } },
    { label: "Non-coder building an app", set: { lovable: ["Pro", 1] } },
    { label: "Try both app builders", set: { lovable: ["Pro", 1], bolt: ["Pro", 1] } },
    { label: "5-dev team on GitHub", set: { copilot: ["Business", 5] } },
    { label: "5-dev team on Cursor", set: { cursor: ["Teams (Premium seat)", 5] } }
  ];

  function readHash() {
    const m = location.hash.match(/cost=([^&]*)/);
    if (!m) return false;
    const b = location.hash.match(/bill=(annual|monthly)/);
    if (b) state.bill = b[1];
    decodeURIComponent(m[1]).split(",").forEach((part) => {
      const [id, plan, seats] = part.split(":");
      if (!state.rows[id]) return;
      const ok = P[id].plans.some((p) => p.name === plan);
      state.rows[id] = { on: true, plan: ok ? plan : defaultPlan(id), seats: Math.max(1, Math.min(500, parseInt(seats, 10) || 1)) };
    });
    return true;
  }
  function hashFor() {
    const on = tools.filter((t) => state.rows[t.id].on).map((t) => [t.id, state.rows[t.id].plan, state.rows[t.id].seats].join(":"));
    return on.length ? `#cost=${encodeURIComponent(on.join(","))}&bill=${state.bill}` : "";
  }

  function cost(id) {
    const r = state.rows[id];
    const p = P[id].plans.find((x) => x.name === r.plan);
    const seats = p.seat ? r.seats : 1;
    const baseFee = p.base || 0;
    const monthlyBilled = (p.monthly * seats + baseFee) * 12;
    let yearly = monthlyBilled, annualUsed = false;
    if (state.bill === "annual" && p.annual != null) { yearly = p.annual * seats + baseFee * 12; annualUsed = true; }
    return { p, seats, yearly, perMonth: yearly / 12, monthlyBilled, annualUsed };
  }

  function render() {
    root.innerHTML = `
      <div class="calc-top">
        <div class="seg" role="group" aria-label="Billing period">
          <button type="button" data-bill="monthly" aria-pressed="${state.bill === "monthly"}">Pay monthly</button>
          <button type="button" data-bill="annual" aria-pressed="${state.bill === "annual"}">Pay yearly</button>
        </div>
        <div class="presets"><span class="meta">Quick start:</span> ${PRESETS.map((p, i) => `<button type="button" class="chip" data-preset="${i}">${p.label}</button>`).join("")}</div>
      </div>
      <div class="calc-rows">
        ${tools.map((t) => {
          const r = state.rows[t.id];
          const p = P[t.id].plans.find((x) => x.name === r.plan);
          return `<div class="calc-row${r.on ? " on" : ""}">
            <label class="calc-tool"><input type="checkbox" data-on="${t.id}" ${r.on ? "checked" : ""}/> <span>${t.name.replace(" (formerly Windsurf)", "")}</span></label>
            <label class="sr" for="plan-${t.id}">${t.name} plan</label>
            <select id="plan-${t.id}" data-plan="${t.id}">${P[t.id].plans.map((x) => `<option ${x.name === r.plan ? "selected" : ""}>${x.name}</option>`).join("")}</select>
            <span class="calc-seats${p.seat ? "" : " off"}"><label for="seats-${t.id}">Seats</label> <input id="seats-${t.id}" type="number" min="1" max="500" value="${r.seats}" data-seats="${t.id}"/></span>
            <span class="calc-note meta">${p.note || ""}</span>
          </div>`;
        }).join("")}
      </div>
      <div class="calc-out" aria-live="polite">${summary()}</div>`;
  }

  function summary() {
    const on = tools.filter((t) => state.rows[t.id].on);
    if (!on.length) return `<p class="meta">Tick a tool (or pick a quick start) to see your real monthly and yearly cost.</p>`;
    let total = 0, totalMonthlyBilled = 0;
    const rows = on.map((t) => {
      const c = cost(t.id);
      total += c.yearly; totalMonthlyBilled += c.monthlyBilled;
      const flag = state.bill === "annual" && !c.annualUsed && c.p.monthly > 0 ? ' <span class="tag">monthly only</span>' : "";
      const L = (window.LINKS || {})[t.id] || { url: t.website, affiliate: false };
      return `<tr><td><a href="${L.url}" rel="${L.affiliate ? "sponsored nofollow noopener" : "noopener"}" data-link="${t.id}">${t.name.replace(" (formerly Windsurf)", "")}</a>${L.affiliate ? ' <span class="tag ref">referral</span>' : ""}</td><td>${c.p.name}${c.p.seat ? ` × ${c.seats}` : ""}${flag}</td><td class="num">${fmt(c.perMonth)}</td><td class="num">${fmt(c.yearly)}</td></tr>`;
    }).join("");
    const saved = totalMonthlyBilled - total;
    const extras = on.map((t) => `<li><strong>${t.name.replace(" (formerly Windsurf)", "")}:</strong> ${P[t.id].extraCost}</li>`).join("");
    return `
      <table class="calc-table"><thead><tr><th>Tool</th><th>Plan</th><th class="num">Per month</th><th class="num">Per year</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="2">Total</td><td class="num">${fmt(total / 12)}</td><td class="num">${fmt(total)}</td></tr></tfoot></table>
      ${state.bill === "annual" && saved > 0 ? `<p class="calc-save">Paying yearly saves ${fmt(saved)} a year vs monthly billing.</p>` : ""}
      ${state.bill === "monthly" ? annualHint() : ""}
      <details class="calc-extras"><summary>What this doesn't include</summary><ul class="list">${extras}<li>Taxes (all listed prices exclude tax).</li></ul></details>
      <div class="cta-row" style="margin-top:10px"><button type="button" class="btn" id="calc-copy">Copy link to this estimate</button><span class="meta" id="calc-copied" role="status"></span></div>
      <p class="meta">Prices verified ${window.PRICING_CHECKED} on each vendor's official pricing page. "Monthly only" = no annual price is listed on the vendor's pricing page.</p>`;
  }
  function annualHint() {
    const prev = state.bill; state.bill = "annual";
    let a = 0, m = 0;
    tools.filter((t) => state.rows[t.id].on).forEach((t) => { const c = cost(t.id); a += c.yearly; m += c.monthlyBilled; });
    state.bill = prev;
    return m - a > 0 ? `<p class="calc-save">Tip: paying yearly would save ${fmt(m - a)} a year on this setup.</p>` : "";
  }

  function update(full) {
    const h = hashFor();
    history.replaceState(null, "", h || location.pathname + location.search);
    if (full) {
      const id = document.activeElement && root.contains(document.activeElement) ? document.activeElement.id : "";
      render();
      if (id && document.getElementById(id)) document.getElementById(id).focus();
    } else root.querySelector(".calc-out").innerHTML = summary();
  }

  root.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.on) { state.rows[el.dataset.on].on = el.checked; update(true); }
    else if (el.dataset.plan) { const r = state.rows[el.dataset.plan]; r.plan = el.value; r.on = true; update(true); }
    else if (el.dataset.seats) { const r = state.rows[el.dataset.seats]; r.seats = Math.max(1, Math.min(500, parseInt(el.value, 10) || 1)); r.on = true; update(false); }
  });
  root.addEventListener("click", (e) => {
    const el = e.target.closest("button");
    if (!el) return;
    if (el.dataset.bill) { state.bill = el.dataset.bill; update(true); }
    else if (el.dataset.preset != null) {
      const pr = PRESETS[+el.dataset.preset];
      tools.forEach((t) => (state.rows[t.id].on = false));
      Object.entries(pr.set).forEach(([id, [plan, seats]]) => (state.rows[id] = { on: true, plan, seats }));
      update(true);
    } else if (el.id === "calc-copy") {
      const url = location.origin + location.pathname + hashFor();
      const done = () => (document.getElementById("calc-copied").textContent = "Link copied.");
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => (document.getElementById("calc-copied").textContent = url));
      else document.getElementById("calc-copied").textContent = url;
    }
  });

  // Public hook so the quiz can prefill an estimate.
  window.CTP_CALC = {
    select(id) {
      tools.forEach((t) => (state.rows[t.id].on = false));
      state.rows[id] = { on: true, plan: defaultPlan(id), seats: 1 };
      update(true);
    }
  };
  readHash();
  render();
})();
