/*
  ============================================================
  SCROLL REVEAL
  ============================================================
  Anything in index.html with class="reveal" starts hidden and
  fades/slides in when you scroll down to it.

  To animate a new element, just add the "reveal" class to it.
  The look of the animation lives in styles.css ("SCROLL REVEAL").
  ============================================================
*/
(function () {
  const items = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If the visitor prefers no animation (or the browser is very old),
  // do nothing — everything simply stays visible.
  if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;

  // This class switches on the "hidden until revealed" CSS.
  // It is added here, so if this file ever fails to load, nothing is hidden.
  document.documentElement.classList.add('js');

  const observer = new IntersectionObserver(function (entries) {
    let shownTogether = 0;

    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      observer.unobserve(el); // reveal once, then stop watching

      // Items that arrive on screen together appear one after another
      setTimeout(function () {
        el.classList.add('is-visible');
      }, shownTogether * 120);
      shownTogether++;

      // Once the animation finishes, remove the helper classes so they
      // don't slow down other effects (like the card hover lift).
      el.addEventListener('transitionend', function done(event) {
        if (event.target !== el) return;
        el.removeEventListener('transitionend', done);
        el.classList.remove('reveal', 'is-visible');
      });
    });
  }, {
    threshold: 0.1,                    // 10% of the element is on screen
    rootMargin: '0px 0px -40px 0px'    // ...and it's a little above the bottom edge
  });

  items.forEach(function (el) {
    observer.observe(el);
  });
})();
