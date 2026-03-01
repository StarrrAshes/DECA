/* ============================================
   DECA Website — Main JavaScript
   Features: navigation, scroll animations,
   tabs, form validation, mobile menu,
   back-to-top, dark mode, counter animation,
   accordion FAQ, ICDC countdown, newsletter,
   competition finder quiz, stagger animations
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
  /* → handled by unified scroll handler below */

  /* ---------- Scroll Fade-In Animations ---------- */
  /* → handled by unified IntersectionObserver in visual showstoppers section */

  /* ---------- Tabbed Content ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === target) content.classList.add('active');
      });
    });
  });

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      const name = contactForm.querySelector('#name');
      if (name && name.value.trim().length < 2) { showError(name, 'Please enter your full name.'); isValid = false; }

      const email = contactForm.querySelector('#email');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError(email, 'Please enter a valid email address.'); isValid = false; }

      const message = contactForm.querySelector('#message');
      if (message && message.value.trim().length < 10) { showError(message, 'Please enter a message (at least 10 characters).'); isValid = false; }

      if (isValid) {
        contactForm.style.display = 'none';
        const successEl = document.querySelector('.form-success');
        if (successEl) successEl.classList.add('show');
      }
    });
  }

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
    if (href === currentPage) link.classList.add('active');
  });

  /* ---------- Smooth anchor scroll offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =============================================
     NEW FEATURES
     ============================================= */

  /* ---------- 1. Back to Top Button ---------- */
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    /* show/hide → handled by unified scroll handler */
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 2. Dark Mode Toggle ---------- */
  const darkToggle = document.querySelector('.dark-toggle');
  if (darkToggle) {
    if (localStorage.getItem('deca-dark') === 'true') {
      document.body.classList.add('dark');
      darkToggle.textContent = '☀️';
    }
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      darkToggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('deca-dark', isDark);
    });
  }

  /* ---------- 3. Stats Counter Animation ---------- */
  const statNumbers = document.querySelectorAll('.stat-item h3');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/^([^0-9]*)([0-9,]+)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const target = parseInt(match[2].replace(/,/g, ''), 10);
    const suffix = match[3];
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(tick);
  }

  /* ---------- 4. Accordion FAQ ---------- */
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- 5. ICDC Countdown ---------- */
  const countdownEl = document.getElementById('icdc-countdown');
  if (countdownEl) {
    const icdcDate = new Date('2026-04-25T09:00:00-04:00');
    function updateCountdown() {
      const now = new Date();
      const diff = icdcDate - now;
      if (diff <= 0) {
        countdownEl.innerHTML = '<span style="color:var(--deca-gold-light);font-weight:600;">ICDC 2026 is happening now!</span>';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      countdownEl.innerHTML =
        '<div class="countdown-unit"><span class="num">' + days + '</span><span class="label">Days</span></div>' +
        '<div class="countdown-unit"><span class="num">' + hours + '</span><span class="label">Hours</span></div>' +
        '<div class="countdown-unit"><span class="num">' + mins + '</span><span class="label">Minutes</span></div>' +
        '<div class="countdown-unit"><span class="num">' + secs + '</span><span class="label">Seconds</span></div>';
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---------- 6. Newsletter Signup ---------- */
  const nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      const msg = nlForm.nextElementSibling;
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (msg) { msg.textContent = '✓ Thanks for subscribing!'; msg.style.color = '#6EE7B7'; msg.classList.add('show'); }
        input.value = '';
      } else {
        if (msg) { msg.textContent = 'Please enter a valid email.'; msg.style.color = '#f87171'; msg.classList.add('show'); }
      }
    });
  }

  /* ---------- 7. Competition Finder Quiz ---------- */
  const quiz = document.getElementById('competition-quiz');
  if (quiz) {
    let step = 0;
    const answers = [];
    const steps = quiz.querySelectorAll('.quiz-step');
    const dots = quiz.querySelectorAll('.quiz-dot');

    quiz.addEventListener('click', (e) => {
      const option = e.target.closest('.quiz-option');
      if (!option) return;

      option.parentElement.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      answers[step] = option.getAttribute('data-value');
      if (dots[step]) dots[step].classList.add('filled');

      setTimeout(() => {
        steps[step].classList.remove('active');
        step++;
        if (step < steps.length - 1) {
          steps[step].classList.add('active');
        } else {
          showQuizResult();
        }
      }, 350);
    });

    const restartBtn = quiz.querySelector('.quiz-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        step = 0;
        answers.length = 0;
        dots.forEach(d => d.classList.remove('filled'));
        steps.forEach(s => s.classList.remove('active'));
        steps[0].classList.add('active');
        quiz.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      });
    }

    function showQuizResult() {
      const resultStep = steps[steps.length - 1];
      const h3 = resultStep.querySelector('h3');
      const p = resultStep.querySelector('p');

      const style = answers[0];
      const cluster = answers[1];
      const experience = answers[2];

      let eventName = '';
      let desc = '';

      if (experience === 'first-year') {
        eventName = 'Principles of Business Administration';
        desc = 'As a first-year member, the Principles events are perfect for you. You\'ll tackle a role-play scenario covering fundamental ' + cluster + ' concepts with a Business Administration Core Exam.';
      } else if (style === 'speaking') {
        eventName = 'Individual Series — ' + capitalize(cluster);
        desc = 'You thrive under pressure! The Individual Series in ' + cluster + ' lets you showcase your knowledge through a role-play with a judge, combined with a ' + cluster + ' cluster exam.';
      } else if (style === 'teamwork') {
        eventName = 'Team Decision Making — ' + capitalize(cluster);
        desc = 'You love collaborating! Team Decision Making in ' + cluster + ' pairs you with a partner to analyze a case study and present strategic recommendations to judges.';
      } else if (style === 'writing') {
        if (cluster === 'marketing') {
          eventName = 'Integrated Marketing Campaign';
          desc = 'You enjoy preparation and research! The Integrated Marketing Campaign lets you create a comprehensive marketing initiative with a pitch deck and oral presentation.';
        } else {
          eventName = 'Business Operations Research';
          desc = 'You\'re methodical and thorough! Business Operations Research lets you conduct in-depth research on a ' + cluster + '-related topic and present your findings.';
        }
      } else {
        eventName = 'Virtual Business Challenge';
        desc = 'You love simulations! The Virtual Business Challenges let you compete online through business simulations in areas like ' + cluster + ', retailing, and more.';
      }

      if (h3) h3.textContent = eventName;
      if (p) p.textContent = desc;
      resultStep.classList.add('active');
      dots.forEach(d => d.classList.add('filled'));
    }

    function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  }

  /* =============================================
     BATCH 2 — 12 MORE FEATURES
     ============================================= */

  /* ---------- 1. Page Loader Spinner ---------- */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 300);
    });
    // Safety fallback
    setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 2500);
  }

  /* ---------- 2. Scroll Progress Bar ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  /* → handled by unified scroll handler */

  /* ---------- 3. Image Blur-Up Lazy Load ---------- */
  const lazyImages = document.querySelectorAll('img.lazy');
  if (lazyImages.length > 0) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.onload = () => img.classList.replace('lazy', 'loaded');
            img.onerror = () => img.classList.replace('lazy', 'loaded');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  /* ---------- 4. Quick Links Speed Dial ---------- */
  const speedDial = document.querySelector('.speed-dial');
  if (speedDial) {
    const toggle = speedDial.querySelector('.speed-dial-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        speedDial.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!speedDial.contains(e.target)) speedDial.classList.remove('open');
      });
    }
  }

  /* ---------- 6. Share / Copy Link Buttons ---------- */
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-section');
      const url = window.location.origin + window.location.pathname + '#' + id;
      navigator.clipboard.writeText(url).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '🔗 Share';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback
        btn.textContent = '✗ Failed';
        setTimeout(() => { btn.textContent = '🔗 Share'; }, 1500);
      });
    });
  });

  /* ---------- 8. Page Transition Fade ---------- */
  const mainContent = document.querySelector('.page-transition');
  // Already applied via CSS class on body content wrappers

  /* ---------- 9. Reading Time Estimate ---------- */
  const readingTimeEl = document.querySelector('.reading-time');
  if (readingTimeEl) {
    const mainText = document.querySelector('main') || document.body;
    const text = mainText.innerText || '';
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / 230));
    const numSpan = readingTimeEl.querySelector('.rt-num');
    if (numSpan) numSpan.textContent = minutes + ' min read';
  }

  /* ---------- 11. Testimonial Carousel ---------- */
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let current = 0;
    let autoTimer = null;

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function startAuto() {
      autoTimer = setInterval(() => showSlide(current + 1), 5000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(current + 1); resetAuto(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { showSlide(i); resetAuto(); });
    });

    if (slides.length > 1) startAuto();
  }

  /* ---------- 12. Preference Banner ---------- */
  const prefBanner = document.querySelector('.pref-banner');
  if (prefBanner && !localStorage.getItem('deca-pref-dismissed')) {
    setTimeout(() => prefBanner.classList.add('show'), 1200);

    const acceptBtn = prefBanner.querySelector('.btn-accept');
    const dismissBtn = prefBanner.querySelector('.btn-dismiss');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('deca-pref-dismissed', 'true');
        localStorage.setItem('deca-pref-accepted', 'true');
        prefBanner.classList.remove('show');
      });
    }
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        localStorage.setItem('deca-pref-dismissed', 'true');
        prefBanner.classList.remove('show');
      });
    }
  }

  /* =============================================
     BATCH 3 — 12 MORE FEATURES
     ============================================= */

  /* ---------- B3-1. Flip Animation on Countdown ---------- */
  // Enhanced: adds flip class when number changes
  const countdownNums = {};
  const origCountdownUpdate = document.getElementById('icdc-countdown');
  if (origCountdownUpdate) {
    const flipObserver = new MutationObserver(() => {
      origCountdownUpdate.querySelectorAll('.num').forEach(num => {
        const key = num.parentElement.querySelector('.label')?.textContent || '';
        const val = num.textContent;
        if (countdownNums[key] !== undefined && countdownNums[key] !== val) {
          num.classList.remove('flip');
          void num.offsetWidth; // reflow
          num.classList.add('flip');
        }
        countdownNums[key] = val;
      });
    });
    flipObserver.observe(origCountdownUpdate, { childList: true, subtree: true, characterData: true });
  }

  /* ---------- B3-2. Table of Contents Sidebar (scroll spy) ---------- */
  const tocLinks = document.querySelectorAll('.toc-sidebar a');
  const tocSections = [];
  if (tocLinks.length > 0) {
    tocLinks.forEach(link => {
      const id = link.getAttribute('href').replace('#', '');
      const section = document.getElementById(id);
      if (section) tocSections.push({ id, el: section, link });
    });
    /* scroll spy → handled by unified scroll handler */
  }

  /* ---------- B3-3. Resource Search/Filter ---------- */
  const searchInput = document.getElementById('resource-search');
  if (searchInput) {
    const cards = document.querySelectorAll('.resource-list .resource-card');
    const noResults = document.querySelector('.no-results-msg');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let visible = 0;
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = !query || text.includes(query);
        card.classList.toggle('hidden-filter', !match);
        if (match) visible++;
      });
      if (noResults) noResults.classList.toggle('show', visible === 0 && query.length > 0);
    });
  }

  /* ---------- B3-4. Confetti on Quiz Result ---------- */
  window.fireConfetti = function() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#003B7B', '#F0A500', '#FFD166', '#0A5EB5', '#6EE7B7', '#f87171'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.8 + 's';
      piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
      const size = 6 + Math.random() * 10;
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : (Math.random() > 0.5 ? '2px' : '0');
      piece.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 3500);
  };

  // Hook confetti into quiz result — patch the existing quiz
  const quizEl = document.getElementById('competition-quiz');
  if (quizEl) {
    const quizObserver = new MutationObserver(() => {
      const lastStep = quizEl.querySelectorAll('.quiz-step');
      const resultStep = lastStep[lastStep.length - 1];
      if (resultStep && resultStep.classList.contains('active') && resultStep.querySelector('.quiz-result')) {
        window.fireConfetti();
        quizObserver.disconnect();
      }
    });
    quizObserver.observe(quizEl, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

  /* ---------- B3-6. Tooltips (initialized from HTML data attributes) ---------- */
  // Tooltips are pure CSS — no JS needed, handled by .tooltip-trigger:hover

  /* ---------- B3-7. Image Lightbox ---------- */
  const lightbox = document.querySelector('.lightbox-overlay');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.getAttribute('data-full') || trigger.src;
        if (lightboxImg) lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---------- B3-8. Typing Effect on Hero ---------- */
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const fullText = typingEl.getAttribute('data-text') || typingEl.textContent;
    typingEl.textContent = '';
    typingEl.style.visibility = 'visible';
    let charIndex = 0;

    function typeChar() {
      if (charIndex < fullText.length) {
        typingEl.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 45);
      } else {
        // Remove cursor after typing completes
        const cursor = typingEl.nextElementSibling;
        if (cursor && cursor.classList.contains('typing-cursor')) {
          setTimeout(() => cursor.style.display = 'none', 1500);
        }
      }
    }
    setTimeout(typeChar, 600);
  }

  /* ---------- B3-9. Quiz Progress Bar ---------- */
  const quizBar = document.querySelector('.quiz-progress-fill');
  if (quizBar && quizEl) {
    const allSteps = quizEl.querySelectorAll('.quiz-step');
    const totalSteps = allSteps.length - 1; // exclude result
    const barObserver = new MutationObserver(() => {
      let activeIdx = 0;
      allSteps.forEach((s, i) => { if (s.classList.contains('active')) activeIdx = i; });
      const pct = activeIdx >= totalSteps ? 100 : ((activeIdx / totalSteps) * 100);
      quizBar.style.width = pct + '%';
    });
    barObserver.observe(quizEl, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

  /* ---------- B3-11. Konami Code Easter Egg ---------- */
  const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        triggerDiamondRain();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerDiamondRain() {
    const container = document.createElement('div');
    container.className = 'diamond-rain';
    document.body.appendChild(container);

    const colors = ['#003B7B', '#F0A500', '#FFD166', '#0A5EB5', '#93c5fd'];
    for (let i = 0; i < 50; i++) {
      const diamond = document.createElement('div');
      diamond.className = 'rain-diamond';
      diamond.style.left = Math.random() * 100 + '%';
      diamond.style.background = colors[Math.floor(Math.random() * colors.length)];
      diamond.style.animationDelay = Math.random() * 2 + 's';
      diamond.style.animationDuration = (2 + Math.random() * 2) + 's';
      const size = 10 + Math.random() * 20;
      diamond.style.width = size + 'px';
      diamond.style.height = size + 'px';
      container.appendChild(diamond);
    }
    setTimeout(() => container.remove(), 5000);
  }

  /* =============================================
     BATCH 4 — 12 MORE FEATURES
     ============================================= */

  /* ---------- B4-1. Section Scroll Dots ---------- */
  const sectionDots = document.querySelector('.section-dots');
  const dotBtns = sectionDots ? sectionDots.querySelectorAll('.section-dot') : [];
  const sectionDotIds = [];
  if (sectionDots) {
    dotBtns.forEach(d => {
      const id = d.getAttribute('data-section');
      if (id) sectionDotIds.push({ id, dot: d, el: document.getElementById(id) });
    });
    /* show/hide + active dot → handled by unified scroll handler */

    dotBtns.forEach(d => {
      d.addEventListener('click', () => {
        const target = document.getElementById(d.getAttribute('data-section'));
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- B4-3. Theme Color Picker ---------- */
  const themePicker = document.querySelector('.theme-picker');
  if (themePicker) {
    const toggle = themePicker.querySelector('.theme-picker-toggle');
    const swatches = themePicker.querySelectorAll('.theme-swatch');

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        themePicker.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!themePicker.contains(e.target)) themePicker.classList.remove('open');
      });
    }

    // Restore saved theme
    const savedTheme = localStorage.getItem('deca-accent');
    if (savedTheme) applyAccent(savedTheme);

    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.getAttribute('data-color');
        applyAccent(color);
        localStorage.setItem('deca-accent', color);
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        showToast('Accent color updated!', 'info');
      });
    });

    function applyAccent(color) {
      const accents = {
        blue: { main: '#003B7B', light: '#0A5EB5', gold: '#F0A500', goldLight: '#FFD166' },
        teal: { main: '#0D6D6E', light: '#14919B', gold: '#F0A500', goldLight: '#FFD166' },
        purple: { main: '#5B21B6', light: '#7C3AED', gold: '#F59E0B', goldLight: '#FCD34D' },
        red: { main: '#991B1B', light: '#DC2626', gold: '#F59E0B', goldLight: '#FCD34D' },
        green: { main: '#166534', light: '#22C55E', gold: '#F0A500', goldLight: '#FFD166' }
      };
      const a = accents[color] || accents.blue;
      document.documentElement.style.setProperty('--deca-blue', a.main);
      document.documentElement.style.setProperty('--deca-blue-light', a.light);
      document.documentElement.style.setProperty('--deca-gold', a.gold);
      document.documentElement.style.setProperty('--deca-gold-light', a.goldLight);
      swatches.forEach(s => s.classList.toggle('active', s.getAttribute('data-color') === color));
    }
  }

  /* ---------- B4-6. Parallax Hero ---------- */
  const heroSection = document.querySelector('.hero.parallax');
  const heroBg = heroSection ? heroSection.querySelector('.hero-bg') : null;
  /* → handled by unified scroll handler */

  /* ---------- B4-7. Toast Notification System ---------- */
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  window.showToast = function(message, type) {
    type = type || 'info';
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  // Patch existing share buttons to use toast
  document.querySelectorAll('.share-btn').forEach(btn => {
    const origClick = btn.onclick;
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-section');
      const url = window.location.origin + window.location.pathname + '#' + id;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'success');
      }).catch(() => {});
    });
  });

  // Patch newsletter to use toast
  const nlFormB4 = document.querySelector('.newsletter-form');
  if (nlFormB4) {
    nlFormB4.addEventListener('submit', () => {
      setTimeout(() => {
        const msg = nlFormB4.nextElementSibling;
        if (msg && msg.classList.contains('show') && msg.style.color !== 'rgb(248, 113, 113)') {
          showToast('Subscribed successfully!', 'success');
        }
      }, 50);
    });
  }

  /* ---------- B4-8. Keyboard Shortcuts Overlay ---------- */
  const shortcutsOverlay = document.querySelector('.shortcuts-overlay');
  if (shortcutsOverlay) {
    document.addEventListener('keydown', (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        shortcutsOverlay.classList.toggle('open');
      }
      if (e.key === 'Escape' && shortcutsOverlay.classList.contains('open')) {
        shortcutsOverlay.classList.remove('open');
      }
    });
    shortcutsOverlay.addEventListener('click', (e) => {
      if (e.target === shortcutsOverlay) shortcutsOverlay.classList.remove('open');
    });

    // Keyboard nav shortcuts
    document.addEventListener('keydown', (e) => {
      if (shortcutsOverlay.classList.contains('open')) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'h' && !e.ctrlKey) window.location.href = 'index.html';
      if (e.key === 'a' && !e.ctrlKey) window.location.href = 'about.html';
      if (e.key === 'r' && !e.ctrlKey) window.location.href = 'resources.html';
      if (e.key === 'e' && !e.ctrlKey) window.location.href = 'events.html';
      if (e.key === 'c' && !e.ctrlKey) window.location.href = 'contact.html';
      if (e.key === 'd' && !e.ctrlKey) {
        const dt = document.querySelector('.dark-toggle');
        if (dt) dt.click();
      }
      if (e.key === 't' && !e.ctrlKey) window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- B4-9. Mobile Swipe on Carousel ---------- */
  const carouselEl = document.querySelector('.testimonial-carousel');
  if (carouselEl) {
    let touchStartX = 0;
    let touchEndX = 0;

    carouselEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        const nextBtn = carouselEl.querySelector(diff > 0 ? '.carousel-next' : '.carousel-prev');
        if (nextBtn) nextBtn.click();
      }
    }, { passive: true });
  }

  /* ---------- B4-11. Character Count on Textarea ---------- */
  const messageField = document.getElementById('message');
  if (messageField) {
    const maxChars = 1000;
    const counter = document.createElement('div');
    counter.className = 'char-count';
    counter.textContent = '0 / ' + maxChars;
    messageField.parentElement.appendChild(counter);

    messageField.addEventListener('input', () => {
      const len = messageField.value.length;
      counter.textContent = len + ' / ' + maxChars;
      counter.classList.remove('warn', 'limit');
      if (len > maxChars * 0.85) counter.classList.add('warn');
      if (len >= maxChars) counter.classList.add('limit');
    });
  }

  /* ---------- B4-12. Auto-Hide Navbar on Scroll ---------- */
  let lastScrollY = window.scrollY;
  const navbarEl = document.querySelector('.navbar');
  /* → handled by unified scroll handler */

  /* =============================================
     BATCH 5 — 12 IMPACTFUL FEATURES
     ============================================= */

  /* ---------- B5-2. Animated Stat Bars ---------- */
  /* stat-bar-fill handled by unified observer below */

  /* ---------- B5-5. Question of the Day ---------- */
  const qotdText = document.querySelector('.qotd-text');
  const qotdCategory = document.querySelector('.qotd-category');
  const qotdBtn = document.querySelector('.qotd-new-btn');
  if (qotdText && qotdBtn) {
    const questions = [
      { q: 'A customer complains that a product they purchased online arrived damaged. As the customer service manager, how would you handle this situation to retain the customer and protect the company\'s reputation?', c: 'Marketing' },
      { q: 'Your team has been tasked with launching a new product in a saturated market. What strategies would you use to differentiate your product and capture market share?', c: 'Marketing' },
      { q: 'A small business owner asks you to analyze their cash flow statement and identify areas where they could reduce expenses without impacting quality. What would you look for?', c: 'Finance' },
      { q: 'You are the front desk manager at a hotel and a guest\'s reservation has been lost during a fully booked weekend. How do you resolve this while maintaining guest satisfaction?', c: 'Hospitality' },
      { q: 'As a new store manager, you notice employee morale is low and turnover is high. What steps would you take in your first 90 days to address these issues?', c: 'Management' },
      { q: 'A client wants to invest $50,000 but has a low risk tolerance and needs access to the funds within 3 years. What investment options would you recommend and why?', c: 'Finance' },
      { q: 'Your restaurant has received several negative online reviews about slow service during peak hours. Develop a plan to improve operations and rebuild the restaurant\'s online reputation.', c: 'Hospitality' },
      { q: 'You are launching an integrated marketing campaign for a local charity event. How would you use social media, email, and traditional media to maximize attendance and donations?', c: 'Marketing' }
    ];

    function showQuestion() {
      const idx = Math.floor(Math.random() * questions.length);
      qotdText.textContent = questions[idx].q;
      if (qotdCategory) qotdCategory.textContent = questions[idx].c;
    }

    qotdBtn.addEventListener('click', showQuestion);
    // Show initial question based on day
    const dayIdx = new Date().getDate() % questions.length;
    qotdText.textContent = questions[dayIdx].q;
    if (qotdCategory) qotdCategory.textContent = questions[dayIdx].c;
  }

  /* ---------- B5-7. Bookmark/Save Events ---------- */
  const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
  const savedPanel = document.querySelector('.saved-events-list');
  let savedEvents = [];
  try { savedEvents = JSON.parse(localStorage.getItem('deca-saved-events') || '[]'); } catch(e) {}

  function renderSaved() {
    if (!savedPanel) return;
    if (savedEvents.length === 0) {
      savedPanel.innerHTML = '<li class="no-saved">No saved events yet. Click the ⭐ button on any event to save it.</li>';
    } else {
      savedPanel.innerHTML = savedEvents.map((name, i) =>
        '<li><span>' + name + '</span><button class="remove-saved" data-idx="' + i + '">✕</button></li>'
      ).join('');
    }
    // Wire remove buttons
    savedPanel.querySelectorAll('.remove-saved').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        savedEvents.splice(idx, 1);
        localStorage.setItem('deca-saved-events', JSON.stringify(savedEvents));
        renderSaved();
        updateBookmarkStates();
        showToast('Event removed', 'info');
      });
    });
  }

  function updateBookmarkStates() {
    bookmarkBtns.forEach(btn => {
      const name = btn.getAttribute('data-event');
      btn.classList.toggle('saved', savedEvents.includes(name));
      btn.textContent = savedEvents.includes(name) ? '⭐ Saved' : '☆ Save';
    });
  }

  bookmarkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-event');
      if (savedEvents.includes(name)) {
        savedEvents = savedEvents.filter(e => e !== name);
        showToast('Removed from saved', 'info');
      } else {
        savedEvents.push(name);
        showToast('Event saved!', 'success');
      }
      localStorage.setItem('deca-saved-events', JSON.stringify(savedEvents));
      updateBookmarkStates();
      renderSaved();
    });
  });

  updateBookmarkStates();
  renderSaved();

  /* ---------- B5-9. Expandable Event Cards ---------- */
  document.querySelectorAll('.card-expand-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card-expandable');
      if (card) card.classList.toggle('expanded');
    });
  });

  /* ---------- B5-11. Checklist with Progress ---------- */
  const checklistItems = document.querySelectorAll('.checklist-items input[type="checkbox"]');
  const checklistFill = document.querySelector('.checklist-progress-fill');
  const checklistText = document.querySelector('.checklist-progress-text');

  // Restore state
  let checklistState = {};
  try { checklistState = JSON.parse(localStorage.getItem('deca-checklist') || '{}'); } catch(e) {}
  checklistItems.forEach((cb, i) => {
    if (checklistState[i]) { cb.checked = true; cb.parentElement.classList.add('done'); }
  });
  updateChecklistProgress();

  checklistItems.forEach((cb, i) => {
    cb.addEventListener('change', () => {
      cb.parentElement.classList.toggle('done', cb.checked);
      checklistState[i] = cb.checked;
      localStorage.setItem('deca-checklist', JSON.stringify(checklistState));
      updateChecklistProgress();
    });
  });

  function updateChecklistProgress() {
    if (!checklistFill || checklistItems.length === 0) return;
    const checked = document.querySelectorAll('.checklist-items input:checked').length;
    const total = checklistItems.length;
    const pct = (checked / total) * 100;
    checklistFill.style.width = pct + '%';
    if (checklistText) checklistText.textContent = checked + ' of ' + total + ' completed';
    if (checked === total && total > 0) {
      if (typeof showToast === 'function') showToast('Checklist complete! You\'re ready to compete! 🏆', 'success');
    }
  }

  const printBtn = document.querySelector('.checklist-print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  /* ---------- B5-12. Getting Started Wizard ---------- */
  const wizard = document.querySelector('.wizard');
  if (wizard) {
    const panels = wizard.querySelectorAll('.wizard-panel');
    const indicators = wizard.querySelectorAll('.wizard-step-indicator');
    let wizardStep = 0;

    function showWizardStep(idx) {
      panels.forEach(p => p.classList.remove('active'));
      indicators.forEach((ind, i) => {
        ind.classList.remove('active', 'done');
        if (i < idx) ind.classList.add('done');
        if (i === idx) ind.classList.add('active');
      });
      panels[idx].classList.add('active');
      wizardStep = idx;
    }

    wizard.querySelectorAll('.wizard-btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (wizardStep < panels.length - 1) showWizardStep(wizardStep + 1);
      });
    });

    wizard.querySelectorAll('.wizard-btn-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        if (wizardStep > 0) showWizardStep(wizardStep - 1);
      });
    });

    showWizardStep(0);
  }

  /* ---------- B5-6. Interactive Diamond (hover events) ---------- */
  const diamondSvg = document.querySelector('.diamond-interactive');
  if (diamondSvg) {
    const tooltip = diamondSvg.querySelector('.diamond-tooltip');
    const points = diamondSvg.querySelectorAll('.diamond-point');
    points.forEach(pt => {
      pt.addEventListener('mouseenter', () => {
        if (tooltip) {
          tooltip.textContent = pt.getAttribute('data-label');
          tooltip.style.left = pt.getAttribute('data-x') + 'px';
          tooltip.style.top = pt.getAttribute('data-y') + 'px';
          tooltip.classList.add('show');
        }
      });
      pt.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.remove('show');
      });
    });
  }

  /* =============================================
     BATCH 6 — 12 IMPACTFUL FEATURES
     ============================================= */

  /* ---------- B6-2. Pomodoro Timer ---------- */
  const pomoDisplay = document.querySelector('.pomodoro-display');
  const pomoRingFill = document.querySelector('.ring-fill');
  if (pomoDisplay) {
    let pomoTime = 25 * 60;
    let pomoTotal = 25 * 60;
    let pomoInterval = null;
    let pomoRunning = false;
    const circumference = 2 * Math.PI * 90;

    if (pomoRingFill) {
      pomoRingFill.style.strokeDasharray = circumference;
      pomoRingFill.style.strokeDashoffset = 0;
    }

    function updatePomoDisplay() {
      const m = Math.floor(pomoTime / 60);
      const s = pomoTime % 60;
      pomoDisplay.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      if (pomoRingFill) {
        const pct = 1 - (pomoTime / pomoTotal);
        pomoRingFill.style.strokeDashoffset = circumference * pct;
      }
    }

    document.querySelectorAll('.pomo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (action === 'start') {
          if (!pomoRunning) {
            pomoRunning = true;
            btn.textContent = '⏸ Pause';
            pomoInterval = setInterval(() => {
              pomoTime--;
              updatePomoDisplay();
              if (pomoTime <= 0) {
                clearInterval(pomoInterval);
                pomoRunning = false;
                btn.textContent = '▶ Start';
                if (typeof showToast === 'function') showToast('Pomodoro complete! Take a break 🎉', 'success');
              }
            }, 1000);
          } else {
            pomoRunning = false;
            clearInterval(pomoInterval);
            btn.textContent = '▶ Start';
          }
        } else if (action === 'reset') {
          clearInterval(pomoInterval);
          pomoRunning = false;
          pomoTime = pomoTotal;
          updatePomoDisplay();
          document.querySelector('[data-action="start"]').textContent = '▶ Start';
        } else if (action === '25' || action === '15' || action === '5') {
          clearInterval(pomoInterval);
          pomoRunning = false;
          pomoTime = parseInt(action) * 60;
          pomoTotal = pomoTime;
          updatePomoDisplay();
          document.querySelector('[data-action="start"]').textContent = '▶ Start';
          document.querySelectorAll('.pomo-btn[data-action]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
    updatePomoDisplay();
  }

  /* ---------- B6-3. Journey Progress Tracker ---------- */
  const journeyChecks = document.querySelectorAll('.journey-check');
  let journeyState = {};
  try { journeyState = JSON.parse(localStorage.getItem('deca-journey') || '{}'); } catch(e) {}

  journeyChecks.forEach((check, i) => {
    if (journeyState[i]) {
      check.classList.add('checked');
      check.textContent = '✓';
      check.closest('.journey-step').classList.add('completed');
    }
    check.addEventListener('click', () => {
      const done = check.classList.toggle('checked');
      check.textContent = done ? '✓' : '';
      check.closest('.journey-step').classList.toggle('completed', done);
      journeyState[i] = done;
      localStorage.setItem('deca-journey', JSON.stringify(journeyState));
    });
  });

  /* ---------- B6-5. Flashcards ---------- */
  const flashcard = document.querySelector('.flashcard');
  if (flashcard) {
    const terms = [
      { term: 'Market Segmentation', def: 'The process of dividing a market into distinct groups of buyers with different needs, characteristics, or behaviors who might require separate products or marketing strategies.' },
      { term: 'ROI (Return on Investment)', def: 'A financial metric that measures the profitability of an investment, calculated by dividing net profit by the cost of the investment, expressed as a percentage.' },
      { term: 'SWOT Analysis', def: 'A strategic planning framework that evaluates Strengths, Weaknesses, Opportunities, and Threats to help organizations make informed business decisions.' },
      { term: 'Revenue Stream', def: 'A source of revenue for a company or organization. It represents the various ways a business earns money from selling goods or services.' },
      { term: 'Competitive Advantage', def: 'A set of unique qualities or capabilities that allow a company to outperform its competitors and generate greater value for the firm and its shareholders.' },
      { term: 'Break-Even Point', def: 'The point at which total revenue equals total costs, meaning the business has neither profit nor loss. Sales beyond this point generate profit.' },
      { term: 'Target Market', def: 'A specific group of potential customers at which a company aims its products and services. Defined by demographics, psychographics, and buying behavior.' },
      { term: 'Gross Profit Margin', def: 'Revenue minus the cost of goods sold, divided by revenue. It indicates how efficiently a company uses its resources to produce and sell products.' },
      { term: 'Supply Chain', def: 'The entire network of entities involved in producing and delivering a product to the end consumer, from raw materials to final delivery.' },
      { term: 'Elevator Pitch', def: 'A brief, persuasive speech (30-60 seconds) that explains a business idea, product, or service in a way that any listener can understand quickly.' }
    ];
    let fcIndex = 0;
    const fcTerm = flashcard.querySelector('.fc-term');
    const fcDef = flashcard.querySelector('.fc-def');
    const fcCounter = document.querySelector('.fc-counter');

    function updateFlashcard() {
      flashcard.classList.remove('flipped');
      setTimeout(() => {
        if (fcTerm) fcTerm.textContent = terms[fcIndex].term;
        if (fcDef) fcDef.textContent = terms[fcIndex].def;
        if (fcCounter) fcCounter.textContent = (fcIndex + 1) + ' / ' + terms.length;
      }, 150);
    }

    flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

    document.querySelectorAll('.fc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dir = btn.getAttribute('data-dir');
        if (dir === 'next') fcIndex = (fcIndex + 1) % terms.length;
        else fcIndex = (fcIndex - 1 + terms.length) % terms.length;
        updateFlashcard();
      });
    });
    updateFlashcard();
  }

  /* ---------- B6-7. Resource Ratings ---------- */
  document.querySelectorAll('.resource-rating').forEach(container => {
    const stars = container.querySelectorAll('.rating-star');
    const countEl = container.querySelector('.rating-count');
    const key = container.getAttribute('data-resource');
    let rating = 0;
    try { rating = parseInt(localStorage.getItem('deca-rating-' + key) || '0'); } catch(e) {}
    updateStars(stars, rating, countEl);

    stars.forEach((star, i) => {
      star.addEventListener('click', () => {
        rating = i + 1;
        localStorage.setItem('deca-rating-' + key, rating);
        updateStars(stars, rating, countEl);
      });
    });
  });

  function updateStars(stars, rating, countEl) {
    stars.forEach((s, i) => {
      s.classList.toggle('active', i < rating);
      s.textContent = i < rating ? '★' : '☆';
    });
    if (countEl && rating > 0) countEl.textContent = rating + '/5';
  }

  /* ---------- B6-11. Competition Level Countdowns ---------- */
  document.querySelectorAll('.level-cd-card').forEach(card => {
    const dateStr = card.getAttribute('data-date');
    if (!dateStr) return;
    const target = new Date(dateStr);
    const daysEl = card.querySelector('.level-days');
    if (!daysEl) return;

    function updateLevelCD() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) { daysEl.textContent = 'Now!'; return; }
      daysEl.textContent = Math.ceil(diff / 86400000);
    }
    updateLevelCD();
    setInterval(updateLevelCD, 60000);
  });

  /* ---------- B6-12. Glossary Search ---------- */
  const glossaryInput = document.querySelector('.glossary-search');
  if (glossaryInput) {
    const items = document.querySelectorAll('.glossary-item');
    glossaryInput.addEventListener('input', () => {
      const q = glossaryInput.value.toLowerCase().trim();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.classList.toggle('hidden-filter', q.length > 0 && !text.includes(q));
      });
    });
  }

  /* ==============================================
     VISUAL SHOWSTOPPERS — POLISHED & CONSOLIDATED
     ============================================== */

  /* --- Unified IntersectionObserver for all scroll-triggered effects --- */
  const unifiedObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Fade-in (legacy)
      if (el.classList.contains('fade-in')) el.classList.add('visible');
      // Spring reveal
      if (el.classList.contains('reveal-up') || el.classList.contains('reveal-scale')) el.classList.add('visible');
      // Scale-in sections
      if (el.classList.contains('scale-in')) el.classList.add('scaled');
      // SVG line art
      if (el.classList.contains('line-art-icon')) el.classList.add('drawn');
      // Split word animations
      if (el.classList.contains('split-words')) el.classList.add('revealed');
      // Card stack spread
      if (el.classList.contains('card-stack')) el.classList.add('spread');
      // Stat bar fill
      if (el.classList.contains('stat-bar-fill')) el.classList.add('animated');

      unifiedObs.unobserve(el);
    });
  }, { threshold: 0.08 });

  // Register all elements with the unified observer
  document.querySelectorAll('.fade-in, .reveal-up, .reveal-scale, .scale-in, .line-art-icon, .split-words, .card-stack, .stat-bar-fill').forEach(el => {
    unifiedObs.observe(el);
  });

  /* --- Apply spring reveal to cards with staggered delay --- */
  document.querySelectorAll('.card-grid .card, .info-card, .spotlight-card').forEach((el, i) => {
    if (!el.classList.contains('reveal-up')) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 0.07) + 's';
      unifiedObs.observe(el);
    }
  });

  /* --- Scale-in sections --- */
  document.querySelectorAll('section.section-padding, section.stats-bar').forEach(section => {
    if (!section.classList.contains('scale-in')) {
      section.classList.add('scale-in');
      unifiedObs.observe(section);
    }
  });

  /* ---------- VS-3. Magnetic Cursor (desktop only) ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn, .speed-dial-toggle, .back-to-top, .dark-toggle').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
        el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- VS-6. Card Glow Following Mouse ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.card, .resource-card, .info-card').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  /* ---------- VS-7. Film Grain Overlay ---------- */
  if (!document.querySelector('.grain-overlay') && window.matchMedia('(min-width: 769px)').matches) {
    const grain = document.createElement('div');
    grain.className = 'grain-overlay';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  }

  /* ---------- VS-10. Spotlight Cursor (desktop only) ---------- */
  if (window.matchMedia('(pointer: fine) and (min-width: 769px)').matches) {
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spotlight);

    let spotlightRaf;
    document.addEventListener('mousemove', (e) => {
      if (spotlightRaf) return;
      spotlightRaf = requestAnimationFrame(() => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
        spotlight.classList.add('active');
        spotlightRaf = null;
      });
    });
    document.addEventListener('mouseleave', () => spotlight.classList.remove('active'));
  }

  /* ---------- VS-11. Split Word Animations ---------- */
  document.querySelectorAll('.split-words').forEach(el => {
    if (el.children.length === 0) {
      const text = el.textContent.trim();
      el.innerHTML = text.split(' ').map(word =>
        '<span class="split-word">' + word + '</span>'
      ).join(' ');
      unifiedObs.observe(el);
    }
  });

  /* ---------- VS-12. Floating Micro Elements (desktop only) ---------- */
  if (window.matchMedia('(min-width: 769px)').matches) {
    document.querySelectorAll('.floating-section').forEach(section => {
      if (section.querySelector('.floating-elements')) return;
      const container = document.createElement('div');
      container.className = 'floating-elements';
      container.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 6; i++) {
        const el = document.createElement('div');
        el.className = 'floating-el';
        const size = 4 + Math.random() * 10;
        el.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (Math.random()*100) + '%;top:' + (Math.random()*100) + '%;--float-dur:' + (12+Math.random()*12) + 's;animation-delay:-' + (Math.random()*12) + 's;';
        container.appendChild(el);
      }
      section.style.position = 'relative';
      section.prepend(container);
    });
  }

  /* ---------- UNIFIED SCROLL HANDLER (replaces 8 separate listeners) ---------- */
  let scrollRaf = null;
  window.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = docHeight > 0 ? scrollY / docHeight : 0;

      // Navbar shadow
      if (navbar) navbar.classList.toggle('scrolled', scrollY > 20);

      // Back to top
      if (backBtn) backBtn.classList.toggle('show', scrollY > 400);

      // Scroll progress bar
      if (progressBar) progressBar.style.width = (scrollPct * 100) + '%';

      // Auto-hide navbar
      if (navbarEl) {
        if (scrollY > 200 && scrollY > lastScrollY) {
          navbarEl.classList.add('nav-hidden');
        } else {
          navbarEl.classList.remove('nav-hidden');
        }
        lastScrollY = scrollY;
      }

      // Parallax hero
      if (heroBg && scrollY < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
      }

      // Section dots
      if (sectionDots && sectionDotIds.length > 0) {
        sectionDots.classList.toggle('show', scrollY > 300);
        const scrollPos = scrollY + window.innerHeight / 3;
        let activeId = sectionDotIds[0].id;
        sectionDotIds.forEach(({ id, el }) => { if (el && el.offsetTop <= scrollPos) activeId = id; });
        dotBtns.forEach(d => d.classList.remove('active'));
        const ad = sectionDots.querySelector('[data-section="' + activeId + '"]');
        if (ad) ad.classList.add('active');
      }

      // TOC scroll spy
      if (tocSections.length > 0) {
        const sp = scrollY + 120;
        let aid = tocSections[0].id;
        tocSections.forEach(({ id, el }) => { if (el.offsetTop <= sp) aid = id; });
        tocLinks.forEach(l => l.classList.remove('active'));
        const al = document.querySelector('.toc-sidebar a[href="#' + aid + '"]');
        if (al) al.classList.add('active');
      }

      // Hue shift (subtle)
      document.documentElement.style.setProperty('--hue-shift', (scrollPct * 10) + 'deg');

      scrollRaf = null;
    });
  }, { passive: true });

  /* ---------- VS-14. Card Stack Effect ---------- */
  document.querySelectorAll('.card-stack').forEach(stack => {
    stack.querySelectorAll('.card').forEach(c => c.classList.add('stacked'));
    unifiedObs.observe(stack);
  });

  /* ---------- 3D Tilt on Cards (desktop only) ---------- */
  if (window.matchMedia('(pointer: fine) and (min-width: 769px)').matches) {
    document.querySelectorAll('.card, .info-card, .spotlight-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(1000px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

});
