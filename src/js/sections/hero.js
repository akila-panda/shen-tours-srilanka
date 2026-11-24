import { gsap, MQ } from '../motion.js';

export function init(hero) {
  initToggle(hero);

  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    // Entrance. The H1 is never hidden (it is the LCP text): lines only slide, no fade.
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(hero.querySelector('.hero-photo.is-active'), { scale: 1.12, duration: 2.4 }, 0)
      .from(hero.querySelectorAll('[data-hero-line]'), { yPercent: 28, duration: 1.4, stagger: 0.1 }, 0)
      .from(hero.querySelector('[data-hero-script]'), { clipPath: 'inset(0 100% 0 0)', duration: 1.6, ease: 'power3.inOut' }, 0.25)
      .from(hero.querySelector('[data-hero-foot]'), { y: 24, autoAlpha: 0, duration: 1.2 }, 0.45)
      .from(hero.querySelector('.hero-toggle'), { autoAlpha: 0, duration: 1 }, 0.6);

    // Content drifts up a little as the hero scrolls away (the zoom itself is Phase 2).
    gsap.to(hero.querySelector('[data-hero-content]'), {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

// Coast / Hills: crossfades the two photos (CSS transition, so reduced motion is instant).
function initToggle(hero) {
  const buttons = hero.querySelectorAll('.hero-toggle button');
  const photos = hero.querySelectorAll('.hero-photo');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const scene = btn.dataset.scene;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      photos.forEach((p) => p.classList.toggle('is-active', p.dataset.scene === scene));
    });
  });
}
