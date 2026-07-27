/* ============================================================
   CORPORACIÓN ANDERSON DAVID — main.js
   Navbar scroll · Hamburger · Reveal animations
   ============================================================ */

(function () {
  'use strict';

  /* --- Navbar scroll behaviour ----------------------------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    const SCROLL_THRESHOLD = 60;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
  }

  /* --- Hamburger / Drawer ---------------------------------- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const drawer = document.querySelector('.navbar__drawer');
  const drawerLinks = document.querySelectorAll('.navbar__drawer-nav a');

  if (hamburger && drawer) {
    const toggleDrawer = () => {
      const isOpen = hamburger.classList.toggle('is-open');
      drawer.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeDrawer = () => {
      hamburger.classList.remove('is-open');
      drawer.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !drawer.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* --- Active nav link ------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__nav a, .navbar__drawer-nav a').forEach(link => {
    const linkPath = link.getAttribute('href')?.split('/').pop() || 'index.html';
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- IntersectionObserver reveal ------------------------- */
  /* Incluye los triggers del rediseño Servicios iter.2 (wipe s2 / line-draw s3):
     mismo observer, mismo callback (add .is-visible una sola vez). */
  const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-wipe], [data-draw-route]');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.revealDelay || 0;
            setTimeout(() => {
              el.classList.add('is-visible');
            }, parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show immediately
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* --- Metric counter animation ---------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const suffix = el.dataset.suffix || '';

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  /* --- Smooth scroll for anchor links ---------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();

/* ─── MOTION PATCH — Ag.6 · Altive Solutions · 07/06/2026 ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* A. NAVBAR — BLUR AL SCROLL */
  const siteNav = document.querySelector('.navbar');
  if (siteNav) {
    let ticking = false;
    const updateNav = () => {
      siteNav.classList.toggle('is-scrolled', window.scrollY > 20);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
    }, { passive: true });
    updateNav();
  }

  /* B. INTERSECTION OBSERVER GENÉRICO */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (!entry.target.dataset.revealRepeat) observer.unobserve(entry.target);
      } else if (entry.target.dataset.revealRepeat) {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  ['.metrics-bar', '.diff-list', '.flota-gallery', '.timeline', '.cta-banner', '.footer']
    .forEach(sel => document.querySelectorAll(sel).forEach(el => observer.observe(el)));

  /* B2. FORMULARIO DE CONTACTO — ENVÍO AJAX + REDIRECT (Área 4b)
     El redirect nativo de Formspree (_next) requiere plan de pago, así que en
     plan free enviamos por AJAX (Accept: application/json) y hacemos nosotros el
     redirect a gracias.html al recibir OK. Reply-To lo aporta el campo name="email". */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const statusBox = contactForm.querySelector('.form-status');
    const WHATSAPP = '952 656 820';

    const showError = (message) => {
      if (statusBox) {
        statusBox.textContent = message;
        statusBox.hidden = false;
      }
      if (submitBtn) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (statusBox) statusBox.hidden = true;
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          window.location.href = 'gracias.html';
          return;
        }

        let message = 'No se pudo enviar el formulario. Vuelva a intentarlo o escríbanos por WhatsApp al ' + WHATSAPP + '.';
        try {
          const data = await response.json();
          if (data && Array.isArray(data.errors) && data.errors.length) {
            message = data.errors.map((err) => err.message).join(' ');
          }
        } catch (_) { /* respuesta sin cuerpo JSON */ }
        showError(message);
      } catch (_) {
        showError('Hubo un problema de conexión. Vuelva a intentarlo o escríbanos por WhatsApp al ' + WHATSAPP + '.');
      }
    });
  }

  /* C. METRIC BAR — COUNTER CON DELAY */
  document.querySelectorAll('.metrics-bar').forEach((bar) => {
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('is-visible')) {
          setTimeout(() => {
            bar.querySelectorAll('[data-count]').forEach((el) => {
              const target = parseInt(el.dataset.count, 10);
              const suffix = el.dataset.suffix || '';
              if (!isNaN(target)) animateCount(el, target, suffix);
            });
          }, 280);
          mutObs.disconnect();
        }
      });
    });
    mutObs.observe(bar, { attributes: true, attributeFilter: ['class'] });
  });

  function animateCount(el, target, suffix = '', dur = 1200) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target + suffix; return;
    }
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * eased) + (progress < 1 ? '' : suffix);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(update);
  }

  /* D. COBERTURA — PUNTOS SECUENCIALES */
  const mapWrapper = document.querySelector('.cobertura-map-wrapper');
  if (mapWrapper) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ['#map-piura','#map-trujillo','#map-sierra','#map-lima','#map-sur']
            .forEach((sel, i) => {
              const point = entry.target.querySelector(sel);
              if (point) setTimeout(() => point.classList.add('is-active'), i * 300);
            });
          mapObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -60px 0px' });
    mapObserver.observe(mapWrapper);
  }

  /* E. SERVICIOS iter.2 — PARALLAX celda 01 (código nuevo: scroll continuo, no un toggle).
     Los reveal wipe (s2) / line-draw (s3) usan el IntersectionObserver existente del primer IIFE. */
  const parallaxLayer = document.querySelector('[data-parallax-layer]');
  if (parallaxLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallaxCell = document.querySelector('[data-parallax]');
    let pTicking = false;
    function updateParallax() {
      const rect = parallaxCell.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset = Math.max(-1, Math.min(1, progress)) * 30;
      parallaxLayer.style.transform = `translateY(${offset}px)`;
      pTicking = false;
    }
    window.addEventListener('scroll', () => {
      if (!pTicking) { requestAnimationFrame(updateParallax); pTicking = true; }
    }, { passive: true });
  }

});
