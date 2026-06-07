/* ============================================================
   PITZLLOCH – main.js
   Vanilla JS – kein Framework, kein jQuery
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------
     1. Partials laden (Header & Footer per fetch)
  -------------------------------------------------- */
  async function fetchPartial(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Partial not found: ' + url);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn(e.message);
    }
  }

  async function initPartials() {
    await fetchPartial('header-ph', '/partials/header.html');
    await fetchPartial('footer-ph', '/partials/footer.html');
    markActiveNav();
    initHeader();
    initHamburger();
    initCookies(); // Nach Footer-Load, da Banner im Partial liegt
  }

  /* --------------------------------------------------
     2. Aktiven Nav-Link markieren
  -------------------------------------------------- */
  function markActiveNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* --------------------------------------------------
     3. Sticky Header Transparenz
  -------------------------------------------------- */
  function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const hasHero = document.querySelector('.hero');

    function update() {
      if (window.scrollY > 60) {
        header.classList.remove('transparent');
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
        if (hasHero) header.classList.add('transparent');
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* --------------------------------------------------
     4. Hamburger / Mobile Menu
  -------------------------------------------------- */
  function initHamburger() {
    const btn  = document.querySelector('.hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('open');
      if (open) {
        menu.style.display = 'flex';
        requestAnimationFrame(() => menu.classList.add('open'));
        document.body.style.overflow = 'hidden';
      } else {
        closeMenu();
      }
    });

    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    function closeMenu() {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
      menu.addEventListener('transitionend', () => { menu.style.display = 'none'; }, { once: true });
    }
  }

  /* --------------------------------------------------
     5. Scroll-Fade Animationen (IntersectionObserver)
  -------------------------------------------------- */
  function initFadeIn() {
    const els = document.querySelectorAll('.fade');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    els.forEach(el => io.observe(el));
  }

  /* --------------------------------------------------
     6. FAQ Accordion
  -------------------------------------------------- */
  function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item    = trigger.closest('.accordion-item');
        const body    = item.querySelector('.accordion-body');
        const isOpen  = item.classList.contains('open');

        // Alle anderen schließen
        document.querySelectorAll('.accordion-item.open').forEach(open => {
          if (open !== item) {
            open.classList.remove('open');
            open.querySelector('.accordion-body').style.maxHeight = '0';
          }
        });

        item.classList.toggle('open', !isOpen);
        body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
      });
    });
  }

  /* --------------------------------------------------
     7. Galerie – Filter & Lightbox
  -------------------------------------------------- */
  function initGallery() {
    initGalleryFilter();
    initLightbox();
  }

  function initGalleryFilter() {
    const btns  = document.querySelectorAll('.gal-btn');
    const items = document.querySelectorAll('.gal-item');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        items.forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  function initLightbox() {
    const lb      = document.getElementById('lightbox');
    if (!lb) return;
    const lbImg   = lb.querySelector('.lightbox-img');
    const lbClose = lb.querySelector('.lb-close');
    const lbPrev  = lb.querySelector('.lb-prev');
    const lbNext  = lb.querySelector('.lb-next');
    const items   = [...document.querySelectorAll('.gal-item[data-src]')];

    let current = 0;

    function open(i) {
      current = i;
      lbImg.src = items[i].dataset.src;
      lbImg.alt = items[i].dataset.alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    items.forEach((item, i) => item.addEventListener('click', () => open(i)));

    lbClose.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });

    lbPrev.addEventListener('click', () => open((current - 1 + items.length) % items.length));
    lbNext.addEventListener('click', () => open((current + 1) % items.length));

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   lbPrev.click();
      if (e.key === 'ArrowRight')  lbNext.click();
    });
  }

  /* --------------------------------------------------
     8. Google Fonts – nur nach Einwilligung laden (DSGVO)
  -------------------------------------------------- */
  function loadGoogleFonts() {
    if (document.getElementById('gfonts-link')) return;
    const link = document.createElement('link');
    link.id   = 'gfonts-link';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&family=Great+Vibes&display=swap';
    document.head.appendChild(link);
  }

  /* --------------------------------------------------
     9. Cookie Banner
  -------------------------------------------------- */
  function initCookies() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const stored = localStorage.getItem('pitzlloch_cookies');
    if (stored === 'accepted') { loadGoogleFonts(); return; }
    if (stored === 'declined') return;

    banner.classList.add('visible');

    banner.querySelector('.cookie-ok')?.addEventListener('click', () => {
      localStorage.setItem('pitzlloch_cookies', 'accepted');
      banner.classList.remove('visible');
      loadGoogleFonts();
    });
    banner.querySelector('.cookie-no')?.addEventListener('click', () => {
      localStorage.setItem('pitzlloch_cookies', 'declined');
      banner.classList.remove('visible');
    });
  }

  /* --------------------------------------------------
     9. Kontaktformular (Web3Forms)
     REPLACE: Trage deinen Web3Forms Access Key in das
     hidden input data-key="DEIN_KEY" ein.
  -------------------------------------------------- */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('[type=submit]');
        if (!btn) return;
        const orig = btn.textContent;
        btn.textContent = 'Wird gesendet …';
        btn.disabled = true;

        const data = Object.fromEntries(new FormData(form));

        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showSuccess(form);
          } else {
            throw new Error(json.message || 'Fehler');
          }
        } catch (err) {
          btn.textContent = 'Fehler – bitte erneut versuchen';
          btn.disabled = false;
          console.error(err);
        }
      });
    });
  }

  function showSuccess(form) {
    const div = document.createElement('div');
    div.className = 'form-success';
    div.innerHTML = `
      <div class="check">✓</div>
      <h3>Vielen Dank für Ihre Anfrage!</h3>
      <p>Wir melden uns innerhalb von 1–2 Werktagen bei Ihnen. Wir freuen uns darauf, Ihren besonderen Tag mit Ihnen zu planen.</p>
    `;
    form.replaceWith(div);
  }

  /* --------------------------------------------------
     10. Content aus JSON-Dateien laden (CMS-Daten)
  -------------------------------------------------- */
  async function loadContent() {
    try {
      const [globalData, heroData, reviewsData, faqData, preiseData, teamData] = await Promise.all([
        fetch('/data/global.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/data/hero.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/data/reviews.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/data/faq.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/data/preise.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/data/team.json').then(r => r.ok ? r.json() : null).catch(() => null),
      ]);

      // Hero-Bereich befüllen
      if (heroData) {
        const img = document.querySelector('.hero-bg-img');
        if (img && heroData.image) img.src = heroData.image;
        setText('.hero-welcome', heroData.welcome);
        setText('.hero-title',   heroData.title);
        setText('.hero-subtitle', heroData.subtitle);
        const sub = document.querySelector('.hero-sub');
        if (sub && heroData.description) sub.innerHTML = heroData.description.replace(/\n/g, '<br>');
      }

      // Kontaktdaten global befüllen
      if (globalData) {
        document.querySelectorAll('[data-phone]').forEach(el => {
          el.textContent = globalData.phone_display;
          if (el.tagName === 'A') el.href = globalData.phone_href;
        });
        document.querySelectorAll('[data-email]').forEach(el => {
          el.textContent = globalData.email;
          if (el.tagName === 'A') el.href = 'mailto:' + globalData.email;
        });
        document.querySelectorAll('[data-address1]').forEach(el => el.textContent = globalData.address1);
        document.querySelectorAll('[data-address2]').forEach(el => el.textContent = globalData.address2);
        document.querySelectorAll('[data-hours-weekday]').forEach(el => el.textContent = globalData.hours_weekday);
        document.querySelectorAll('[data-hours-saturday]').forEach(el => el.textContent = globalData.hours_saturday);
        document.querySelectorAll('[data-hours-sunday]').forEach(el => el.textContent = globalData.hours_sunday);
        document.querySelectorAll('[data-rating]').forEach(el => el.textContent = globalData.rating);
        document.querySelectorAll('[data-review-count]').forEach(el => el.textContent = globalData.review_count);
        document.querySelectorAll('[data-max-guests]').forEach(el => el.textContent = globalData.max_guests);
      }

      // Bewertungen dynamisch generieren
      if (reviewsData?.reviews?.length) {
        const grid = document.getElementById('reviews-grid');
        if (grid) {
          const delays = ['fade-d1','fade-d2','fade-d3'];
          grid.innerHTML = reviewsData.reviews.map((r, i) => `
            <div class="review-card fade ${delays[i % 3]}">
              <div class="review-stars">${'★'.repeat(r.stars || 5)}</div>
              <p class="review-text">„${r.text}"</p>
              <div class="review-author">${r.author}</div>
              <div class="review-date">${r.date}</div>
            </div>`).join('');
          initFadeIn();
        }
      }

      // FAQ dynamisch generieren
      if (faqData?.kategorien?.length) {
        const container = document.getElementById('faq-container');
        if (container) {
          container.innerHTML = faqData.kategorien.map((kat, ki) => `
            <div class="${ki === 0 ? 'section-intro fade' : 'section-intro'}" style="text-align:left;max-width:100%;${ki > 0 ? 'margin-top:var(--sp-lg);' : ''}margin-bottom:var(--sp-md);">
              <span class="section-label">${kat.label}</span>
              <h2 style="font-size:2rem;">${kat.heading}</h2>
            </div>
            <div class="accordion fade">
              ${kat.fragen.map(f => `
                <div class="accordion-item">
                  <button class="accordion-trigger">
                    ${f.frage}
                    <span class="accordion-icon">+</span>
                  </button>
                  <div class="accordion-body">
                    <div class="accordion-body-inner">${f.antwort}</div>
                  </div>
                </div>`).join('')}
            </div>`).join('');
          initAccordion();
          initFadeIn();
        }
      }

      // Pakete dynamisch generieren
      if (preiseData?.pakete?.length) {
        const grid = document.getElementById('pakete-grid');
        if (grid) {
          grid.innerHTML = preiseData.pakete.map(p => `
            <div class="pkg-card${p.featured ? ' featured' : ''}">
              ${p.badge ? `<div class="pkg-badge">${p.badge}</div>` : ''}
              <div style="font-size:2rem;${p.featured ? 'margin:1rem 0 .5rem;' : 'margin-bottom:.5rem;'}color:var(--gold);">${p.icon}</div>
              <div class="pkg-name">${p.name}</div>
              <div class="pkg-price">${p.price}</div>
              <ul class="pkg-list">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
              <a href="/kontakt.html" class="${p.featured ? 'btn btn-gold' : 'btn btn-outline-dark'}" style="width:100%;justify-content:center;">Angebot anfragen</a>
            </div>`).join('');
        }
      }

      // Team dynamisch generieren
      if (teamData?.mitglieder?.length) {
        const grid = document.getElementById('team-grid');
        if (grid) {
          const delays = ['fade-d1','fade-d2','fade-d3'];
          grid.innerHTML = teamData.mitglieder.map((m, i) => `
            <div class="card fade ${delays[i % 3]}">
              ${m.bild
                ? `<img src="${m.bild}" alt="${m.name} – ${m.rolle}" class="card-image" loading="lazy">`
                : `<div class="img-ph short" aria-label="Teamfoto Pitzlloch"></div>`}
              <div class="card-body text-center">
                <h4 style="margin-bottom:.2rem;">${m.name}</h4>
                <span class="section-label">${m.rolle}</span>
                <p style="font-size:.88rem;font-style:italic;font-family:var(--font-heading);">„${m.zitat}"</p>
              </div>
            </div>`).join('');
          initFadeIn();
        }
      }
    } catch (e) {
      console.warn('Content laden fehlgeschlagen:', e);
    }
  }

  function setText(selector, value) {
    if (!value) return;
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  /* Hilfsfunktion: Bild in Container einsetzen */
  function setImg(containerId, src, alt) {
    if (!src) return;
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.loading = 'lazy';
    wrap.innerHTML = '';
    wrap.appendChild(img);
  }

  /* --------------------------------------------------
     10b. Seiten-spezifischen Content laden
  -------------------------------------------------- */
  async function loadPageContent() {
    const page = location.pathname.split('/').pop().replace('.html', '') || 'index';

    const pageMap = {
      hochzeiten:      '/data/page-hochzeiten.json',
      'feiern-events': '/data/page-feiern.json',
      kulinarik:       '/data/page-kulinarik.json',
      raeumlichkeiten: '/data/page-raeumlichkeiten.json',
      'ueber-uns':     '/data/page-ueberuns.json',
      galerie:         '/data/galerie.json',
    };

    const url = pageMap[page];
    if (!url) return;

    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const d = await res.json();

      /* Hero-Bild (alle Unterseiten) */
      if (d.hero_bild) setImg('page-hero-bg', d.hero_bild, 'Pitzlloch');
      if (d.hero_untertitel) {
        const el = document.getElementById('page-hero-sub');
        if (el) el.textContent = d.hero_untertitel;
      }

      /* Hochzeiten */
      if (page === 'hochzeiten') {
        setImg('bild-festsaal', d.festsaal_bild, 'Festsaal Pitzlloch');
        setImg('bild-aussen', d.aussen_bild, 'Außenbereich Pitzlloch');
      }

      /* Feiern & Events */
      if (page === 'feiern-events') {
        setImg('bild-service', d.service_bild, 'Service Pitzlloch');
      }

      /* Kulinarik */
      if (page === 'kulinarik') {
        setImg('bild-philosophie', d.philosophie_bild, 'Küche Pitzlloch');
        setImg('bild-wuensche', d.wuensche_bild, 'Sonderwünsche Pitzlloch');
      }

      /* Räumlichkeiten */
      if (page === 'raeumlichkeiten') {
        setImg('bild-festsaal', d.festsaal_bild, 'Festsaal Pitzlloch');
        setImg('bild-terrasse', d.terrasse_bild, 'Terrasse Pitzlloch');
      }

      /* Über uns */
      if (page === 'ueber-uns') {
        setImg('bild-geschichte', d.geschichte_bild, 'Geschichte Pitzlloch');
        setImg('bild-lage', d.lage_bild, 'Lage Pitzlloch');
      }

      /* Galerie */
      if (page === 'galerie' && d.bilder?.length) {
        const grid = document.getElementById('galerie-grid');
        if (grid) {
          grid.innerHTML = d.bilder
            .filter(b => b.bild)
            .map(b => `
              <div class="gal-item${b.breit ? ' wide' : ''}" data-cat="${b.kategorie}" data-src="${b.bild}" data-alt="${b.alt}">
                <img src="${b.bild}" alt="${b.alt}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy">
                <div class="gal-overlay"><span class="gal-zoom">⊕</span></div>
              </div>`).join('');
          initGallery();
        }
      }
    } catch (e) {
      console.warn('Seiten-Content laden fehlgeschlagen:', e);
    }
  }

  /* --------------------------------------------------
     11. Init
  -------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    loadPageContent();
    initFadeIn();
    initAccordion();
    initGallery();
    initForms();
    initPartials(); // initCookies() wird darin nach Footer-Load aufgerufen
  });

})();
