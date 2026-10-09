/* Collections page: active-state scroll-spy for the sticky category pills */
(function () {
  'use strict';
  var pills = document.querySelectorAll('.cat-pill');
  var sections = Array.prototype.map.call(pills, function (pill) {
    var id = pill.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  if (!pills.length || !sections.length) return;

  pills.forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      var id = pill.getAttribute('href').replace('#', '');
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        var offset = document.querySelector('.cat-nav').offsetHeight + 88;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          pills.forEach(function (pill) {
            pill.classList.toggle('is-active', pill.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }
})();
