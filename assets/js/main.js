/* ==========================================================================
   Queenreal's Beauty Stop — main.js
   Shared site chrome: nav, mobile drawer, cursor, magnetic buttons,
   scroll progress, back-to-top, floating contact widget, reveal engine.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector('.site-header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------------- Mobile drawer ---------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  if (navToggle && drawer) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      drawer.classList.toggle('is-open', !open);
      document.documentElement.classList.toggle('no-scroll', !open);
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
        document.documentElement.classList.remove('no-scroll');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
        document.documentElement.classList.remove('no-scroll');
        navToggle.focus();
      }
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  var progressBar = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  /* ---------------- Back to top ---------------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 700);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Floating contact widget ---------------- */
  var floatToggle = document.querySelector('.float-toggle');
  var floatPanel = document.querySelector('.float-panel');
  if (floatToggle && floatPanel) {
    floatToggle.addEventListener('click', function () {
      var open = floatPanel.classList.toggle('is-open');
      floatToggle.classList.toggle('is-open', open);
      floatToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!floatPanel.contains(e.target) && !floatToggle.contains(e.target)) {
        floatPanel.classList.remove('is-open');
        floatToggle.classList.remove('is-open');
        floatToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Custom cursor (desktop only) ---------------- */
  if (!isCoarsePointer && !prefersReducedMotion) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      var mouseX = -100, mouseY = -100;
      var ringX = -100, ringY = -100;
      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
      });
      function loop() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
        requestAnimationFrame(loop);
      }
      loop();

      var hoverTargets = 'a, button, .tilt-card, input, textarea, select, [data-cursor-hover]';
      document.addEventListener('mouseover', function (e) {
        if (e.target.closest && e.target.closest(hoverTargets)) ring.classList.add('is-hover');
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target.closest && e.target.closest(hoverTargets)) ring.classList.remove('is-hover');
      });
    }
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!isCoarsePointer && !prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var strength = parseFloat(btn.getAttribute('data-magnetic')) || 0.35;
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - rect.left - rect.width / 2;
        var relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (relX * strength) + 'px,' + (relY * strength) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------------- Generic reveal-on-scroll (IntersectionObserver) ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el, i) {
      var group = el.closest('.stagger');
      if (group) el.style.setProperty('--i', Array.prototype.indexOf.call(group.children, el));
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- 3D tilt cards ---------------- */
  if (!isCoarsePointer && !prefersReducedMotion) {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      var max = 8;
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -max;
        var ry = (px - 0.5) * max;
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  /* ---------------- Lightbox gallery ---------------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    var current = 0;

    function openLightbox(index) {
      current = index;
      var t = triggers[current];
      lbImg.src = t.getAttribute('data-lightbox');
      lbImg.alt = t.getAttribute('data-caption') || '';
      if (lbCaption) lbCaption.textContent = t.getAttribute('data-caption') || '';
      lightbox.classList.add('is-open');
      document.documentElement.classList.add('no-scroll');
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.documentElement.classList.remove('no-scroll');
    }
    function step(dir) {
      current = (current + dir + triggers.length) % triggers.length;
      openLightbox(current);
    }
    triggers.forEach(function (t, i) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(i);
      });
    });
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }

  /* ---------------- Current nav link highlight ---------------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-drawer-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('is-active');
    }
  });
})();
