/* ============================================================
   PLANET PLUMBING — script.js
   Vanilla JS · no dependencies
   ============================================================ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  let progress = 0;

  const preloadInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 92);
    if (fill) fill.style.width = progress + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(preloadInterval);
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
      preloader.classList.add('done');
      startHeroReveal();
    }, 450);
  });

  // Fallback in case 'load' never fires (cached images, etc.)
  setTimeout(() => {
    if (!preloader.classList.contains('done')) {
      clearInterval(preloadInterval);
      if (fill) fill.style.width = '100%';
      preloader.classList.add('done');
      startHeroReveal();
    }
  }, 3500);

  /* ---------- HERO HEADLINE REVEAL ---------- */
  function startHeroReveal() {
    if (prefersReduced) return;
    const lines = document.querySelectorAll('.hero__headline .line__inner');
    lines.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 140);
    });
    // Reveal hero eyebrow, sub, actions
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 400 + i * 150);
    });
  }

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    lastScroll = y;
  }, { passive: true });

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ---------- HERO PARALLAX ---------- */
  const heroImg = document.getElementById('heroImg');
  if (heroImg && !prefersReduced) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          heroImg.style.transform = `translateY(${y * 0.25}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-img');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED COUNTERS ---------- */
  const statNumbers = document.querySelectorAll('.stat__number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    if (prefersReduced) { el.textContent = target; return; }
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- PROCESS LINE FILL ---------- */
  const processLine = document.getElementById('processLine');
  const processSection = document.querySelector('.process');
  if (processLine && processSection) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processLine.style.width = '100%';
          processObserver.unobserve(processSection);
        }
      });
    }, { threshold: 0.3 });
    processObserver.observe(processSection);
  }

  /* ---------- WORK FILTERS ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      workItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hidden', !match);
        if (match && !prefersReduced) {
          item.style.animation = 'none';
          void item.offsetWidth;
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        }
      });
    });
  });

  // Lightweight fade-in-up keyframe injection for filter transitions
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(styleTag);

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  workItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- FLOATING WHATSAPP ENTRANCE ---------- */
  const waFloat = document.getElementById('whatsappFloat');
  if (waFloat) {
    setTimeout(() => waFloat.classList.add('show'), 1800);
  }

  /* ---------- CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'name',    err: 'nameError',    test: v => v.trim().length >= 2,        msg: 'Please enter your name.' },
        { id: 'email',   err: 'emailError',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email.' },
        { id: 'phone',   err: 'phoneError',   test: v => /^[\d\s+\-()]{7,}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
        { id: 'service', err: 'serviceError', test: v => v !== '',                        msg: 'Please choose a service.' },
        { id: 'message', err: 'messageError', test: v => v.trim().length >= 8,            msg: 'Please add a short message.' }
      ];

      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.err);
        const group = input.closest('.form-group');
        const ok = f.test(input.value);
        if (!ok) {
          valid = false;
          group.classList.add('invalid');
          errEl.textContent = f.msg;
          errEl.classList.add('show');
        } else {
          group.classList.remove('invalid');
          errEl.textContent = '';
          errEl.classList.remove('show');
        }
      });

      if (valid) {
        formNote.textContent = '✓ Thank you — your enquiry has been received. We will contact you shortly via WhatsApp or phone.';
        formNote.classList.add('show');
        form.reset();
        setTimeout(() => formNote.classList.remove('show'), 7000);
      } else {
        formNote.textContent = 'Please correct the highlighted fields.';
        formNote.style.color = '#ff6b6b';
        formNote.classList.add('show');
        setTimeout(() => {
          formNote.classList.remove('show');
          formNote.style.color = '';
        }, 4000);
      }
    });

    // Live clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group.classList.contains('invalid')) {
          group.classList.remove('invalid');
          const errEl = group.querySelector('.form-error');
          if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
        }
      });
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- SMOOTH ANCHOR SCROLL (offset for fixed nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH + 2;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

})();