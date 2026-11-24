import { gsap, MQ } from '../motion.js';

export function init(section) {
  const line = section.querySelector('[data-how-line]');
  const steps = section.querySelectorAll('[data-how-step]');
  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: steps[0], start: 'top 80%' } });
    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, 0)
      .from(steps, { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out' }, 0.2);
  });
}
