import { gsap, MQ } from '../motion.js';

// Each card drifts at its own speed, like loose photos on a table.
export function init(section) {
  const cards = section.querySelectorAll('[data-journal-card]');
  const speeds = [-12, 8, -18, 14, -8];
  const mm = gsap.matchMedia();
  mm.add(MQ.desktop, () => {
    cards.forEach((card, i) => {
      gsap.fromTo(card, { yPercent: speeds[i % speeds.length] * -1 }, {
        yPercent: speeds[i % speeds.length], ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
  mm.add(MQ.mobile, () => {
    gsap.from(cards, {
      y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cards[0], start: 'top 85%' },
    });
  });
}
