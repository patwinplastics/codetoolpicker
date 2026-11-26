// CodeToolPicker shared UI behavior for guide pages (markup comes from scripts/enhance.js).
// Plain JS, no dependencies. Everything degrades to fully readable HTML without it.
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Open the accordion that holds an element, then scroll to it.
  function reveal(el, scroll) {
    if (!el) return;
    var d = el.closest && el.closest("details");
    while (d) { d.open = true; d = d.parentElement && d.parentElement.closest("details"); }
    if (el.tagName === "SECTION") { var inner = el.querySelector(":scope > details.ui-d"); if (inner) inner.open = true; }
    if (scroll) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function fromHash(h, scroll) {
    if (!h || h.length < 2) return;
    var el = null;
    try { el = document.getElementById(decodeURIComponent(h.slice(1))); } catch (e) {}
    if (el) reveal(el, scroll);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    reveal(el, true);
    if (history.replaceState) history.replaceState(null, "", id);
  });
  window.addEventListener("hashchange", function () { fromHash(location.hash, true); });
  if (location.hash) setTimeout(function () { fromHash(location.hash, true); }, 50);

  // Sticky jump chips: highlight the section on screen, expand or collapse all.
  var jump = $(".ui-jump");
  if (jump) {
    var chips = $$(".ui-chip", jump);
    var map = {};
    chips.forEach(function (c) { map[c.getAttribute("href").slice(1)] = c; });
    var setOn = function (id) {
      chips.forEach(function (c) { c.classList.toggle("is-on", c === map[id]); });
      var on = map[id];
      if (on) { var box = on.parentElement; var x = on.offsetLeft - box.clientWidth / 2 + on.clientWidth / 2; box.scrollTo({ left: x, behavior: "smooth" }); }
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) setOn(en.target.id); });
      }, { rootMargin: "-80px 0px -65% 0px" });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
      var sentinel = document.createElement("div");
      jump.parentNode.insertBefore(sentinel, jump);
      new IntersectionObserver(function (es) { jump.classList.toggle("is-stuck", !es[0].isIntersecting); }).observe(sentinel);
    }
    var btn = $(".ui-expand", jump);
    var accs = $$("details.ui-d");
    if (btn && accs.length > 2) {
      btn.hidden = false;
      var sync = function () { btn.textContent = accs.every(function (d) { return d.open; }) ? "Collapse all" : "Expand all"; };
      btn.addEventListener("click", function () {
        var open = btn.textContent === "Expand all";
        accs.forEach(function (d) { d.open = open; });
        sync();
      });
      accs.forEach(function (d) { d.addEventListener("toggle", sync); });
      sync();
    }
  }

  // Clamp long paragraphs inside accordions to 3 lines with a "More" button.
  $$(".ui-body > p, .ui-card > p").forEach(function (p) {
    if (p.classList.contains("note") || p.classList.contains("meta") || p.closest(".ui-pick")) return;
    if ((p.textContent || "").length < 330) return;
    p.classList.add("ui-clamp");
    var b = document.createElement("button");
    b.type = "button"; b.className = "ui-moreb"; b.textContent = "More";
    b.setAttribute("aria-expanded", "false");
    b.addEventListener("click", function () {
      var open = p.classList.toggle("ui-clamp") === false;
      b.textContent = open ? "Less" : "More";
      b.setAttribute("aria-expanded", String(open));
    });
    p.insertAdjacentElement("afterend", b);
  });

  // Simple percent bars in table cells that hold just a percentage.
  $$(".ui-body td").forEach(function (td) {
    var m = (td.textContent || "").trim().match(/^(\d{1,3}(?:\.\d+)?)%$/);
    if (m && +m[1] <= 100) { td.classList.add("ui-pct"); td.style.setProperty("--pct", m[1] + "%"); }
  });

  // "Pick for me": turn the "Pick X if..." lists into a tap-what-fits checklist with live bars.
  var lists = $$("ul[data-pick]");
  if (lists.length >= 2) {
    var names = lists.map(function (u) { return u.getAttribute("data-pick"); });
    var items = [];
    var longest = 0;
    lists.forEach(function (u, i) {
      $$(":scope > li", u).forEach(function (li) {
        var t = (li.textContent || "").replace(/\s+/g, " ").trim();
        var mm = t.match(/^(.{12,}?[.:;])\s/); var short = (mm ? mm[1] : t).replace(/[.:;]$/, "");
        if (short.length > 90) short = short.slice(0, 88).replace(/\s\S*$/, "") + "…";
        items.push({ who: i, text: short, full: t });
      });
    });
    // interleave so options from each tool are mixed
    var byWho = names.map(function (_, i) { return items.filter(function (x) { return x.who === i; }); });
    byWho.forEach(function (a) { longest = Math.max(longest, a.length); });
    var mixed = [];
    for (var r = 0; r < longest; r++) byWho.forEach(function (a) { if (a[r]) mixed.push(a[r]); });
    var box = document.createElement("div");
    box.className = "ui-pick"; box.id = "ui-pick";
    box.innerHTML = '<h3>🎯 Pick for me</h3><p class="ui-pick-sub">Tap everything that sounds like you. The bars update as you go.</p><div class="ui-pick-opts"></div><div class="ui-pick-res" aria-live="polite"></div><p class="ui-pick-win"></p>';
    var opts = $(".ui-pick-opts", box);
    mixed.forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "ui-pick-opt"; b.textContent = it.text; b.title = it.full;
      b.setAttribute("aria-pressed", "false"); b.dataset.who = it.who;
      opts.appendChild(b);
    });
    var res = $(".ui-pick-res", box);
    res.innerHTML = names.map(function (n, i) { return '<div class="ui-bar" data-i="' + i + '"><span>' + n.replace(/</g, "&lt;") + '</span><span class="ui-bar-t"><span class="ui-bar-f"></span></span><span class="ui-bar-n">0</span></div>'; }).join("");
    var win = $(".ui-pick-win", box);
    var update = function () {
      var score = names.map(function () { return 0; });
      $$(".ui-pick-opt", box).forEach(function (b) { if (b.getAttribute("aria-pressed") === "true") score[+b.dataset.who]++; });
      var max = Math.max.apply(null, score);
      $$(".ui-bar", res).forEach(function (bar, i) {
        var tot = byWho[i].length || 1;
        $(".ui-bar-f", bar).style.width = (score[i] / tot) * 100 + "%";
        $(".ui-bar-n", bar).textContent = score[i];
        bar.classList.toggle("is-top", max > 0 && score[i] === max);
      });
      var tops = names.filter(function (_, i) { return max > 0 && score[i] === max; });
      win.innerHTML = !max ? "" : tops.length === 1 ? "Your pick: <b>" + tops[0] + "</b>" : "Tie: <b>" + tops.join("</b> or <b>") + "</b>. Tap a few more.";
    };
    opts.addEventListener("click", function (e) {
      var b = e.target.closest(".ui-pick-opt");
      if (!b) return;
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
      update();
    });
    var grid = lists[0].closest(".ui-cards") || lists[0].parentElement;
    grid.parentNode.insertBefore(box, grid);
  } else {
    $$('a[href="#ui-pick"]').forEach(function (a) { a.remove(); });
  }
})();
