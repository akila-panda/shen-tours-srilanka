import { gsap, ScrollTrigger, MQ } from '../motion.js';

// Counts up once when the numbers come into view. The final values are already in the HTML.
export function init(section) {
  const els = section.querySelectorAll('[data-count]');
  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    els.forEach((el) => {
      const end = Number(el.dataset.count);
      const counter = { v: 0 };
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            v: end,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: () => (el.textContent = Math.round(counter.v)),
          }),
      });
      // Start from 0 only if it hasn't been seen yet.
      if (section.getBoundingClientRect().top > innerHeight * 0.8) el.textContent = '0';
    });
  });
}
