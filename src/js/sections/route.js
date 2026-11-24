import { gsap, MQ } from '../motion.js';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

export function init(section) {
  const stage = section.querySelector('[data-route-stage]');
  const legs = section.querySelectorAll('[data-route-leg]');
  const dots = section.querySelectorAll('[data-route-dot]');
  const stops = section.querySelectorAll('[data-route-stop]');
  const rail = section.querySelector('[data-route-rail]');

  const mm = gsap.matchMedia();

  // Desktop: pin while the line draws leg by leg from the airport; each stop pops in as the
  // line reaches it.
  mm.add(MQ.desktop, () => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: stage, start: 'bottom bottom', end: '+=160%', pin: true, scrub: 1 },
    });
    gsap.set(legs, { drawSVG: '0%' });
    gsap.set(dots, { scale: 0 });
    gsap.set(stops, { autoAlpha: 0, y: 16 });

    tl.to(dots[0], { scale: 1, duration: 0.15, ease: 'back.out(3)' }, 0)
      .to(stops[0], { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0);
    legs.forEach((leg, i) => {
      const at = 0.2 + i;
      tl.to(leg, { drawSVG: '100%', duration: 1 }, at)
        .to(dots[i + 1], { scale: 1, duration: 0.15, ease: 'back.out(3)' }, at + 0.9)
        .to(stops[i + 1], { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, at + 0.9);
    });
    tl.to({}, { duration: 0.4 });
  });

  // Phones: vertical list; the rail fills and stops fade in as they scroll past.
  mm.add(MQ.mobile, () => {
    gsap.fromTo(rail, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: rail.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: true },
    });
    stops.forEach((stop) => {
      gsap.from(stop, {
        autoAlpha: 0, x: -12, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: stop, start: 'top 80%' },
      });
    });
  });

  initHills(section, mm);
}

// Clouds start closed over the text and part as you scroll; hill layers rise at different speeds.
function initHills(section, mm) {
  const scene = section.querySelector('[data-hills]');
  if (!scene) return;
  const layer = (name) => scene.querySelector(`[data-hills-layer="${name}"]`);
  const cloud = (name) => scene.querySelector(`[data-cloud="${name}"]`);
  const text = scene.querySelector('[data-hills-text]');

  const build = (pin) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: pin
        ? { trigger: scene, start: 'top top', end: '+=120%', pin: true, scrub: 1 }
        : { trigger: scene, start: 'top 80%', end: 'bottom bottom', scrub: true },
    });
    tl.fromTo(cloud('left'), { xPercent: 58 }, { xPercent: -10, duration: 1 }, 0)
      .fromTo(cloud('right'), { xPercent: -58 }, { xPercent: 10, duration: 1 }, 0)
      .fromTo(cloud('low'), { yPercent: -40, autoAlpha: 1 }, { yPercent: 30, autoAlpha: 0, duration: 1 }, 0)
      .fromTo(text, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, 0.25)
      .fromTo(layer('far'), { yPercent: 6 }, { yPercent: 0, duration: 1 }, 0)
      .fromTo(layer('mid'), { yPercent: 14 }, { yPercent: 0, duration: 1 }, 0)
      .fromTo(layer('near'), { yPercent: 24 }, { yPercent: 0, duration: 1 }, 0)
      .fromTo(layer('front'), { yPercent: 30 }, { yPercent: 0, duration: 1 }, 0);
  };

  mm.add(MQ.desktop, () => build(true));
  mm.add(MQ.mobile, () => build(false));
}
