// Browser behaviour for the standalone HTML export (scripts/export-html.mjs).
// Mirrors the React components using the same Tailwind classes: header, slide-out menu,
// hero slideshow, gallery viewer and enquiry form.
(function () {
  "use strict";
  var D = window.__LHG__;
  var EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dur = function (s) { return reduceMotion ? "0s" : s; };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function swap(node, remove, add) {
    remove.split(" ").forEach(function (c) { if (c) node.classList.remove(c); });
    add.split(" ").forEach(function (c) { if (c) node.classList.add(c); });
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  var ICON = {
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="size-6 transition-transform duration-500 group-hover:rotate-90" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    right: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="size-5 shrink-0 opacity-50 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    left: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" class="size-4 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3" aria-hidden="true"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3" aria-hidden="true"><path d="M6 3l14 9-14 9V3z"/></svg>',
  };

  // ---------------- Header: solid on scroll, tucks away when scrolling down ----------------
  var header = document.querySelector("header");
  var menuButton = document.querySelector('button[aria-controls="site-navigation"]');
  var drawerOpen = false;
  var root = null;
  var closeDrawer = function () {};
  if (header) {
    var bar = header.firstElementChild;
    var cta = header.querySelector("a.rounded-full");
    var lastY = 0;
    var onScroll = function () {
      var y = window.scrollY;
      var solid = y > 40;
      var hidden = y > 480 && y > lastY && !drawerOpen;
      lastY = y;
      if (solid) {
        swap(header, "bg-gradient-to-b from-black/45 to-transparent", "bg-ivory/95 shadow-[0_1px_0_var(--color-stone)] backdrop-blur-md");
        swap(bar, "text-ivory", "text-forest");
        if (cta) swap(cta, "border-ivory/70 text-ivory hover:bg-ivory hover:text-forest", "border-heritage bg-heritage text-ivory hover:bg-forest");
      } else {
        swap(header, "bg-ivory/95 shadow-[0_1px_0_var(--color-stone)] backdrop-blur-md", "bg-gradient-to-b from-black/45 to-transparent");
        swap(bar, "text-forest", "text-ivory");
        if (cta) swap(cta, "border-heritage bg-heritage text-ivory hover:bg-forest", "border-ivory/70 text-ivory hover:bg-ivory hover:text-forest");
      }
      swap(header, hidden ? "translate-y-0" : "-translate-y-full", hidden ? "-translate-y-full" : "translate-y-0");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------------- Slide-out navigation ----------------
  if (menuButton) {
    root = el("div", "fixed inset-0 z-50");
    root.id = "site-navigation";
    root.hidden = true;
    var backdrop = el("div", "absolute inset-0 bg-forest-deep/55 backdrop-blur-[2px]");
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.style.cssText = "opacity:0;transition:opacity " + dur("0.5s") + " " + EASE;
    var panel = el("div", "absolute inset-y-0 left-0 flex w-full flex-col overflow-hidden bg-forest text-ivory shadow-2xl sm:w-[min(32rem,92vw)]");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Site navigation");
    panel.style.cssText = "transform:translateX(-100%);transition:transform " + dur("0.7s") + " " + EASE;

    var top = el("div", "flex h-20 shrink-0 items-center justify-between px-6 md:h-24 md:px-10");
    var closeBtn = el("button", "group -ml-2 flex items-center gap-4 p-2", ICON.x + '<span class="eyebrow">' + esc(D.labels.close) + "</span>");
    closeBtn.type = "button";
    top.appendChild(closeBtn);
    top.appendChild(el("span", "eyebrow text-sage", esc(D.shortName)));

    var nav = el("nav", "relative flex-1 overflow-y-auto overflow-x-hidden px-6 md:px-10");
    nav.setAttribute("aria-label", "Main");
    var level = el("div", "pb-10 pt-4 md:pt-8");
    nav.appendChild(level);

    var foot = el("div", "shrink-0 border-t border-ivory/15 px-6 py-6 md:px-10 md:py-8");
    foot.innerHTML =
      '<div class="space-y-1 text-sm text-ivory/70"><p>' + esc(D.contact.phone) + "</p><p>" + esc(D.contact.email) + "</p></div>" +
      '<a href="' + esc(D.cta.href) + '" class="eyebrow mt-6 flex min-h-12 items-center justify-center border border-gold/70 text-ivory transition-colors duration-500 hover:bg-gold hover:text-forest">' + esc(D.cta.label) + "</a>";

    panel.appendChild(top);
    panel.appendChild(nav);
    panel.appendChild(foot);
    root.appendChild(backdrop);
    root.appendChild(panel);
    document.body.appendChild(root);

    var path = [];
    var rowClass = function (depth) {
      var size = depth === 0
        ? "font-serif text-[1.9rem] font-light leading-tight md:text-[2.35rem]"
        : "font-serif text-[1.45rem] font-light md:text-[1.65rem]";
      return "group flex items-center justify-between gap-6 py-2 text-left text-ivory transition-colors duration-500 hover:text-gold focus-visible:text-gold " + size;
    };

    var render = function (direction) {
      var items = D.nav, trail = [];
      path.forEach(function (i) { trail.push(items[i]); items = items[i].children; });
      var parent = trail[trail.length - 1];
      var depth = trail.length;
      var html = "";
      if (parent) {
        html += '<div class="mb-8 border-b border-ivory/15 pb-6"><button type="button" data-back data-focus class="group -ml-1 flex items-center gap-2 p-1 text-sage transition-colors hover:text-ivory">' + ICON.left + '<span class="eyebrow">' + esc(D.labels.back) + "</span></button>";
        if (trail.length > 1) html += '<p class="eyebrow mt-5 text-sage/80">' + trail.slice(0, -1).map(function (t) { return esc(t.label); }).join(" / ") + "</p>";
        html += '<p class="' + (trail.length > 1 ? "mt-2" : "mt-5") + ' font-serif text-3xl font-light md:text-4xl">' + esc(parent.label) + "</p></div>";
      }
      html += '<ul class="' + (depth === 0 ? "space-y-1 md:space-y-2" : "space-y-1") + '">';
      var hasOwn = parent && parent.href && items.some(function (i) { return i.href === parent.href; });
      if (parent && parent.href && !hasOwn) {
        html += '<li><a href="' + esc(parent.href) + '" class="' + rowClass(depth) + '"><span>' + esc(D.labels.overview) + "</span></a></li>";
      }
      items.forEach(function (item, i) {
        var label = (depth === 0 ? '<span class="w-6 shrink-0 font-sans text-[0.65rem] tracking-[0.2em] text-sage/80" aria-hidden="true">' + String(i + 1).padStart(2, "0") + "</span>" : "") + esc(item.label);
        if (item.children && item.children.length) {
          html += '<li><button type="button" data-index="' + i + '" aria-haspopup="true" class="' + rowClass(depth) + ' w-full"><span class="flex items-baseline gap-4">' + label + "</span>" + ICON.right + "</button></li>";
        } else if (item.href) {
          html += '<li><a href="' + esc(item.href) + '" class="' + rowClass(depth) + '"><span class="flex items-baseline gap-4">' + label + "</span></a></li>";
        }
      });
      html += "</ul>";
      level.innerHTML = html;
      // Slide the new level in from the direction of travel
      level.style.transition = "none";
      level.style.opacity = "0";
      level.style.transform = "translateX(" + (direction || 0) * 48 + "px)";
      requestAnimationFrame(function () {
        level.style.transition = "opacity " + dur("0.45s") + " " + EASE + ", transform " + dur("0.45s") + " " + EASE;
        level.style.opacity = "1";
        level.style.transform = "none";
      });
      var focusTarget = level.querySelector("[data-focus]") || (depth === 0 ? closeBtn : null);
      if (focusTarget && !root.hidden) setTimeout(function () { focusTarget.focus(); }, 60);
    };

    level.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (btn.hasAttribute("data-back")) { path.pop(); render(-1); }
      else if (btn.dataset.index) { path.push(Number(btn.dataset.index)); render(1); }
    });

    var open = function () {
      drawerOpen = true;
      path = [];
      root.hidden = false;
      document.body.style.overflow = "hidden";
      menuButton.setAttribute("aria-expanded", "true");
      render(0);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          backdrop.style.opacity = "1";
          panel.style.transform = "translateX(0)";
        });
      });
    };
    var close = function (restoreFocus) {
      if (!drawerOpen) return;
      drawerOpen = false;
      backdrop.style.opacity = "0";
      panel.style.transform = "translateX(-100%)";
      document.body.style.overflow = "";
      menuButton.setAttribute("aria-expanded", "false");
      setTimeout(function () { root.hidden = true; }, reduceMotion ? 0 : 700);
      if (restoreFocus !== false) menuButton.focus();
    };
    closeDrawer = close;
    menuButton.addEventListener("click", open);
    closeBtn.addEventListener("click", function () { close(); });
    backdrop.addEventListener("click", function () { close(); });
    document.addEventListener("keydown", function (e) {
      if (!drawerOpen) return;
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      var f = panel.querySelectorAll("a[href], button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // ---------------- Page-level behaviour (re-run after every page switch in single-file mode) ----------------
  var slideTimer = null;
  var lightbox = null;

  function initPage() {
  clearTimeout(slideTimer);
  if (lightbox) { lightbox.remove(); lightbox = null; }

  // ---------------- Hero slideshow ----------------
  var hero = document.querySelector('section[aria-roledescription="carousel"]');
  if (hero && D.slides.length > 1) {
    var current = hero.querySelector('[aria-roledescription="slide"]');
    var dots = Array.prototype.slice.call(hero.querySelectorAll('button[aria-label^="Show slide"]'));
    var pauseBtn = hero.querySelector('button[aria-label$="slideshow"]');
    var index = 0, paused = reduceMotion;

    var kenBurns = function (slide) {
      var inner = slide.firstElementChild;
      if (!inner || reduceMotion) return;
      inner.style.transition = "none";
      inner.style.transform = "scale(1.08)";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          inner.style.transition = "transform " + (D.interval / 1000 + 2) + "s linear";
          inner.style.transform = "scale(1)";
        });
      });
    };

    var show = function (next) {
      if (next === index) return;
      var slide = current.cloneNode(true);
      var img = slide.querySelector("img");
      img.src = (D.images && D.images[D.slides[next].src]) || D.slides[next].src;
      img.alt = D.slides[next].alt;
      slide.setAttribute("aria-label", next + 1 + " of " + D.slides.length);
      slide.style.opacity = "0";
      slide.style.transition = "opacity " + dur("1.6s") + " " + EASE;
      current.parentNode.insertBefore(slide, current.nextSibling);
      kenBurns(slide);
      var old = current;
      requestAnimationFrame(function () { requestAnimationFrame(function () { slide.style.opacity = "1"; }); });
      setTimeout(function () { old.remove(); }, reduceMotion ? 0 : 1700);
      current = slide;
      index = next;
      dots.forEach(function (d, i) {
        var bar = d.firstElementChild;
        d.setAttribute("aria-current", String(i === index));
        if (i === index) swap(bar, "w-5 bg-ivory/40 group-hover:bg-ivory/80", "w-10 bg-ivory");
        else swap(bar, "w-10 bg-ivory", "w-5 bg-ivory/40 group-hover:bg-ivory/80");
      });
      schedule();
    };
    var schedule = function () {
      clearTimeout(slideTimer);
      if (!paused) slideTimer = setTimeout(function () { show((index + 1) % D.slides.length); }, D.interval);
    };
    var setPaused = function (p) {
      paused = p;
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-label", p ? "Play slideshow" : "Pause slideshow");
        pauseBtn.innerHTML = p ? ICON.play : ICON.pause;
      }
      schedule();
    };
    dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i); }); });
    if (pauseBtn) pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    kenBurns(current);
    setPaused(paused);
  }

  // ---------------- Gallery viewer ----------------
  var galleryButtons = Array.prototype.slice.call(document.querySelectorAll("button")).filter(function (b) {
    return /Open image \d+ of/.test(b.textContent);
  });
  if (galleryButtons.length) {
    var images = galleryButtons.map(function (b) { var i = b.querySelector("img"); return { src: i.src, alt: i.alt }; });
    var box = el("div", "fixed inset-0 z-[70] flex items-center justify-center bg-forest-deep/95 p-4 md:p-12");
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<img class="max-h-full max-w-full object-contain" alt="">' +
      '<button type="button" data-close class="absolute right-4 top-4 p-3 text-ivory md:right-8 md:top-8" aria-label="Close gallery">' + ICON.x + "</button>" +
      '<button type="button" data-step="-1" class="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-4xl font-light text-ivory md:left-6" aria-label="Previous image">‹</button>' +
      '<button type="button" data-step="1" class="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-4xl font-light text-ivory md:right-6" aria-label="Next image">›</button>' +
      '<p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-ivory/70"></p>';
    document.body.appendChild(box);
    lightbox = box;
    var bigImg = box.querySelector("img"), counter = box.querySelector("p"), active = 0, opener = null;
    var showImg = function (i) {
      active = (i + images.length) % images.length;
      bigImg.src = images[active].src;
      bigImg.alt = images[active].alt;
      counter.textContent = active + 1 + " / " + images.length;
      box.setAttribute("aria-label", "Image " + (active + 1) + " of " + images.length);
    };
    var closeBox = function () { box.hidden = true; document.body.style.overflow = ""; if (opener) opener.focus(); };
    galleryButtons.forEach(function (b, i) {
      b.addEventListener("click", function () {
        opener = b; showImg(i); box.hidden = false; document.body.style.overflow = "hidden";
        box.querySelector("[data-close]").focus();
      });
    });
    box.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (t && t.dataset.step) showImg(active + Number(t.dataset.step));
      else if (t || e.target === box) closeBox();
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden || lightbox !== box) return;
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowRight") showImg(active + 1);
      if (e.key === "ArrowLeft") showImg(active - 1);
    });
  }

  // ---------------- Enquiry form ----------------
  // This static version has no server, so it never claims to send: it shows the "not connected" message.
  Array.prototype.forEach.call(document.querySelectorAll("form"), function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var live = form.querySelector("[aria-live]");
      if (!live) return;
      live.innerHTML = '<p role="alert" class="flex items-start gap-3 border border-error/30 bg-error/5 p-4 text-sm text-error">' + esc(D.formMessage) + "</p>";
      live.focus();
    });
  });
  }

  if (!D.single) {
    initPage();
    return;
  }

  // ---------------- Single-file mode: every page lives in a <template>; the URL hash picks one ----------------
  var main = document.getElementById("main");
  var templates = {};
  Array.prototype.forEach.call(document.querySelectorAll("template[data-route]"), function (t) {
    templates[t.getAttribute("data-route")] = t;
  });

  // Same-page anchors (#content, #enquire, skip link) scroll instead of changing the page.
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute("href");
    if (href.indexOf("#/") === 0) return;
    var target = document.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  });

  function route() {
    var hash = decodeURIComponent(location.hash.slice(1)) || "/";
    var parts = hash.split("#");
    var path = parts[0] || "/";
    var t = templates[path] || templates["/404"];
    var content = t.content.cloneNode(true);
    Array.prototype.forEach.call(content.querySelectorAll("img[data-img]"), function (img) {
      img.src = D.images[img.getAttribute("data-img")];
    });
    main.replaceChildren(content);
    document.title = t.getAttribute("data-title");
    if (drawerOpen && root) closeDrawer(false);
    var anchor = parts[1] && document.getElementById(parts[1]);
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
    window.dispatchEvent(new Event("scroll"));
    initPage();
  }
  window.addEventListener("hashchange", route);
  route();
})();
