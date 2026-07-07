/* Aerodynamics study explorer.
   Every number here is a reported value from Table 1 of
   "Topographical Effects of Materials on Aerodynamics" (Keerthi, 2026).
   Pick a finish; the flow diagram, readouts, and chart settle to its data. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var MATERIALS = [
    { id: "gloss-cf",    name: "Gloss carbon fiber", ra: 0.20, ks: 1.17,  cd: 0.021, cf: 0.0028, bl: 78, regime: "Laminar",
      obs: "Smoothest surface tested. Streamlines remain attached across nearly the entire plate length." },
    { id: "gloss-clear", name: "Gloss clear coat",   ra: 0.35, ks: 2.05,  cd: 0.023, cf: 0.0031, bl: 72, regime: "Laminar",
      obs: "Comparable to gloss carbon fiber. Slightly earlier transition due to minor coating imperfections." },
    { id: "gloss-vinyl", name: "Gloss vinyl wrap",   ra: 0.55, ks: 3.22,  cd: 0.026, cf: 0.0035, bl: 61, regime: "Mostly laminar",
      obs: "Seam edges introduce micro-disturbances. Transition onset occurs earlier than coated surfaces." },
    { id: "aluminum",    name: "Bare aluminum",      ra: 1.00, ks: 5.86,  cd: 0.030, cf: 0.0041, bl: 52, regime: "Transitional",
      obs: "Mid-range baseline. Machined surface promotes earlier transition; turbulent zone covers rear half of plate." },
    { id: "matte-cf",    name: "Matte carbon fiber", ra: 1.40, ks: 8.20,  cd: 0.034, cf: 0.0047, bl: 45, regime: "Transitional",
      obs: "Exposed weave texture visible in wall shear stress contour. Significant skin friction increase vs gloss carbon fiber." },
    { id: "matte-clear", name: "Matte clear coat",   ra: 2.10, ks: 12.30, cd: 0.041, cf: 0.0058, bl: 32, regime: "Turbulent",
      obs: "Matting agents produce consistent pitting. Turbulent zone begins at only one-third of plate length." },
    { id: "matte-vinyl", name: "Matte vinyl wrap",   ra: 2.80, ks: 16.40, cd: 0.047, cf: 0.0065, bl: 22, regime: "Turbulent",
      obs: "Highest roughness tested. Flow becomes turbulent very early; enlarged low-pressure wake observed." }
  ];

  var PETROL = "#1E5064";
  var MUTED = "#6B8A9A";

  var state = { active: 0, from: null, to: null, t: 1 };

  /* ---------- selector chips ---------- */

  var chipRow = document.getElementById("material-chips");
  var chips = [];

  MATERIALS.forEach(function (m, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", i === 0 ? "true" : "false");
    b.tabIndex = i === 0 ? 0 : -1;
    b.innerHTML = m.name + " <small>Ra " + m.ra.toFixed(2) + " µm</small>";
    b.addEventListener("click", function () { select(i); });
    b.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % MATERIALS.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + MATERIALS.length) % MATERIALS.length;
      if (n !== null) { e.preventDefault(); select(n); chips[n].focus(); }
    });
    chipRow.appendChild(b);
    chips.push(b);
  });

  /* ---------- flow diagram ---------- */

  var svg = document.getElementById("flow-svg");
  var NS = "http://www.w3.org/2000/svg";
  var X0 = 90, X1 = 890, Y_PLATE = 380;
  var STREAM_YS = [352, 322, 290, 256, 220];

  var wedge = document.getElementById("bl-wedge");
  var tLine = document.getElementById("transition-line");
  var tLabel = document.getElementById("transition-label");
  var lamLabel = document.getElementById("laminar-label");
  var turbLabel = document.getElementById("turbulent-label");
  var streams = STREAM_YS.map(function (y) {
    var p = document.createElementNS(NS, "path");
    p.setAttribute("class", "stream");
    document.getElementById("streams").appendChild(p);
    return { el: p, y: y };
  });

  function ampFor(cf, y) {
    // amplitude grows with skin friction and near the plate
    var base = 3 + ((cf - 0.0028) / (0.0065 - 0.0028)) * 13;
    var near = 1 - (Y_PLATE - y) / 220;      // 1 near plate → smaller aloft
    return base * (0.45 + 0.55 * near);
  }

  function drawFlow(blFrac, cf) {
    var xT = X0 + (X1 - X0) * blFrac;

    streams.forEach(function (s, si) {
      var d = "M 30 " + s.y + " L " + xT.toFixed(1) + " " + s.y;
      var amp = ampFor(cf, s.y);
      for (var x = xT + 14; x <= X1 + 30; x += 14) {
        var grow = 1 + (x - xT) / 420;
        var yy = s.y + Math.sin((x - xT) / 34 + si * 1.5) * amp * grow;
        d += " L " + x.toFixed(1) + " " + yy.toFixed(1);
      }
      s.el.setAttribute("d", d);
    });

    var wedgeH = 10 + ampFor(cf, Y_PLATE) * 3.2;
    wedge.setAttribute("d",
      "M " + xT.toFixed(1) + " " + (Y_PLATE - 2) +
      " L " + X1 + " " + (Y_PLATE - 2 - wedgeH).toFixed(1) +
      " L " + X1 + " " + (Y_PLATE - 2) + " Z");

    tLine.setAttribute("x1", xT.toFixed(1));
    tLine.setAttribute("x2", xT.toFixed(1));
    tLabel.setAttribute("x", xT.toFixed(1));
    tLabel.textContent = "transition · " + Math.round(blFrac * 100) + "%";
    // keep the label inside the frame
    tLabel.setAttribute("text-anchor", blFrac > 0.82 ? "end" : blFrac < 0.14 ? "start" : "middle");

    var lamW = xT - X0, turbW = X1 - xT;
    lamLabel.style.opacity = lamW > 130 ? 1 : 0;
    turbLabel.style.opacity = turbW > 150 ? 1 : 0;
    lamLabel.setAttribute("x", (X0 + lamW / 2).toFixed(1));
    turbLabel.setAttribute("x", (xT + turbW / 2).toFixed(1));
  }

  /* ---------- readouts ---------- */

  var rCd = document.getElementById("r-cd");
  var rCf = document.getElementById("r-cf");
  var rBl = document.getElementById("r-bl");
  var rRegime = document.getElementById("r-regime");
  var rRough = document.getElementById("r-rough");
  var rObs = document.getElementById("r-obs");

  function setText(m, cd, cf, bl) {
    rCd.textContent = cd.toFixed(3);
    rCf.textContent = cf.toFixed(4);
    rBl.textContent = Math.round(bl) + "%";
    rRegime.textContent = m.regime;
    rRough.textContent = "Ra " + m.ra.toFixed(2) + " µm → ks " + m.ks.toFixed(2) + " µm";
    rObs.textContent = m.obs;
    svg.setAttribute("aria-label",
      "Flow diagram for " + m.name + ": the boundary layer stays laminar for " +
      m.bl + "% of the plate, then turns " + m.regime.toLowerCase() +
      ". Drag coefficient " + m.cd.toFixed(3) + ", skin friction " + m.cf.toFixed(4) + ".");
  }

  /* ---------- bar chart ---------- */

  var chart = document.getElementById("cd-chart");
  var CW = 960, ROW_H = 44, PAD_L = 190, PAD_R = 80, PAD_T = 14;
  var maxCd = 0.05;
  var plotW = CW - PAD_L - PAD_R;
  var chartH = PAD_T + MATERIALS.length * ROW_H + 34;
  chart.setAttribute("viewBox", "0 0 " + CW + " " + chartH);
  var barRows = [];

  (function buildChart() {
    // gridlines + ticks
    for (var v = 0.01; v <= maxCd + 1e-9; v += 0.01) {
      var x = PAD_L + (v / maxCd) * plotW;
      var g = document.createElementNS(NS, "line");
      g.setAttribute("class", "grid-line");
      g.setAttribute("x1", x); g.setAttribute("x2", x);
      g.setAttribute("y1", PAD_T); g.setAttribute("y2", PAD_T + MATERIALS.length * ROW_H);
      chart.appendChild(g);
      var t = document.createElementNS(NS, "text");
      t.setAttribute("class", "tick-label");
      t.setAttribute("x", x); t.setAttribute("y", PAD_T + MATERIALS.length * ROW_H + 22);
      t.setAttribute("text-anchor", "middle");
      t.textContent = v.toFixed(2);
      chart.appendChild(t);
    }

    MATERIALS.forEach(function (m, i) {
      var y = PAD_T + i * ROW_H;
      var row = document.createElementNS(NS, "g");
      row.setAttribute("class", "bar-row");
      row.setAttribute("aria-hidden", "true"); // chips are the accessible control

      var label = document.createElementNS(NS, "text");
      label.setAttribute("class", "bar-label");
      label.setAttribute("x", PAD_L - 14);
      label.setAttribute("y", y + ROW_H / 2 + 4);
      label.setAttribute("text-anchor", "end");
      label.textContent = m.name;
      row.appendChild(label);

      var w = (m.cd / maxCd) * plotW;
      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", PAD_L);
      bar.setAttribute("y", y + (ROW_H - 20) / 2);
      bar.setAttribute("width", w);
      bar.setAttribute("height", 20);
      bar.setAttribute("rx", 4);
      bar.setAttribute("fill", MUTED);
      row.appendChild(bar);

      var val = document.createElementNS(NS, "text");
      val.setAttribute("class", "bar-val");
      val.setAttribute("x", PAD_L + w + 10);
      val.setAttribute("y", y + ROW_H / 2 + 4);
      val.textContent = m.cd.toFixed(3);
      if (i === 0 || i === MATERIALS.length - 1) val.setAttribute("data-always", "1");
      row.appendChild(val);

      var hit = document.createElementNS(NS, "rect");
      hit.setAttribute("x", 0); hit.setAttribute("y", y);
      hit.setAttribute("width", CW); hit.setAttribute("height", ROW_H);
      hit.setAttribute("fill", "transparent");
      row.appendChild(hit);

      row.addEventListener("click", function () { select(i); });
      chart.appendChild(row);
      barRows.push({ row: row, bar: bar });
    });
  })();

  function paintChart() {
    barRows.forEach(function (r, i) {
      var on = i === state.active;
      r.bar.setAttribute("fill", on ? PETROL : MUTED);
      if (on) r.row.setAttribute("data-active", "1");
      else r.row.removeAttribute("data-active");
    });
  }

  /* ---------- selection + settle animation ---------- */

  var settling = false;

  function select(i) {
    if (i === state.active && state.t === 1) return;
    chips.forEach(function (c, ci) {
      c.setAttribute("aria-checked", ci === i ? "true" : "false");
      c.tabIndex = ci === i ? 0 : -1;
    });
    state.from = MATERIALS[state.active];
    state.to = MATERIALS[i];
    state.active = i;
    paintChart();
    setText(state.to, state.to.cd, state.to.cf, state.to.bl);

    if (reduced) {
      drawFlow(state.to.bl / 100, state.to.cf);
      return;
    }
    state.t = 0;
    if (!settling) { settling = true; requestAnimationFrame(step); }
  }

  function ease(t) { return 1 - Math.pow(1 - t, 4); } // same family: slow settle

  var last = null;

  function step(now) {
    if (last === null) last = now;
    var dt = (now - last) / 1000; last = now;
    state.t = Math.min(1, state.t + dt / 0.6);
    var e = ease(state.t);
    var f = state.from, m = state.to;
    var bl = f.bl + (m.bl - f.bl) * e;
    var cf = f.cf + (m.cf - f.cf) * e;
    var cd = f.cd + (m.cd - f.cd) * e;
    drawFlow(bl / 100, cf);
    rCd.textContent = cd.toFixed(3);
    rCf.textContent = cf.toFixed(4);
    rBl.textContent = Math.round(bl) + "%";
    if (state.t < 1) requestAnimationFrame(step);
    else { settling = false; last = null; }
  }

  /* ---------- init ---------- */

  var first = MATERIALS[0];
  setText(first, first.cd, first.cf, first.bl);
  drawFlow(first.bl / 100, first.cf);
  paintChart();
})();
