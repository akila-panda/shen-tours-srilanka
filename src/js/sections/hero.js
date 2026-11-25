import { gsap, MQ } from '../motion.js';

export function init(hero) {
  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    // The H1 is the LCP text: it only slides, it never starts hidden.
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(hero.querySelector('[data-hero-photo] img'), { scale: 1.12, duration: 2.4 }, 0)
      .from(hero.querySelectorAll('[data-hero-title] span'), { yPercent: 30, duration: 1.3, stagger: 0.08 }, 0)
      .from(hero.querySelector('[data-hero-note]'), { y: 30, rotate: 12, autoAlpha: 0, duration: 1.2 }, 0.5);

    gsap.to(hero.querySelector('[data-hero-photo] img'), {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}
