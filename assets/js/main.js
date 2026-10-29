/* ==========================================================================
   London Hotel Group — site behaviour
   Runs after partials.js has injected the header, menu, footer and panel.
   ========================================================================== */

/* Where inquiry and newsletter forms are sent.
   GitHub Pages cannot process forms, so paste the URL of a form service here,
   for example a Formspree endpoint: "https://formspree.io/f/abcdwxyz".
   Leave it empty ("") and forms open a pre-filled email to sales@lhg.co.uk. */
const FORM_ENDPOINT = "";

(function () {
  'use strict';

  var SALES_EMAIL = (window.LHG && window.LHG.contact.email) || 'sales@lhg.co.uk';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var body = document.body;
  var lastFocus = null;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- shared: scroll lock and focus trap ---------- */
  var locks = 0;
  function lockScroll(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    var sbw = window.innerWidth - document.documentElement.clientWidth;
    if (locks > 0) {
      if (!body.classList.contains('locked')) body.style.paddingRight = sbw + 'px';
      body.classList.add('locked');
    } else {
      body.classList.remove('locked');
      body.style.paddingRight = '';
    }
  }
  function focusables(el) {
    return $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', el)
      .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
  }
  function trapTab(e, el) {
    if (e.key !== 'Tab') return;
    var f = focusables(el);
    if (!f.length) { e.preventDefault(); return; }
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }
  function setInert(el, on) {
    if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
  }

  /* ---------- header: collapse row 2 after 160px ---------- */
  var hdr = $('.hdr');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (hdr) hdr.classList.toggle('compact', window.scrollY > 160);
      parallax();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- header dropdowns ---------- */
  $$('.nitem').forEach(function (item) {
    var btn = $('.dd-btn', item);
    if (!btn) return;
    function set(open) {
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (!open) item.classList.add('shut'); else item.classList.remove('shut');
    }
    btn.addEventListener('click', function () { set(!item.classList.contains('open')); });
    item.addEventListener('mouseenter', function () { item.classList.remove('shut'); });
    item.addEventListener('mouseleave', function () { set(false); item.classList.remove('shut'); });
    item.addEventListener('focusin', function () { item.classList.remove('shut'); btn.setAttribute('aria-expanded', 'true'); });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) { item.classList.remove('open', 'shut'); btn.setAttribute('aria-expanded', 'false'); }
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { set(false); btn.focus(); item.classList.add('shut'); }
    });
  });

  /* ---------- slide-out menu ---------- */
  var menu = $('#site-menu');
  var menuBtn = $('.menu-btn');
  var menuScrim = menu && menu.previousElementSibling;
  var menuOpen = false;
  function openMenu() {
    if (!menu || menuOpen) return;
    menuOpen = true;
    lastFocus = document.activeElement;
    setInert(menu, false);
    menu.classList.add('on');
    menuScrim.classList.add('on');
    menuBtn.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    $('.menu-close', menu).focus();
  }
  function closeMenu(restore) {
    if (!menu || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove('on');
    menuScrim.classList.remove('on');
    setInert(menu, true);
    menuBtn.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    if (restore !== false && lastFocus) lastFocus.focus();
  }
  if (menu) {
    menuBtn.addEventListener('click', openMenu);
    $$('[data-close-menu]').forEach(function (b) { b.addEventListener('click', function () { closeMenu(); }); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
      trapTab(e, menu);
    });
    $$('.mi > button.mi-row', menu).forEach(function (b) {
      b.addEventListener('click', function () {
        var li = b.parentElement;
        var open = !li.classList.contains('open');
        $$('.mi.open', menu).forEach(function (o) {
          if (o !== li) { o.classList.remove('open'); $('button.mi-row', o).setAttribute('aria-expanded', 'false'); }
        });
        li.classList.toggle('open', open);
        b.setAttribute('aria-expanded', String(open));
      });
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
  }

  /* ---------- inquiry panel ---------- */
  var modal = $('#inquiry');
  var modalPanel = modal && $('.panel', modal);
  var modalOpen = false;
  function openInquiry(trigger) {
    if (!modal) return;
    var title = (trigger && trigger.getAttribute('data-inquire')) || 'Make an inquiry';
    var type = (trigger && trigger.getAttribute('data-type')) || 'General inquiry';
    var hotel = (trigger && trigger.getAttribute('data-hotel')) || '';
    $('#inquiry-title', modal).textContent = title;
    $('[data-form-slot]', modal).innerHTML = window.LHG.formHTML({ type: type, hotel: hotel });
    var form = $('form', modal);
    form.setAttribute('data-subject', title);
    lastFocus = document.activeElement;
    modalOpen = true;
    setInert(modal, false);
    modal.classList.add('on');
    $('.scrim', modal).classList.add('on');
    modalPanel.scrollTop = 0;
    lockScroll(true);
    $('.x', modal).focus();
  }
  function closeInquiry() {
    if (!modalOpen) return;
    modalOpen = false;
    modal.classList.remove('on');
    $('.scrim', modal).classList.remove('on');
    setInert(modal, true);
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-inquire]');
    if (t) { e.preventDefault(); if (menuOpen) closeMenu(false); openInquiry(t); return; }
    if (e.target.closest('[data-close-inquiry]')) closeInquiry();
  });
  if (modal) {
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeInquiry();
      trapTab(e, modalPanel);
    });
  }

  /* ---------- inquiry forms: validation and sending ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(input, msg) {
    var err = document.getElementById(input.getAttribute('aria-describedby'));
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    if (err) err.textContent = msg || '';
  }
  function validate(form) {
    var bad = [];
    var name = form.elements.name, email = form.elements.email, type = form.elements.type, rooms = form.elements.rooms;
    function check(input, msg) { setError(input, msg); if (msg) bad.push(input); }
    check(name, name.value.trim() ? '' : 'Please enter your name.');
    check(email, !email.value.trim() ? 'Please enter your email address.' :
      (EMAIL_RE.test(email.value.trim()) ? '' : 'Please enter a valid email address, for example name@company.com.'));
    check(type, type.value ? '' : 'Please choose an inquiry type.');
    if (rooms.value !== '') {
      var n = Number(rooms.value);
      check(rooms, (Number.isInteger(n) && n >= 1) ? '' : 'Please enter a whole number of rooms (1 or more).');
    } else setError(rooms, '');
    return bad;
  }
  function formData(form) {
    var get = function (k) { return (form.elements[k] && form.elements[k].value.trim()) || ''; };
    return {
      subject: form.getAttribute('data-subject') || ('Website inquiry: ' + get('type')),
      fields: [
        ['Name', get('name')], ['Email', get('email')], ['Inquiry type', get('type')], ['Preferred hotel', get('hotel')],
        ['Arrival date', get('arrival')], ['Number of rooms', get('rooms')], ['Details', get('details')]
      ]
    };
  }
  function mailtoLink(subject, fields) {
    var bodyText = fields.filter(function (f) { return f[1]; }).map(function (f) { return f[0] + ': ' + f[1]; }).join('\n');
    return 'mailto:' + SALES_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
  }
  function send(subject, fields) {
    if (!FORM_ENDPOINT) {
      window.location.href = mailtoLink(subject, fields);
      return Promise.resolve('mailto');
    }
    var fd = new FormData();
    fd.append('_subject', subject);
    fields.forEach(function (f) { fd.append(f[0], f[1]); });
    var email = fields.filter(function (f) { return f[0] === 'Email'; })[0];
    if (email) fd.append('_replyto', email[1]);
    return fetch(FORM_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return 'sent'; });
  }
  function thanksHTML(how) {
    var msg = how === 'mailto'
      ? 'Your email app should now open with your inquiry ready to send. If it doesn\'t, please email us at <a href="mailto:' + SALES_EMAIL + '">' + SALES_EMAIL + '</a>.'
      : 'Your inquiry has been sent. Our sales team will be in touch soon.';
    return '<div class="thanks" tabindex="-1"><h3 class="h2">Thank you</h3><p class="body">' + msg + '</p>' +
      '<div class="actions"><button class="ob" type="button" data-reset-form>Send another inquiry</button></div></div>';
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.getAttribute('data-form') === 'inquiry') {
      e.preventDefault();
      var status = $('.form-status', form);
      status.textContent = '';
      var bad = validate(form);
      if (bad.length) { bad[0].focus(); return; }
      var data = formData(form);
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.textContent = 'Sending…';
      send(data.subject, data.fields).then(function (how) {
        var holder = document.createElement('div');
        holder.innerHTML = thanksHTML(how);
        var thanks = holder.firstChild;
        thanks._form = form;
        form.replaceWith(thanks);
        thanks.focus();
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = 'Send inquiry';
        status.innerHTML = 'Sorry, your inquiry could not be sent. Please try again, or email us at <a href="' +
          mailtoLink(data.subject, data.fields) + '">' + SALES_EMAIL + '</a>.';
      });
    }
    if (form.classList.contains('signup')) {
      e.preventDefault();
      var input = $('input', form);
      var msg = form.nextElementSibling;
      if (!EMAIL_RE.test(input.value.trim())) {
        input.setAttribute('aria-invalid', 'true');
        msg.className = 'signup-msg err';
        msg.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      send('Newsletter sign-up', [['Email', input.value.trim()], ['Inquiry type', 'Newsletter sign-up']]).then(function (how) {
        msg.className = 'signup-msg';
        msg.textContent = how === 'mailto'
          ? 'Thank you. Your email app should open so you can confirm your sign-up.'
          : 'Thank you for signing up.';
        form.hidden = true;
      }).catch(function () {
        msg.className = 'signup-msg err';
        msg.textContent = 'Sorry, we couldn\'t sign you up just now. Please try again later.';
      });
    }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute('aria-invalid') === 'true' && t.form && t.form.getAttribute('data-form') === 'inquiry') setError(t, '');
  });
  document.addEventListener('click', function (e) {
    var r = e.target.closest('[data-reset-form]');
    if (!r) return;
    var thanks = r.closest('.thanks');
    var form = thanks._form;
    form.reset();
    var btn = $('button[type="submit"]', form);
    btn.disabled = false;
    btn.textContent = 'Send inquiry';
    thanks.replaceWith(form);
    form.elements.name.focus();
  });

  /* ---------- newsletter: Subscribe reveals the email field ---------- */
  $$('[data-subscribe]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var form = document.getElementById(btn.getAttribute('aria-controls'));
      form.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.parentElement.hidden = true;
      $('input', form).focus();
    });
  });

  /* ---------- tabs ---------- */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    var scope = list.closest('section') || document;
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
        $$('[data-tab-img="' + t.getAttribute('aria-controls') + '"]', scope).forEach(function (img) { img.classList.toggle('on', on); });
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        else if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (k === 'Home') n = tabs[0];
        else if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---------- hotel carousel ---------- */
  $$('[data-carousel]').forEach(function (car) {
    var track = $('.track', car);
    var cards = $$('.hcard', track);
    var prev = $('[data-prev]', car), next = $('[data-next]', car);
    var bars = $('.bars', car);
    var positions = 1;
    function step() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return cards[0].offsetWidth + gap;
    }
    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function index() {
      if (track.scrollLeft >= maxScroll() - 4) return positions - 1;
      return Math.min(positions - 1, Math.round(track.scrollLeft / step()));
    }
    function goTo(i) {
      var left = i >= positions - 1 ? maxScroll() : i * step();
      track.scrollTo({ left: left, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
    function build() {
      positions = Math.max(1, Math.ceil(maxScroll() / step() - 0.05) + 1);
      bars.innerHTML = '';
      for (var i = 0; i < positions; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show hotel ' + (i + 1) + ' of ' + cards.length);
        b.innerHTML = '<i></i>';
        b.addEventListener('click', goTo.bind(null, i));
        bars.appendChild(b);
      }
      update();
    }
    function update() {
      var i = index();
      $$('button', bars).forEach(function (b, j) { b.setAttribute('aria-current', String(i === j)); });
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= maxScroll() - 4;
    }
    prev.addEventListener('click', function () { goTo(Math.max(0, index() - 1)); });
    next.addEventListener('click', function () { goTo(Math.min(positions - 1, index() + 1)); });
    var raf = 0;
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', build);
    build();
  });

  /* ---------- gallery lightbox ---------- */
  var lb = null, lbItems = [], lbIdx = 0;
  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Gallery');
    lb.setAttribute('inert', '');
    var x = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true" focusable="false">';
    lb.innerHTML = '<div class="lb-stage"></div>' +
      '<button class="lb-b lb-close" type="button" aria-label="Close gallery">' + x + '<path d="M5 5l14 14M19 5L5 19"/></svg></button>' +
      '<button class="lb-b lb-prev" type="button" aria-label="Previous image">' + x + '<path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>' +
      '<button class="lb-b lb-next" type="button" aria-label="Next image">' + x + '<path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
      '<p class="lb-cap" aria-live="polite"></p>';
    body.appendChild(lb);
    $('.lb-close', lb).addEventListener('click', closeLightbox);
    $('.lb-prev', lb).addEventListener('click', function () { showLb(lbIdx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { showLb(lbIdx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') showLb(lbIdx + 1);
      else if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
      trapTab(e, lb);
    });
  }
  function showLb(i) {
    lbIdx = (i + lbItems.length) % lbItems.length;
    var fig = lbItems[lbIdx];
    var media = fig.querySelector('img, .ph').cloneNode(true);
    media.removeAttribute('loading');
    var stage = $('.lb-stage', lb);
    stage.innerHTML = '';
    stage.appendChild(media);
    var cap = fig.querySelector('figcaption');
    $('.lb-cap', lb).textContent = (cap ? cap.textContent : '') + '  (' + (lbIdx + 1) + ' / ' + lbItems.length + ')';
  }
  function openLightbox(setId, i) {
    var set = document.getElementById(setId);
    if (!set) return;
    if (!lb) buildLightbox();
    lbItems = $$('figure', set);
    if (!lbItems.length) return;
    lastFocus = document.activeElement;
    showLb(i || 0);
    setInert(lb, false);
    lb.classList.add('on');
    lockScroll(true);
    $('.lb-close', lb).focus();
  }
  function closeLightbox() {
    lb.classList.remove('on');
    setInert(lb, true);
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-lightbox]');
    if (t) openLightbox(t.getAttribute('data-lightbox'), parseInt(t.getAttribute('data-index') || '0', 10));
  });

  /* ---------- scroll reveal ---------- */
  var rv = $$('.rv');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero photo parallax (max ±80px) ---------- */
  var heroes = $$('.hero-move');
  function parallax() {
    if (reduceMotion.matches) return;
    heroes.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var v = Math.max(-80, Math.min(80, -r.top * 0.15));
      el.style.transform = 'translate3d(0,' + v.toFixed(1) + 'px,0)';
    });
  }
  parallax();
  onScroll();
})();
