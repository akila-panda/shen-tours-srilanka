# 07 — Homepage plan (Draft 1)

Locked 2026-11-23. Only the homepage is in scope for Draft 1. Nothing here may state a fact that is
not in `src/data/business.json` (see doc 00).

## References and what each one gives us

| Site | Role | What we take |
|------|------|--------------|
| [era-residence.com](https://www.era-residence.com/) | **Main design reference** | Tall thin high-contrast serif display + script accent + wide small-caps sans; rotating circular logo badge; left-edge scroll counter; scroll-driven zoom into the hero photo; "By day / By night" image toggle; circle reveal carrying arched heading text; stair-stepped giant words with a cut-out plant overlapping; a wavy travel-time line followed by clouds parting onto mountains; pinned list where each item swaps the photo; giant phone number footer on a deep colour. (Built on Webflow + GSAP + Lenis.) |
| [ceylonshentours.com](https://ceylonshentours.com/) | **Content source** (the client's current site) | Business facts, 5 packages, inclusions/exclusions, guides, stats, offers, FAQ, testimonials, section list |
| [dimtourssrilanka.com](https://dimtourssrilanka.com/) | Content pattern | Tour cards with "from" price, Day/Round/Wildlife split, WhatsApp-first booking |
| [insideasiatours.com/sri-lanka](https://www.insideasiatours.com/sri-lanka) | SEO content order | H1 "Holidays to Sri Lanka" → photo collage → itineraries → experiences → destinations → planning (best time, things to do, food, culture) → FAQ → why book → speak to a specialist |
| [thepekoetrail.org](https://thepekoetrail.org/) | Inspiration | Tea-green palette, documentary photos of real people, stat tiles |
| [fitzroy-travel.com](https://fitzroy-travel.com/) | Inspiration | Large expert quote with portrait; condensed caps with one highlighted word |
| [hedwigtravel.com](https://hedwigtravel.com/) (Awwwards) | Inspiration | Scattered "travel journal" photos with roman-numeral captions; four-corner nav |
| [columbus-travel.com](https://columbus-travel.com/) (Awwwards) | Inspiration | Hero photo inset in a frame; "Plan your trip" pill with arrow circle; story told as a flight through clouds |

## Concept — "The journey starts at arrivals"

Shen's base (Minuwangoda) is about 20 minutes from Colombo airport. The homepage tells the trip in
order: you land at CMB, your guide meets you, the road unwinds across the island, you head home.
Every ERA-style effect has a narrative job, not a decorative one.

## Section order

| # | Section | Reference | Content (all from the current site unless noted) | Motion |
|---|---------|-----------|--------------------------------------------------|--------|
| 1 | **Header** | ERA, Columbus | Rotating badge logo ("Shen Tours Sri Lanka · since 2022"), "Plan my tour" pill, WhatsApp, menu; left-edge scroll counter 00→100 | Badge rotates with scroll velocity; counter tied to progress |
| 2 | **Hero** | ERA, Columbus | H1 "Private Sri Lanka tours with a local driver-guide" (SEO phrase, not the brand name); script accent word; **Coast / Hills** toggle in place of By day / By night; "Get a free quote" + "See tours"; micro-line: airport pickup · English-speaking driver-guide · from $65 pp/day | Line-by-line text reveal; toggle crossfades two photos |
| 3 | **Zoom → Three reasons** | ERA | "Three reasons to travel with Shen": just your group, no strangers · local driver-guides · clear prices | Scroll scales into the photo; a circle grows (clip-path) carrying an arched heading |
| 4 | **The route** (signature) | ERA | "From arrivals to anywhere": wavy line CMB → Sigiriya (≈4h, stated on current site) → Kandy → Ella → Yala → Galle with drive times | Path draws on scroll (DrawSVG); stops pop in; clouds part onto a layered hill-country parallax. **Drive times other than CMB→Sigiriya need the owner's confirmation.** |
| 5 | **Tours** | ERA pinned list | 5 packages: Cultural Triangle 5d $375 · Hill Country 6d $390 · South Coast 4d $260 · Wildlife Safari 5d $325 · Complete Sri Lanka 10d $650 (per person, vehicle + driver-guide, hotels separate); best months | Section pins; active list item swaps the big photo and its facts |
| 6 | **Where to go** | ERA stair type, InsideAsia | Stair-stepped words with a cut-out frangipani/tea leaves overlapping; horizontal strip of the 8 destinations (Colombo, Kandy, Galle, Sigiriya, Ella, Mirissa, Jaffna, Arugam Bay) | Words drift at different speeds; cut-out parallax; horizontal scroll strip |
| 7 | **Meet your guide** | Fitzroy | Large quote from Shashen Bhanuka with portrait (quote text needs the owner's words); guide cards with years of experience | Portrait mask reveal |
| 8 | **Numbers** | Pekoe Trail | 100+ travellers · 90+ tours · 5 local guides · since 2022 | Count-up once |
| 9 | **Seasonal offers** | current site | Offers rendered from data with `validFrom`/`validTo`; expired offers never render (the live site currently shows expired ones) | Simple stagger |
| 10 | **Guest journal** | Hedwig | Scattered photos + the 5 video testimonials with numbered captions; TripAdvisor quotes (named, linked) | Loose parallax per card |
| 11 | **How it works** | current site, doc 05 | Tell us your dates → we plan the route → we meet you at the airport; tailor-made request teaser | Steps reveal |
| 12 | **Travel basics** | InsideAsia | Teasers to guides: best time to visit, visa/ETA (8–10k searches/month each) — link targets are Draft 4 pages, so show as plain teasers until they exist | — |
| 13 | **FAQ** | current site | The 9 existing questions; `FAQPage` JSON-LD | Accordion |
| 14 | **Footer** | ERA | Giant WhatsApp number on the deep night colour; address, hours, socials, TripAdvisor, legal | Number splits in |

## Design system — decided 2026-11-23: use ERA Residence's colours and fonts

Values read from era-residence.com's computed styles.

**Colours**

| Token | Hex | ERA use | Our use |
|-------|-----|---------|---------|
| `--color-ink` | `#17233B` | Navy: headings, text, lines | Headings, body text, nav |
| `--color-paper` | `#F3F3EC` | Cream page background | Main background |
| `--color-sky` | `#B5CEDB` | Powder blue section bands, circle reveal | "Three reasons" circle, route section band |
| `--color-plum` | `#340C24` | Footer with the giant phone number | Footer with the giant WhatsApp number |
| `--color-white` | `#FFFFFF` | Text over photos | Text over photos |
| `--color-bloom` | magenta from the bougainvillea photos (exact value picked from our cut-out image) | Imagery only | Cut-out frangipani/bougainvillea; never text |

ERA has no strong action colour; buttons are underlined serif text. We keep that look and add
one solid button for "Get a free quote" in ink on paper (or paper on photos). Every text/background
pair is checked to WCAG AA.

**Fonts**

| Role | ERA font | Licence | Free stand-in if no licence |
|------|----------|---------|-----------------------------|
| Display (tall condensed high-contrast serif, caps) | Ambroise Francois Std (`ambroise-francois-std`) | Adobe Fonts (needs an Adobe Creative Cloud kit) | Instrument Serif |
| Script accent | Sloop Script Three (`sloop-script-three`) | Adobe Fonts | Pinyon Script |
| Labels and body (wide sans, small caps, tracked) | Maison Neue Extended | Commercial (Milieu Grotesque) | Archivo at 125% width |

Using ERA's exact fonts needs an Adobe Fonts kit (Ambroise, Sloop) and a Maison Neue licence —
open question below. Fonts are wired through tokens, so swapping stand-ins for the licensed faces
is a one-line change.
- **Photography:** real guests, guides and roads over stock; warm, documentary.
- **Motion:** GSAP + ScrollTrigger + SplitText + DrawSVG, Lenis. No blocking preloader. All text in
  the HTML. Everything inside `gsap.matchMedia()`; `prefers-reduced-motion` gets static layouts.
  Mobile gets simplified versions of sections 3–6 (no long pins).

## Homepage SEO

- Title: "Private Sri Lanka Tours with a Driver-Guide | Shen Tours" (56 chars). Full brand
  "Shen Tours Sri Lanka" goes in `og:site_name` and the `TravelAgency` schema `name`, with
  "Ceylon Shen Tours" as `alternateName` so the old name's reviews and searches still connect.
- One H1 (section 2). H2s per section, using target phrases where natural: "Sri Lanka tour
  packages", "Where to go in Sri Lanka", "Frequently asked questions".
- JSON-LD: `TravelAgency` (NAP from data; no licence number until supplied), `WebSite`,
  `ItemList` of the 5 tours with `Offer` prices, `FAQPage`. No `AggregateRating` until real
  counts are supplied.
- If this replaces ceylonshentours.com: 301 map every old URL (e.g. `/packages/cultural-triangle`)
  before launch.

## Open questions (defaults in use until answered)

| Question | Default used |
|----------|--------------|
| Brand name | **Decided: Shen Tours Sri Lanka** (2026-11-23). Needs a logo in the new name; the current one reads "CEYLONSHEN TOURS" |
| Does the new site replace ceylonshentours.com? | **Yes** — plan the 301 map |
| Build setup | **HTML + Vite** (doc 04) |
| Fonts: Adobe Fonts kit + Maison Neue licence available? | Free stand-ins (Instrument Serif, Pinyon Script, Archivo) until confirmed |
| Photos and video for Draft 1 (internal) | Client's own images from ceylonshentours.com + free-licence stock (Unsplash, Pexels, Pixabay); every file logged in `src/images/CREDITS.md` with source and licence, swapped for the owner's originals before launch |
| Drive times for the route | Only CMB→Sigiriya ≈4h is confirmed; others shown only once confirmed |
| Shashen's quote | Needs his own words |

## Done when

Lighthouse mobile ≥ 95 performance / 100 SEO / 100 accessibility · works with JS off and with
reduced motion · checked at 375px and 1440px · no fact on the page that isn't in the data file.
