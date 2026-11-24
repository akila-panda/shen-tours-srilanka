import { gsap, MQ } from '../motion.js';

export function init(section) {
  const lines = section.querySelectorAll('[data-where-line]');
  const flower = section.querySelector('[data-where-flower]');
  const flowerSmall = section.querySelector('[data-where-flower-small]');
  const strip = section.querySelector('[data-where-strip]');
  const viewport = section.querySelector('[data-where-viewport]');
  const track = section.querySelector('[data-where-track]');

  const mm = gsap.matchMedia();

  // Stair words drift at different speeds; the flowers float and turn over them.
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    const scrub = { trigger: section, start: 'top bottom', end: 'center top', scrub: true };
    lines.forEach((line, i) => {
      gsap.fromTo(line, { xPercent: (i - 1) * -6 }, { xPercent: (i - 1) * 6, ease: 'none', scrollTrigger: scrub });
    });
    gsap.fromTo(flower, { yPercent: 40, rotate: -25 }, { yPercent: -50, rotate: 35, ease: 'none', scrollTrigger: scrub });
    if (flowerSmall) {
      gsap.fromTo(flowerSmall, { yPercent: 60, rotate: 20 }, { yPercent: -80, rotate: -40, ease: 'none', scrollTrigger: scrub });
    }
  });

  // Desktop: pin the strip and move the track sideways as you scroll down.
  mm.add(MQ.desktop, () => {
    strip.classList.add('is-pinned');
    viewport.removeAttribute('tabindex');
    const distance = () => track.scrollWidth - viewport.clientWidth + parseFloat(getComputedStyle(viewport).paddingLeft) * 2;
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: strip,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    return () => {
      strip.classList.remove('is-pinned');
      viewport.setAttribute('tabindex', '0');
    };
  });
}
