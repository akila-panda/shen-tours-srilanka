import { gsap, MQ } from '../motion.js';

const mm = gsap.matchMedia();
mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
  // The tailgate is "painted" in: corners swing in, the medallion scene opens.
  gsap.from('.corner', { scale: 0, rotate: -40, duration: 1, stagger: 0.08, ease: 'back.out(1.6)' });
  gsap.from('[data-medallion]', { scale: 0.6, autoAlpha: 0, duration: 1.2, delay: 0.2, ease: 'expo.out' });
  gsap.from('.ribbon', { scaleX: 0, duration: 0.9, delay: 0.4, ease: 'expo.out' });
  // Signboards swing up like they're being hung.
  gsap.from('[data-plank]', {
    rotate: () => gsap.utils.random(-10, 10), y: 70, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.signs', start: 'top 80%' },
  });
});
