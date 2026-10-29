/* ==========================================================================
   London Hotel Group — shared partials
   The header, slide-out menu, footer and inquiry panel are defined ONCE here
   and injected into every page. To change a menu item, a footer link, the
   contact details or a social link, edit the data at the top of this file.

   Each page sets two attributes on <body>:
     data-root  — relative path back to the site root ("" or "../")
     data-path  — this page's path from the root, e.g. "hotels/wembley.html"
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- site data ---------- */
  var CONTACT = {
    company: 'London Hotel Group',
    address: ['Lynton House', '54 Clapham Common South Side', 'London SW4 9BX', 'United Kingdom'],
    phone: '+44 20 7720 5005',
    email: 'sales@lhg.co.uk'
  };

  var SOCIAL = [
    ['Facebook', 'https://www.facebook.com/londonhotelgroup/'],
    ['Instagram', 'https://www.instagram.com/londonhotelgroup/'],
    ['LinkedIn', 'https://www.linkedin.com/company/london-hotel-group'],
    ['X', 'https://twitter.com/ldnhotelgroup'],
    ['YouTube', 'https://www.youtube.com/channel/UC53Pxj5qR46XYFbxYCOj_GA']
  ];

  // Hotels with their own page (order = carousel, footer, menu, "next property")
  var HOTELS = [
    ['London Queens Crystal Palace Hotel', 'hotels/crystal-palace.html'],
    ['London Wembley Hotel', 'hotels/wembley.html'],
    ['London Peckham Hotel', 'hotels/peckham.html'],
    ['London Croydon Aparthotel', 'hotels/croydon-aparthotel.html'],
    ['London Walthamstow Hotel', 'hotels/walthamstow.html'],
    ['Clapham South Belvedere', 'hotels/clapham-south-belvedere.html']
  ];

  // Main navigation. [label, path, (indent)]; "match" marks the item active.
  var NAV = [
    { label: 'Home', href: 'index.html', menuOnly: true, match: ['index.html'] },
    { label: 'About LHG', href: 'about.html', match: ['about.html'], kids: [
      ['Our Story', 'about.html#story'],
      ['Our Group', 'about.html#group'],
      ['Our Values', 'about.html#values'],
      ['Leadership', 'about.html#leadership'],
      ['Gallery', 'about.html#gallery']
    ] },
    { label: 'Our Hotels', href: 'hotels.html', match: ['hotels.html', 'hotels/', 'coming-soon.html'], kids:
      [['All Properties', 'hotels.html']]
        .concat(HOTELS.map(function (h) { return [h[0], h[1], true]; }))
        .concat([['Coming Soon', 'coming-soon.html']])
    },
    { label: 'Group Bookings', href: 'group-bookings.html', match: ['group-bookings.html'], kids: [
      ['Group Accommodation', 'group-bookings.html#accommodation'],
      ['Corporate Inquiries', 'group-bookings.html#corporate'],
      ['Request a Quote', 'group-bookings.html#quote']
    ] },
    { label: 'Social Responsibility', href: 'social-responsibility.html', match: ['social-responsibility.html'], kids: [
      ['Our Commitment', 'social-responsibility.html#commitment'],
      ['Community Partnerships', 'social-responsibility.html#partners'],
      ['Sustainability', 'social-responsibility.html#sustainability'],
      ['People & Wellbeing', 'social-responsibility.html#people'],
      ['Responsible Hospitality', 'social-responsibility.html#responsible']
    ] },
    { label: 'News & Insights', href: 'news.html', match: ['news.html', 'news/'], kids: [
      ['Press Releases', 'news.html#press'],
      ['Latest News', 'news.html#latest']
    ] },
    { label: 'Careers', href: 'careers.html', match: ['careers.html'] },
    { label: 'Contact Us', href: 'contact.html', menuOnly: true, match: ['contact.html'] }
  ];

  var INQUIRY_TYPES = ['Group accommodation', 'Corporate inquiry', 'General inquiry', 'Careers'];

  /* ---------- helpers ---------- */
  var body = document.body;
  var ROOT = body.getAttribute('data-root') || '';
  var PATH = body.getAttribute('data-path') || 'index.html';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function url(p) { return ROOT + p; }
  function isCurrent(p) { return p === PATH; }
  function cur(p) { return isCurrent(p) ? ' aria-current="page"' : ''; }
  function inSection(item) {
    return item.match.some(function (m) { return m.slice(-1) === '/' ? PATH.indexOf(m) === 0 : PATH === m; });
  }
  var tel = 'tel:' + CONTACT.phone.replace(/\s/g, '');
  var mail = 'mailto:' + CONTACT.email;
  var logo = url('assets/images/lhg-logo.png');

  var ICON = {
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    chev: '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true" focusable="false"><path d="M1.5 3.5L5 7l3.5-3.5"/></svg>'
  };

  /* ---------- header ---------- */
  function headerHTML() {
    var items = NAV.filter(function (n) { return !n.menuOnly; }).map(function (n, i) {
      var dd = '';
      if (n.kids) {
        dd = '<button class="dd-btn" type="button" aria-expanded="false" aria-controls="dd-' + i + '" aria-label="' + esc(n.label) + ' pages">' + ICON.chev + '</button>' +
          '<ul class="dd" id="dd-' + i + '">' + n.kids.map(function (k) {
            return '<li><a href="' + url(k[1]) + '"' + (k[2] ? ' class="indent"' : '') + cur(k[1]) + '>' + esc(k[0]) + '</a></li>';
          }).join('') + '</ul>';
      }
      return '<li class="nitem' + (inSection(n) ? ' active' : '') + '"><a href="' + url(n.href) + '"' + cur(n.href) + '>' + esc(n.label) + '</a>' + dd + '</li>';
    }).join('');

    return '' +
      '<div class="hdr-top">' +
        '<div class="l"><button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-menu"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span><span class="hide-sm">Menu</span><span class="sr-only"> (open site menu)</span></button></div>' +
        '<a class="logo" href="' + url('index.html') + '"><img src="' + logo + '" alt="London Hotel Group home" width="240" height="123"></a>' +
        '<div class="r"><a class="hdr-contact hide-sm" href="' + url('contact.html') + '"' + cur('contact.html') + '>Contact us</a>' +
          '<button class="sb hdr-inq" type="button" data-inquire>Inquire</button></div>' +
      '</div>' +
      '<nav class="hdr-nav" aria-label="Main">' +
        '<ul>' + items + '</ul>' +
        '<button class="sb enq" type="button" data-inquire>Inquire</button>' +
      '</nav>';
  }

  /* ---------- slide-out menu ---------- */
  function menuHTML() {
    var items = NAV.map(function (n, i) {
      if (!n.kids) {
        return '<li class="mi"><a class="mi-row" href="' + url(n.href) + '"' + cur(n.href) + '>' + esc(n.label) + '</a></li>';
      }
      var open = inSection(n);
      return '<li class="mi' + (open ? ' open' : '') + '">' +
        '<button class="mi-row" type="button" aria-expanded="' + open + '" aria-controls="sub-' + i + '"><span>' + esc(n.label) + '</span><span class="pm" aria-hidden="true">+</span></button>' +
        '<div class="sub" id="sub-' + i + '"><div><ul>' + n.kids.map(function (k) {
          return '<li><a href="' + url(k[1]) + '"' + (k[2] ? ' class="indent"' : '') + cur(k[1]) + '>' + esc(k[0]) + '</a></li>';
        }).join('') + '</ul></div></div></li>';
    }).join('');

    return '' +
      '<div class="scrim" data-close-menu></div>' +
      '<nav class="menu" id="site-menu" aria-label="Site menu" inert>' +
        '<div class="menu-top"><button class="menu-close" type="button" data-close-menu>' + ICON.x + 'Close</button>' +
          '<img class="mlogo" src="' + logo + '" alt="" width="240" height="123"></div>' +
        '<ul>' + items + '</ul>' +
        '<div class="menu-foot"><a href="' + tel + '">' + esc(CONTACT.phone) + '</a><br><a href="' + mail + '">' + esc(CONTACT.email) + '</a><br>' +
          esc(CONTACT.address.slice(0, 3).join(', ')) + '</div>' +
      '</nav>';
  }

  /* ---------- footer ---------- */
  function footerHTML() {
    function list(links) {
      return '<ul>' + links.map(function (l) { return '<li><a href="' + url(l[1]) + '"' + cur(l[1]) + '>' + esc(l[0]) + '</a></li>'; }).join('') + '</ul>';
    }
    var stay = HOTELS.map(function (h) { return [h[0].replace(/^London /, ''), h[1]]; }).concat([['Coming soon', 'coming-soon.html']]);
    return '' +
      '<div class="foot-grid">' +
        '<div><img class="flogo" src="' + logo + '" alt="London Hotel Group" width="240" height="123" loading="lazy">' +
          '<address>' + CONTACT.address.map(esc).join('<br>') + '</address>' +
          '<p class="contact"><a href="' + tel + '">' + esc(CONTACT.phone) + '</a><a href="' + mail + '">' + esc(CONTACT.email) + '</a></p></div>' +
        '<div><h2>Stay</h2>' + list(stay) + '</div>' +
        '<div><h2>About LHG</h2>' + list([
          ['Our story', 'about.html#story'], ['Leadership', 'about.html#leadership'], ['Social responsibility', 'social-responsibility.html'],
          ['News & insights', 'news.html'], ['Careers', 'careers.html']]) + '</div>' +
        '<div><h2>Plan</h2>' + list([
          ['Group bookings', 'group-bookings.html'], ['Request a quote', 'group-bookings.html#quote'], ['Contact us', 'contact.html']]) + '</div>' +
      '</div>' +
      '<nav class="foot-soc" aria-label="Social media">' + SOCIAL.map(function (s) {
        return '<a href="' + s[1] + '" target="_blank" rel="noopener noreferrer">' + s[0] + '<span class="sr-only"> (opens in a new tab)</span></a>';
      }).join('') + '</nav>' +
      '<div class="foot-bot"><p>&copy; ' + new Date().getFullYear() + ' London Hotel Group. All rights reserved.</p>' +
        '<ul><li><a href="' + url('privacy.html') + '">Privacy</a></li><li><a href="' + url('privacy.html#cookies') + '">Cookies</a></li><li><a href="' + url('privacy.html#terms') + '">Terms</a></li></ul></div>';
  }

  /* ---------- inquiry form (used by the panel and the inline forms) ---------- */
  var formCount = 0;
  function formHTML(opts) {
    opts = opts || {};
    var id = 'f' + (++formCount);
    var type = opts.type || 'General inquiry';
    function field(name, label, control, req, full) {
      return '<div class="field' + (full ? ' fw' : '') + '"><label for="' + id + '-' + name + '">' + label + (req ? ' <span class="req" aria-hidden="true">*</span>' : '') + '</label>' +
        control + '<span class="field-error" id="' + id + '-' + name + '-err"></span></div>';
    }
    function attrs(name, req) {
      return ' id="' + id + '-' + name + '" name="' + name + '"' + (req ? ' required aria-required="true"' : '') + ' aria-describedby="' + id + '-' + name + '-err"';
    }
    var typeOpts = INQUIRY_TYPES.map(function (t) { return '<option' + (t === type ? ' selected' : '') + '>' + t + '</option>'; }).join('');
    var hotelOpts = '<option value="Any">Any hotel</option>' + HOTELS.map(function (h) {
      return '<option' + (h[0] === opts.hotel ? ' selected' : '') + '>' + esc(h[0]) + '</option>';
    }).join('');

    return '' +
      '<form class="inquiry-form" novalidate data-form="inquiry">' +
        '<p class="form-note" style="margin-bottom:24px">Fields marked <span aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>' +
        '<div class="form">' +
          field('name', 'Name', '<input type="text" autocomplete="name"' + attrs('name', true) + '>', true) +
          field('email', 'Email', '<input type="email" autocomplete="email" inputmode="email"' + attrs('email', true) + '>', true) +
          field('type', 'Inquiry type', '<select' + attrs('type', true) + '>' + typeOpts + '</select>', true) +
          field('hotel', 'Preferred hotel', '<select' + attrs('hotel') + '>' + hotelOpts + '</select>') +
          field('arrival', 'Arrival date', '<input type="date"' + attrs('arrival') + '>') +
          field('rooms', 'Number of rooms', '<input type="number" min="1" step="1" inputmode="numeric" placeholder="e.g. 20"' + attrs('rooms') + '>') +
          field('details', 'Details', '<textarea placeholder="Dates, number of guests, any requirements"' + attrs('details') + '></textarea>', false, true) +
          '<div class="fw"><p class="form-status" role="alert"></p></div>' +
          '<div class="fw"><button class="sb" type="submit">Send inquiry</button></div>' +
        '</div>' +
      '</form>';
  }

  /* ---------- inquiry panel ---------- */
  function modalHTML() {
    return '' +
      '<div class="modal" id="inquiry" inert>' +
        '<div class="scrim" data-close-inquiry></div>' +
        '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">' +
          '<button class="x" type="button" data-close-inquiry>' + ICON.x + 'Close</button>' +
          '<h2 class="h2" id="inquiry-title">Make an inquiry</h2>' +
          '<p class="muted intro-text">Tell us about your stay and we\'ll come back with options across our hotels.</p>' +
          '<div data-form-slot></div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- inject ---------- */
  var hdr = document.querySelector('[data-partial="header"]');
  if (hdr) hdr.innerHTML = headerHTML();
  var ftr = document.querySelector('[data-partial="footer"]');
  if (ftr) ftr.innerHTML = footerHTML();
  body.insertAdjacentHTML('beforeend', menuHTML() + modalHTML());

  document.querySelectorAll('[data-inquiry-form]').forEach(function (el) {
    el.innerHTML = formHTML({ type: el.getAttribute('data-inquiry-form') || 'General inquiry' });
  });

  // Exposed for main.js
  window.LHG = { contact: CONTACT, hotels: HOTELS, formHTML: formHTML };
})();
