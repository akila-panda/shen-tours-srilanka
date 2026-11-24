import { gsap, MQ } from '../motion.js';

export function init(section) {
  const stage = section.querySelector('[data-reasons-stage]');
  const photo = section.querySelector('[data-reasons-photo]');
  const img = section.querySelector('[data-reasons-img]');
  const circle = section.querySelector('[data-reasons-circle]');
  const title = section.querySelector('[data-reasons-title]');
  const items = section.querySelectorAll('[data-reason]');

  const mm = gsap.matchMedia();

  // Desktop: pin, zoom from a framed photo to full-bleed, then a sky circle grows from the
  // centre carrying the arched heading, then the three reasons.
  mm.add(MQ.desktop, () => {
    stage.classList.add('is-pinned');

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: stage, start: 'top top', end: '+=220%', pin: true, scrub: 1 },
    });
    tl.fromTo(photo, { clipPath: 'inset(16% 24% 16% 24%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
      .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.2 }, 0)
      .fromTo(circle, { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(75% at 50% 55%)', duration: 1, ease: 'power2.in' }, 1)
      .fromTo(title, { yPercent: 40, rotate: -6, autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 1.45)
      .fromTo(items, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.15, ease: 'power2.out' }, 1.8)
      .to({}, { duration: 0.3 });

    return () => stage.classList.remove('is-pinned');
  });

  // Phones: no pin. The photo eases in and the sky panel opens as a circle while it scrolls in.
  mm.add(MQ.mobile, () => {
    gsap.fromTo(img, { scale: 1.25 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom center', scrub: true },
    });
    gsap.fromTo(circle, { clipPath: 'circle(20% at 50% 20%)' }, {
      clipPath: 'circle(120% at 50% 20%)', ease: 'none',
      scrollTrigger: { trigger: circle, start: 'top bottom', end: 'top 25%', scrub: true },
    });
    gsap.from(items, {
      y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: items[0], start: 'top 85%' },
    });
  });
}
