/*
  ============================================================
  PORTFOLIO SCRIPTS
  ============================================================
  1. SPLIT-FLAP BOARD: the flipping letter tiles at the top of the page
  2. SCROLL REVEAL:    sections fade in as you scroll down to them

  The page still works if this file fails to load: the name and
  role show as normal text and nothing is hidden.
  ============================================================
*/

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
  ------------------------------------------------------------
  1. SPLIT-FLAP BOARD
  ------------------------------------------------------------
  Any element in index.html with a data-flap="..." attribute
  becomes a row of flipping tiles, like an airport departure board.

    data-flap="Luke Vang"            shows one phrase
    data-flap="First|Second|Third"   rotates through several phrases

  Keep each phrase to about 15 characters so it fits on a phone.
  ------------------------------------------------------------
*/
(function () {
  const rows = document.querySelectorAll('[data-flap]');
  if (!rows.length) return;

  const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // the order the tiles flip through
  const FLIP_MS = 60;       // how long one flip takes (lower = faster)
  const STAGGER_MS = 30;    // delay before each next tile starts
  const HOLD_MS = 3200;     // how long a phrase stays before the next one
  const ROW_DELAY_MS = 500; // each row starts this much later than the one above

  const canAnimate = !reduceMotion && 'animate' in Element.prototype;

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // One half of a tile (top or bottom) showing one character
  function makeHalf(className, char) {
    const half = document.createElement('span');
    half.className = 'flap-half ' + className;
    const letter = document.createElement('span');
    letter.textContent = char;
    half.appendChild(letter);
    return half;
  }

  function setChar(half, char) {
    half.firstChild.textContent = char;
  }

  // A tile is four pieces: the fixed top and bottom halves,
  // plus two "fold" pieces that do the actual flipping.
  function makeTile(char) {
    const el = document.createElement('span');
    el.className = 'flap';
    const tile = {
      el: el,
      char: char,
      top: makeHalf('flap-top', char),
      bottom: makeHalf('flap-bottom', char),
      foldTop: makeHalf('flap-fold flap-fold-top', char),
      foldBottom: makeHalf('flap-fold flap-fold-bottom', char)
    };
    el.append(tile.top, tile.bottom, tile.foldTop, tile.foldBottom);
    return tile;
  }

  // Flip a tile forward by one character
  function flipOnce(tile, next) {
    return new Promise(function (resolve) {
      setChar(tile.foldTop, tile.char);   // old letter falls away...
      setChar(tile.foldBottom, next);     // ...new letter lands
      setChar(tile.top, next);            // new letter is waiting behind the fold

      const fall = tile.foldTop.animate(
        [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }],
        { duration: FLIP_MS / 2, easing: 'ease-in' }
      );

      fall.onfinish = function () {
        const land = tile.foldBottom.animate(
          [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }],
          { duration: FLIP_MS / 2, easing: 'ease-out', fill: 'forwards' }
        );

        land.onfinish = function () {
          setChar(tile.bottom, next);
          land.cancel();
          tile.char = next;
          resolve();
        };
      };
    });
  }

  // Keep flipping a tile through the alphabet until it shows the target
  async function spinTo(tile, target, delay) {
    await wait(delay);

    if (CHARS.indexOf(target) === -1) {
      // A character that isn't in CHARS (like a number): flip straight to it
      if (tile.char !== target) await flipOnce(tile, target);
      return;
    }

    let i = CHARS.indexOf(tile.char);
    while (tile.char !== target) {
      i = (i + 1) % CHARS.length;
      await flipOnce(tile, CHARS[i]);
    }
  }

  rows.forEach(function (row, rowIndex) {
    const phrases = row.dataset.flap
      .split('|')
      .map(function (phrase) { return phrase.trim(); })
      .filter(Boolean);
    if (!phrases.length) return;

    const length = Math.max.apply(null, phrases.map(function (p) { return p.length; }));
    const padded = phrases.map(function (p) { return p.toUpperCase().padEnd(length, ' '); });

    // Screen readers get the plain text; the tiles are decoration.
    const label = document.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = phrases.join(', ');

    const board = document.createElement('span');
    board.className = 'flap-tiles';
    board.setAttribute('aria-hidden', 'true');

    // Tiles start blank and flip to the text. With animation turned off,
    // they simply start on the first phrase.
    const tiles = [];
    for (let i = 0; i < length; i++) {
      const tile = makeTile(canAnimate ? ' ' : padded[0][i]);
      tiles.push(tile);
      board.appendChild(tile.el);
    }

    row.textContent = '';
    row.append(label, board);
    row.classList.add('is-flap');

    if (!canAnimate) return;

    function show(text) {
      return Promise.all(tiles.map(function (tile, i) {
        return spinTo(tile, text[i], i * STAGGER_MS);
      }));
    }

    (async function run() {
      await wait(rowIndex * ROW_DELAY_MS);
      await show(padded[0]);

      let index = 0;
      while (padded.length > 1) {
        await wait(HOLD_MS);
        if (document.hidden) continue; // don't flip while the tab is in the background
        index = (index + 1) % padded.length;
        await show(padded[index]);
      }
    })();
  });
})();

/*
  ------------------------------------------------------------
  2. SCROLL REVEAL
  ------------------------------------------------------------
  Anything in index.html with class="reveal" starts hidden and
  fades/slides in when you scroll down to it.

  To animate a new element, just add the "reveal" class to it.
  The look of the animation lives in styles.css ("SCROLL REVEAL").
  ------------------------------------------------------------
*/
(function () {
  const items = document.querySelectorAll('.reveal');

  // If the visitor prefers no animation (or the browser is very old),
  // do nothing, and everything simply stays visible.
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
