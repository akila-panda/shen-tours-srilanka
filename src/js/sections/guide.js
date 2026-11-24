import { gsap, MQ } from '../motion.js';

export function init(section) {
  const portrait = section.querySelector('[data-guide-portrait]');
  const img = section.querySelector('[data-guide-img]');
  const cards = section.querySelectorAll('[data-guide-card]');

  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    // Portrait mask opens upward while the photo settles from a slight zoom.
    gsap.timeline({ scrollTrigger: { trigger: portrait, start: 'top 80%' } })
      .fromTo(portrait, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
      .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.2);

    gsap.from(cards, {
      y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: cards[0], start: 'top 85%' },
    });
  });
}
