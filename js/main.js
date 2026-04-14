/* =============================================
   MEDIFIX SKILLS HUB - Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- NAVBAR: scroll effect + mobile menu ---- */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- ACTIVE NAV LINK ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- CONTACT FORM VALIDATION ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fields = {
      name: { required: true, minLength: 2, label: 'Full name' },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email address' },
      phone: { required: false, pattern: /^[\+\d\s\-\(\)]{7,20}$/, label: 'Phone number' },
      subject: { required: true, label: 'Subject' },
      message: { required: true, minLength: 10, label: 'Message' },
    };

    function validateField(name, value) {
      const rule = fields[name];
      if (!rule) return null;
      if (rule.required && !value.trim()) return `${rule.label} is required.`;
      if (value.trim() && rule.minLength && value.trim().length < rule.minLength)
        return `${rule.label} must be at least ${rule.minLength} characters.`;
      if (value.trim() && rule.pattern && !rule.pattern.test(value.trim()))
        return `Please enter a valid ${rule.label.toLowerCase()}.`;
      return null;
    }

    function setFieldState(input, errorMsg) {
      const group = input.closest('.form-group');
      const msgEl = group.querySelector('.error-msg');
      if (errorMsg) {
        group.classList.add('error');
        if (msgEl) msgEl.textContent = errorMsg;
      } else {
        group.classList.remove('error');
        if (msgEl) msgEl.textContent = '';
      }
    }

    // Live validation on blur
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => {
        const err = validateField(input.name, input.value);
        setFieldState(input, err);
      });
      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('error')) {
          const err = validateField(input.name, input.value);
          setFieldState(input, err);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('input, textarea, select').forEach(input => {
        if (!input.name) return;
        const err = validateField(input.name, input.value);
        setFieldState(input, err);
        if (err) valid = false;
      });

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const successMsg = document.getElementById('formSuccess');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        // Simulate async submission
        setTimeout(() => {
          contactForm.reset();
          btn.disabled = false;
          btn.textContent = 'Send Message';
          if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
          }
        }, 1200);
      }
    });
  }

  /* ---- SCROLL REVEAL ANIMATION ---- */
  const revealElements = document.querySelectorAll('.card, .program-card, .team-card, .value-card, .testimonial-card, .two-col');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  /* ---- COUNTER ANIMATION for stats ---- */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-item strong, .hero-stat strong');
  if ('IntersectionObserver' in window && statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent.replace(/[^0-9.]/g, '');
          const target = parseFloat(raw);
          if (!isNaN(target) && target > 0) animateCounter(el, target, 1800);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statsObserver.observe(el));
  }

  /* ---- PROGRAM FILTER (training page) ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card[data-category]');

  if (filterBtns.length && programCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        programCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  /* ---- BACK TO TOP ---- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

})();
