import { gsap, MQ } from '../motion.js';

export function init(section) {
  // The page may have been built before an offer ended: hide any whose validTo has passed,
  // and the whole section if none are left.
  const today = new Date().toISOString().slice(0, 10);
  section.querySelectorAll('[data-valid-to]').forEach((card) => {
    if (card.dataset.validTo < today) card.remove();
  });
  const cards = section.querySelectorAll('[data-offer]');
  if (!cards.length) {
    section.remove();
    return;
  }

  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    gsap.from(cards, {
      y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cards[0], start: 'top 85%' },
    });
  });
}
