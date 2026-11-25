import { gsap, MQ } from '../motion.js';

// Udawalawe: follow the elephant tracks. One pinned timeline slides the wide track sideways;
// footprints press in and photos rise out of the ground at their own point along the trail.
export function init(section) {
  const stage = section.querySelector('[data-herd-stage]');
  const track = section.querySelector('[data-herd-track]');
  const prints = [...section.querySelectorAll('[data-print-p]')];
  const photos = [...section.querySelectorAll('[data-herd-photo]')];
  const end = section.querySelector('[data-herd-end]');

  const mm = gsap.matchMedia();

  mm.add(MQ.desktop, () => {
    stage.classList.add('is-trail');
    const distance = () => track.scrollWidth - innerWidth;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${distance() * 1.1}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    tl.to(track, { x: () => -distance(), duration: 1 }, 0);

    // A footprint presses in just before the viewport's right third passes over it.
    const lead = () => innerWidth / track.scrollWidth;
    prints.forEach((p) => {
      const at = Math.max(0, Number(p.dataset.printP) - lead() * 0.7);
      tl.fromTo(p, { opacity: 0, scale: 1.6, transformOrigin: 'center' }, { opacity: 0.75, scale: 1, duration: 0.02, ease: 'power3.in' }, at);
    });

    // Photos rise out of the ground (clip opens from the bottom) and settle; captions write in.
    photos.forEach((ph) => {
      const at = Math.max(0, Number(ph.dataset.p) - lead() * 0.75);
      const card = ph.querySelector('[data-herd-card]');
      const inner = ph.querySelector('.herd-photo-inner');
      const cap = ph.querySelector('figcaption');
      const r = parseFloat(ph.style.getPropertyValue('--r')) || 0;
      tl.fromTo(card, { y: 80, autoAlpha: 0, rotation: r - 8 }, { y: 0, autoAlpha: 1, rotation: r, duration: 0.06, ease: 'power3.out' }, at)
        .fromTo(inner, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.07, ease: 'power2.out' }, at + 0.01)
        .fromTo(inner.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 0.12 }, at + 0.01)
        .fromTo(cap, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.05 }, at + 0.06);
    });
    tl.fromTo(end, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.86);

    // Mouse: photos tilt toward the cursor like prints you could pick up.
    const cards = photos.map((ph) => ph.querySelector('[data-herd-card]'));
    const tilts = cards.map((card) => ({
      rx: gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' }),
      ry: gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' }),
      el: card,
    }));
    gsap.set(cards, { transformPerspective: 900 });
    const onMove = (e) => {
      tilts.forEach(({ rx, ry, el }) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        const near = Math.max(0, 1 - Math.hypot(dx, dy) * 2.2);
        ry(dx * 22 * near);
        rx(-dy * 18 * near);
      });
    };
    stage.addEventListener('pointermove', onMove);
    return () => {
      gsap.set(cards, { clearProps: 'transform' });
      stage.classList.remove('is-trail');
      stage.removeEventListener('pointermove', onMove);
    };
  });

  mm.add(MQ.mobile, () => {
    photos.forEach((ph) => {
      gsap.fromTo(ph.querySelector('.herd-photo-inner'), { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ph, start: 'top 85%' },
      });
    });
  });
}
