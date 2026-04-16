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

/* ---- Hero water splash effect ---- */
(function initHeroSplash() {
  const container = document.querySelector('.hero-splash');
  if (!container) return;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createDrop() {
    const drop = document.createElement('div');
    drop.className = 'hero-drop';

    const size     = rand(7, 28);
    const duration = rand(2.0, 4.2);
    const fall     = rand(20, 60);
    const leftPct  = rand(2, 97);
    const topPct   = rand(4, 84);

    drop.style.width            = size + 'px';
    drop.style.height           = (size * rand(1.1, 1.55)) + 'px';
    drop.style.left             = leftPct + '%';
    drop.style.top              = topPct + '%';
    drop.style.animationDuration = duration + 's';
    drop.style.setProperty('--fall', fall + 'px');

    container.appendChild(drop);
    setTimeout(function () { if (drop.parentNode) drop.remove(); }, (duration + 0.6) * 1000);

    // Add a trailing streak below larger drops
    if (size > 15) {
      const streak = document.createElement('div');
      streak.className = 'hero-streak';
      const streakH   = rand(22, 70);
      const streakDur = duration * rand(0.55, 0.75);
      const streakDel = duration * rand(0.18, 0.32);

      streak.style.height           = streakH + 'px';
      streak.style.left             = leftPct + '%';
      streak.style.top              = 'calc(' + topPct + '% + ' + (size * 1.0) + 'px)';
      streak.style.animationDuration = streakDur + 's';
      streak.style.animationDelay   = streakDel + 's';
      streak.style.setProperty('--fall', (fall * 1.6) + 'px');

      container.appendChild(streak);
      setTimeout(function () { if (streak.parentNode) streak.remove(); }, (duration + 0.9) * 1000);
    }
  }

  // Initial burst so the effect is visible immediately
  for (var i = 0; i < 12; i++) {
    setTimeout(createDrop, i * 110);
  }

  // Ongoing natural rhythm with varied intervals
  function scheduleDrop() {
    createDrop();
    setTimeout(scheduleDrop, rand(160, 580));
  }
  setTimeout(scheduleDrop, 1400);
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
