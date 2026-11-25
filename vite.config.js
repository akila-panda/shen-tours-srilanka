import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import handlebars from 'vite-plugin-handlebars';
import { defineConfig } from 'vite';

const root = import.meta.dirname;
const readJson = (name) => JSON.parse(readFileSync(resolve(root, 'src/data', `${name}.json`), 'utf8'));

// Per-page SEO. Every HTML entry needs a row here (doc 02: one H1, title ≤ 60, description ≤ 155).
const pages = {
  '/index.html': {
    title: 'Private Sri Lanka Tours with a Driver-Guide | Shen Tours',
    description:
      'Private Sri Lanka tours with a local English-speaking driver-guide. Airport pickup, clear prices from $65 per person per day. Plan your route with Shen.',
    path: '/',
    index: true,
  },
  // Design-direction explorations (internal, not indexed).
  '/directions/index.html': { title: 'Design directions | Shen Tours', description: 'Internal design review.', path: '/directions/', index: false },
  '/directions/road-book.html': { title: 'A. The Road Book | Shen Tours', description: 'Internal design review.', path: '/directions/road-book.html', index: false },
  '/directions/window-seat.html': { title: 'B. Window Seat | Shen Tours', description: 'Internal design review.', path: '/directions/window-seat.html', index: false },
  '/directions/painted-roads.html': { title: 'C. Painted Roads | Shen Tours', description: 'Internal design review.', path: '/directions/painted-roads.html', index: false },
  '/style-tile.html': {
    title: 'Style tile | Shen Tours Sri Lanka',
    description: 'Internal design review page.',
    path: '/style-tile.html',
    index: false,
  },
};

// TravelAgency (+ WebSite once the domain is known). Only confirmed facts: null fields are left
// out, and there is no AggregateRating until real review counts are supplied (doc 07).
function jsonLd(business, tours = [], faqs = []) {
  const url = business.domain ? `https://${business.domain}/` : undefined;
  const sameAs = Object.values(business.socials ?? {}).filter(Boolean);
  const agency = {
    '@type': 'TravelAgency',
    '@id': url ? `${url}#agency` : undefined,
    name: business.name,
    alternateName: business.alternateName ?? undefined,
    legalName: business.legalName ?? undefined,
    url,
    email: business.email ?? undefined,
    telephone: business.phone ?? undefined,
    foundingDate: business.foundedYear ? String(business.foundedYear) : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: business.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.schema,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    sameAs: sameAs.length ? sameAs : undefined,
  };
  const graph = [agency];
  if (tours.length) {
    graph.push({
      '@type': 'ItemList',
      name: 'Sri Lanka tour packages',
      itemListElement: tours.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristTrip',
          name: `${t.title} tour`,
          description: `${t.durationDays} days, ${t.durationDays - 1} nights. Private vehicle and driver-guide; hotels separate. Best ${t.bestMonths}.`,
          provider: { '@type': 'TravelAgency', name: business.name },
          offers: {
            '@type': 'Offer',
            price: (t.pricing.from / 100).toFixed(2),
            priceCurrency: t.pricing.currency,
            description: 'From, per person',
          },
        },
      })),
    });
  }
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  if (url) graph.push({ '@type': 'WebSite', url, name: business.name, publisher: { '@id': `${url}#agency` } });
  // JSON.stringify drops undefined keys; escape "<" so the JSON can't close the script tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

// Route line (homepage section 4): stops sit exactly on the line, which is one S-curve per leg
// in a 1200×420 box. Positions are also given as percentages for the HTML labels.
const ROUTE_BOX = { w: 1200, h: 420 };
// The homepage lays the same route out wider (×2.5) so it can scroll sideways while pinned.
const ROUTE_WIDE = 2.5;
function routeWithSegments(stopsIn, scale = 1) {
  const stops = stopsIn.map((st) => ({ ...st, x: st.x * scale }));
  return stops.map((stop, i) => {
    const prev = stops[i - 1];
    const leg = prev
      ? (() => {
          const dx = (stop.x - prev.x) / 2;
          return `M${prev.x},${prev.y} C${prev.x + dx},${prev.y} ${stop.x - dx},${stop.y} ${stop.x},${stop.y}`;
        })()
      : null;
    return {
      ...stop,
      i,
      index: String(i + 1).padStart(2, '0'),
      leftPct: ((stop.x / (ROUTE_BOX.w * scale)) * 100).toFixed(3),
      topPct: ((stop.y / ROUTE_BOX.h) * 100).toFixed(3),
      // Photo sits inside the empty curve next to the stop: above a valley stop, below a peak.
      // The map's viewBox is 1200×560 with the route shifted down 70 units.
      printTopPct: ((((stop.labelBelow ? stop.y + 70 - 165 : stop.y + 70 + 160)) / 560) * 100).toFixed(3),
      printRot: [-4, 3, -2, 4, -3, 2, -5, 3, -2][i % 9],
      leg,
    };
  });
}

