import { gsap, MQ } from '../motion.js';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// The giant WhatsApp number rises in character by character as the footer arrives.
export function init(footer) {
  const number = footer.querySelector('[data-footer-number]');
  if (!number) return;
  const mm = gsap.matchMedia();
  mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
    const split = SplitText.create(number, { type: 'chars', mask: 'chars', aria: 'auto' });
    gsap.from(split.chars, {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.035,
      ease: 'expo.out',
      scrollTrigger: { trigger: number, start: 'top 90%' },
    });
    return () => split.revert();
  });
}
