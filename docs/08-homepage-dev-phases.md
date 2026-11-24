# 08 — Homepage development phases (Draft 1)

The homepage (doc 07) is built in seven phases. **Each phase ends with a design review**: the
work runs locally, you check it in the browser at phone and desktop width, and the next phase
starts only after you approve it (or after the changes you ask for are made).

Photos and video arrive on their own track (see "Assets" below). Until they are ready, sections use
labelled placeholder blocks with the exact size and crop the final image will have, so layout and
motion can be reviewed without them.

## Tracker

| Phase | What gets built | Sections (doc 07) | Status | Reviewed |
|-------|-----------------|-------------------|--------|----------|
| 0 | Foundations and style tile | — | Approved | 2026-11-24 |
| 1 | Header and hero | 1, 2 | Approved | 2026-11-24 |
| 2 | Signature scroll: zoom, three reasons, the route | 3, 4 | Approved | 2026-11-24 |
| 3 | Tours and where to go | 5, 6 | Approved | 2026-11-24 |
| 4 | Guide, numbers, offers, guest journal | 7, 8, 9, 10 | Approved | 2026-11-24 |
| 5 | How it works, travel basics, FAQ, footer | 11, 12, 13, 14 | Approved | 2026-11-24 |
| 6 | Real images, polish, performance and launch checks | all | Not started | — |

Status values: Not started · In progress · Ready for review · Changes requested · Approved.

---

## Phase 0 — Foundations and style tile

**Build**
- Vite + Tailwind v4 + GSAP + Lenis on Bun; `bun run dev` / `build` / `preview`.
- Design tokens in `src/styles/main.css` (`@theme`): ERA colours, the three stand-in fonts
  (Instrument Serif, Pinyon Script, Archivo wide), type scale, spacing, radii, easing, durations.
- `src/js/motion.js` (one Lenis instance synced to ScrollTrigger, reduced-motion check).
- Data files from doc 00: `business.json`, `tours.json`, `offers.json`, `faqs.json`,
  `destinations.json`, `guides.json`. Unknown facts are `null`.
- Partials: `head-seo`, `header`, `footer` (empty shells), rendered at build time so the page
  works without JavaScript.
- A temporary **style tile** page (`/style-tile.html`, not linked, `noindex`).

**You review:** the style tile. It shows the colour swatches with contrast results, every type
size in each font, the script accent, both button styles, link and focus styles, and one
placeholder image block.

**Done when:** dev server runs; tokens are the only source of colours and fonts; the style tile is
approved.

## Phase 1 — Header and hero (sections 1–2)

**Build**
- Header: rotating badge logo ("Shen Tours Sri Lanka · since 2022"), "Plan my tour" pill,
  WhatsApp link, menu button and full-screen menu, left-edge scroll counter 00→100.
- Hero: H1 "Private Sri Lanka tours with a local driver-guide" with the script accent word,
  Coast / Hills photo toggle, "Get a free quote" and "See tours" buttons, the micro-line
  (airport pickup · English-speaking driver-guide · from $65 pp/day).
- Head SEO: title, meta description, canonical, OG tags, `TravelAgency` + `WebSite` JSON-LD.

**You review:** first impression at 375px and 1440px; type size and line breaks of the H1; the
toggle crossfade; badge rotation and the scroll counter; the menu open and close.

**Done when:** the H1 is visible before any JavaScript runs; the hero has no layout shift; the
menu works with the keyboard.

## Phase 2 — Signature scroll (sections 3–4)

**Build**
- Zoom into the hero photo, then the sky-blue circle grows and carries the arched heading
  "Three reasons to travel with Shen" (just your group · local driver-guides · clear prices).
- The route: wavy line from CMB to Sigiriya, Kandy, Ella, Yala and Galle, drawn on scroll; stops
  pop in; clouds part onto a layered hill-country scene. Only CMB→Sigiriya (≈4h) shows a drive
  time until the owner confirms the rest.
- Mobile gets a shorter, unpinned version of both.

**You review:** scroll speed and feel (Lenis), pin length, the circle reveal, how the route
reads on a phone. This is the phase most likely to need a second pass.

**Done when:** smooth at 60fps on a mid-range phone; reduced motion shows a static map and the
three reasons as plain text.

## Phase 3 — Tours and where to go (sections 5–6)

**Build**
- Pinned list of the five packages, rendered from `tours.json` (name, days/nights, price from,
  best months). The active item swaps the large photo and its facts. Mobile: stacked cards.
- Stair-stepped "Where to go" words with the cut-out flower overlapping, then a horizontal strip
  of the eight destinations.
- `ItemList` JSON-LD for the tours with `Offer` prices.

**You review:** tour list readability and price presentation; the stair type and cut-out; the
destination strip on touch.

**Done when:** no price is typed into the HTML by hand; the strip scrolls with touch, keyboard
and trackpad.

## Phase 4 — Guide, numbers, offers, guest journal (sections 7–10)

**Build**
- Meet your guide: large portrait with mask reveal and the guide cards (years of experience).
  The quote block stays empty until Shashen gives his own words.
- Numbers: 100+ travellers · 90+ tours · 5 local guides · since 2022, counting up once.
- Seasonal offers from `offers.json`; expired offers never render.
- Guest journal: scattered photo cards with numbered captions, the five video testimonials,
  named TripAdvisor quotes linked to the source.

**You review:** the tone of the people sections, the offer cards, the journal layout on a phone.

**Done when:** the expired early-booking offer does not appear; videos load only when played.

## Phase 5 — How it works, travel basics, FAQ, footer (sections 11–14)

**Build**
- How it works: three steps (tell us your dates → we plan the route → we meet you at the
  airport) and the tailor-made teaser.
- Travel basics teasers (best time to visit, visa/ETA) as plain teasers until the guide pages exist.
- FAQ accordion with `FAQPage` JSON-LD.
- Footer: giant WhatsApp number on plum, address, hours, socials, TripAdvisor, legal links.

**You review:** the full page top to bottom for the first time.

**Done when:** the accordion works with the keyboard and without JavaScript (`<details>`); every
fact in the footer comes from `business.json`.

## Phase 6 — Real images, polish, launch checks

**Build**
- Swap placeholders for the approved images and video (AVIF/WebP, sizes, explicit width/height,
  descriptive alt text); credits in `src/images/CREDITS.md`.
- Performance, accessibility and SEO pass; JS-off and reduced-motion pass.

**You review:** the finished homepage on your own phone.

**Done when:** Lighthouse mobile ≥ 95 performance / 100 SEO / 100 accessibility; LCP < 2.0 s;
CLS < 0.05; JS < 90 KB gzip; checked at 375px and 1440px.

---

## Assets (parallel track)

- Sri Lanka-only images and video: finish the search, write `docs/09-asset-list.md` (filename,
  source, size, licence) for approval, then download. Paused until the faster connection is
  available.
- Each phase uses placeholders until its images are approved; Phase 6 swaps any that remain.

## Owner answers that unblock content (any phase)

Drive times beyond CMB→Sigiriya (Phase 2) · Shashen's quote (Phase 4) · offer dates (Phase 4) ·
SLTDA number, legal name, email, domain (Phase 1 SEO / Phase 5 footer) · logo in the new name
(Phase 1) · font licences (any time; a one-line token change).
