(function () {
  const tools = window.TOOL_DATA;
  const quiz = window.QUIZ;
  let step = 0;
  const answers = [];

  const moneyLabel = (n) => (n == null ? "Usage-based" : n === 0 ? "Free" : `$${n}/mo`);

  function renderCards(list) {
    const el = document.getElementById("cards");
    el.innerHTML = list.map((t) => `
      <article class="card" data-category="${t.category}" id="tool-${t.id}">
        <div>
          <span class="badge">${t.formFactor}</span>
          ${t.affiliate ? '<span class="badge money">Affiliate potential</span>' : ""}
        </div>
        <h3>${t.name}</h3>
        <p class="meta">${t.tagline}</p>
        <div class="price">${moneyLabel(t.startingPaid)} <small>starting paid</small></div>
        <p class="meta"><strong>Best for:</strong> ${t.bestFor}</p>
        <ul class="list">${t.strengths.slice(0, 3).map((s) => `<li>${s}</li>`).join("")}</ul>
        <div class="actions">
          <a class="btn btn-primary" href="${t.website}" rel="noopener sponsored">Visit ${t.name}</a>
          <a class="btn" href="${t.pricingUrl}" rel="noopener">Pricing</a>
        </div>
      </article>
    `).join("");
  }

  function renderTable() {
    const body = document.querySelector("#compare-table tbody");
    body.innerHTML = tools.map((t) => `
      <tr>
        <td><a href="#tool-${t.id}">${t.name}</a></td>
        <td>${t.formFactor}</td>
        <td>${moneyLabel(t.startingPaid)}${t.freeTier ? " (+ free tier)" : ""}</td>
        <td>${t.models}</td>
        <td>${t.bestFor}</td>
      </tr>
    `).join("");
  }

  function showQuizStep() {
    const box = document.getElementById("quiz-body");
    if (step >= quiz.length) {
      finishQuiz();
      return;
    }
    const q = quiz[step];
    box.innerHTML = `
      <div class="quiz-q">${step + 1}/${quiz.length}: ${q.q}</div>
      <div class="options">
        ${q.options.map((o, i) => `<button class="option" data-i="${i}">${o.label}</button>`).join("")}
      </div>
    `;
    box.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[step] = q.options[Number(btn.dataset.i)];
        step += 1;
        showQuizStep();
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
    result.innerHTML = `
      <h3>Best fit: ${top.name}</h3>
      <p>${top.bestFor}. Starts at <strong>${moneyLabel(top.startingPaid)}</strong>.</p>
      <p class="meta">Also consider ${second.name} if you want ${second.tagline.toLowerCase()}.</p>
      <div class="cta-row" style="margin-top:12px">
        <a class="btn btn-primary" href="${top.website}" rel="noopener sponsored">Try ${top.name}</a>
        <a class="btn" href="#tool-${top.id}">See details</a>
        <button class="btn" id="quiz-reset">Retake</button>
      </div>
    `;
    document.getElementById("quiz-body").innerHTML = "";
    document.getElementById("quiz-reset").addEventListener("click", () => {
      step = 0;
      answers.length = 0;
      result.classList.remove("show");
      result.innerHTML = "";
      showQuizStep();
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

// Newsletter signup: validate, queue in localStorage, POST to endpoint if configured.
(function () {
  const form = document.getElementById("nl-form");
  if (!form) return;
  const input = document.getElementById("nl-email");
  const msg = document.getElementById("nl-msg");
  const KEY = "ctp_newsletter_queue";
  const valid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    const email = input.value.trim().toLowerCase();
    if (!valid(email)) { msg.textContent = "Please enter a valid email address."; input.focus(); return; }
    let q = [];
    try { q = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) {}
    if (!q.some((x) => x.email === email)) q.push({ email, ts: new Date().toISOString() });
    try { localStorage.setItem(KEY, JSON.stringify(q)); } catch (_) {}
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      const fd = new FormData(); fd.append("email", email);
      fetch(endpoint, { method: "POST", body: fd, mode: "no-cors" }).catch(() => {});
    }
    msg.textContent = "You're on the list! We'll send weekly AI tool picks once the newsletter launches.";
    form.reset();
  });
})();
