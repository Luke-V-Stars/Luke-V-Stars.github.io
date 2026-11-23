# Luke Vang | Portfolio

My personal portfolio site, built with plain HTML, CSS, and a little vanilla JavaScript, and hosted on GitHub Pages.

**Live site:** [luke-v-stars.github.io](https://luke-v-stars.github.io)

## What's on the site
- **Hero:** a split-flap board (like an airport departure sign) that spells out my name and flips through roles: Tech Enthusiast, AI Power User, Team Leader, Web Developer.
- **About:** my background, plus a list of skills.
- **Projects:** RFP Project (ServiceNow ticket analysis for a Fortune 500 company), Spotify Playlist 3D Simulation (Three.js), and an NFL & NBA Game Simulator.
- **Contact:** links to email, GitHub, and LinkedIn.

## Features
- Dark "Sailor Blue" theme with soft, blurred color glows in the background
- Frosted-glass project cards with a hover lift
- Split-flap animation on load and fade-in sections as you scroll
- Responsive layout that works from phones up to wide desktop screens
- All motion turns off for visitors who have "reduce motion" turned on
- The page still works if JavaScript is off: the text just shows without the animation
- No frameworks and no build step

## Files
| File | What it does |
| --- | --- |
| `index.html` | Page content: nav, hero, about, projects, contact, footer |
| `styles.css` | All styling. Colors and fonts are the `:root` variables at the top |
| `script.js` | The split-flap board and the scroll-reveal animation |
| `favicon.svg` | The "LV" icon in the browser tab |
| `images/` | Holds the profile photo (`profile.jpg`) |

## Run it locally
No install needed. Open `index.html` in a browser. Edit, save, and refresh to see changes.

## Customizing
- **Text:** edit `index.html`. Search for `REPLACE` to find every editable spot.
- **Split-flap phrases:** change the `data-flap` attribute, with phrases separated by `|`:
  ```html
  <p class="hero-role" data-flap="Tech Enthusiast|AI Power User|Team Leader">Tech Enthusiast</p>
  ```
  Keep each phrase to about 15 characters so it fits on a phone.
- **Profile photo:** save a portrait photo as `images/profile.jpg`. It replaces the "Your photo here" placeholder automatically.
- **Colors:** change the variables under `:root` at the top of `styles.css`.

| Color | Hex | Used for |
| --- | --- | --- |
| Sailor Blue | `#204049` | Page background |
| Butter | `#f8e0b1` | Links, buttons, card titles |
| Mist | `#becec8` | Muted text |
| Seafoam | `#c7dbc4` | Glows, skill chips |
| Fog | `#90a6a9` | Glows |
| Driftwood | `#422c1d` | Text on butter, background glow |

```
The live site updates within 1 to 2 minutes. If you don't see the change, hard-refresh with Ctrl+Shift+R (Cmd+Shift+R on a Mac).

## To do
- [ ] Add a profile photo at `images/profile.jpg`
- [ ] Link each project card to its real repo or demo
- [ ] Finish the call to action in the Contact section
- [ ] Split the About paragraph into shorter paragraphs
