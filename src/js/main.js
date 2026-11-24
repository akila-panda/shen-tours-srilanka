import '../styles/main.css';
import './motion.js';

// One module per homepage section (src/js/sections/), each exporting init().
// Sections initialise in page order: ScrollTrigger needs pins higher on the page created before
// the triggers below them, or those triggers measure the wrong positions.
const modules = import.meta.glob('./sections/*.js', { eager: true });
const byName = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/').pop().replace('.js', ''), mod]),
);

for (const el of document.querySelectorAll('[data-section]')) {
  const mod = byName[el.dataset.section];
  if (typeof mod?.init === 'function') mod.init(el);
}
