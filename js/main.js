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
