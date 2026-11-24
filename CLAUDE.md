# CLAUDE.md

Website for **Shen Tours Sri Lanka** (confirmed brand name; the current site trades as "Ceylon Shen
Tours") — tourists browse private Sri Lanka tours and request bookings. Rebuild of
ceylonshentours.com. Planning docs are in `docs/` (start with
`README.md`). Draft 1 is the homepage only: `docs/07-homepage-plan.md`. Phase 0 (foundations) is built; progress is tracked in `docs/08-homepage-dev-phases.md`.

## Stack (see docs/04-tech-stack.md)

Plain HTML (no framework) · Vite · Tailwind CSS v4 · GSAP 3 (ScrollTrigger, SplitText, DrawSVG) ·
Lenis · vanilla JS modules · Bun.

## Commands

`bun run dev` (Vite, http://localhost:5173; the style tile is at `/style-tile.html`) · `bun run build` ·
`bun run preview`. Lint and format are not set up yet. Every new HTML page needs a row in `pages`
(SEO) and an entry in `build.rollupOptions.input`, both in `vite.config.js`.

## Rules

- **Business facts live only in `src/data/business.json`.** Phone, WhatsApp, address, licence
  number, review links. A `null` field renders nowhere. Never invent a placeholder value, review,
  rating, award, drive time, quote or "No.1" claim. `docs/00-business-brief.md` tracks what is
  confirmed.
- **Prices and offers come from `src/data/`.** Never hard-code a price in HTML by hand. Offers
  carry `validFrom`/`validTo` and expired ones never render.
- **SEO is part of every page.** One primary keyword per page (map in `docs/02-seo-strategy.md`),
  one H1, unique title ≤ 60 chars, meta description ≤ 155 chars, canonical, OG image, JSON-LD.
- **Content renders without JavaScript.** Animations add motion to content already visible in
  the HTML. Never hide LCP text behind a JS reveal. No blocking preloader.
- **One Lenis instance** (`src/js/motion.js`). All GSAP work goes through `gsap.matchMedia()`,
  respects `prefers-reduced-motion`, and is simplified on mobile. One module per section in
  `src/js/sections/`, each exporting `init()`.
- **Design tokens win.** Colours, type, spacing, radii, easing and durations come from the
  `@theme` tokens in `src/styles/main.css`. Don't hand-pick values that aren't tokens.
- Performance budget (doc 04): LCP < 2.0 s mobile, CLS < 0.05, JS < 90 KB gzip.
- Images: AVIF/WebP, explicit width/height, descriptive alt text (place + subject).
- Accessibility: keyboard reachable, visible focus, WCAG AA contrast, labelled form fields.
