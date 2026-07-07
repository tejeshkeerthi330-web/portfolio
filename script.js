/* Undertow motion system.
   One rAF loop, transforms only, one lerped easing feel everywhere.
   Everything here is enhancement: with JS off or reduced motion on,
   the page is complete and still. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- mobile nav ---------- */

  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- masked hero reveal (arm after first paint) ---------- */

  requestAnimationFrame(function () {
    document.documentElement.classList.add("ready");
  });

  /* ---------- one-time reveals: images unclip, titles rise ---------- */

  var revealables = document.querySelectorAll("[data-reveal], [data-rise]");

  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- active section in nav ---------- */

  var navLinks = document.querySelectorAll(".nav-menu a[href^='#']");

  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionIO.observe(section);
    });
  }

  /* ---------- inertia scrolling (vendored Lenis; optional) ---------- */

  var lenis = null;

  if (!reduced && finePointer && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    document.documentElement.dataset.lenis = "1";
    var lenisRaf = function (time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    };
    requestAnimationFrame(lenisRaf);

    // Anchors ride the same easing instead of the native jump.
    // The skip link keeps its native jump so focus moves with it.
    document.querySelectorAll("a[href^='#']:not(.skip-link)").forEach(function (a) {
      a.addEventListener("click", function (event) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.2 });
        history.pushState(null, "", id);
      });
    });
  }

  /* ---------- header retreats while reading, returns on scroll-up ---------- */

  var head = document.querySelector(".site-head");
  var lastY = window.scrollY;

  /* ---------- drift + parallax + pointer lean, one loop ---------- */

  if (reduced) return; // complete static page: pools rest, header stays

  var drifters = Array.prototype.map.call(
    document.querySelectorAll("[data-drift]"),
    function (el) {
      var fixed = el.classList.contains("pool");
      return {
        el: el,
        speed: parseFloat(el.dataset.drift),
        fixed: fixed,                     // pools: viewport-relative drift
        baseTop: 0,
        y: 0
      };
    }
  );

  var parallaxed = Array.prototype.map.call(
    document.querySelectorAll("[data-parallax]"),
    function (el) {
      return { el: el, host: el.closest(".unclip") || el, baseTop: 0, y: 0 };
    }
  );

  function measure() {
    var sy = window.scrollY;
    drifters.forEach(function (d) {
      if (d.fixed) return;
      d.baseTop = d.el.getBoundingClientRect().top + sy - d.y;
    });
    parallaxed.forEach(function (p) {
      p.baseTop = p.host.getBoundingClientRect().top + sy;
    });
  }

  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  var leaner = document.querySelector("[data-lean]");
  var px = 0, py = 0, tx = 0, ty = 0;

  if (finePointer) {
    window.addEventListener("pointermove", function (event) {
      tx = (event.clientX / window.innerWidth - 0.5) * 60;
      ty = (event.clientY / window.innerHeight - 0.5) * 40;
    }, { passive: true });
  }

  var start = performance.now();

  function tick(now) {
    var sy = window.scrollY;
    var vh = window.innerHeight;
    var t = (now - start) / 1000;

    // Header: retreat after 140px going down, return going up.
    if (head) {
      if (sy > lastY + 2 && sy > 140) head.classList.add("is-hidden");
      else if (sy < lastY - 2) head.classList.remove("is-hidden");
      lastY = sy;
    }

    // Pools: slow scroll drift plus a barely-there breathing wobble.
    // Numerals: bounded drift from their place in the document.
    drifters.forEach(function (d, i) {
      var target;
      if (d.fixed) {
        target = sy * d.speed + Math.sin(t * 0.22 + i * 1.7) * 12;
      } else {
        var progress = (d.baseTop - sy - vh * 0.5) / vh;
        target = progress * vh * d.speed;
      }
      d.y += (target - d.y) * 0.075;
      var lean = d.el === leaner
        ? " translate(" + px.toFixed(2) + "px," + py.toFixed(2) + "px)"
        : "";
      d.el.style.transform = "translate3d(0," + d.y.toFixed(2) + "px,0)" + lean;
    });

    // Media glides a touch slower than its frame.
    parallaxed.forEach(function (p) {
      var progress = (p.baseTop - sy - vh * 0.4) / vh;
      var target = Math.max(-26, Math.min(26, progress * 30));
      p.y += (target - p.y) * 0.075;
      p.el.style.transform = "translate3d(0," + p.y.toFixed(2) + "px,0)";
    });

    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
