# 05 — Content model and booking flow

## Content data

Stack is plain HTML (doc 04), so content lives as JSON in `src/data/` and is rendered into the
HTML at build time — `business.json`, `tours.json`, `destinations.json`, `offers.json`
(each with `validFrom`/`validTo`; expired offers never render), `faqs.json`, `reviews.json`. The
shapes below are written as TypeScript for readability; they describe the JSON.

All prices are stored as integers in the smallest unit (cents) with an explicit currency, and
formatted by one helper so a card and its tour page can never disagree (a bug seen on a
competitor site).

### `tours`
```ts
{
  slug: string;                       // from filename
  title: string;                      // "Yala Safari from Bentota"
  type: 'day' | 'round' | 'transfer';
  durationHours?: number;             // day tours
  durationDays?: number;              // round tours (nights = days - 1)
  summary: string;                    // card + meta description source (≤ 155 chars)
  heroImage: ImageRef; gallery: ImageRef[];
  destinations: Ref<'destinations'>[];
  experiences: Ref<'experiences'>[];
  highlights: string[];
  itinerary: (
    | { time: string; title: string; body: string; place?: Ref<'destinations'> }      // day tour
    | { day: number; title: string; body: string; overnight?: string; see?: string[] } // round tour
  )[];
  pickup: { zones: string[]; startTime?: string; hotelPickup: boolean };
  pricing: {
    currency: 'USD' | 'EUR' | 'GBP' | 'LKR';
    basis: 'per_person' | 'per_vehicle';
    tiers: { minPax: number; maxPax: number; amount: number }[];   // amount in cents
    childPolicy?: string;
  };
  included: string[]; excluded: string[]; bring?: string[];
  languages: string[];
  cancellation: string;               // shown as a badge when free cancellation applies
  routeMap?: { lat: number; lng: number; label: string }[];
  faqs: { q: string; a: string }[];
  featured: boolean; order: number;
  seo?: { title?: string; description?: string; primaryKeyword: string };
  status: 'draft' | 'published';
}
```

### `destinations`
`slug, name, region, heroImage, intro, thingsToDo[{title, body, image}], bestTime, gettingThere,
travelTimeFromBase, coords, nearby[Ref], faqs[], seo` — tours are found by reverse lookup
(`tours.filter(t => t.destinations.includes(slug))`), never duplicated here.

### `experiences`
`slug, name, intro, heroImage, where[{destination, note}], season, tips[], faqs[], seo` — tours
again by reverse lookup.

### `guides`
`slug, title, description, heroImage, author, publishedAt, updatedAt, tldr, body (MDX),
relatedTours[Ref], relatedGuides[Ref], faqs[]`.

### `reviews`
`author, country, date, rating, text, source ('tripadvisor' | 'google' | 'direct'), sourceUrl,
tour?: Ref` — only real, attributable reviews. Aggregate rating shown = computed from platform
data the owner supplies, never typed in by hand.

### `src/data/business.json`
Name, legal name, SLTDA number, phone, WhatsApp, email, address, coords, socials, review profile
URLs. A field left `null` renders nowhere. No placeholder values ever.

## Booking (reservation request) flow — v1

Every reference site is enquiry-led; we keep that model (it suits private tours with variable
pickup and group size) but make it feel like booking.

```
Tour page ─► sticky card: date · adults · children · pickup ─► live estimated total
   │
   ▼
/book/{slug}  (prefilled from the card)
   name · email · WhatsApp (with country code) · country · hotel/pickup · notes · consent
   │  submit (serverless function: validation, honeypot, rate limit)
   ▼
Server: recompute price from content data (never trust the client total)
   ├─► email to owner (Reply-To = customer)
   ├─► confirmation email to customer (reference no., summary, what happens next)
   └─► (optional) row in a store: Google Sheet / Airtable / Postgres — decide with owner
   ▼
Confirmation page: reference no. + "Continue on WhatsApp" (wa.me link, message prefilled
with reference, tour, date, pax) + what happens next
   ▼
Owner confirms availability on WhatsApp/email ─► deposit or pay-on-day (per owner policy)
```

Also: a site-wide WhatsApp button (`wa.me/{number}?text=` with the current page's tour name
prefilled) and a **Tailor-made** form (dates, nights, adults, children, interests, budget band,
hotel level).

## v2 options (decide later, not in Draft 1–4)

- **Card deposits online**: Stripe Checkout (cards, Apple/Google Pay) or PayHere (Sri Lankan
  gateway) — triggered by the owner after confirming availability, via a payment link, so we
  never take money for a date we can't serve.
- **Availability calendar** with blocked dates.
- **Booking admin** (list, statuses, notes) — only once volume justifies it.
- Channel sync with Viator / GetYourGuide.
