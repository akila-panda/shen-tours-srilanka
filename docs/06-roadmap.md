# 06 — Roadmap

## Draft 1 — Homepage (design + foundations)

Goal: a homepage that clearly stands out from every site in doc 01, built on the real stack, so
every later page reuses its pieces.

The full plan is **[doc 07](07-homepage-plan.md)** (references, concept, 14 sections, design
system, SEO, open questions). The build runs in phases with a design review at the end of each:
**[doc 08](08-homepage-dev-phases.md)**.

1. **Design discussion**: finalise palette values, type pairing and photography with the user.
2. Scaffold: plain HTML + Vite + Tailwind v4 + GSAP + Lenis on Bun (doc 04).
3. Design tokens in `src/styles/main.css` (`@theme`).
4. Head partial with SEO (title, meta, canonical, OG) and JSON-LD; `motion.js` (Lenis + GSAP).
5. Header and footer partials; data files from the facts in doc 00.
6. Homepage sections 1–14 from doc 07, one JS module each.
7. Signature scroll moment: the route line from CMB across the island.

**Done when:** Lighthouse mobile ≥ 95 performance / 100 SEO / 100 accessibility; works with
reduced motion and with JS off; reviewed on a real phone.

## Draft 2 — Tours and booking (the money path)

Tours listing + categories with filters, tour detail template, booking request page + Action +
emails, confirmation page, Contact, About, legal pages, 404, sitemap/robots.
**Done when:** a test booking request reaches the owner's inbox and the customer gets a
confirmation, with server-recomputed price.

## Draft 3 — Destinations, experiences, services

Destinations hub (map) + 10–15 destination pages, experience pages, Tailor-made, Private driver,
Airport transfers, Reviews, FAQ. Full internal-link mesh tours ↔ destinations ↔ experiences.

## Draft 4 — Content hub and launch

Guides hub + first 6 guides (doc 03), "day tours from {town}" pages for real pickup towns,
analytics events, Search Console, Google Business Profile link-up, final SEO audit, launch.

## After launch

Rank tracking on the commercial keyword set, monthly guide publishing, review collection,
v2 booking options (doc 05).

## Open decisions before Draft 1

- [x] Stack: plain HTML (Vite + Tailwind + GSAP + Lenis) — doc 04
- [x] Homepage plan — doc 07
- [ ] Open questions in doc 07 (brand name, same domain, photos, drive times, Shashen's quote)
- [ ] Design discussion
