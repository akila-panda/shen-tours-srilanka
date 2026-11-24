# 01 — Competitor research

Reviewed 2026-11-18: homepage plus a tour page and a contact/booking page on each site, where
reachable. Meta descriptions and JSON-LD could not be inspected with the tools used (page text
only), so "no schema" below means *not visible*, not confirmed absent.

Not fully read: `srilanka.travel` (JS-rendered, title only), `ceylontours.com` tour page (HTTP 500),
`safaritolanka.com` tour listing (rate-limited).

## The three tiers

### Tier A — small local operators (our direct competitors)
dimtourssrilanka.com · chamaratours.com · bentotasrilankatravels.com · bentotatour.com ·
lankaexcursions.com · daytoursrilanka.com · bentotatravelmart.com · safaritolanka.com

| Site | Taxonomy | Price shown? | Booking path | Notable |
|------|----------|--------------|--------------|---------|
| Dim Tours | Day / Round / Wildlife filters, 35 tours | Yes ("From $360") | WhatsApp + email only | Clean `/tours/slug` URLs, SLTDA no. in footer, XML sitemap. One-line itineraries; destination tiles all dead-end to `/tours` |
| Chamara Tours | Experiences + Day tours from Bentota | Yes, but homepage and tour page disagree ($120 vs $125) | Contact form + floating WhatsApp | Good badges ("Free cancellation", "Pickup included"), included/excluded lists, gallery. Typos in titles |
| Bentota SL Travels | One-day / Multi-day / Transfers | No | `/book-now` + contact form | Real Google + TripAdvisor counts via widget. Conflicting contact emails |
| Bentota Tours | Round tours by nights, transfers | No | "Ask questions" form | Day-by-day plans; URLs like `p1.html`; stale copy ("@2023") |
| Lanka Excursions | Packages by length + theme | Yes ("from 750$ per 2 pax") | Third-party form with budget/interests | Single-page site, no tour URLs, itinerary errors (two "Day 8"s) |
| Day Tours SL | Duration then theme | No ("contact for details") | Enquiry; 35% deposit, 14-day free cancellation | Links leak `localhost/wordpress`; review dated 1970 |
| Bentota Travel Mart | One-day / Two-day / Activities | Yes, **live total** | Widget: date, pickup point, adult/child/infant counters | Best booking UX in tier A, but homepage CTAs link to `#` |
| Safari to Lanka | Destination / style / things to do | — | 4-step plan-with-us flow to external CRM | Clear process; footer "© 2009-2017" |

### Tier B — established inbound operators
walkerstours.com · nkartravelhouse.com · tangerinetours.com · aitkenspencetravels.com ·
jetwingtravels.com · ceylontours.com

- Taxonomy by **theme** (cultural, wildlife, beach, honeymoon, ayurveda, adventure), titles carry
  nights/days ("9N/10D").
- Day-by-day itineraries, route maps, inclusions/exclusions, related tours — but **almost never a
  price**. Everything is "Inquire now".
- Strongest trust stacks: SLTDA/SLAITO logos with licence refs (NKAR), awards, "since 1980/50
  years", 24/7 airport desk, sustainability certs (Aitken Spence: GSTC, Travelife).
- Booking: enquiry forms with nights, adults, children, start date (Tangerine); prefilled tour name
  (NKAR); instant confirmation only on fixed seat-in-coach departures (NKAR). Deposits 35–50%.
- Weak spots: dated templates, placeholder images, captchas on enquiry, stale reviews (2017–2019),
  deep `.html` URLs with typos.
- Jetwing's **persona tiles** ("What's your journey?" — Authentic, Adventurous, Barefoot Luxury,
  Following the Wild, Romantic) are the best intent-led navigation in the set.

### Tier C — premium international + content hubs
reddottours.com · lovesrilanka.org · srilanka.travel

- **Red Dot**: the benchmark for itinerary pages — "From $5,990 pp", "14 days (13 nights)", per-day
  blocks with an evocative day title, a "Stay at" hotel card and a "See" list. Named consultants,
  ATOL/ABTOT numbers, dated named reviews, Feefo + TripAdvisor. URL hub:
  `/destinations/sri-lanka/{itineraries|hotels|experiences|destination-guide}/{slug}`.
- **Love Sri Lanka**: the biggest long-tail SEO hub — ~30 destination pages each with "Things to
  do / Attractions / Experiences" grids, planning guides (visa, getting about, budget, packing),
  an "Is Sri Lanka safe?" page. No conversion path at all.

## Patterns everyone shares

1. **Enquiry, not booking.** No site in the set takes an instant online booking for a private tour.
2. **Prices hidden** on most tour pages (tier B almost entirely).
3. **WhatsApp** is the de-facto booking channel for small operators.
4. **No FAQs, no maps, no visible schema** on tier A tour pages.
5. **Destination pages are dead ends** or missing on tier A; only tier C does them properly.
6. **Maintenance rot**: stale copyright years, typos in `<title>`, dead `#` links, placeholder images.

## Where Shen Tours can win

| Gap | Our answer |
|-----|------------|
| Hidden or inconsistent prices | Real "from" price on every card and tour page, from one data source (can't disagree) |
| Enquiry forms feel like a black hole | Reservation request with date, pax counters, pickup and a **live estimated total**, then an instant confirmation screen + WhatsApp handoff with the request prefilled |
| Thin one-line itineraries | Timed itinerary (day tours) / day-by-day (round tours) in the Red Dot pattern |
| Destination tiles dead-end | Real destination pages that rank (Sigiriya, Ella, Yala…) and list the tours that visit them |
| No FAQs/maps/schema | Per-tour FAQ + map + `TouristTrip`/`Product`/`FAQPage` JSON-LD |
| Unverified trust claims ("No.1", "500+ reviews") | Only verifiable trust: SLTDA number, live review counts, named guide with photo |
| Dated, static templates | A design that stands out: editorial photography, GSAP scroll storytelling, Lenis smooth scroll — while staying fast (doc 04) |
| No content hub on tier A | Travel guides that target the high-volume informational searches (doc 02) |
