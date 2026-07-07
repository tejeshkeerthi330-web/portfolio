/* Bitcoin / Silk Road story explorer.
   Stations, prices, and activity notes are the rows of the event chart in
   "Bitcoin: How the Industry Opened a Gateway to Criminal Activity"
   (Keerthi, 2024–25), in the paper's own order. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var STATIONS = [
    {
      label: "Jan 2011", short: "Launch", price: 0.30, priceText: "~$0.30",
      act: "Silk Road launches Feb 2011 — initial usage negligible.",
      body: "Founded by Ross William Ulbricht, the Silk Road was an anonymous " +
        "marketplace reachable only through Tor. It needed a payment method " +
        "that kept buyers, sellers, and the site itself out of government " +
        "view — and chose Bitcoin, then trading around thirty cents."
    },
    {
      label: "Jun 2011", short: "First peak", price: 30, priceText: "~$30",
      act: "Silk Road begins; volume still tiny.",
      body: "Bitcoin hits its first peak as the marketplace comes online. The " +
        "currency's ability to operate beyond government regulation was " +
        "becoming widely recognized — exactly the trait the Silk Road was " +
        "built around."
    },
    {
      label: "Late 2012", short: "Undercurrent", price: 12.6, priceText: "~$12.60",
      act: "Silk Road trading ~6–9.5k BTC/day (≈$15M/yr) — about 4.5% of Bitcoin trades.",
      body: "After the first bubble deflated, the marketplace kept growing " +
        "beneath the surface: by late 2012 the Silk Road was moving six to " +
        "nine and a half thousand bitcoins a day — roughly 4.5% of all " +
        "Bitcoin trades."
    },
    {
      label: "Apr 2013", short: "Bull run", price: 266, priceText: "~$266",
      act: "Silk Road activity high (mid-bull run).",
      body: "Bitcoin runs to $266 with Silk Road activity at a high — the " +
        "market rallying above ground while dark-web demand pushed from below."
    },
    {
      label: "Nov 2013", short: "The peak", price: 1100, priceText: "~$1,100",
      act: "Total Silk Road sales ≈9.5M BTC (~$1.2B) — ~20% of Bitcoin's economic activity at peak.",
      body: "At its height, the paper's chart places total Silk Road sales " +
        "near 9.5 million BTC — about $1.2 billion — with the marketplace " +
        "accounting for roughly 20% of Bitcoin's economic activity."
    },
    {
      label: "Oct 2013", short: "The seizure", price: 204, priceText: "~$204",
      act: "Site seized and closed by the FBI — ≈26k BTC seized.",
      body: "The FBI shut the Silk Road down in 2013; Ulbricht was sentenced " +
        "to life in prison. From the pre-seizure high, Bitcoin's price fell " +
        "more than 81% — a collapse the paper reads as directly tied to the " +
        "closure. My estimate across the whole 2011–2013 period: the Silk " +
        "Road drove 5–15% of Bitcoin's price movement."
    }
  ];

  var PETROL = "#1E5064";
  var MUTED = "#6B8A9A";
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- chart geometry (log y, sequence x) ---------- */

  var svg = document.getElementById("btc-chart");
  var W = 960, H = 440, PAD_L = 78, PAD_R = 40, PAD_T = 30, PAD_B = 58;
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);

  var LOG_MIN = Math.log10(0.1), LOG_MAX = Math.log10(2000);

  function xAt(i) { return PAD_L + (i / (STATIONS.length - 1)) * (W - PAD_L - PAD_R); }
  function yAt(p) {
    var f = (Math.log10(p) - LOG_MIN) / (LOG_MAX - LOG_MIN);
    return H - PAD_B - f * (H - PAD_T - PAD_B);
  }

  // gridlines: $0.10, $1, $10, $100, $1,000 (log scale)
  [[0.1, "$0.10"], [1, "$1"], [10, "$10"], [100, "$100"], [1000, "$1,000"]]
    .forEach(function (g) {
      var y = yAt(g[0]);
      var line = document.createElementNS(NS, "line");
      line.setAttribute("class", "grid-line");
      line.setAttribute("x1", PAD_L); line.setAttribute("x2", W - PAD_R);
      line.setAttribute("y1", y); line.setAttribute("y2", y);
      svg.appendChild(line);
      var t = document.createElementNS(NS, "text");
      t.setAttribute("class", "tick-label");
      t.setAttribute("x", PAD_L - 12); t.setAttribute("y", y + 4);
      t.setAttribute("text-anchor", "end");
      t.textContent = g[1];
      svg.appendChild(t);
    });

  // the price path
  var d = "";
  STATIONS.forEach(function (s, i) {
    d += (i === 0 ? "M " : " L ") + xAt(i).toFixed(1) + " " + yAt(s.price).toFixed(1);
  });
  var path = document.createElementNS(NS, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", PETROL);
  path.setAttribute("stroke-width", "2.5");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);

  var totalLen = path.getTotalLength();
  var lenAt = STATIONS.map(function (s, i) {
    // cumulative path length at each station (straight segments)
    var l = 0;
    for (var k = 1; k <= i; k++) {
      var dx = xAt(k) - xAt(k - 1), dy = yAt(STATIONS[k].price) - yAt(STATIONS[k - 1].price);
      l += Math.sqrt(dx * dx + dy * dy);
    }
    return l;
  });
  path.setAttribute("stroke-dasharray", totalLen);

  // station dots + pulse + labels
  var dots = [];
  STATIONS.forEach(function (s, i) {
    var cx = xAt(i), cy = yAt(s.price);

    var pulse = document.createElementNS(NS, "circle");
    pulse.setAttribute("class", "station-pulse");
    pulse.setAttribute("cx", cx); pulse.setAttribute("cy", cy);
    pulse.setAttribute("r", 9);
    pulse.setAttribute("fill", "none");
    pulse.setAttribute("stroke", PETROL);
    pulse.setAttribute("stroke-width", "2");
    pulse.style.opacity = 0;
    svg.appendChild(pulse);

    var dot = document.createElementNS(NS, "circle");
    dot.setAttribute("class", "station-dot");
    dot.setAttribute("cx", cx); dot.setAttribute("cy", cy);
    dot.setAttribute("r", 7);
    dot.setAttribute("fill", MUTED);
    dot.setAttribute("stroke", "#F1F5F6");
    dot.setAttribute("stroke-width", "2");
    dot.setAttribute("aria-hidden", "true"); // chips carry keyboard access
    dot.addEventListener("click", function () { select(i, true); });
    svg.appendChild(dot);

    var lbl = document.createElementNS(NS, "text");
    lbl.setAttribute("class", "tick-label");
    lbl.setAttribute("x", cx); lbl.setAttribute("y", H - PAD_B + 26);
    lbl.setAttribute("text-anchor", i === 0 ? "start" : i === STATIONS.length - 1 ? "end" : "middle");
    lbl.textContent = s.label;
    svg.appendChild(lbl);

    dots.push({ dot: dot, pulse: pulse });
  });

  svg.setAttribute("role", "img");

  /* ---------- station chips + prev/next ---------- */

  var chipRow = document.getElementById("station-chips");
  var chips = [];
  STATIONS.forEach(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", i === 0 ? "true" : "false");
    b.tabIndex = i === 0 ? 0 : -1;
    b.innerHTML = s.label + " <small>" + s.short + "</small>";
    b.addEventListener("click", function () { select(i, true); });
    b.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = Math.min(i + 1, STATIONS.length - 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = Math.max(i - 1, 0);
      if (n !== null && n !== i) { e.preventDefault(); select(n, true); chips[n].focus(); }
    });
    chipRow.appendChild(b);
    chips.push(b);
  });

  var prevBtn = document.getElementById("st-prev");
  var nextBtn = document.getElementById("st-next");
  prevBtn.addEventListener("click", function () { select(active - 1, true); });
  nextBtn.addEventListener("click", function () { select(active + 1, true); });

  /* ---------- chapter panel ---------- */

  var chKicker = document.getElementById("ch-kicker");
  var chPrice = document.getElementById("ch-price");
  var chAct = document.getElementById("ch-act");
  var chBody = document.getElementById("ch-body");
  var chapterEl = document.getElementById("chapter-swap");

  function renderChapter(s, i) {
    chKicker.textContent = "Station " + (i + 1) + " of " + STATIONS.length + " — " + s.label + " · " + s.short;
    chPrice.textContent = s.priceText;
    chAct.textContent = s.act;
    chBody.textContent = s.body;
    svg.setAttribute("aria-label",
      "Bitcoin price line in the paper's event order, drawn to " + s.label +
      " at " + s.priceText + ". " + s.act + " Full data in the table below.");
  }

  /* ---------- selection + settle ---------- */

  var active = 0;
  var drawn = { len: 0, price: STATIONS[0].price };
  var settling = false, last = null;

  function paint() {
    dots.forEach(function (x, i) {
      x.dot.setAttribute("fill", i < active ? PETROL : i === active ? PETROL : MUTED);
      x.dot.setAttribute("r", i === active ? 9 : 7);
      x.pulse.style.opacity = i === active ? "" : 0;
      if (i === active) x.pulse.setAttribute("r", 11);
    });
    chips.forEach(function (c, ci) {
      c.setAttribute("aria-checked", ci === active ? "true" : "false");
      c.tabIndex = ci === active ? 0 : -1;
    });
    prevBtn.disabled = active === 0;
    nextBtn.disabled = active === STATIONS.length - 1;
  }

  function ease(t) { return 1 - Math.pow(1 - t, 4); }

  var fromLen = 0, toLen = 0, fromPrice = 0.3, toPrice = 0.3, t = 1;

  function step(now) {
    if (last === null) last = now;
    var dt = (now - last) / 1000; last = now;
    t = Math.min(1, t + dt / 0.7);
    var e = ease(t);
    drawn.len = fromLen + (toLen - fromLen) * e;
    // lerp in log space so the count feels even across decades
    var lp = Math.log10(fromPrice) + (Math.log10(toPrice) - Math.log10(fromPrice)) * e;
    drawn.price = Math.pow(10, lp);
    path.setAttribute("stroke-dashoffset", totalLen - drawn.len);
    chPrice.textContent = formatPrice(drawn.price, toPrice);
    if (t < 1) requestAnimationFrame(step);
    else {
      settling = false; last = null;
      chPrice.textContent = STATIONS[active].priceText;
    }
  }

  function formatPrice(p, target) {
    if (target < 1) return "~$" + p.toFixed(2);
    if (target < 100) return "~$" + p.toFixed(2);
    return "~$" + Math.round(p).toLocaleString("en-US");
  }

  function select(i, user) {
    if (i < 0 || i >= STATIONS.length || (i === active && user)) return;
    var s = STATIONS[i];
    fromLen = drawn.len; toLen = lenAt[i];
    fromPrice = drawn.price; toPrice = s.price;
    active = i;
    paint();

    if (reduced) {
      drawn.len = toLen; drawn.price = toPrice;
      path.setAttribute("stroke-dashoffset", totalLen - toLen);
      renderChapter(s, i);
      return;
    }

    // gentle text swap, numbers settle in the rAF loop
    chapterEl.classList.add("is-out");
    setTimeout(function () {
      renderChapter(s, i);
      chapterEl.classList.remove("is-out");
    }, 180);

    t = 0;
    if (!settling) { settling = true; requestAnimationFrame(step); }
  }

  /* ---------- init ---------- */

  paint();
  renderChapter(STATIONS[0], 0);
  if (reduced) {
    drawn.len = lenAt[0];
    path.setAttribute("stroke-dashoffset", totalLen - lenAt[0]);
  } else {
    // draw in the first segment on load
    path.setAttribute("stroke-dashoffset", totalLen);
    fromLen = 0; toLen = lenAt[0]; fromPrice = 0.3; toPrice = 0.3; t = 0;
    settling = true; requestAnimationFrame(step);
  }
})();
