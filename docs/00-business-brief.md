# 00 — Business brief

## What we know

Source: the client's current site, [ceylonshentours.com](https://ceylonshentours.com/), read
2026-11-23. The new site is assumed to replace it (doc 07, open questions).

- **Brand (decided 2026-11-23): Shen Tours Sri Lanka.** The current site, logo ("CEYLONSHEN
  TOURS"), TripAdvisor and socials use "Ceylon Shen Tours". Tagline in use: "Private Sri Lanka Tours with a
  Local Driver-Guide." Founded 2022.
- **Founder / head guide:** Shashen Bhanuka ("Shen"), 6 yrs. Guides: Ramesh Heshan (5), Dinesh
  Maduranga (5), Chethana Charindu (6), Kaveesha Sham Adithya (6). English-speaking.
- **Base:** 152/5 Weliya North, Minuwangoda 11550 — near Bandaranaike International Airport (CMB).
- **Phone:** +94 779 166 168 · **WhatsApp:** +94 743 717 419 · **Email:** appears to be
  info@ceylonshentours.com (obfuscated on the site — confirm).
- **Hours:** Mon–Fri 9:00–18:00, Sat 9:00–16:00, Sun closed.
- **Stats shown:** 100+ travellers hosted, 90+ tours completed, 5 local guides.
- **Packages** (per person; private A/C car or van + driver-guide; hotels separate):
  Cultural Triangle 5d/4n $375 (Jan–Sep) · Hill Country 6d/5n $390 (Jan–Apr) · South Coast 4d/3n
  $260 (Nov–Apr) · Wildlife Safari 5d/4n $325 (Feb–Jul) · Complete Sri Lanka 10d/9n $650 (Dec–Apr).
  Also: transfers from $25, day trips from $45/day, "from $65 per person per day".
- **From the FAQ on the live site (read 2026-11-24):** car for 1–3 people, van for 4–12; "from
  $65 pp/day" applies to tours of a week or longer; children under 12 are not charged; hotels can be
  booked on request (budget, standard or luxury), priced separately. The 10 FAQs are in
  `src/data/faqs.json`, lightly edited to drop links to pages the new site doesn't have yet.
- **Included:** driver-guide, private A/C vehicle, fuel and parking, airport pickup/drop-off,
  passenger insurance up to LKR 500,000, 24/7 support. **Excluded:** flights and visa (ETA),
  hotels and meals, entrance tickets and safari jeeps, personal expenses and tips.
- **Offers on the live site:** shoulder 15%, early booking 10% (deadline 15 Nov 2026 — expired),
  green season 20% (May–Sep 2027), long stay 10% (14+ days).
- **Reviews:** TripAdvisor listing (2 written reviews on the site) + 5 video testimonials. No
  rating or count shown.
- **Socials:** Facebook, Instagram (shashen_banuka), TikTok (shashenbanuka), TripAdvisor.
- **Product:** private tours inside Sri Lanka for foreign tourists — round tours, day trips,
  airport transfers, tailor-made trips with a driver-guide.
- **Website job:** let a tourist find a tour, trust the operator, and send a booking/reservation
  request (with date, group size and pickup) in under two minutes, on a phone.

## Facts still needed from the owner

Nothing in this list may be invented on the website. Until a fact is confirmed, the page that needs
it shows nothing in its place (no placeholder phone numbers, no fake reviews, no made-up awards).

| Fact | Why it matters | Status |
|------|----------------|--------|
| Base town / pickup area | Local SEO, pickup zones | Known: Minuwangoda (near CMB) |
| Domain name | Canonicals, sitemap, schema `url` | Assumed ceylonshentours.com — **confirm** |
| Brand name to display | Logo, titles, schema | Decided: **Shen Tours Sri Lanka** |
| Logo in the new name | Header badge, favicon, OG image | **Needed** (current logo reads "CEYLONSHEN TOURS") |
| Rename TripAdvisor / Google / socials to the new name? | Consistent name everywhere helps local SEO | **Owner decision** |
| Phone + WhatsApp number | Primary booking channel | Known |
| Email for bookings | Enquiry notifications | **Confirm** |
| SLTDA registration number | The single strongest trust signal for this market | **Needed** (not on current site) |
| Legal business name | `TravelAgency` schema, Google Business Profile | **Needed** |
| Tour list with real itineraries, durations, inclusions, exclusions | Tour pages | Known for 5 packages (Draft 2 needs full day-by-day for all) |
| Prices and currency | Showing prices is a differentiator | Known (USD per person); group-size tiers **needed** |
| Drive times from base (for the homepage route line) | Doc 07 section 4 | Only CMB→Sigiriya ≈4h known — **needed** |
| A quote from Shashen in his own words | Doc 07 section 7 | **Needed** |
| Current offers with exact valid dates | Offers section | **Confirm** (live site shows expired ones) |
| Deposit, payment methods, cancellation policy | Booking page + FAQ | **Needed** |
| Vehicles (car/van/mini-coach) and capacity | Group-size pricing, transfer pages | Known: car 1–3, van 4–12 (live FAQ); group price tiers **needed** |
| Guide languages | Filters, tour facts | **Needed** |
| TripAdvisor / Google Business Profile links and current ratings | Review widgets (show real counts only) | **Needed** |
| Photos (own, not stock) and the driver/guide team | Trust; also image SEO | **Needed** |
| Logo / brand colours, if any exist | Design system (Draft 1) | **Needed** |
| Target markets (UK, EU, India, Australia, China, Russia?) and languages | Keyword market, hreflang later | **Needed** |
| Online payment wanted in v1? (deposit by card) | Decides booking scope — see doc 05 | **Decision** |

## Positioning hypothesis (to confirm)

Small, local, owner-run operator with private vehicles and a known guide — competing on
**transparency (real prices, real itineraries, real reviews)** and **ease (book in minutes,
WhatsApp reply fast)** against small operators with dated sites and large operators that hide
prices behind enquiry forms.
