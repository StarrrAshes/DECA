/* ============================================
   DECA Website — Main JavaScript
   Handles: navigation, scroll animations,
   tabs, form validation, mobile menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Navigation ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Navbar Scroll Shadow ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ---------- Scroll Fade-In Animations ---------- */
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => observer.observe(el));
  }

  /* ---------- Tabbed Content ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      // Update active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show target tab
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === target) {
          content.classList.add('active');
        }
      });
    });
  });

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Validate name
      const name = contactForm.querySelector('#name');
      if (name && name.value.trim().length < 2) {
        showError(name, 'Please enter your full name.');
        isValid = false;
      }

      // Validate email
      const email = contactForm.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate message
      const message = contactForm.querySelector('#message');
      if (message && message.value.trim().length < 10) {
        showError(message, 'Please enter a message (at least 10 characters).');
        isValid = false;
      }

      if (isValid) {
        // Show success message
        contactForm.style.display = 'none';
        const successEl = document.querySelector('.form-success');
        if (successEl) successEl.classList.add('show');
      }
    });
  }

  /**
   * Display an error message under a form field
   * @param {HTMLElement} input - The input element
   * @param {string} msg - Error message to display
   */
  function showError(input, msg) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('error');
      const errorEl = group.querySelector('.form-error');
      if (errorEl) errorEl.textContent = msg;
    }
  }

  /* ---------- Active Nav Highlighting ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navItems.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---------- Smooth anchor scroll offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
