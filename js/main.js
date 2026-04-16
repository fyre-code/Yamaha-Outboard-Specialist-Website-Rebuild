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

/* ---- Hero water splash effect (camera lens hit) ---- */
(function initHeroSplash() {
  const container = document.querySelector('.hero-splash');
  if (!container) return;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createImpact() {
    var cx       = rand(5, 94);   // horizontal % centre of impact
    var cy       = rand(5, 88);   // vertical %
    var size     = rand(18, 70);  // main drop diameter px
    var duration = rand(0.5, 1.1); // fast — this is a hit, not a drip

    // --- Main drop ---
    var drop = document.createElement('div');
    drop.className = 'hero-drop';
    drop.style.width  = size + 'px';
    drop.style.height = size + 'px';
    drop.style.left   = 'calc(' + cx + '% - ' + (size / 2) + 'px)';
    drop.style.top    = 'calc(' + cy + '% - ' + (size / 2) + 'px)';
    drop.style.animationDuration = duration + 's';
    container.appendChild(drop);
    setTimeout(function () { if (drop.parentNode) drop.remove(); }, (duration + 0.25) * 1000);

    // --- Ripple rings (1–2) ---
    var numRipples = Math.random() < 0.5 ? 1 : 2;
    for (var r = 0; r < numRipples; r++) {
      var ripple   = document.createElement('div');
      ripple.className = 'hero-ripple';
      var rSize    = size * rand(0.85, 1.15);
      var rDur     = rand(0.45, 0.9);
      var rDelay   = r * rand(0.07, 0.16);
      var rScale   = rand(2.5, 5);
      ripple.style.width            = rSize + 'px';
      ripple.style.height           = rSize + 'px';
      ripple.style.left             = 'calc(' + cx + '% - ' + (rSize / 2) + 'px)';
      ripple.style.top              = 'calc(' + cy + '% - ' + (rSize / 2) + 'px)';
      ripple.style.animationDuration = rDur + 's';
      ripple.style.animationDelay   = rDelay + 's';
      ripple.style.setProperty('--ripple-scale', rScale);
      container.appendChild(ripple);
      setTimeout(function () { if (ripple.parentNode) ripple.remove(); }, (rDur + rDelay + 0.25) * 1000);
    }

    // --- Splatter droplets flying outward ---
    var numSplatters = Math.floor(rand(5, 13));
    for (var s = 0; s < numSplatters; s++) {
      var sp      = document.createElement('div');
      sp.className = 'hero-splatter';
      var spSize  = rand(2, 9);
      var angle   = (s / numSplatters) * Math.PI * 2 + rand(-0.35, 0.35);
      var dist    = rand(size * 0.5, size * 2.4);
      var dx      = Math.cos(angle) * dist;
      var dy      = Math.sin(angle) * dist;
      var spDur   = rand(0.3, 0.75);
      var spDelay = rand(0.04, 0.18);
      sp.style.width            = spSize + 'px';
      sp.style.height           = spSize + 'px';
      sp.style.left             = 'calc(' + cx + '% - ' + (spSize / 2) + 'px)';
      sp.style.top              = 'calc(' + cy + '% - ' + (spSize / 2) + 'px)';
      sp.style.animationDuration = spDur + 's';
      sp.style.animationDelay   = spDelay + 's';
      sp.style.setProperty('--dx', dx + 'px');
      sp.style.setProperty('--dy', dy + 'px');
      container.appendChild(sp);
      setTimeout(function () { if (sp.parentNode) sp.remove(); }, (spDur + spDelay + 0.25) * 1000);
    }
  }

  // Opening burst — hits right away when the page loads
  for (var i = 0; i < 6; i++) {
    setTimeout(createImpact, i * 180);
  }

  // Ongoing cadence — energetic but not overwhelming
  function scheduleImpact() {
    // ~25 % chance of a quick double-hit (wave crest)
    if (Math.random() < 0.25) {
      createImpact();
      setTimeout(createImpact, rand(80, 200));
    } else {
      createImpact();
    }
    setTimeout(scheduleImpact, rand(350, 950));
  }
  setTimeout(scheduleImpact, 1300);
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
