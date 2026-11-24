// The one Lenis instance (CLAUDE.md). Imported once, from main.js.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const lenis = reduceMotion ? null : new Lenis({ lerp: 0.1 });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Section modules put every animation inside these media queries (gsap.matchMedia), so a
// reduced-motion visitor or a phone gets the static / simplified version automatically.
export const MQ = {
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
};

export { gsap, ScrollTrigger };
