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
  const revealElements = document.querySelectorAll('[data-reveal]');

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
