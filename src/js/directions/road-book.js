import { gsap, ScrollTrigger, MQ } from '../motion.js';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

const mm = gsap.matchMedia();

mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
  // Hero: the photo settles, the handwritten note is pinned on with a little turn.
  gsap.from('[data-hero-photo] img', { scale: 1.12, duration: 2.4, ease: 'expo.out' });
  gsap.from('[data-note]', { y: 30, rotate: 12, autoAlpha: 0, duration: 1.2, delay: 0.5, ease: 'expo.out' });

  // Tickets are dealt onto the table.
  gsap.from('[data-ticket]', {
    y: 80, rotate: () => gsap.utils.random(-8, 8), autoAlpha: 0, duration: 1, stagger: 0.09, ease: 'expo.out',
    scrollTrigger: { trigger: '.tickets', start: 'top 80%' },
  });
});

mm.add(MQ.desktop, () => {
  // The route is inked leg by leg as you scroll; notes and prints appear as the pen reaches them.
  const legs = gsap.utils.toArray('[data-leg]');
  const dots = gsap.utils.toArray('[data-dot]');
  const stops = gsap.utils.toArray('[data-stop]');
  const prints = gsap.utils.toArray('[data-print]');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '[data-map]', start: 'top 70%', end: 'bottom 45%', scrub: 1 },
  });
  gsap.set(legs, { drawSVG: '0%' });
  tl.from(dots[0], { scale: 0, transformOrigin: 'center', duration: 0.1 }, 0).from(stops[0], { autoAlpha: 0, duration: 0.2 }, 0);
  legs.forEach((leg, i) => {
    tl.to(leg, { drawSVG: '100%', duration: 1 }, i)
      .from(dots[i + 1], { scale: 0, transformOrigin: 'center', duration: 0.1 }, i + 0.9)
      .from(stops[i + 1], { autoAlpha: 0, y: 10, duration: 0.25 }, i + 0.9);
  });
  prints.forEach((p, i) => tl.from(p, { autoAlpha: 0, y: 40, rotate: '+=10', duration: 0.5, ease: 'power2.out' }, 0.8 + i * 1.4));
});

ScrollTrigger.refresh();
