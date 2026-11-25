import { gsap, MQ } from '../motion.js';

// Static stand-in for Moment 2 (the Sigiriya climb, R4): the photo settles while the three
// notes are stuck on one by one.
export function init(section) {
  const stage = section.querySelector('[data-reasons-stage]');
  const img = section.querySelector('[data-reasons-img]');
  const notes = section.querySelectorAll('[data-reason]');
  const mm = gsap.matchMedia();

  mm.add(MQ.desktop, () => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: stage, start: 'top top', end: '+=140%', pin: true, scrub: 1 },
    });
    tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4 }, 0);
    notes.forEach((n, i) => {
      tl.from(n, { y: 80, rotate: '+=10', autoAlpha: 0, duration: 0.35, ease: 'power3.out' }, 0.25 + i * 0.35);
    });
  });

  mm.add(MQ.mobile, () => {
    gsap.from(notes, {
      y: 40, rotate: 6, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out',
      scrollTrigger: { trigger: notes[0], start: 'top 85%' },
    });
  });
}
