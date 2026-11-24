import { ScrollTrigger } from '../motion.js';

// The photo panel is position: sticky (CSS), so it works without JS. JS only decides which tour
// is active: the item crossing the middle of the screen, or the one hovered / focused.
export function init(section) {
  const items = [...section.querySelectorAll('[data-tour-item]')];
  const photos = [...section.querySelectorAll('[data-tour-photo]')];
  if (!items.length) return;

  let current = 0;
  const setActive = (i) => {
    if (i === current) return;
    current = i;
    items.forEach((el, j) => el.classList.toggle('is-active', j === i));
    photos.forEach((el, j) => el.classList.toggle('is-active', j === i));
  };

  const desktop = matchMedia('(min-width: 768px)');
  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && desktop.matches && setActive(i),
    });
    const link = item.querySelector('a');
    link.addEventListener('pointerenter', () => desktop.matches && setActive(i));
    link.addEventListener('focus', () => setActive(i));
  });
}
