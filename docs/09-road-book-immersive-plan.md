# 09 — Road Book redesign + immersive scroll (plan)

Written 2026-11-24. Replaces the visual direction in doc 07 (ERA colours and fonts) and the
remaining Phase 6 in doc 08. Content, data, SEO structure and the booking-request flow stay.

## Decisions so far

| Decision | Choice | Date |
|----------|--------|------|
| Design direction | **The Road Book** (`/directions/road-book.html`), merged with the homepage already built | 2026-11-24 |
| Immersive level | **Journey**: three big scroll moments spaced apart + small touches; normal scrolling and SEO stay | 2026-11-24 |
| Video downloads | **Last step.** Clips are reviewed now (previews only) so the motion is built around each one | 2026-11-24 |

## New input from the client (2026-11-24)

- **Key destinations:** Galle, Udawalawe, Yala, Kandy, Sigiriya, Polonnaruwa, Minneriya safari.
- **Main market: Poland.**

### What Poland changes

Polish search volumes (OpenSEO, Poland, Polish, 2026-11-24). Keyword difficulty is 0–18 across
the board, so a Polish version can rank quickly.

| Polish keyword | Monthly searches | Intent | Target page |
|----------------|-----------------:|--------|-------------|
| sri lanka pogoda | 8,100 | info | Guide: weather / best time (PL) |
| sri lanka wakacje | 4,400 | info/commercial | PL homepage |
| sigiriya | 3,600 | info | Destination: Sigiriya (PL) |
| sri lanka wiza | 1,600 | info | Guide: visa / ETA (PL) |
| sri lanka kiedy jechać | 1,300 | info | Guide: best time (PL) |
| wycieczka sri lanka / sri lanka wycieczki | 1,000 each | **commercial** | PL homepage + tours |
| polonnaruwa | 880 | info | Destination: Polonnaruwa (PL) |
| sri lanka atrakcje / co zobaczyć | 880 each | info | Destinations hub (PL) |
| kandy sri lanka | 720 | info | Destination: Kandy (PL) |
| galle sri lanka / sri lanka safari | 480 each | info | Destination / experience (PL) |
| minneriya | 320 | info | Destination: Minneriya (PL) |
| yala safari | 140 | info | Experience: Yala (PL) |

Consequences:
- **A Polish version is the priority locale**, served at `/pl/` with `hreflang` (en + pl). The
  homepage is built so every string can be translated; Polish words run longer, so every headline is
  tested in Polish for overflow.
- **Fonts are fine:** Big Shoulders, Schibsted Grotesk and Kalam all include Polish characters
  (latin-ext).
