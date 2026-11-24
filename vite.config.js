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
function routeWithSegments(stops) {
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
      index: String(i + 1).padStart(2, '0'),
      leftPct: ((stop.x / ROUTE_BOX.w) * 100).toFixed(3),
      topPct: ((stop.y / ROUTE_BOX.h) * 100).toFixed(3),
      leg,
    };
  });
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
    route: routeWithSegments(readJson('route')),
    offers,
    faqs: readJson('faqs'),
    founder: guides[0],
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
      },
    },
  },
});
