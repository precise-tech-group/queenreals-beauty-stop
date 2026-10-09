/* ==========================================================================
   Queenreal's Beauty Stop — animations.js
   GSAP + ScrollTrigger driven: hero entrance, parallax, pinned storytelling,
   scale-on-scroll imagery, horizontal scroll galleries.
   Falls back to static (no animation) gracefully if GSAP fails to load or
   the user prefers reduced motion.
   ========================================================================== */
(function () {
  'use strict';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    ScrollTrigger.config({ autoRefresh: true });
    gsap.globalTimeline.timeScale(50); /* collapse any timed sequences instantly */
  }

  /* ---------------- Cinematic hero entrance ---------------- */
  var heroTl = document.querySelector('[data-hero-entrance]');
  if (heroTl) {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-hero-eyebrow]', { opacity: 0, y: 16, duration: 0.7 })
      .from('[data-hero-title] .line > span', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.09 }, '-=0.35')
      .from('[data-hero-sub]', { opacity: 0, y: 16, duration: 0.7 }, '-=0.45')
      .from('[data-hero-cta]', { opacity: 0, y: 16, duration: 0.7 }, '-=0.5')
      .from('[data-hero-visual]', { opacity: 0, scale: 1.08, duration: 1.3, ease: 'power2.out' }, '-=1.1')
      .from('[data-hero-float]', { opacity: 0, y: 24, stagger: 0.12, duration: 0.8 }, '-=0.8');
  }

  /* ---------------- Parallax layers ---------------- */
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('[data-parallax-wrap]') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  /* ---------------- Scale-on-scroll imagery ---------------- */
  document.querySelectorAll('.scale-on-scroll').forEach(function (el) {
    gsap.fromTo(el, { scale: 1.22 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  /* ---------------- Pinned storytelling section ---------------- */
  document.querySelectorAll('.pin-story').forEach(function (section) {
    var panels = section.querySelectorAll('.pin-story-panel');
    var dots = section.querySelectorAll('.pin-story-dot');
    var media = section.querySelectorAll('.pin-story-media img, .pin-story-media video');
    if (!panels.length) return;

    if (window.matchMedia('(min-width: 861px)').matches) {
      panels.forEach(function (panel, i) {
        if (i === 0) return;
        gsap.set(panel, { opacity: 0, y: 24 });
      });
      media.forEach(function (m, i) {
        if (i === 0) return;
        gsap.set(m, { opacity: 0 });
      });

      var st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=' + (panels.length * 70) + '%',
        pin: '.pin-story-pin',
        scrub: 0.4,
        onUpdate: function (self) {
          var idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
          panels.forEach(function (panel, i) {
            gsap.to(panel, { opacity: i === idx ? 1 : 0, y: i === idx ? 0 : 24, duration: 0.4 });
          });
          media.forEach(function (m, i) {
            gsap.to(m, { opacity: i === idx ? 1 : 0, duration: 0.5 });
          });
          dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
        }
      });
    } else {
      /* mobile: simple stacked reveal, no pin */
      panels.forEach(function (p) { p.style.opacity = 1; p.style.transform = 'none'; });
      if (media[0]) media[0].style.opacity = 1;
    }
  });

  /* ---------------- Horizontal scroll section ---------------- */
  document.querySelectorAll('.hscroll').forEach(function (wrap) {
    var track = wrap.querySelector('.hscroll-track');
    if (!track || !window.matchMedia('(min-width: 861px)').matches) return;
    var getDistance = function () { return track.scrollWidth - wrap.clientWidth; };
    gsap.to(track, {
      x: function () { return -getDistance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: function () { return '+=' + getDistance(); },
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });
  });

  /* ---------------- Generic stagger-in groups via GSAP (cards) ---------------- */
  document.querySelectorAll('[data-stagger-gsap]').forEach(function (group) {
    var items = group.children;
    gsap.from(items, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: group,
        start: 'top 85%'
      }
    });
  });

  /* ---------------- Count-free depth tilt on category art (subtle) ---------------- */
  document.querySelectorAll('[data-float]').forEach(function (el) {
    gsap.to(el, {
      y: '+=14',
      duration: 2.6 + Math.random() * 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  });

  ScrollTrigger.addEventListener('refreshInit', function () {});
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
