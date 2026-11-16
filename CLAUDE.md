# CLAUDE.md — Portfolio Working Notes

This file is the running record of our discussions about improving Luke Vang's web portfolio.
Claude Code reads it automatically at the start of each session, so decisions and ideas here carry over.

## Project overview

- Static personal portfolio hosted on **GitHub Pages** (`Luke-V-Stars.github.io`).
- Plain **HTML + CSS + a little vanilla JS** — no build step, no framework. Open `index.html` in a browser to preview.
- Files:
  - `index.html` — page content (nav, hero, about, skills, projects, contact, footer).
  - `styles.css` — all styling. Colors and fonts live in the `:root` variables at the top.
  - `script.js` — scroll-reveal only (elements with `class="reveal"` fade in when scrolled to).
  - `favicon.svg` — the "LV" mark; also used as the nav logo.
- Deploy = commit and push to `main`; GitHub Pages serves it.

## Design system (decided 2026-11-15)

- **Palette** (from Luke's reference image):
  - Sailor Blue `#204049` — page background
  - Mist `#becec8` — muted text
  - Driftwood `#422c1d` — text on butter, dark background glow
  - Butter `#f8e0b1` — accent: links, buttons, card titles
  - Fog `#90a6a9` and Seafoam `#c7dbc4` — background glows, skill chips
- **Dark theme** with blurred color blobs (`.backdrop`) behind **glass panels** — add `class="glass"` to any element.
- **Headings:** Space Grotesk (Google Fonts). Body: system font.
- **Motion:** the hero fades in with CSS; everything else uses `class="reveal"`. All motion is off under `prefers-reduced-motion`.

## Conventions

- Keep it beginner-friendly: comment new CSS/HTML sections the way the existing template does.
- Change colors through the `:root` variables, not hard-coded values.
- Any JavaScript goes in `script.js`, kept small and optional (the page must still work without it).
- No React: considered on 2026-11-15 and skipped because scroll-reveal doesn't need it. Revisit only if Luke asks for the library specifically.
- Check the layout at phone width (the `@media (max-width: 600px)` block) after every visual change.

## Known issues to fix

- [ ] Project links still point to the placeholder `[https://github.com/yourusername/project]`.
- [x] Contact links (Email, GitHub, LinkedIn) fixed — 2026-11-15.
- [x] Typos fixed — 2026-11-15: "involes", "others' skills", "SMP 400" → "S&P 400" (assumed; confirm with Luke), "Service Now" → "ServiceNow", "3d" → "3D".
- [ ] Contact blurb ends with "Please..." — replace with a real call to action.
- [ ] The About paragraph is long; split it into 2–3 shorter paragraphs or a short intro plus bullets.

## UI improvement ideas (backlog)

Ideas are ranked by impact relative to effort. Mark them `[x]` when done and note the date.

### Quick wins (CSS only)
- [x] (2026-11-15) **Stronger visual identity:** pick a distinctive color palette and a display font (e.g. Space Grotesk or Sora for headings, Inter for body text, from Google Fonts). The current mint background with a default blue accent reads as a template.
- [x] (2026-11-15) **Hero upgrade:** larger name, a gradient or animated-gradient text effect, and a subtle background (radial glow, grid, or noise texture).
- [x] (2026-11-15) **Card hover effects:** lift (`transform: translateY(-4px)`), shadow, and an accent border on hover.
- [ ] **Skill chips:** color-code them by category (technical vs. people skills), with a hover state.
- [ ] **Dark mode:** use `prefers-color-scheme` plus redefined `:root` variables.
- [x] (2026-11-15) **Smooth scrolling:** `html { scroll-behavior: smooth; }` for the nav links.
- [x] (2026-11-15) **Frosted sticky nav:** `backdrop-filter: blur()` with a semi-transparent background.

### Medium (a little JS)
- [x] (2026-11-15) **Scroll-reveal animations:** sections fade and slide in using `IntersectionObserver`.
- [ ] **Typewriter tagline:** cycles through roles ("Tech enthusiast", "AI power user", "Team leader").
- [ ] **Active nav highlight:** underline the section that's currently in view.
- [ ] **Theme toggle button:** sun and moon icons, choice saved in `localStorage`.

### Bigger / signature features (tie into the projects)
- [ ] **Three.js hero background:** a slowly rotating particle field or starfield ("Stars" fits the username), reusing skills from the Spotify 3D project.
- [ ] **Project cards with visuals:** a screenshot or GIF for each project, tech-stack tags, and "Live demo" and "Code" buttons.
- [ ] **Interactive demo:** embed a mini version of the NFL/NBA simulator (run 1,000 sims in the browser and show a win-probability bar).
- [ ] **Case-study pages:** one page per project covering the problem, approach, result, and metrics (e.g. "70K ServiceNow tickets → X").
- [ ] **Stats strip:** animated counters such as "70K+ tickets analyzed · 50K sims per game · 3 projects".

## Discussion log

Add newest entries at the top. Format: `YYYY-MM-DD — topic — decision / next step`.

- **2026-11-15** — Redesign pass. Luke supplied a six-color palette and asked for a glass effect, an LV favicon, working contact links, and scroll-in animations. Done: dark Sailor Blue theme with glass panels, `favicon.svg`, `script.js` scroll reveal, contact links fixed. Checked in a headless browser at desktop and 390px phone width. Not committed yet. Still open: project links, typos, the "Please..." blurb.
- **2026-11-15** — Created this file. Reviewed `index.html` and `styles.css`, logged the known issues, and brainstormed the UI backlog above. Next step: Luke picks a direction (palette, fonts, and which signature feature to build first).
