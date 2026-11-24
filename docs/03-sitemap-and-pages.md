# 03 — Sitemap and pages

Pages are grouped by the draft they ship in (see doc 06). "Template" pages are built once and
filled from content data (doc 05).

## Sitemap

```
Home
├── Tours ─────────────── /tours
│   ├── Day Tours ─────── /tours/day-tours
│   ├── Round Tours ───── /tours/round-tours
│   └── {Tour} ────────── /tours/{slug}          ← template
│       └── Book ──────── /book/{slug}           ← noindex
├── Destinations ──────── /destinations          (interactive map)
│   └── {Place} ───────── /destinations/{place}  ← template
├── Experiences ───────── /experiences/{theme}   ← template
├── Tailor-made ───────── /tailor-made
├── Private driver ────── /private-driver-tours
├── Airport transfers ─── /airport-transfers
├── Day tours from ────── /day-tours-from/{town} ← template
├── Travel guides ─────── /guides
│   └── {Guide} ───────── /guides/{slug}         ← template
├── Reviews ───────────── /reviews
├── About ─────────────── /about
├── FAQ ───────────────── /faq
├── Contact ───────────── /contact
└── Legal ─────────────── /privacy · /terms · /booking-terms
```

**Main nav (desktop):** Tours ▾ · Destinations ▾ · Experiences ▾ · Tailor-made · Guides · About
— plus a persistent **"Book a tour"** button and a WhatsApp icon.
**Mobile:** sticky bottom bar with WhatsApp + "Book" on tour pages.

## Page inventory

| Page | Draft | Primary keyword | Purpose |
|------|-------|-----------------|---------|
| Home | **1** | sri lanka tours / sri lanka holidays | Brand, top tours, trust, route into everything |
| Tours (all) | 2 | sri lanka tour packages | Filterable catalogue |
| Day Tours | 2 | sri lanka excursions | Category |
| Round Tours | 2 | sri lanka holiday tours | Category |
| Tour detail ×N | 2 | per tour | Sell + start booking |
| Book (reservation request) | 2 | — | Convert |
| Booking confirmation | 2 | — | Reassure + WhatsApp handoff |
| Contact | 2 | — | All channels |
| About | 2 | — | Who we are, guide/driver team, SLTDA |
| Destinations hub | 3 | places to visit in sri lanka | Map + grid |
| Destination ×10–15 | 3 | sigiriya, ella, yala… | Rank on place names, list tours |
| Experience ×5–8 | 3 | sri lanka safari, honeymoon, whale watching… | Theme landing |
| Tailor-made | 3 | sri lanka private tours | Plan-your-trip form |
| Private driver tours | 3 | sri lanka private driver | Service page |
| Airport transfers | 3 | colombo airport transfer | Service + quick quote |
| Reviews | 3 | — | Real platform reviews |
| FAQ | 3 | — | Booking, payment, safety, packing |
| Guides hub + first 6 guides | 4 | best time to visit, visa, itineraries… | Top-of-funnel traffic |
| Day tours from {town} | 4 | day tours from colombo/kandy… | Only for real pickup towns |
| Legal ×3 | 2 | — | Required before taking bookings |
| 404 | 2 | — | Recovery |

### First destination set (by search volume, Draft 3)
Sigiriya · Ella · Nuwara Eliya · Yala · Kandy · Galle · Bentota · Dambulla · Udawalawe ·
Mirissa · Hikkaduwa/Unawatuna · Minneriya · Horton Plains · Sinharaja · Adam's Peak.
Trincomalee and Arugam Bay are high volume but only worth a page if Shen Tours goes there.

### First experience set
Safaris · Whale watching · Cultural triangle · Tea country & hill trains · Beaches & river safari ·
Honeymoon · Family. (Ayurveda, surfing only if offered.)

### First guides (Draft 4, ordered by volume)
1. Best time to visit Sri Lanka (weather by month) — 8,100 + 9,900
2. Sri Lanka visa / ETA guide — 8,100
3. Sri Lanka itineraries hub (7 / 10 / 14 / 21 days) — ~1,500 combined
4. Things to do in Sri Lanka — 2,400
5. Is Sri Lanka safe? — 2,400
6. Kandy to Ella train guide — 2,400

## Template anatomy

### Home (Draft 1 — design focus)
1. **Hero** — full-bleed video/photo, one-line promise, search/quick-find (tour type · date ·
   travellers) and a WhatsApp CTA. Text visible on first paint.
2. **Trust strip** — SLTDA no., review score + count (live, real), years operating, languages.
3. **Signature tours** — 4–6 cards: photo, duration, "from" price, rating, one-line hook.
4. **"How do you want to see Sri Lanka?"** — intent tiles (Wildlife · Culture · Hill country ·
   Coast · Honeymoon · Family) → experience pages. (Jetwing-style persona nav.)
5. **The island, scroll-told** — GSAP pinned section: a route drawing across a map of Sri Lanka,
   stopping at destinations with photo reveals. The "stand out" moment.
6. **Day tours vs round tours vs tailor-made** — three-way chooser.
7. **Meet your guide** — real faces, languages, vehicle.
8. **How booking works** — 3 steps: request → we confirm on WhatsApp → pay deposit / pay on day.
9. **Reviews** — real TripAdvisor/Google quotes with names, dates, source.
10. **Guide teasers** — best time to visit, itineraries (internal links to SEO content).
11. **FAQ** (5 questions, `FAQPage`).
12. **Final CTA** + footer (NAP, SLTDA, links, socials, legal).

### Tour detail
Breadcrumb → title (H1) + duration + "from" price + rating → gallery → key facts (duration,
pickup, start time, group type, languages, free cancellation window) → overview → highlights →
**itinerary** (timeline for day tours / day-by-day with overnight for round tours) → map of the
route → included / not included → what to bring → price table by group size → reviews for this
tour → FAQ → related tours. **Sticky booking card** (desktop sidebar / mobile bottom bar): date,
adults/children, pickup, live estimated total, "Request booking", WhatsApp.

### Destination
H1 place name → hero → "Why go" intro → top things to see (cards) → best time to visit → how to
get there / time from base → **tours that visit {place}** → nearby destinations → FAQ.

### Experience
Hero → what it is → where in Sri Lanka (map pins) → matching tours → tips/season → FAQ.

### Guide
H1 → TL;DR box → table of contents → body (with tables, maps, photos) → "turn this into a tour"
CTA block → related guides → author + updated date.

### Booking request
Tour summary → date → adults/children/infants → pickup location (zone list or hotel name) →
name, email, WhatsApp number, country → notes → estimated total + deposit rule → consent →
submit. Confirmation page shows the reference and a "Continue on WhatsApp" button prefilled with
it.
