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
  const IN_OUT_MS = FLIP_MS; // how long a tile takes to flip in or out (raise to slow it down)

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

  // Turn one half of a tile from one angle to another, then resolve
  function turn(half, fromDeg, toDeg, easing) {
    return new Promise(function (resolve) {
      const anim = half.animate(
        [{ transform: 'rotateX(' + fromDeg + 'deg)' }, { transform: 'rotateX(' + toDeg + 'deg)' }],
        { duration: IN_OUT_MS / 2, easing: easing, fill: 'forwards' }
      );
      anim.onfinish = function () { resolve(anim); };
    });
  }

  // Show or hide one still half of a tile (the fold pieces do the moving)
  function setShown(half, shown) {
    half.style.visibility = shown ? '' : 'hidden';
  }

  // A brand-new, empty tile: nothing shows until it flips in
  function makeEmptyTile() {
    const tile = makeTile(' ');
    tile.char = null;
    setShown(tile.top, false);
    setShown(tile.bottom, false);
    tile.el.classList.add('no-line');
    return tile;
  }

  // Flip an empty tile into view as a blank tile:
  // the top half swings up out of the middle line, then the bottom half swings down.
  async function flipIn(tile, delay) {
    await wait(delay);

    const rise = await turn(tile.foldTop, -90, 0, 'ease-out');
    setShown(tile.top, true);
    tile.el.classList.remove('no-line');
    rise.cancel();

    const land = await turn(tile.foldBottom, 90, 0, 'ease-out');
    setShown(tile.bottom, true);
    land.cancel();

    tile.char = ' ';
  }

  // Flip a tile out of view, then remove it:
  // the top half falls into the middle line (like a normal flip),
  // then the bottom half folds up after it.
  async function flipOut(tile, delay) {
    await wait(delay);
    setChar(tile.foldTop, tile.char);
    setChar(tile.foldBottom, tile.char);

    setShown(tile.top, false);
    await turn(tile.foldTop, 0, -90, 'ease-in');

    setShown(tile.bottom, false);
    tile.el.classList.add('no-line');
    await turn(tile.foldBottom, 0, 90, 'ease-in');

    tile.el.remove();
  }

  rows.forEach(function (row, rowIndex) {
    const phrases = row.dataset.flap
      .split('|')
      .map(function (phrase) { return phrase.trim(); })
      .filter(Boolean);
    if (!phrases.length) return;

    // The board always has exactly as many tiles as the phrase it shows
    const texts = phrases.map(function (p) { return p.toUpperCase(); });

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
    for (let i = 0; i < texts[0].length; i++) {
      const tile = makeTile(canAnimate ? ' ' : texts[0][i]);
      tiles.push(tile);
      board.appendChild(tile.el);
    }

    row.textContent = '';
    row.append(label, board);
    row.classList.add('is-flap');

    if (!canAnimate) return;

    // Change the board to a new phrase in one left-to-right wave.
    // Each tile starts a little after the one before it (STAGGER_MS).
    function show(text) {
      const oldCount = tiles.length;

      // Shorter phrase: the extra tiles on the right flip out
      const leaving = tiles.splice(text.length).map(function (tile, j) {
        return flipOut(tile, (text.length + j) * STAGGER_MS);
      });

      // Longer phrase: empty tiles are added on the right, ready to flip in
      while (tiles.length < text.length) {
        const tile = makeEmptyTile();
        board.appendChild(tile.el);
        tiles.push(tile);
      }

      const changing = tiles.map(function (tile, i) {
        const delay = i * STAGGER_MS;
        if (i < oldCount) return spinTo(tile, text[i], delay);
        // A new tile flips in blank, then flips to its letter like the others
        return flipIn(tile, delay).then(function () { return spinTo(tile, text[i], 0); });
      });

      return Promise.all(changing.concat(leaving));
    }

    (async function run() {
      await wait(rowIndex * ROW_DELAY_MS);
      await show(texts[0]);

      let index = 0;
      while (texts.length > 1) {
        await wait(HOLD_MS);
        if (document.hidden) continue; // don't flip while the tab is in the background
        index = (index + 1) % texts.length;
        await show(texts[index]);
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
