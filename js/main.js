/* =============================================
   YAMAHA OUTBOARD SPECIALIST
   main.js — Site-wide JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- Mobile Navigation Toggle ---- */
  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Active Nav Link Highlighting ---- */
  (function setActiveNav() {
    const path   = window.location.pathname.replace(/\/$/, '');
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      // Normalize the href
      let normalized = href.replace(/\/$/, '');
      // Index / home
      if (normalized === '' || normalized === '.' || normalized === 'index.html') {
        normalized = '';
      }

      const currentPage = path.split('/').pop().replace('.html', '');

      if (
        (normalized === '' && (currentPage === 'index' || currentPage === '')) ||
        (normalized !== '' && path.includes(normalized.replace('.html', '')))
      ) {
        link.classList.add('active');
      }
    });
  })();

  /* ---- FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('.site-header')
          ? document.querySelector('.site-header').offsetHeight
          : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Contact Form Validation ---- */
  const contactForm = document.querySelector('.js-contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = contactForm.querySelector('[name="full_name"]');
      const email   = contactForm.querySelector('[name="email"]');
      const phone   = contactForm.querySelector('[name="phone"]');
      const message = contactForm.querySelector('[name="message"]');
      let valid     = true;

      // Clear old errors
      contactForm.querySelectorAll('.field-error').forEach(function (el) {
        el.remove();
      });
      contactForm.querySelectorAll('.input-error').forEach(function (el) {
        el.classList.remove('input-error');
      });

      function showError(field, msg) {
        field.classList.add('input-error');
        const span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = msg;
        field.parentNode.appendChild(span);
        valid = false;
      }

      if (name && !name.value.trim()) showError(name, 'Please enter your name.');
      if (email) {
        if (!email.value.trim()) {
          showError(email, 'Please enter your email address.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          showError(email, 'Please enter a valid email address.');
        }
      }
      if (message && !message.value.trim()) showError(message, 'Please enter a message.');

      if (valid) {
        // Show success message (form is static — real submission requires server/service)
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success-msg';
        successMsg.innerHTML =
          '<strong>Message sent!</strong> We\'ll be in touch during business hours.';
        contactForm.parentNode.insertBefore(successMsg, contactForm);
        contactForm.style.display = 'none';
      }
    });
  }


})();

/* ---- Hero flowing water effect ---- */
(function initHeroFlow() {
  var container = document.querySelector('.hero-splash');
  if (!container) return;

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  function rand(min, max) { return Math.random() * (max - min) + min; }

  var curtains = [];

  // Build (or rebuild on resize) a set of overlapping flowing curtains.
  // Each curtain is a wide semi-transparent band that scrolls downward
  // continuously, with sinusoidal wave distortion on both edges.
  function build() {
    canvas.width  = container.offsetWidth;
    canvas.height = container.offsetHeight;
    curtains = [];

    var n = 14; // enough bands to feel like a lot of water
    for (var i = 0; i < n; i++) {
      curtains.push({
        xFrac:     rand(0.0, 1.0),     // centre x as fraction of width
        wFrac:     rand(0.10, 0.38),   // width as fraction of screen width
        speed:     rand(0.35, 1.1),    // screen-heights scrolled per second
        scrollY:   rand(0, 1),         // initial scroll position [0, 1)
        waveAmp:   rand(5, 22),        // px of horizontal edge undulation
        waveFreq:  rand(1.5, 4.5),     // oscillations along the full height
        waveSpeed: rand(0.3, 1.1),     // how fast the wave shape itself moves
        phase:     rand(0, Math.PI * 2),
        alpha:     rand(0.07, 0.22)    // keep it translucent — image shows through
      });
    }
  }

  build();
  window.addEventListener('resize', build);

  var last = null, t = 0;

  function frame(ts) {
    if (!last) last = ts;
    var dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    t += dt;

    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < curtains.length; i++) {
      var c = curtains[i];
      c.scrollY = (c.scrollY + c.speed * dt) % 1;

      var cx = c.xFrac * W;
      var hw = (c.wFrac * W) * 0.5;   // half-width

      // Draw 2 copies end-to-end so the scroll loops seamlessly
      for (var copy = 0; copy < 2; copy++) {
        var yTop = (c.scrollY + copy - 1) * H;

        var SEGS = 40;
        ctx.beginPath();

        // Left edge — top to bottom
        for (var s = 0; s <= SEGS; s++) {
          var fy  = s / SEGS;
          var y   = yTop + fy * H;
          var wav = Math.sin(fy * Math.PI * c.waveFreq + t * c.waveSpeed + c.phase) * c.waveAmp;
          var x   = cx - hw + wav;
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }

        // Right edge — bottom to top
        for (var s = SEGS; s >= 0; s--) {
          var fy  = s / SEGS;
          var y   = yTop + fy * H;
          var wav = Math.sin(fy * Math.PI * c.waveFreq + t * c.waveSpeed + c.phase + 2.0) * c.waveAmp;
          var x   = cx + hw + wav;
          ctx.lineTo(x, y);
        }

        ctx.closePath();

        // Horizontal gradient: transparent at both edges, bright in the centre —
        // gives the rounded, glassy look of a real water sheet
        var grd = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0);
        grd.addColorStop(0.00, 'rgba(200,230,255,0)');
        grd.addColorStop(0.18, 'rgba(255,255,255,' + c.alpha + ')');
        grd.addColorStop(0.50, 'rgba(255,255,255,' + (c.alpha * 1.4).toFixed(3) + ')');
        grd.addColorStop(0.82, 'rgba(255,255,255,' + c.alpha + ')');
        grd.addColorStop(1.00, 'rgba(200,230,255,0)');

        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

/* ---- Disable tel: links on non-touch desktop browsers ---- */
(function () {
  var isMobile = navigator.maxTouchPoints > 0 || /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function (e) { e.preventDefault(); });
      link.style.cursor = 'default';
    });
  }
})();

/* ---- Current year in footer copyright ---- */
document.querySelectorAll('.js-year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

/* ---- Inline styles for form error state (injected once) ---- */
(function injectFormStyles() {
  const style = document.createElement('style');
  style.textContent = [
    '.input-error { border-color: #c0392b !important; }',
    '.field-error  { color: #c0392b; font-size: 0.8rem; margin-top: 0.3rem; display: block; }',
    '.form-success-msg {',
    '  background: #d4edda; color: #155724;',
    '  border: 1px solid #c3e6cb;',
    '  border-radius: 8px;',
    '  padding: 1rem 1.25rem;',
    '  margin-bottom: 1rem;',
    '  font-size: 0.97rem;',
    '}'
  ].join('\n');
  document.head.appendChild(style);
})();
