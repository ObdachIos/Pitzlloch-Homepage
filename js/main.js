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
     10. Init
  -------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initFadeIn();
    initAccordion();
    initGallery();
    initForms();
    initPartials(); // initCookies() wird darin nach Footer-Load aufgerufen
  });

})();
