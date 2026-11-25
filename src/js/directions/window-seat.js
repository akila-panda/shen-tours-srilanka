import { gsap, ScrollTrigger, MQ } from '../motion.js';

const SKY = {
  dawn: ['#f1d2c9', '#121212'],
  morning: ['#fbe9df', '#121212'],
  day: ['#ffffff', '#121212'],
  mist: ['#d3e3d8', '#121212'],
  dusk: ['#e8955a', '#121212'],
  night: ['#15193a', '#ffffff'],
};
const body = document.body;
const setTime = (t) => {
  const [bg, fg] = SKY[t] ?? SKY.day;
  body.style.setProperty('--sky', bg);
  body.style.setProperty('--fg', fg);
  document.documentElement.style.background = bg;
};

const mm = gsap.matchMedia();

// Page colour follows whichever "time" is in the middle of the screen (CSS transition does the fade).
document.querySelectorAll('[data-time]').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 55%',
    end: 'bottom 55%',
    onToggle: (self) => self.isActive && setTime(el.dataset.time),
  });
});

mm.add(MQ.desktop, () => {
  // The carriage pins and slides sideways; scenery inside each window drifts the other way.
  const rail = document.querySelector('[data-rail]');
  const train = document.querySelector('[data-train]');
  rail.style.overflow = 'visible';
  const distance = () => train.scrollWidth - window.innerWidth + 64;
  const tween = gsap.to(train, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-carriage]',
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const stops = [...train.children];
        const i = Math.min(stops.length - 1, Math.floor(self.progress * stops.length));
        setTime(stops[i].dataset.time);
      },
    },
  });
  document.querySelectorAll('[data-scenery]').forEach((img) => {
    gsap.fromTo(img, { xPercent: -6 }, {
      xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
    });
  });
  return () => { rail.style.overflow = ''; };
});

mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
  gsap.from('.hero h1', { y: 30, duration: 1.2, ease: 'expo.out' });
  gsap.from('.hero .lede, .hero-cta', { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.12, delay: 0.15, ease: 'expo.out' });
  gsap.from('.hero .window', { clipPath: 'inset(0 0 100% 0 round 72px)', duration: 1.6, ease: 'expo.inOut' });
});