// Unsplash photos for the internal direction tiles (free licence, hotlinked, not downloaded).
const U = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
// Wikimedia Commons thumbnails (only standard widths such as 1280 / 1920 are served).
const W = (path, w = 1280) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${w}px-${path.split('/').pop()}`;
const PHOTOS = {
  sigiriya: { src: U('1612862862126-865765df2ded'), alt: 'Sigiriya rock fortress rising out of the forest, seen from the air' },
  nineArch: { src: U('1566296314736-6eaac1ca0cb9'), alt: 'Blue train crossing the Nine Arch Bridge near Ella' },
  nineArchField: { src: U('1574611122955-5baa61496637'), alt: 'Train on the Nine Arch Bridge above green fields, Ella' },
  stilt: { src: U('1519566335946-e6f65f0f4fdf'), alt: 'Stilt fishermen on the south coast' },
  tea: { src: U('1760532511219-c8b7566f90af'), alt: 'Tea plantation on a misty hillside in the hill country' },
  tooth: { src: U('1665849050430-5e8c16bacf7e'), alt: 'Temple of the Tooth beside the lake in Kandy' },
  colombo: { src: U('1623595289196-007a22dd8560'), alt: 'Train passing the Lotus Tower in Colombo' },
  waterfall: { src: U('1609681980718-340e7f4b11d7'), alt: 'Waterfall falling down a green cliff in the hill country' },
  blueTrain: { src: U('1578517929167-db9ed31cd5c6'), alt: 'Blue train passing houses in the hills' },
  plumeria: { src: U('1781867084471-3c8d5202e86c', 900), alt: 'Pink and yellow frangipani flowers' },
  tuktuk: { src: U('1704797390325-b057758d8c3d'), alt: 'Tuk-tuk parked beside a lighthouse on the coast' },
  polonnaruwa: { src: U('1709729508706-87741ec2d50a'), alt: 'Ancient stone ruins with a Buddha statue at Polonnaruwa' },
  galVihara: { src: U('1656497106972-d056a38ac8ce'), alt: 'Buddha figure carved into the rock at Polonnaruwa' },
  galleFort: { src: U('1783125385922-71933038f814'), alt: 'People sitting on the Galle Fort walls beside the clock tower' },
  galleSteps: { src: U('1770730608218-f05b82d7a1a4'), alt: 'Stone steps up to the clock tower in Galle Fort' },
  minneriya: { src: U('1619183318129-cd95bc882275'), alt: 'Two elephants on the grassland at Minneriya' },
  udawalawe: { src: U('1674556275189-e78fd6223e6d'), alt: 'A herd of elephants crossing green grassland at Udawalawe' },
  yala: { src: U('1661768508643-e260f6f8e06c'), alt: 'A leopard walking along a dirt track in Yala' },
  wmLeopard: { src: W('b/bc/A_watchful_leopard.jpg'), alt: 'A leopard watching from the road in Yala National Park', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
  wmGathering: { src: W('3/39/Minneriya_National_Park,_elephants_gathering.jpg'), alt: 'Elephants gathering on the grassland at Minneriya National Park', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
  wmUdaCalf: { src: W('b/be/Sri_Lankan_elephant_with_young%2C_Udawalawe_NP.jpg'), alt: 'A Sri Lankan elephant with her calf beside a waterhole in Udawalawe National Park', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
  wmUdaCalfLarge: { src: W('b/be/Sri_Lankan_elephant_with_young%2C_Udawalawe_NP.jpg', 1920), alt: 'A Sri Lankan elephant with her calf beside a waterhole in Udawalawe National Park', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
  wmUdaElephant: { src: W('7/77/Asian_Elephant_in_Udawalawe_National_Park%2C_Sri_Lanka.jpg'), alt: 'An elephant in the grass at Udawalawe National Park', credit: 'Wikimedia Commons, CC BY-SA 4.0' },
  wmGalVihara: { src: W('6/68/LK-polonnaruwa-gal-vihara-01.jpg'), alt: 'The rock-cut Buddha figures of Gal Vihara, Polonnaruwa', credit: 'Wikimedia Commons, CC BY-SA 3.0' },
  wmGalle: { src: W('5/54/SL_Galle_Fort_asv2020-01_img24.jpg'), alt: 'Galle lighthouse inside the old Dutch fort', credit: 'A.Savin, Wikimedia Commons, FAL' },
  wmTooth: { src: W('f/f3/SL_Kandy_asv2020-01_img34_Sacred_Tooth_Temple.jpg'), alt: 'The Temple of the Sacred Tooth Relic in Kandy', credit: 'A.Savin, Wikimedia Commons, FAL' },
  udaHerd: { src: U('1674556275189-e78fd6223e6d'), alt: 'A herd of elephants crossing the green grassland at Udawalawe' },
  udaGrazing: { src: U('1559038241-3b172c11ede9'), alt: 'An elephant pulling up grass at Udawalawe' },
  udaGrass: { src: U('1617867644194-550af3ae2c56'), alt: 'An elephant standing in the green grass at Udawalawe' },
  sigiriyaSunset: { src: U('1751247026229-518bfec9b5e6'), alt: 'Sunset light on Sigiriya, seen from Pidurangala' },
};

// Udawalawe trail: footprints wandering along a gentle S-curve across a 3200×600 track,
// alternating left and right feet either side of the line.
function herdPrints() {
  const out = [];
  let side = 1;
  for (let x = 60; x <= 3140; x += 72) {
    const y = 300 + 150 * Math.sin(x / 300);
    const dy = (150 / 300) * Math.cos(x / 300);
    const angle = (Math.atan2(dy, 1) * 180) / Math.PI;
    const nx = -Math.sin((angle * Math.PI) / 180);
    const ny = Math.cos((angle * Math.PI) / 180);
    out.push({ x: +(x + nx * 16 * side).toFixed(1), y: +(y + ny * 16 * side).toFixed(1), r: +(angle + 90).toFixed(1), p: +(x / 3200).toFixed(4) });
    side *= -1;
  }
  return out;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// Numbers section (homepage section 8). "100+" → { value: 100, suffix: '+' } for the count-up.
function statTiles(business) {
  const split = (v) => {
    const m = String(v).match(/^(\d+)(.*)$/);
    return m ? { value: Number(m[1]), suffix: m[2] } : { value: null, suffix: String(v) };
  };
  return [
    { ...split(business.stats.travellers), label: 'Travellers hosted' },
    { ...split(business.stats.tours), label: 'Tours completed' },
    { ...split(business.stats.guides), label: 'Local driver-guides' },
    { value: business.foundedYear, suffix: '', label: 'Guiding since', noCount: true },
  ].filter((s) => s.value !== null);
}

// Data is re-read on every page render so edits to src/data/*.json show up on reload.
function context(pagePath) {
  const business = readJson('business');
  const today = new Date().toISOString().slice(0, 10);
  const offers = readJson('offers').filter(
    (o) => (!o.validFrom || o.validFrom <= today) && (!o.validTo || o.validTo >= today),
  );
  // offers.js re-checks validTo in the browser, so a page built before an offer ended still hides it.
  const guides = readJson('guides');
  const waLink = (text) => {
    const d = String(business.whatsapp ?? '').replace(/\D/g, '');
    return d ? `https://wa.me/${d}?text=${encodeURIComponent(text)}` : null;
  };
  const safariUrl = waLink("Hi Shen, I'd like to add an Udawalawe elephant safari to my tour.");
  const tours = readJson('tours')
    .filter((t) => t.status === 'published')
    .sort((a, b) => a.order - b.order)
    .map((t, i) => ({
      ...t,
      index: String(i + 1).padStart(2, '0'),
      nights: t.durationDays - 1,
      // Until tour pages exist (Draft 2), each tour opens a WhatsApp quote request for it.
      quoteUrl: waLink(`Hi Shen, I'd like a quote for the ${t.title} tour.`),
    }));
  const page = pages[pagePath] ?? pages['/index.html'];
  const waDigits = String(business.whatsapp ?? '').replace(/\D/g, '');
  return {
    page,
    jsonLd: page.index ? jsonLd(business, tours, readJson('faqs')) : null,
    // "Get a free quote" / "Plan my tour" open WhatsApp until the booking page exists (Draft 2).
    quoteUrl: waDigits
      ? `https://wa.me/${waDigits}?text=${encodeURIComponent("Hi Shen, I'd like a free quote for a private Sri Lanka tour.")}`
      : null,
    business,
    tours,
    destinations: readJson('destinations').map((d, i) => ({ ...d, index: String(i + 1).padStart(2, '0') })),
    guides,
    guideYearsMin: Math.min(...guides.map((g) => g.years)),
    route: routeWithSegments(readJson('route')).map((st) => ({
      ...st,
      // "Add this stop to my route" opens WhatsApp until the booking page exists.
      addUrl: st.slug === 'cmb' ? null : waLink(`Hi Shen, I'd like to include ${st.name} in my tour.`),
    })),
    routeWide: routeWithSegments(readJson('route'), ROUTE_WIDE).map((st) => ({
      ...st,
      addUrl: st.slug === 'cmb' ? null : waLink(`Hi Shen, I'd like to include ${st.name} in my tour.`),
    })),
    routeWidePath: readJson('route').map((s0) => ({ ...s0, x: s0.x * ROUTE_WIDE })).map((st, i, a) => (i === 0 ? `M${st.x},${st.y}` : `C${a[i - 1].x + (st.x - a[i - 1].x) / 2},${a[i - 1].y} ${st.x - (st.x - a[i - 1].x) / 2},${st.y} ${st.x},${st.y}`)).join(' '),
    routePath: readJson('route').map((st, i, a) => (i === 0 ? `M${st.x},${st.y}` : `C${a[i - 1].x + (st.x - a[i - 1].x) / 2},${a[i - 1].y} ${st.x - (st.x - a[i - 1].x) / 2},${st.y} ${st.x},${st.y}`)).join(' '),
    offers,
    faqs: readJson('faqs'),
    safariUrl,
    herdPrints: herdPrints(),
    founder: guides[0],
    photos: PHOTOS,
    stats: statTiles(business),
    // The five guest videos from the current site; files are added in Phase 6 (src stays null until then).
    videos: readJson('videos').map((v, i) => ({ ...v, numeral: ROMAN[i] })),
    // Only real, attributable reviews (doc 05). Empty until the owner supplies them.
    reviews: readJson('reviews'),
    year: new Date().getFullYear(),
  };
}

const helpers = {
  // Single price formatter (doc 05): cents → "$375".
  money: (cents, currency) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: typeof currency === 'string' ? currency : 'USD',
      maximumFractionDigits: 0,
    }).format(cents / 100),
  eq: (a, b) => a === b,
  odd: (n) => n % 2 === 1,
  initials: (name) => String(name ?? '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''),
  firstName: (name) => String(name ?? '').split(/\s+/)[0],
  // "+94 743 717 419" → "94743717419" for tel:/wa.me links.
  digits: (s) => String(s ?? '').replace(/\D/g, ''),
  json: (value) => JSON.stringify(value),
  // {{#with (photo photos key)}} → the photo object for a key, or nothing.
  photo: (photos, key) => (key && photos ? photos[key] : null),
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    handlebars({
      partialDirectory: resolve(root, 'partials'),
      context,
      helpers,
      reloadOnPartialChange: true,
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        styleTile: resolve(root, 'style-tile.html'),
        directions: resolve(root, 'directions/index.html'),
        roadBook: resolve(root, 'directions/road-book.html'),
        windowSeat: resolve(root, 'directions/window-seat.html'),
        paintedRoads: resolve(root, 'directions/painted-roads.html'),
      },
    },
  },
});
