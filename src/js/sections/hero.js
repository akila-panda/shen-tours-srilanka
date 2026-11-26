import { gsap, MQ, ScrollTrigger } from '../motion.js';
import { createFrameSequence, canLoadFrames } from '../lib/frames.js';

// Moment 1: the road. The hero pins and scrolling drives a drone shot: the car on the hairpin,
// then the camera rising over the hill country. The H1 and quote button are visible at 0 %, the
// laterite slab wipes away so the footage gets the whole screen, and it wipes back with the hills
// wide behind it before handing over to the next section.
//
// Fallbacks: reduced motion, Save-Data / 2G, or no JS → the static hero with the poster frame
// (the first frame of the same shot), which is also the LCP image.

const SETS = {
  desktop: { base: '/media/road/d/', count: 120, pin: '+=240%' },
  mobile: { base: '/media/road/m/', count: 80, pin: '+=170%' },
};

export function init(hero) {
  const q = (sel) => hero.querySelector(sel);
  const title = q('[data-hero-title]');
  const note = q('[data-hero-note]');
  const slab = q('.hero-slab');
  const foot = q('.hero-foot');
  const frame = q('[data-hero-frame]');
  const canvas = q('[data-hero-canvas]');
  const cue = q('[data-hero-cue]');
  const caption = q('[data-hero-caption] span');

  const mm = gsap.matchMedia();

  // Load-in. The H1 is the LCP text: it slides, it never starts hidden.
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from(title.querySelectorAll('span'), { yPercent: 30, duration: 1.3, stagger: 0.08 }, 0)
      .from(note, { scale: 0.7, rotation: 14, duration: 1.2 }, 0.45)
      .from(cue, { autoAlpha: 0, y: -8, duration: 1 }, 1.1);
  });

  if (!canLoadFrames()) return;

  mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, ({ conditions }) => {
    const set = conditions.desktop ? SETS.desktop : SETS.mobile;
    hero.classList.add('is-scrub');

    const measure = () => hero.style.setProperty('--slab-h', `${slab.offsetHeight}px`);
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);

    const seq = createFrameSequence(canvas, { base: set.base, count: set.count });
    seq.focus(0.4, 0.5); // matches the poster's object-position

    gsap.set(caption, { autoAlpha: 0, y: 24 });
    const film = { p: 0 };

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: set.pin,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    tl.to(film, { p: 1, duration: 1, ease: 'none', onUpdate: () => seq.seek(film.p) }, 0)
      // The scroll cue and the paper note leave first; the note lifts like it was peeled off.
      // fromTo with immediateRender off: the load-in owns the cue until the visitor scrolls.
      .fromTo(cue, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 12, duration: 0.08, immediateRender: false }, 0)
      .to(note, { yPercent: -90, opacity: 0, duration: 0.16, ease: 'power2.in' }, 0.03)
      // The title card wipes away downward: text first, then the laterite.
      .to(title, { yPercent: -40, opacity: 0, duration: 0.14, ease: 'power2.in' }, 0.12)
      .to(foot, { y: -16, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0.14)
      .fromTo(slab, { clipPath: 'inset(0% 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)', duration: 0.16, ease: 'power3.inOut' }, 0.2)
      // Mid-climb: one handwritten line over the footage.
      .to(caption, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.44)
      .to(caption, { autoAlpha: 0, y: -18, duration: 0.08, ease: 'power2.in' }, 0.66)
      // Hills wide: the title card comes back up from the bottom with the quote button.
      .to(slab, { clipPath: 'inset(0% 0 0 0)', duration: 0.14, ease: 'power3.out' }, 0.8)
      .to(title, { yPercent: 0, opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.86)
      .to(foot, { y: 0, opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.9);

    // Cursor: the footage tilts a degree toward the pointer; the paper note lags behind it, as if
    // it's stuck on the glass in front.
    let onMove;
    if (conditions.desktop) {
      gsap.set(frame, { transformPerspective: 1400, scale: 1.02 });
      const rx = gsap.quickTo(frame, 'rotationX', { duration: 1.2, ease: 'power3.out' });
      const ry = gsap.quickTo(frame, 'rotationY', { duration: 1.2, ease: 'power3.out' });
      const nx = gsap.quickTo(note, 'x', { duration: 1.8, ease: 'power3.out' });
      const ny = gsap.quickTo(note, 'y', { duration: 1.8, ease: 'power3.out' });
      onMove = (e) => {
        const dx = e.clientX / innerWidth - 0.5;
        const dy = e.clientY / innerHeight - 0.5;
        ry(dx * 2.4);
        rx(-dy * 1.6);
        nx(dx * -18);
        ny(dy * -12);
      };
      hero.addEventListener('pointermove', onMove);
    }

    return () => {
      seq.destroy();
      ScrollTrigger.removeEventListener('refreshInit', measure);
      if (onMove) hero.removeEventListener('pointermove', onMove);
      hero.classList.remove('is-scrub');
      hero.style.removeProperty('--slab-h');
    };
  });
}