- **The season lines up:** December–April is dry on the west and south coasts and in the hills
  (from the client's FAQ), which covers Polish winter holidays.
- To ask the owner: is there a Polish-speaking guide? Should prices also show in EUR or PLN for
  Polish visitors? (Both are owner decisions; nothing is shown until confirmed.)

### What the destination list changes

- The homepage destinations become the client's seven: **Sigiriya, Polonnaruwa, Minneriya, Kandy,
  Udawalawe, Yala, Galle.** Ella and Nuwara Eliya stay reachable through the Hill Country tour.
- The route line follows the classic loop those places make:
  **Colombo airport → Sigiriya → Polonnaruwa → Minneriya → Kandy → (hill country) → Udawalawe →
  Yala → Galle.** Only "Sigiriya ≈ 4 h from the airport" shows a drive time until the owner
  confirms the rest.
- Wildlife becomes a bigger theme (elephants at Minneriya and Udawalawe, leopards in Yala).

## Merge map: current homepage → Road Book

Kept as-is: page order, data files, SEO and JSON-LD, menu, booking links, sticky tour panel logic,
FAQ `<details>`, offer expiry, Lenis + GSAP architecture.

Changed everywhere: colours (laterite `#B4532A`, tea ink `#16231B`, white paper, ballpoint blue
`#1F3A93`, four ticket tints), fonts (Big Shoulders / Schibsted Grotesk / Kalam for Shen's hand),
**no small labels above sections**, numbering only where the order is real (the route, how it works).

| # | Section now | Becomes |
|---|-------------|---------|
| 1 | Header with rotating badge, scroll counter | Laterite rubber-stamp postmark that spins with scroll speed; an **odometer** on the left edge rolls up as you go down the page |
| 2 | Hero with Coast/Hills toggle | **Moment 1: the road** (below) |
| 3 | Zoom → "Three reasons" circle | **Moment 2: the Sigiriya climb**; the three reasons are Shen's notes pinned on the way up |
| 4 | Route line + clouds over hills | Road Book notebook page: inked route with a small van driving along it, photo prints, English/Sinhala/Tamil stop names, Shen's notes. Then **Moment 3: mist over tea country** |
| 5 | Tour list + sticky photo panel | Railway tickets on the left; the sticky panel plays a short muted loop for the active tour. The Nine Arch train crosses as the section opens |
| 6 | Stair type + flower + destination strip | Stair type in Big Shoulders + a real frangipani cut-out; the seven destinations as photo prints with handwritten captions |
| 7 | Meet your guide | Shen's portrait as a print + a handwritten letter (his own words, when supplied) |
| 8 | Numbers band | A page from the driver's logbook: 100+ travellers, 90+ tours, 5 guides, since 2022, written in |
| 9 | Seasonal offers | Ticket stubs with a rubber stamp |
| 10 | Guest journal | Prints with handwritten captions on laterite |
| 11 | How it works | Three steps as a real numbered route |
| 12 | Travel basics | A "before you go" checklist with handwritten ticks |
| 13 | FAQ | Same accordion, Road Book styling |
| 14 | Footer | **Galle**: the drone rises over the fort wall to the sea, then the giant WhatsApp number |

## The three big moments

Each has a fallback: phones get fewer, smaller frames or a plain loop; reduced motion gets one
still frame; with JavaScript off the text and a poster image are already in the HTML.

### Moment 1 — The road (hero) · clip **road2**

Pexels 32629785 · 33 s · 4K · "winding roads amidst lush Sri Lankan landscapes". A drone sits
just behind a white car on a hairpin road, then rises until the hills fill the frame.

| Scroll | Frame | What happens |
|--------|-------|--------------|
| 0 % | Car on the hairpin (poster, in the HTML, the LCP image) | H1 "Private Sri Lanka tours with a local driver-guide" already visible |
| 0–40 % | Camera follows the car | A handwritten note slides in beside it: "That's your car. Just your group." |
| 40–85 % | Camera rises over the hills | The H1 eases up and out; the odometer starts rolling |
| 85–100 % | Wide hills | A laterite slab rises from the bottom with the price line and "Get a free quote", then hands over to Sigiriya |
| Mouse | — | The frame tilts a degree or two toward the cursor; the paper note lags slightly behind, like it's stuck on glass |

### Moment 2 — Sigiriya: the whole rock, then the climb (signature)

Requested 2026-11-24: the full rock and its surroundings from different viewpoints, and the path
people take to climb it. Pinned for about five screens of scrolling, in six chapters joined by quick
laterite page-wipes.

| Chapter | Clip (Pexels) | What you see | Overlay / interaction |
|---------|---------------|--------------|-----------------------|
| 1. From afar, at sunrise | sig7 · 34100385 · 13 s (or sig1 · 34100436) | Flying low over the forest toward the distant rock | Note 1: "Just your group, no strangers" |
| 2. The whole rock | sig8 · 29921609 · 23 s | Side-on view of the full rock with the mountains behind | **Mouse left/right orbits the view**; label "≈ 4 h from the airport" (data) |
| 3. The path up | still frame of the rock + photos | The visitor route **inked onto the rock** as a dotted pen line, stop by stop: water gardens → boulder gardens → frescoes and mirror wall → Lion's Paw terrace → summit | Each stop lights up with scroll, with a small photo print and Shen's note |
| 4. The rock face | sig5 · 36373731 · first ~12 s | Past the Lion's Paw terrace and up the face | Note 2: "Local driver-guides" + arrow to the terrace |
| 5. Over the edge | sig2 · 36175877 · 11 s | Up the face and over the summit edge | Note 3: "Clear prices, from $65 pp/day" |
| 6. On top at sunset | sig9 · 36212601 · 29 s · visitors on the summit at sunset | People on the summit, the plains below | **Mouse left/right looks around**; Cultural Triangle tour link |

Phones: chapters 1, 2, 3 (route as a vertical inked list) and 6 only, using sig6 · 29038151
(portrait, the rock from the fields) as the opening frame.

Gap: close ground-level shots of the stairways, frescoes and Lion's Paw (no free footage found);
photos or owner footage needed, or references for AI generation (see "Asset strategy").

### Moment 3 — Into the cool hills: mist, then the waterfall

Requested 2026-11-24: mountains with mist and waterfalls in cool surroundings.

| Part | Clip (Pexels) | What happens |
|------|---------------|--------------|
| a. Mist | mt3 · 32689274 · 39 s · white temple on misty hills, camera descends toward it | A soft fog layer covers the frame and **the cursor wipes it away** (it slowly drifts back). Phones: the fog parts on its own as you scroll |
| b. Tea and cloud | tea2 · 32702757 · 22 s | Short scrub over tea hills rising into cloud; "Up into the hill country" |
| c. Walk to the waterfall | wf1 · 32718796 · 51 s · from misty hills toward a tall waterfall | Pinned scrub: you travel toward the falls; the colour grade cools as you get closer; the Hill Country tour ticket slides in at the end |
| Phones | wf3 · 34529431 / wf6 · 34814925 (portrait cascades) | Short portrait loops instead of the long scrub |

Also available: mt1 · 32630425 (Ella Rock), wf2 · 32718815, wf5 · 37963722 (cascade in green hills),
wf4 · 20158554 (Devon Falls).

## Experiences tourists come for (new section, after "Where to go")

Requested 2026-11-24. Shown as **"Pages from the road"**: a horizontal run of photo prints, each
with a short muted loop that plays when it's in view or hovered, a handwritten caption, and the tour
it belongs to. Warm coast and cool hills sit side by side.

| Experience | Footage / image | Linked tour |
|------------|-----------------|-------------|
| Misty mountains | mt3, mt1 | Hill Country |
| Waterfalls | wf2, wf5 | Hill Country |
| The train over Nine Arch Bridge | arch1 | Hill Country / Complete |
| Tea country | tea2 | Hill Country |
| Beaches | bch2 · 32504501 (Mirissa, waves), bch1 · 34100516 | South Coast |
| Sunset on the coast | bch3 · 12597385 | South Coast |
| Fishing boats at dawn | boat · 35639434 | South Coast |
| Galle Fort | galle2 | South Coast |
| Elephants at the lake | el1 | Wildlife Safari (Minneriya, once confirmed) |
| On safari | el3 (jeep track) | Wildlife Safari |
| Temple of the Tooth | kandy3 | Cultural Triangle |
| Sigiriya | sig8 | Cultural Triangle |

More that tourists look for, to add as photos or references: whale watching off Mirissa, stilt
fishermen, Pidurangala sunrise (the view of Sigiriya), Dambulla cave temple, Polonnaruwa ruins,
Ella Rock and Little Adam's Peak hikes, surf at Weligama and Arugam Bay, leopards in Yala.
Seasons and claims (e.g. whale months) are only written once confirmed.

## Smaller video moments (short loops or short scrubs, not long sequences)

| Where | Clip | Use |
|-------|------|-----|
| Tours section opening | **arch1** · 32629871 · 8 s · drone tilts up to reveal the train on Nine Arch Bridge | Scrubbed as the "Sri Lanka tour packages" heading lands |
| Tour panel: Cultural Triangle | sig2 (short loop) | Active ticket → loop |
| Tour panel: Hill Country | tea2 (short loop) | Active ticket → loop |
| Tour panel: South Coast | **galle2** · 32614245 · 29 s · rising over Galle Fort to the sea | Active ticket → loop |
| Tour panel: Wildlife Safari | **el1** · 41004926 · 29 s · elephant herd by a lake (Sri Lanka) | Active ticket → loop (fits Minneriya; label only "elephants by the lake" unless the owner confirms the place) |
| Tour panel: Complete Sri Lanka | arch1 | Active ticket → loop |
| Kandy print | **kandy3** · 37650126 · 9 s · elephant beside the Temple of the Tooth | Short loop inside the Kandy print on hover |
| Footer | galle2 | Rises over the fort wall to the sea as the page ends |

## Clip review (previews only, nothing downloaded)

**Chosen:** road2; Sigiriya sig7, sig8, sig5, sig2, sig9 (+ sig1, sig6 alternates); hills mt3, tea2, wf1; loops arch1, galle2, el1, kandy3, bch2, bch3, boat, mt1, wf2, wf5 (about 20 clips; long scrubs only for road2, Sigiriya and the hills).

**Reserve:** sig3 (across the summit), sig4 (misty rock, little motion; poster or reduced-motion still), wf3 / wf6 (portrait, phones), arch2 (shadowed),
kandy1 (Kandy town aerial, slow), el3 (safari-jeep view along a track, location not stated),
el4 (elephants on grassland from a drone, location not stated).

**Rejected:** road1 (portrait, place not stated), "leopard resting" (South Africa), "coastal road"
(Indonesia), the Ruwanweli clip under "polonnaruwa" (it's Anuradhapura).

**Gaps (photos needed, or owner footage):** Polonnaruwa, Yala leopards, Udawalawe. Footage is only
labelled with a place when its source says so.

## Asset strategy (requested 2026-11-24)

Two tiers, kept separate:

1. **Build assets (internal site now):** free-licence clips and photos (Pexels, Unsplash) listed in
   this doc, plus the best available images from magazines, the official tourism site and hotels
   where they're stronger. Every non-free item is marked **"reference only, not for launch"** in
   `src/images/CREDITS.md`, and is swapped before the site goes public.
2. **Reference board for AI generation:** the strongest Sri Lanka photography and film we can find
   (National Geographic and Nat Geo Traveller, BBC Earth and other nature/geography channels on
   Sri Lanka and its famous places, Condé Nast Traveller, Lonely Planet, Sri Lanka Tourism's own films,
   Aman / Resplendent Ceylon / Teardrop hotel shoots, well-known photographers), saved as links with
   notes on what each one is good for (light, angle, mood). Used to brief new AI-generated assets in
   the same style, not to copy the images.

Shot list the board must cover: Sigiriya from Pidurangala at sunrise; the Sigiriya stairway, frescoes
and Lion's Paw; misty mountains and tea at dawn; waterfalls close-up in cool green light; Nine Arch
train; Galle Fort ramparts at golden hour; Mirissa beach and whales; stilt fishermen; Minneriya
elephant gathering; Yala leopard; Polonnaruwa ruins; Kandy and the Temple of the Tooth; the car and
driver-guide on the road (owner footage ideal).

## How it's built

- **Frame engine** (one small module): draws a frame sequence on a `<canvas>`, picks the frame from
  scroll progress, and draws with `devicePixelRatio`. During development it scrubs the Pexels
  preview video instead, so the motion can be built before anything is downloaded; production uses
  the downloaded frames.
- **Loading:** the first frame is an AVIF poster in the HTML. A sequence starts loading only when its
  section is within about 1.5 screens: every 8th frame first, then the rest. On Save-Data or slow
  connections it falls back to the poster plus a short loop.
- **Sizes (estimate):** frames at 1280 px wide, AVIF/WebP about 45 KB each. Hero ~120 frames,
  Sigiriya ~260, hills (mist + waterfall) ~140, Nine Arch ~48: about **25 MB on desktop**, loaded only as you reach each
  part. Phones get 720 px portrait crops and half the frames: about **6 MB**. Loops are 0.5–1.5 MB
  each and load only when shown.
- **Budgets:** LCP < 2.0 s (poster + text), CLS < 0.05, JS stays under 90 KB gzip.
- **Accessibility:** every moment has a still frame with alt text for reduced motion, the notes are
  real text, and the mouse effects are extras (nothing needs a mouse).

## Build phases (each ends with your review)

| Phase | What | Review |
|-------|------|--------|
| R0 | **Asset hunt**: reference board + build-asset list from magazines, official tourism, hotels and free stock, covering the shot list above | The board (links, notes, which section each feeds) |
| R1 | Road Book system on the existing homepage: tokens, fonts, stamp, odometer, all 14 sections restyled, AI tells removed; still images only (**built 2026-11-24, ready for review**) | The whole page, still |
| R2 | Destinations and route updated to the client's seven places; route pins until fully drawn, with clickable stops and detail cards; route photos paste into the curves as the pen arrives (scrapbook); new **Udawalawe** "follow the tracks" section after the tours (elephant footprints, four photos rising from the ground, 3D tilt) (**built 2026-11-24, ready for review**; Sinhala/Tamil names dropped at the user's request) | Route, destinations, Udawalawe |
| R3 | Frame engine + **Moment 1: the road** (**built 2026-11-26, ready for review**): `src/js/lib/frames.js` (canvas scrubber, coarse-to-fine loading, skipped on Save-Data/2G) and `tools/make_frames.py` (ffmpeg + cwebp). road2 0–23 s → 120 desktop frames at 1280 px (6.1 MB) and 80 phone frames, 9:16 crop at 540 px (3.0 MB) in `public/media/road/`; first frame is the poster/LCP image. Hero pins for 240 % (170 % on phones): the title card wipes away, the drone climbs with one handwritten line, the card returns over the wide hills. Cursor tilts the footage and the paper note lags. The car only appears in the first ~2 s of the clip, so the planned "That's your car" note was not used | Hero scroll feel on desktop and phone |
| R4 | **Moment 2: the Sigiriya climb** + look-around at the summit | The signature |
| R5 | **Moment 3: into the cool hills** (mist, tea, waterfall), "Pages from the road" experiences strip, Nine Arch reveal, tour loops, Galle footer, small touches (ticket tilt and punch, petals, stamp) | Everything moving together |
| R6 | Download the chosen clips, convert to frames and loops with ffmpeg, credits in `src/images/CREDITS.md`, performance / accessibility / Lighthouse / reduced motion / phone checks | Final |

Polish version: planned after R6 (translation, `/pl/` routes, hreflang, Polish meta and JSON-LD),
unless the owner wants Polish first.

## Owner questions (new)

- Polish-speaking guide available?
- Prices in EUR or PLN for Polish visitors, as well as USD?
- Which tours include Udawalawe and Minneriya? (Current tour data doesn't list stops.)
- Shen's handwritten notes (a page of short notes we can scan) and photos/footage from real tours,
  especially Polonnaruwa, Yala and Udawalawe.
- Check the Sinhala and Tamil place names.
