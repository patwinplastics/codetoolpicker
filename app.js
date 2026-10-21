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

  function showQuizStep() {
    const box = document.getElementById("quiz-body");
    if (step >= quiz.length) {
      finishQuiz();
      return;
    }
    const q = quiz[step];
    box.innerHTML = `
      <div class="quiz-progress" aria-hidden="true"><span style="width:${(step / quiz.length) * 100}%"></span></div>
      <div class="quiz-q">${step + 1}/${quiz.length}: ${q.q}</div>
      <div class="options">
        ${q.options.map((o, i) => `<button type="button" class="option" data-i="${i}">${o.label}</button>`).join("")}
      </div>
    `;
    box.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[step] = q.options[Number(btn.dataset.i)];
        step += 1;
        showQuizStep();
        const nb = document.querySelector("#quiz-body .option") || document.querySelector("#quiz-result h3");
        if (nb && step > 0) { nb.setAttribute("tabindex", nb.tagName === "H3" ? "-1" : "0"); nb.focus({ preventScroll: true }); }
      });
    });
  }

  function finishQuiz() {
    const scores = {};
    tools.forEach((t) => (scores[t.id] = 0));
    answers.forEach((a) => {
      Object.entries(a.scores).forEach(([id, n]) => {
        scores[id] = (scores[id] || 0) + n;
      });
    });
    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topId = ranked[0][0];
    const secondId = ranked[1][0];
    const top = tools.find((t) => t.id === topId);
    const second = tools.find((t) => t.id === secondId);
    const result = document.getElementById("quiz-result");
    result.classList.add("show");
    const pair = [top.id, second.id].sort().join("|");
    const cmp = (window.COMPARE_PAGES || {})[pair];
    const tp = P[top.id] || {};
    const guide = (tp.guide || [])[tp.start || 0];
    result.innerHTML = `
      <p class="eyebrow">Your best fit</p>
      <h3>${top.name}</h3>
      ${tp.bestBadge ? `<span class="badge best">${tp.bestBadge}</span>` : ""}
      <p>${top.bestFor}. Starts at <strong>${moneyLabel(top.startingPaid)}</strong>${top.freeTier ? ", with a free tier to try first" : ""}.</p>
      ${guide ? `<p class="meta"><strong>Plan to start with:</strong> ${guide[0]}. ${guide[1]}</p>` : ""}
      ${tp.skipIf ? `<p class="skip"><strong>Skip it if:</strong> ${tp.skipIf}</p>` : ""}
      <div class="cta-row" style="margin-top:12px">
        ${R.tryBtn(top.id, `${top.freeTier ? "Try" : "Get"} ${R.short(top.name)}${top.freeTier ? " free" : ""} &rarr;`, "btn-primary btn-lg")}
        <button class="btn" type="button" id="quiz-cost">Estimate my cost</button>
        <button class="btn" type="button" id="quiz-reset">Retake</button>
      </div>
      ${R.disclosure([top.id])}
      <div class="runner">
        <p><strong>Runner-up: ${second.name}</strong>, if you want ${midSentence(second.tagline)}. From ${moneyLabel(second.startingPaid)}.</p>
        <div class="cta-row">
          ${cmp ? `<a class="btn" href="${cmp.url}">Compare: ${cmp.label}</a>` : `<a class="btn" href="#compare">Compare all tools</a>`}
          ${R.tryBtn(second.id, `Try ${R.short(second.name)}`)}
        </div>
        ${R.disclosure([second.id])}
      </div>
      <p class="meta" style="margin-top:12px">Next: <a href="#ship">what hosting, a database and a domain will cost</a> once your app works.</p>
      <div class="sponsor" id="quiz-sponsor" style="margin-top:14px;padding:14px">
        <strong>Sponsor slot</strong> <span class="meta">(Sponsored placements are labeled and never change your quiz result)</span>
        <div class="meta" style="margin-top:6px">Founding sponsor rates available now. <a href="advertise/">See packages</a> or email <a href="mailto:sponsors@codetoolpicker.com?subject=CodeToolPicker%20sponsorship">sponsors@codetoolpicker.com</a></div>
      </div>
    `;
    document.getElementById("quiz-cost").addEventListener("click", () => {
      if (window.CTP_CALC) window.CTP_CALC.select(top.id);
      document.getElementById("cost").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("quiz-body").innerHTML = "";
    document.getElementById("quiz-reset").addEventListener("click", () => {
      step = 0;
      answers.length = 0;
      result.classList.remove("show");
      result.innerHTML = "";
      showQuizStep();
      document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
    });
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
  showQuizStep();
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
