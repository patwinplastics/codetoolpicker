// Shared HTML renderers used by app.js in the browser and scripts/prerender.js at build time,
// so crawlers and AI chatbots that don't run JavaScript see the same content.
(function (w) {
  const money = (n) => (n == null ? "Usage-based" : n === 0 ? "Free" : `$${n}/mo`);
  const ctaUrl = (t) => t.affiliateUrl || t.website;
  const short = (name) => name.replace(" (formerly Windsurf)", "");
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
          <a class="btn btn-primary" href="${ctaUrl(t)}" rel="noopener sponsored">${t.affiliateUrl ? `Try ${short(t.name)}` : `Visit ${short(t.name)}`}</a>
          <a class="btn" href="${base}ai-coding-tool-pricing/#plans-${t.id}">Which plan?</a>
        </div>
        ${t.affiliateUrl ? '<p class="meta tiny">Referral link: we may earn a commission at no cost to you.</p>' : ""}
      </article>`;
  }
  function glanceRow(t) {
    const g = ((w.PRICING || {})[t.id] || {}).glance || {};
    return `
      <tr>
        <th scope="row"><a href="#tool-${t.id}">${short(t.name)}</a></th>
        <td>${g.free || (t.freeTier ? "Yes" : "No")}</td>
        <td>${money(t.startingPaid)}</td>
        <td>${g.models || t.models}</td>
        <td>${g.agents || ""}</td>
        <td>${g.surface || t.formFactor}</td>
        <td>${g.team || ""}</td>
      </tr>`;
  }
  w.CTP_RENDER = { money, ctaUrl, short, card, glanceRow };
})(typeof window !== "undefined" ? window : globalThis);
