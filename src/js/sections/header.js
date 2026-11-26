import { gsap, ScrollTrigger, lenis, MQ } from '../motion.js';

const root = document.documentElement;

export function init(header) {
  initChromeState();
  initCounter();
  initMenu();

  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    // Badge: slow constant spin, sped up (and reversed on scroll-up) by scroll velocity.
    const ring = header.querySelector('.badge-ring');
    const spin = gsap.to(ring, { rotation: 360, duration: 24, ease: 'none', repeat: -1 });
    const settle = gsap.quickTo(spin, 'timeScale', { duration: 0.8, ease: 'power3.out' });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        const v = self.getVelocity();
        const dir = v < 0 ? -1 : 1;
        spin.timeScale(dir * gsap.utils.clamp(1, 8, Math.abs(v) / 250));
        settle(v < 0 ? -1 : 1);
      },
    });
    return () => spin.kill();
  });
}

// Transparent header over the hero photo; solid once the hero has scrolled away.
function initChromeState() {
  const hero = document.querySelector('[data-section="hero"]');
  if (!hero) return;
  // The hero pins (hero.js), so "scrolled away" is the end of its pin plus its own height.
  // main.js sorts triggers so the hero's is refreshed before this one reads it.
  const heroPin = () => ScrollTrigger.getAll().find((t) => t.pin === hero);
  ScrollTrigger.create({
    start: () => {
      const pin = heroPin();
      return (pin ? pin.end : hero.offsetTop) + hero.offsetHeight - 72;
    },
    onEnter: () => root.classList.add('past-hero'),
    onLeaveBack: () => root.classList.remove('past-hero'),
  });
}

// Odometer on the left edge: three rolling digits, 000 → 100 with page progress.
function initCounter() {
  const box = document.querySelector('[data-odometer]');
  if (!box) return;
  const digits = [...box.querySelectorAll('.odometer-digit')];
  // Each digit becomes a column 0–9 that slides vertically.
  digits.forEach((d) => {
    d.innerHTML = `<span style="display:block;will-change:transform">${[...Array(10).keys()].map((n) => `<span>${n}</span>`).join('')}</span>`;
  });
  const cols = digits.map((d) => d.firstElementChild);
  const set = (value) => {
    const str = String(Math.round(value)).padStart(3, '0');
    cols.forEach((col, i) => {
      col.style.transform = `translateY(${-Number(str[i]) * 1.6}rem)`;
    });
  };
  set(0);
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => set(self.progress * 100) });
}

// Full-screen menu: opened with a class (no hash change), Esc closes, focus is kept inside and
// returned to the menu button. Without JS the same element opens via :target.
function initMenu() {
  const menu = document.querySelector('[data-menu]');
  const opener = document.querySelector('[data-menu-open]');
  if (!menu || !opener) return;
  const closer = menu.querySelector('[data-menu-close]');
  const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled])')];

  const open = () => {
    menu.classList.add('is-animated', 'is-open');
    opener.setAttribute('aria-expanded', 'true');
    root.style.overflow = 'hidden';
    lenis?.stop();
    focusables()[0]?.focus();
    document.addEventListener('keydown', onKey);
  };
  const close = (returnFocus = true) => {
    menu.classList.remove('is-open');
    opener.setAttribute('aria-expanded', 'false');
    root.style.overflow = '';
    lenis?.start();
    document.removeEventListener('keydown', onKey);
    if (returnFocus) opener.focus();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  opener.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  });
  closer.addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });
  // Section links: close, then scroll there smoothly.
  menu.querySelectorAll('.menu-links a').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      close(false);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -72 });
      else target.scrollIntoView();
    });
  });
}
