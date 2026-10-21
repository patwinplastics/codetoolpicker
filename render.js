// Shared HTML renderers used by app.js in the browser and scripts/prerender.js at build time,
// so crawlers and AI chatbots that don't run JavaScript see the same content.
// Outbound tool links always come from window.LINKS (data.js) via link().
(function (w) {
  const money = (n) => (n == null ? "Usage-based" : n === 0 ? "Free" : `$${n}/mo`);
  const short = (name) => name.replace(" (formerly Windsurf)", "");
  const link = (id) => {
    const l = (w.LINKS || {})[id];
    if (!l) return null;
    return { href: l.url, aff: !!l.affiliate, perk: l.perk || "", name: l.name, rel: l.affiliate ? "sponsored nofollow noopener" : "noopener" };
  };
  const ctaUrl = (t) => (link(t.id) || {}).href || t.affiliateUrl || t.website;
  const relFor = (t) => (link(t.id) || {}).rel || "noopener";
  const isAff = (t) => !!(link(t.id) || {}).aff;
  const refTag = '<span class="tag ref">referral</span>';
  // One honest line under any block that contains an affiliate link.
  const AFF_LINE = "Referral link: we may earn a commission at no extra cost to you. It never changes our picks.";
  // "Try X" button for a LINKS id.
  function tryBtn(id, label, cls) {
    const l = link(id);
    if (!l) return "";
    return `<a class="btn ${cls || ""}" href="${l.href}" rel="${l.rel}" data-link="${id}">${label || `Try ${l.name}`}${l.aff ? " " + refTag : ""}</a>`;
  }
  function disclosure(ids) {
    const affs = ids.map(link).filter((l) => l && l.aff);
    if (!affs.length) return "";
    const perks = affs.filter((l) => l.perk).map((l) => l.perk).join(" ");
    return `<p class="meta tiny aff-note">${AFF_LINE}${perks ? " " + perks : ""}</p>`;
  }
  function card(t, base) {
    const p = (w.PRICING || {})[t.id] || {};
    return `
      <article class="card" data-category="${t.category}" id="tool-${t.id}">
        <div class="badges">
          ${p.bestBadge ? `<span class="badge best">${p.bestBadge}</span>` : ""}
          <span class="badge">${t.formFactor}</span>
        </div>
        <h3>${t.name}</h3>
        <p class="meta">${t.tagline}</p>
        <div class="price">${money(t.startingPaid)} <small>starting paid${t.freeTier ? " · free tier" : " · no free tier"}</small></div>
        <p class="meta"><strong>Best for:</strong> ${t.bestFor}</p>
        <ul class="list">${t.strengths.slice(0, 3).map((s) => `<li>${s}</li>`).join("")}</ul>
        ${p.skipIf ? `<p class="skip"><strong>Skip it if:</strong> ${p.skipIf}</p>` : ""}
        <div class="actions">
          ${tryBtn(t.id, `${t.freeTier ? "Try" : "Get"} ${short(t.name)}${t.freeTier ? " free" : ""}`, "btn-primary")}
          <a class="btn" href="${base}ai-coding-tool-pricing/#plans-${t.id}">Which plan?</a>
        </div>
        ${disclosure([t.id])}
      </article>`;
  }
  function glanceRow(t) {
    const g = ((w.PRICING || {})[t.id] || {}).glance || {};
    const l = link(t.id) || { href: t.website, rel: "noopener" };
    return `
      <tr>
        <th scope="row"><a href="#tool-${t.id}">${short(t.name)}</a></th>
        <td>${g.free || (t.freeTier ? "Yes" : "No")}</td>
        <td>${money(t.startingPaid)}</td>
        <td>${g.models || t.models}</td>
        <td>${g.agents || ""}</td>
        <td>${g.surface || t.formFactor}</td>
        <td>${g.team || ""}</td>
        <td><a href="${l.href}" rel="${l.rel}" data-link="${t.id}">${t.freeTier ? "Try free" : "Get started"}</a>${l.aff ? " " + refTag : ""}</td>
      </tr>`;
  }
  // Verdict CTA panel for comparison pages: one "Try" button per tool with the plan we'd start on.
  function tryPanel(ids, base) {
    const tools = (w.TOOL_DATA || []);
    const rows = ids.map((id) => {
      const t = tools.find((x) => x.id === id);
      if (!t) return "";
      const p = (w.PRICING || {})[id] || {};
      const g = (p.guide || [])[p.start || 0];
      return `
        <div class="try-item">
          <h3>${short(t.name)}</h3>
          <p class="meta">${g ? `<strong>Start on:</strong> ${g[0]}. ${g[1]}` : t.bestFor}</p>
          <div class="cta-row">
            ${tryBtn(id, `${t.freeTier ? "Try" : "Get"} ${short(t.name)}${t.freeTier ? " free" : ""} &rarr;`, "btn-primary")}
            <a class="btn" href="${base}ai-coding-tool-pricing/#plans-${id}">All ${short(t.name)} plans</a>
          </div>
        </div>`;
    }).join("");
    return `
    <section class="panel try" id="try">
      <h2>Ready to try one?</h2>
      <p class="sub">Every tool here can be cancelled monthly${ids.every((id) => ((tools.find((x) => x.id === id) || {}).freeTier)) ? " and has a free tier" : ""}, so the fastest way to decide is a real task on each.</p>
      <div class="try-grid">${rows}</div>
      ${disclosure(ids)}
    </section>`;
  }
  // "Ship your app" stack: hosting, database, code review, domains.
  function stack(base, order) {
    const groups = (w.STACK || []).slice();
    if (order) groups.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
    const ids = [];
    const body = groups.map((g) => `
        <div class="stack-group">
          <h3>${g.group}</h3>
          <p class="meta">${g.why}</p>
          <ul class="stack-list">${g.items.map((it) => {
            const l = link(it.id);
            if (!l) return "";
            ids.push(it.id);
            return `<li><a href="${l.href}" rel="${l.rel}" data-link="${it.id}"><strong>${l.name}</strong></a>${l.aff ? " " + refTag : ""}<span>${it.fit}</span><small>${it.price}</small></li>`;
          }).join("")}</ul>
          ${g.note ? `<p class="meta tiny">${g.note}</p>` : ""}
        </div>`).join("");
    return `
    <section class="panel stack" id="ship">
      <h2>Ship your app: the rest of the stack</h2>
      <p class="sub">Picked your AI coding tool? These are the usual next costs. Free tiers first, and prices checked Oct 20, 2026 on each vendor's pricing page.</p>
      <div class="stack-grid">${body}</div>
      ${disclosure(ids) || '<p class="meta tiny">None of these links pay us today. If that changes, they\'ll be labeled "referral".</p>'}
    </section>`;
  }
  w.CTP_RENDER = { money, ctaUrl, relFor, isAff, short, link, tryBtn, disclosure, card, glanceRow, tryPanel, stack, refTag, AFF_LINE };
})(typeof window !== "undefined" ? window : globalThis);
