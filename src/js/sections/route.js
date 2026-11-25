import { gsap, MQ } from '../motion.js';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

export function init(section) {
  const stage = section.querySelector('[data-route-stage]');
  const inner = section.querySelector('[data-route-inner]');
  const legs = section.querySelectorAll('[data-route-leg]');
  const dots = [...section.querySelectorAll('[data-route-dot]')];
  const stops = section.querySelectorAll('[data-route-stop]');
  const items = [...section.querySelectorAll('[data-stop-index]')];
  const van = section.querySelector('[data-van]');

  initStops(section, dots);

  const mm = gsap.matchMedia();

  // Desktop: the section pins; the road is ~2.3 screens wide and slides sideways so the pen
  // (and the van) stay around the middle of the screen while each leg is inked.
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-trail');
    gsap.set(legs, { drawSVG: '0%' });

    // How far to slide so stop i sits at ~55% of the screen (never past either end).
    const xFor = (i) => () => {
      const max = Math.max(0, inner.offsetWidth + inner.offsetLeft * 2 - innerWidth);
      const stopX = (parseFloat(items[i].style.getPropertyValue('--x')) / 100) * inner.offsetWidth;
      return -gsap.utils.clamp(0, max, stopX + inner.offsetLeft - innerWidth * 0.55);
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${legs.length * 34}%`,
        pin: section,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    tl.from(dots[0], { scale: 0, transformOrigin: 'center', duration: 0.1 }, 0).from(stops[0], { autoAlpha: 0, duration: 0.2 }, 0);
    legs.forEach((leg, i) => {
      tl.to(inner, { x: xFor(i + 1), duration: 1, ease: 'sine.inOut' }, i)
        .to(leg, { drawSVG: '100%', duration: 1 }, i)
        .from(dots[i + 1], { scale: 0, transformOrigin: 'center', duration: 0.1 }, i + 0.9)
        .from(stops[i + 1], { autoAlpha: 0, y: 10, duration: 0.25 }, i + 0.9);
    });
    if (van) {
      tl.to(van, {
        motionPath: { path: '#route-path', align: '#route-path', alignOrigin: [0.5, 0.5] },
        duration: legs.length,
      }, 0);
    }
    // Each stop's photo is pasted into its curve as the pen arrives.
    section.querySelectorAll('[data-route-print]').forEach((print) => {
      const i = Number(print.dataset.for);
      const at = i === 0 ? 0 : i - 1 + 0.8;
      const r = parseFloat(print.style.getPropertyValue('--r')) || 0;
      tl.fromTo(print,
        { autoAlpha: 0, scale: 1.35, y: -40, rotate: r + gsap.utils.random(-14, 14) },
        { autoAlpha: 1, scale: 1, y: 0, rotate: r, duration: 0.35, ease: 'back.out(1.4)' }, at);
    });
    tl.to({}, { duration: 0.6 });
    return () => {
      stage.classList.remove('is-trail');
      gsap.set(inner, { clearProps: 'transform' });
    };
  });

  mm.add(MQ.mobile, () => {
    stops.forEach((stop) => {
      gsap.from(stop, { autoAlpha: 0, x: -12, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: stop, start: 'top 85%' } });
    });
  });

  initHills(mm);
}

// Stops: hovering a stop (or its photo) opens its card after a short pause; moving into the card
// keeps it open so its button can be pressed. Click / tap / Enter also opens it.
function initStops(section, dots) {
  const items = [...section.querySelectorAll('[data-stop-index]')];
  const prints = [...section.querySelectorAll('[data-route-print]')];
  const card = section.querySelector('[data-stop-card]');
  const body = section.querySelector('[data-stop-card-body]');
  const closeBtn = section.querySelector('[data-stop-close]');
  const hoverable = matchMedia('(hover: hover) and (pointer: fine)');
  let current = -1;
  let openTimer = 0;
  let closeTimer = 0;

  const printFor = (i) => prints.find((p) => Number(p.dataset.for) === i);
  const mark = (i, on) => {
    dots[i]?.classList.toggle('is-hot', on);
    printFor(i)?.classList.toggle('is-hot', on);
    items[i]?.classList.toggle('is-active', on);
  };
  const close = () => {
    clearTimeout(openTimer);
    if (current < 0) return;
    mark(current, false);
    card.classList.remove('is-open');
    current = -1;
    setTimeout(() => { if (current < 0) card.hidden = true; }, 450);
  };
  const open = (i) => {
    clearTimeout(closeTimer);
    if (current === i) return;
    if (current >= 0) mark(current, false);
    current = i;
    mark(i, true);
    body.replaceChildren(section.querySelector(`[data-stop-template="${i}"]`).content.cloneNode(true));
    // Put the card on the side of the screen away from the stop.
    const r = items[i].getBoundingClientRect();
    card.dataset.side = r.left + r.width / 2 > innerWidth / 2 ? 'left' : 'right';
    card.hidden = false;
    requestAnimationFrame(() => card.classList.add('is-open'));
  };
  const hoverIn = (i) => {
    if (!hoverable.matches) return;
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    openTimer = setTimeout(() => open(i), 140);
  };
  const hoverOut = () => {
    if (!hoverable.matches) return;
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, 320);
  };

  items.forEach((li, i) => {
    const btn = li.querySelector('button');
    btn.addEventListener('click', () => (current === i && !hoverable.matches ? close() : open(i)));
    btn.addEventListener('pointerenter', () => hoverIn(i));
    btn.addEventListener('pointerleave', hoverOut);
    btn.addEventListener('focus', () => open(i));
  });
  prints.forEach((p) => {
    const i = Number(p.dataset.for);
    p.addEventListener('click', () => open(i));
    p.addEventListener('pointerenter', () => hoverIn(i));
    p.addEventListener('pointerleave', hoverOut);
  });
  dots.forEach((d, i) => {
    d.addEventListener('click', () => open(i));
    d.addEventListener('pointerenter', () => hoverIn(i));
    d.addEventListener('pointerleave', hoverOut);
    d.style.cursor = 'pointer';
  });
  card.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  card.addEventListener('pointerleave', hoverOut);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  document.addEventListener('pointerdown', (e) => {
    if (current >= 0 && !card.contains(e.target) && !e.target.closest('[data-stop-index], [data-route-dot], [data-route-print]')) close();
  });
  // Close when the section scrolls away.
  addEventListener('scroll', () => {
    if (current < 0) return;
    const r = section.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) close();
  }, { passive: true });
}

// Clouds start closed over the text and part as you scroll; hill layers rise at different speeds.
function initHills(mm) {
  const scene = document.querySelector('[data-hills]');
  if (!scene) return;
  const layer = (n) => scene.querySelector(`[data-hills-layer="${n}"]`);
  const cloud = (n) => scene.querySelector(`[data-cloud="${n}"]`);
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
