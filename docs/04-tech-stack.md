# 04 — Tech stack

Decided 2026-11-23: **plain HTML, no framework.** Tailwind CSS, GSAP and Lenis are required.
Vite is the build tool (default; see "Alternative" below).

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Pages | Hand-written `.html` files (Vite multi-page). Clean URLs via folders: `tours/index.html` → `/tours/` | Static HTML is ideal for SEO and speed; no framework |
| Shared markup | Header/footer partials via a Vite HTML-include plugin (e.g. `vite-plugin-handlebars`) | One header, one footer, no copy-paste drift |
| Scripts | Vanilla JS (ES modules), one module per section in `src/js/sections/` | Small, explicit, easy to read |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`), tokens in `@theme` in `src/styles/main.css` | Tokens defined once |
| Animation | **GSAP 3** + ScrollTrigger, SplitText, DrawSVGPlugin (all free since 3.13), installed from npm | Scroll storytelling (doc 07) |
| Smooth scroll | **Lenis**, synced to ScrollTrigger | — |
| Data | JSON in `src/data/` (`business.json`, `tours.json`, `offers.json`, `faqs.json`), rendered into the HTML at build time by the template plugin | Facts and prices live in one place; content stays in the HTML for SEO |
| Images | Optimised at build (`vite-plugin-image-optimizer` or pre-exported AVIF/WebP), explicit width/height | LCP and bandwidth |
| Forms (Draft 2) | Serverless function (Vercel/Cloudflare) or a form service, plus WhatsApp handoff | No backend needed for the homepage |
| Hosting | Vercel or Cloudflare Pages | Static + CDN |
| Package manager | **Bun** | Matches the other projects here |
| Quality | Prettier, ESLint, Lighthouse checks | Keep the budget honest |

**Alternative (not chosen unless asked):** pure static with CDN links (Tailwind Play CDN, GSAP and
Lenis from jsDelivr), no build step. Fine for sketching, but the Play CDN is not meant for
production and partials would be copy-pasted into every page.

## Lenis + GSAP wiring (single source of truth)

```js
// src/js/motion.js — imported once from src/js/main.js
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const lenis = reduce ? null : new Lenis({ lerp: 0.1 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
```

Rules:
- One Lenis instance, created in one file.
- Every animation inside `gsap.matchMedia()`; skipped under `prefers-reduced-motion`; simpler on
  mobile.
- Content is visible by default in HTML/CSS; JS sets the "from" state just before animating.
- Modals call `lenis.stop()` / `lenis.start()`; inner scroll areas get `data-lenis-prevent`.
- Anchor links use `lenis.scrollTo()` with a header offset.
- Each section module exports `init()` and only runs if its root element exists.

## Performance budget (homepage, mobile)

| Metric | Budget |
|--------|--------|
| LCP | < 2.0 s (4G) — the hero photo, `fetchpriority="high"` |
| CLS | < 0.05 |
| INP | < 200 ms |
| JS | < 90 KB gzip (GSAP + ScrollTrigger + plugins + Lenis ≈ 55 KB) |
| Fonts | ≤ 2 families + 1 script, `woff2`, subset, preload the display face |
| Preloader | None that blocks content |

## Folder structure

```
shen-tours-srilanka/
├── CLAUDE.md  README.md  docs/
├── index.html                 homepage (Draft 1)
├── partials/                  header.hbs, footer.hbs, head-seo.hbs
├── public/                    favicons, robots.txt, og images, fonts
├── src/
│   ├── data/                  business.json, tours.json, offers.json, faqs.json
│   ├── styles/main.css        Tailwind import + @theme tokens + base layer
│   ├── js/
│   │   ├── main.js            entry: motion.js + section inits
│   │   ├── motion.js          Lenis + GSAP setup
│   │   └── sections/          hero.js, reasons.js, route.js, tours.js, …
│   └── images/                source photos (optimised at build)
├── vite.config.js
└── package.json
```
