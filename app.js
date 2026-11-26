(function () {
  const tools = window.TOOL_DATA;
  const quiz = window.QUIZ;
  let step = 0;
  const answers = [];

  const moneyLabel = (n) => (n == null ? "Usage-based" : n === 0 ? "Free" : `$${n}/mo`);
  // Lowercase only a plain leading word ("Chat-to-app" -> "chat-to-app"); keep acronyms,
  // brand names and possessives ("AI", "Anthropic's", "Cognition's") and the rest as written.
  const midSentence = (s) => {
    const first = s.split(/\s/)[0];
    if (/^[A-Z][a-z]/.test(first) && !/['\u2019]/.test(first)) return s.charAt(0).toLowerCase() + s.slice(1);
    return s;
  };

  const R = window.CTP_RENDER;
  const P = window.PRICING || {};
  function renderCards(list) {
    document.getElementById("cards").innerHTML = list.map((t) => R.card(t, "")).join("");
  }

  function renderTable() {
    document.querySelector("#compare-table tbody").innerHTML = tools.map(R.glanceRow).join("");
  }

  // ---- Interactive quiz: one question at a time, live ranking bars, budget slider ----
  const ICONS = { "ship-app": "🚀", "daily-code": "⌨️", "agent-heavy": "🤖", "github-team": "👥", "desktop-ide": "🖥️", terminal: "💻", browser: "🌐", any: "✨" };
  let budget = 20;
  const budgetOption = (v) => {
    const opts = (quiz.find((q) => q.id === "budget") || {}).options || [];
    return opts.find((o) => o.id === (v < 15 ? "free" : v <= 60 ? "mid" : "power"));
  };
  function liveScores() {
    const sc = {};
    tools.forEach((t) => (sc[t.id] = 0));
    answers.forEach((a) => a && Object.entries(a.scores).forEach(([id, n]) => (sc[id] = (sc[id] || 0) + n)));
    return sc;
  }
  function renderBoard() {
    const board = document.getElementById("quiz-board");
    if (!board) return;
    const sc = liveScores();
    const max = Math.max(1, ...Object.values(sc));
    const ranked = tools.slice().sort((a, b) => sc[b.id] - sc[a.id] || tools.indexOf(a) - tools.indexOf(b));
    if (!board.children.length) {
      board.innerHTML = `<p class="qb-title">Live ranking</p>` + tools.map((t) => `<div class="qb-row" data-id="${t.id}"><span class="qb-name">${R.short(t.name)}</span><span class="qb-track"><span class="qb-fill"></span></span></div>`).join("");
    }
    const rowH = 30;
    board.style.setProperty("--rows", tools.length);
    ranked.forEach((t, i) => {
      const row = board.querySelector(`[data-id="${t.id}"]`);
      row.style.transform = `translateY(${i * rowH}px)`;
      row.classList.toggle("is-lead", i === 0 && sc[t.id] > 0);
      row.querySelector(".qb-fill").style.width = `${answers.length ? (sc[t.id] / max) * 100 : 0}%`;
    });
  }
  function showQuizStep(dir) {
    const box = document.getElementById("quiz-body");
    if (step >= quiz.length) {
      finishQuiz();
      return;
    }
    const q = quiz[step];
    const dots = quiz.map((_, i) => `<span class="${i < step ? "done" : i === step ? "on" : ""}"></span>`).join("");
    const back = step > 0 ? `<button type="button" class="qz-back">&larr; Back</button>` : "";
    let body;
    if (q.id === "budget") {
      body = `
        <div class="qz-budget">
          <div class="qz-bval"><strong id="qz-bnum">$${budget}</strong><span>/month</span></div>
          <input type="range" id="qz-range" min="0" max="200" step="5" value="${budget}" aria-label="Monthly budget in dollars" />
          <div class="qz-ticks"><span>$0</span><span>$50</span><span>$100</span><span>$150</span><span>$200+</span></div>
          <p class="qz-fits" id="qz-fits"></p>
          <button type="button" class="btn btn-primary qz-next">Next &rarr;</button>
        </div>`;
    } else {
      body = `<div class="options qz-grid">${q.options.map((o, i) => `<button type="button" class="option" data-i="${i}"><span class="qz-ico" aria-hidden="true">${ICONS[o.id] || "•"}</span>${o.label}</button>`).join("")}</div>`;
    }
    box.innerHTML = `
      <div class="qz-step ${dir === -1 ? "from-left" : "from-right"}">
        <div class="qz-head"><span class="qz-dots" aria-hidden="true">${dots}</span><span class="qz-count">${step + 1} of ${quiz.length}</span>${back}</div>
        <div class="quiz-q">${q.q}</div>
        ${body}
      </div>`;
    const go = (opt) => {
      answers[step] = opt;
      answers.length = step + 1;
      step += 1;
      renderBoard();
      setTimeout(() => showQuizStep(1), 160);
    };
    box.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.add("active");
        go(q.options[Number(btn.dataset.i)]);
      });
    });
    const range = box.querySelector("#qz-range");
    if (range) {
      const upd = () => {
        budget = Number(range.value);
        box.querySelector("#qz-bnum").textContent = budget >= 200 ? "$200+" : `$${budget}`;
        range.style.setProperty("--p", `${(budget / 200) * 100}%`);
        const fit = tools.filter((t) => (budget === 0 ? t.freeTier : t.startingPaid != null && t.startingPaid <= budget) || (t.startingPaid == null && budget > 0));
        box.querySelector("#qz-fits").innerHTML = `<strong>${fit.length} of ${tools.length}</strong> tools ${budget === 0 ? "have a free tier" : "start within this"}: ${fit.map((t) => R.short(t.name)).join(", ")}`;
        answers[step] = budgetOption(budget);
        renderBoard();
      };
      range.addEventListener("input", upd);
      upd();
      box.querySelector(".qz-next").addEventListener("click", () => go(budgetOption(budget)));
    }
    const bk = box.querySelector(".qz-back");
    if (bk) bk.addEventListener("click", () => {
      step -= 1;
      answers.length = step;
      renderBoard();
      showQuizStep(-1);
    });
  }

  function finishQuiz() {
    const scores = liveScores();
    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const maxPossible = quiz.reduce((s, q) => s + Math.max(...q.options.map((o) => Math.max(...Object.values(o.scores)))), 0);
    const pct = (id) => Math.round((scores[id] / maxPossible) * 100);
    const topId = ranked[0][0];
    const secondId = ranked[1][0];
    const thirdId = ranked[2][0];
    const top = tools.find((t) => t.id === topId);
    const second = tools.find((t) => t.id === secondId);
    const third = tools.find((t) => t.id === thirdId);
    const result = document.getElementById("quiz-result");
    document.getElementById("quiz").classList.add("is-done");
    result.classList.add("show");
    const pair = [top.id, second.id].sort().join("|");
    const cmp = (window.COMPARE_PAGES || {})[pair];
    const tp = P[top.id] || {};
    const guide = (tp.guide || [])[tp.start || 0];
    const fits = (t) => (t.startingPaid != null && t.startingPaid <= budget) || (budget === 0 && t.freeTier);
    const fitTag = (t) => (fits(t) ? `<span class="badge money">Fits your $${budget >= 200 ? "200+" : budget} budget</span>` : t.freeTier ? `<span class="badge">Free tier to start</span>` : "");
    const meter = (t) => `<div class="qz-match"><span class="qz-mbar"><span style="--w:${pct(t.id)}%"></span></span><b>${pct(t.id)}% match</b></div>`;
    result.innerHTML = `
      <div class="qz-res">
      <div class="qz-top">
        <p class="eyebrow">Your best fit</p>
        <h3>${top.name}</h3>
        ${meter(top)}
        <div class="badges" style="margin:8px 0">${tp.bestBadge ? `<span class="badge best">${tp.bestBadge}</span>` : ""}${fitTag(top)}</div>
        <p>${top.bestFor}. Starts at <strong>${moneyLabel(top.startingPaid)}</strong>${top.freeTier ? ", with a free tier to try first" : ""}.</p>
        ${guide ? `<p class="meta"><strong>Plan to start with:</strong> ${guide[0]}. ${guide[1]}</p>` : ""}
        ${tp.skipIf ? `<details class="skip-d"><summary>Skip it if…</summary><p class="skip">${tp.skipIf}</p></details>` : ""}
        <div class="cta-row" style="margin-top:12px">
          ${R.tryBtn(top.id, `${top.freeTier ? "Try" : "Get"} ${R.short(top.name)}${top.freeTier ? " free" : ""} &rarr;`, "btn-primary btn-lg")}
          <button class="btn" type="button" id="quiz-cost">Estimate my cost</button>
          <button class="btn" type="button" id="quiz-reset">Retake</button>
        </div>
        ${R.disclosure([top.id])}
      </div>
      <div class="qz-alts">
        ${[second, third].map((t, i) => `
        <div class="qz-alt">
          <p class="eyebrow">${i === 0 ? "Runner-up" : "Also good"}</p>
          <h4>${t.name}</h4>
          ${meter(t)}
          <p class="meta">If you want ${midSentence(t.tagline)}. From <strong>${moneyLabel(t.startingPaid)}</strong>.</p>
          <div class="cta-row">${R.tryBtn(t.id, `Try ${R.short(t.name)}`)}</div>
          ${R.disclosure([t.id])}
        </div>`).join("")}
        <div class="cta-row qz-cmp">${cmp ? `<a class="btn" href="${cmp.url}">Compare: ${cmp.label}</a>` : ""}<button class="btn" type="button" id="quiz-vs">${R.short(top.name)} vs ${R.short(second.name)} side by side</button></div>
      </div>
      </div>
      <p class="meta" style="margin-top:12px">Next: <a href="#ship">what hosting, a database and a domain will cost</a> once your app works.</p>
      <div class="sponsor" id="quiz-sponsor" style="margin-top:14px;padding:14px">
        <strong>Sponsor slot</strong> <span class="meta">(Sponsored placements are labeled and never change your quiz result)</span>
        <div class="meta" style="margin-top:6px">Founding sponsor rates available now. <a href="advertise/">See packages</a> or email <a href="mailto:sponsors@codetoolpicker.com?subject=CodeToolPicker%20sponsorship">sponsors@codetoolpicker.com</a></div>
      </div>
    `;
    requestAnimationFrame(() => requestAnimationFrame(() => result.classList.add("in")));
    document.getElementById("quiz-cost").addEventListener("click", () => {
      if (window.CTP_CALC) window.CTP_CALC.select(top.id);
      document.getElementById("cost").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("quiz-vs").addEventListener("click", () => {
      if (window.CTP_VS) window.CTP_VS.set(top.id, second.id);
      document.getElementById("compare").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("quiz-body").innerHTML = "";
    document.getElementById("quiz-reset").addEventListener("click", () => {
      step = 0;
      answers.length = 0;
      result.classList.remove("show", "in");
      document.getElementById("quiz").classList.remove("is-done");
      result.innerHTML = "";
      renderBoard();
      showQuizStep();
      document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
    });
    const h = result.querySelector("h3");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ---- Compare any two tools ----
  function initVs() {
    const box = document.getElementById("vs");
    if (!box) return;
    const opt = (sel) => tools.map((t) => `<option value="${t.id}"${t.id === sel ? " selected" : ""}>${R.short(t.name)}</option>`).join("");
    box.innerHTML = `
      <div class="vs-pick">
        <select id="vs-a" aria-label="First tool">${opt("cursor")}</select>
        <button type="button" class="vs-swap" aria-label="Swap tools" title="Swap">⇄</button>
        <select id="vs-b" aria-label="Second tool">${opt("claude-code")}</select>
      </div>
      <div class="vs-out" aria-live="polite"></div>`;
    const a = box.querySelector("#vs-a"), b = box.querySelector("#vs-b"), out = box.querySelector(".vs-out");
    const col = (t, o) => {
      const p = P[t.id] || {};
      const g = p.glance || {};
      const cheaper = t.startingPaid != null && (o.startingPaid == null || t.startingPaid < o.startingPaid);
      return `
        <div class="vs-card">
          <div class="badges">${p.bestBadge ? `<span class="badge best">${p.bestBadge}</span>` : ""}${cheaper ? `<span class="badge money">Cheaper to start</span>` : ""}</div>
          <h3>${t.name}</h3>
          <div class="vs-price">${moneyLabel(t.startingPaid)}<small>${t.freeTier ? "free tier ✓" : "no free tier"}</small></div>
          <dl>
            <dt>Best for</dt><dd>${t.bestFor}</dd>
            <dt>Where</dt><dd>${g.surface || t.formFactor}</dd>
            <dt>Strengths</dt><dd><ul>${t.strengths.slice(0, 3).map((s) => `<li>${s}</li>`).join("")}</ul></dd>
            <dt>Watch out</dt><dd>${t.limits[0]}</dd>
          </dl>
          <div class="cta-row">${R.tryBtn(t.id, `${t.freeTier ? "Try" : "Get"} ${R.short(t.name)}`, "btn-primary")}<a class="btn" href="ai-coding-tool-pricing/#plans-${t.id}">Plans</a></div>
          ${R.disclosure([t.id])}
        </div>`;
    };
    const draw = () => {
      if (a.value === b.value) b.value = tools.find((t) => t.id !== a.value).id;
      const ta = tools.find((t) => t.id === a.value), tb = tools.find((t) => t.id === b.value);
      const cmp = (window.COMPARE_PAGES || {})[[ta.id, tb.id].sort().join("|")];
      out.innerHTML = `<div class="vs-grid">${col(ta, tb)}<div class="vs-mid" aria-hidden="true">VS</div>${col(tb, ta)}</div>
        ${cmp ? `<p class="vs-more"><a class="btn" href="${cmp.url}">Full breakdown: ${cmp.label} &rarr;</a></p>` : ""}`;
      out.classList.remove("pop"); void out.offsetWidth; out.classList.add("pop");
    };
    a.addEventListener("change", draw);
    b.addEventListener("change", draw);
    box.querySelector(".vs-swap").addEventListener("click", () => { const x = a.value; a.value = b.value; b.value = x; draw(); });
    window.CTP_VS = { set(x, y) { a.value = x; b.value = y; draw(); } };
    draw();
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      if (f === "all") renderCards(tools);
      else renderCards(tools.filter((t) => t.category === f));
    });
  });

  renderCards(tools);
  renderTable();
  const qb = document.createElement("div");
  qb.id = "quiz-board";
  qb.className = "quiz-board";
  qb.setAttribute("aria-hidden", "true");
  const qwrap = document.getElementById("quiz-body");
  if (qwrap) { const lay = document.createElement("div"); lay.className = "quiz-lay"; qwrap.parentNode.insertBefore(lay, qwrap); lay.appendChild(qwrap); lay.appendChild(qb); }
  renderBoard();
  showQuizStep();
  initVs();
})();

