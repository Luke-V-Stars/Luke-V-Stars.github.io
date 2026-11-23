# CLAUDE.md — Portfolio Working Notes

This file is the running record of our discussions about improving Luke Vang's web portfolio.
Claude Code reads it automatically at the start of each session, so decisions and ideas here carry over.

## Project overview

- Static personal portfolio hosted on **GitHub Pages** (`Luke-V-Stars.github.io`).
- Plain **HTML + CSS + a little vanilla JS** — no build step, no framework. Open `index.html` in a browser to preview.
- Files:
  - `index.html` — page content (nav, hero, about, skills, projects, contact, footer).
  - `styles.css` — all styling. Colors and fonts live in the `:root` variables at the top.
  - `script.js` — the split-flap board (`data-flap`) and scroll-reveal (`class="reveal"`).
  - `favicon.svg` — the "LV" browser-tab icon (not shown on the page itself).
- Deploy = commit and push to `main`; GitHub Pages serves it.

## Design system (decided 2026-11-15)

- **Palette** (from Luke's reference image):
  - Sailor Blue `#204049` — page background
  - Mist `#becec8` — muted text
  - Driftwood `#422c1d` — text on butter, dark background glow
  - Butter `#f8e0b1` — accent: links, buttons, card titles
  - Fog `#90a6a9` and Seafoam `#c7dbc4` — background glows, skill chips
- **Dark theme** with soft blurred color blobs (`.backdrop`) in the background.
- **Glass is used sparingly:** only the project cards have `class="glass"`. Luke found glass on the nav, About and Contact panels to be too much (2026-11-15). Don't add more without asking.
- **Nav:** plain, no bar, no background, not sticky. Text "LV" logo on the left. Luke disliked the pill-shaped bar and the favicon shown in a circle.
- **Hero:** left-aligned split-flap board. Tiles are a soft teal (`--flap-tile: #3f5d64`, Sailor Blue blended with Fog) so they blend with the page; Luke rejected dark Driftwood tiles as too contrasting (2026-11-15). Row 1 is the name in butter letters; row 2 rotates "who I am" phrases in seafoam letters. Set through `data-flap="A|B|C"` in `index.html`; keep phrases to about 15 characters. The board always has exactly as many tiles as the current phrase (no blank padding tiles): on a shorter phrase the extra tiles flip blank, then shrink away; on a longer one new tiles grow in blank, then flip (Luke picked this "smooth slide" on 2026-11-23). Tile spacing is a `.flap + .flap` margin, not a flex `gap`, so it can shrink with the tile.
- **Hero photo:** `.hero-photo` frame (portrait 4:5, rounded) loads `images/profile.jpg`. Until that file exists, a dashed "Your photo here" placeholder shows (the `<img>` removes itself on error). On screens 900px and wider it sits to the right of the board; below that it sits above the name. The photo is deliberately the dominant visual (Luke: "the person behind all of the work"): up to about 400px wide on desktop, about 320px on phones, with a butter outline offset behind it. Don't shrink it. `--max-width` was raised from 960px to 1120px to make room.
- **Layout:** nav, hero, sections and footer share one left/right edge (`--max-width` 1120px, `--gutter`). Sections are separated by a hairline and `--section-space`. About is two columns (story left, skills right), stacking on phones.
- **Headings:** Space Grotesk (Google Fonts). Body: system font.
- **Motion:** split-flap on load; everything below uses `class="reveal"`. All motion is off under `prefers-reduced-motion`.

## Conventions

- No em dashes anywhere in the site files (Luke's request, 2026-11-15). Use a comma, colon, period, or "|" instead.
- Keep it beginner-friendly: comment new CSS/HTML sections the way the existing template does.
- Change colors through the `:root` variables, not hard-coded values.
- Any JavaScript goes in `script.js`, kept small and optional (the page must still work without it).
- No React: considered on 2026-11-15 and skipped because scroll-reveal doesn't need it. Revisit only if Luke asks for the library specifically.
- Check the layout at phone width (the `@media (max-width: 600px)` block) after every visual change.

## Known issues to fix

- [ ] **Add the profile photo** at `images/profile.jpg` before publishing; otherwise visitors see the "Your photo here" placeholder.
- [ ] Project links still point to the placeholder `[https://github.com/yourusername/project]`.
- [x] Contact links (Email, GitHub, LinkedIn) fixed — 2026-11-15.
- [x] Typos fixed — 2026-11-15: "involes", "others' skills", "SMP 400" → "Fortune 500" (Luke confirmed 2026-11-23; S&P 400 was a wrong guess), "Service Now" → "ServiceNow", "3d" → "3D".
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

- **2026-11-23** — Split-flap role row no longer pads shorter phrases with blank tiles ("AI Power User" had 2 extras, "Team Leader" 4). Tile count now follows each phrase, with tiles sliding in/out. Verified in headless Chrome at 1280 and 390px: 15 → 13 → 11 → 13 tiles, smooth resize, no layout jump, no errors. Committed and pushed.
- **2026-11-23** — Rewrote `README.md` from the generic starter template into a project README: live link, site sections, features, file table, customizing (flap phrases, photo, palette), deploy steps, repo habits, and a to-do list mirroring the known issues. No em dashes. Committed by Luke.

- **2026-11-15** — Made the hero photo the dominant visual: about 45% larger on desktop, twice as large on phones, butter outline behind it, page widened to 1120px. Verified at 1440, 1280, 900, 899, 390 and 320px. Not committed yet.
- **2026-11-15** — Split-flap tiles changed from Driftwood to soft teal. Added a hero photo area with a placeholder (waiting on Luke's photo at `images/profile.jpg`); name tiles shrink slightly on wide screens to make room. Verified at 1280, 900, 899, 390 and 320px. Not committed yet.
- **2026-11-15** — Second design pass after Luke's feedback: removed the glass nav bar and circled favicon, cut glass back to the project cards only, added the split-flap hero (name plus rotating roles: Tech Enthusiast, AI Power User, Team Leader, Web Developer; Claude picked these from the About text, Luke to confirm), and rebuilt spacing on one shared grid. Also fixed typos and removed em dashes from site files. Verified in a real-time headless browser run at 1280px, 390px and 320px. Not committed yet.
- **2026-11-15** — Redesign pass. Luke supplied a six-color palette and asked for a glass effect, an LV favicon, working contact links, and scroll-in animations. Done: dark Sailor Blue theme with glass panels, `favicon.svg`, `script.js` scroll reveal, contact links fixed. Checked in a headless browser at desktop and 390px phone width. Not committed yet. Still open: project links, typos, the "Please..." blurb.
- **2026-11-15** — Created this file. Reviewed `index.html` and `styles.css`, logged the known issues, and brainstormed the UI backlog above. Next step: Luke picks a direction (palette, fonts, and which signature feature to build first).