// Newsletter signup. No account needed: submissions go to FormSubmit (formsubmit.co), which emails
// them to sponsors@codetoolpicker.com. Unsent signups are kept in localStorage and retried on the
// next visit, so nothing is lost if the endpoint is down or not activated yet.
// To move to Buttondown/Beehiiv later, change data-endpoint on #nl-form.
(function () {
  const form = document.getElementById("nl-form");
  if (!form) return;
  const input = document.getElementById("nl-email");
  const msg = document.getElementById("nl-msg");
  const KEY = "ctp_newsletter_queue";
  const valid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) { return []; } };
  const save = (q) => { try { localStorage.setItem(KEY, JSON.stringify(q)); } catch (_) {} };
  const endpoint = form.dataset.endpoint;
  function send(email) {
    if (!endpoint) return Promise.resolve(false);
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: email, _subject: "New CodeToolPicker newsletter signup", _template: "table", source: location.pathname })
    }).then((r) => r.json().then((j) => r.ok && String(j.success) === "true")).catch(() => false);
  }
  function flush() {
    const q = load().filter((x) => !x.sent);
    q.forEach((x) => send(x.email).then((ok) => {
      if (!ok) return;
      const all = load();
      all.forEach((y) => { if (y.email === x.email) y.sent = true; });
      save(all);
    }));
  }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (form.querySelector('[name="_honey"]') && form.querySelector('[name="_honey"]').value) return;
    const email = input.value.trim().toLowerCase();
    if (!valid(email)) { msg.textContent = "Please enter a valid email address."; input.focus(); return; }
    const q = load();
    if (!q.some((x) => x.email === email)) q.push({ email, ts: new Date().toISOString(), sent: false });
    save(q);
    msg.textContent = "Sending...";
    send(email).then((ok) => {
      const all = load();
      all.forEach((y) => { if (y.email === email && ok) y.sent = true; });
      save(all);
      msg.textContent = ok
        ? "You're on the list. We'll email you when the first issue goes out: pricing changes and new tool picks, at most once a week."
        : "Saved. We couldn't reach our list server just now, so we'll retry automatically next time you visit.";
      form.reset();
    });
  });
  flush();
})();
