// Frame-sequence scrubber: draws numbered WebP frames to a <canvas> from a 0–1 progress value.
// Shared by the road hero (R3), the Sigiriya climb (R4) and the hills (R5).
//
//   const seq = createFrameSequence(canvas, { base: '/media/road/d/', count: 120 });
//   seq.seek(0.4);        // from a ScrollTrigger onUpdate
//   seq.destroy();        // from the gsap.matchMedia cleanup
//
// Loading is coarse-to-fine: every 16th frame first, then every 8th, 4th, 2nd and the rest, so the
// scrub works (a little steppy) within a few hundred KB and sharpens as the rest arrives. Until a
// frame for the requested position exists, the nearest loaded one is drawn. The <img> poster in
// the HTML stays underneath, so nothing is ever blank.

const PASSES = [16, 8, 4, 2, 1];
const PARALLEL = 6;

export function createFrameSequence(canvas, { base, count, ext = 'webp', onFirstFrame } = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const frames = new Array(count);
  const url = (i) => `${base}${String(i + 1).padStart(4, '0')}.${ext}`;

  let wanted = 0;
  let drawn = -1;
  let raf = 0;
  let dead = false;
  let first = true;

  // Coarse-to-fine queue, each index once.
  const queue = [];
  const seen = new Set();
  for (const step of PASSES) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        queue.push(i);
      }
    }
  }
  if (!seen.has(count - 1)) queue.splice(1, 0, count - 1);

  const loadOne = async (i) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = url(i);
    try {
      await img.decode();
    } catch {
      return;
    }
    if (dead) return;
    frames[i] = img;
    if (first) {
      first = false;
      canvas.classList.add('is-ready');
      onFirstFrame?.();
    }
    // A newly loaded frame may be closer to the wanted one than what's on screen.
    if (Math.abs(i - wanted) < Math.abs(drawn - wanted)) schedule();
  };

  const worker = async () => {
    while (!dead && queue.length) await loadOne(queue.shift());
  };
  for (let w = 0; w < PARALLEL; w++) worker();

  const nearest = (i) => {
    if (frames[i]) return i;
    for (let d = 1; d < count; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  };

  // Cover-fit, like object-fit: cover, with an optional focus point (0–1).
  let focusX = 0.5;
  let focusY = 0.5;
  const draw = () => {
    raf = 0;
    const i = nearest(wanted);
    if (i < 0) return;
    const img = frames[i];
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) * focusX, (ch - h) * focusY, w, h);
    drawn = i;
  };
  const schedule = () => {
    if (!raf && !dead) raf = requestAnimationFrame(draw);
  };

  // Backing store follows the CSS box; DPR capped at 2 (frames are 1280 wide anyway).
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    drawn = -1;
    schedule();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  return {
    seek(progress) {
      const i = Math.round(Math.min(1, Math.max(0, progress)) * (count - 1));
      if (i === wanted && i === drawn) return;
      wanted = i;
      schedule();
    },
    focus(x, y) {
      focusX = x;
      focusY = y;
      drawn = -1;
      schedule();
    },
    destroy() {
      dead = true;
      queue.length = 0;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.classList.remove('is-ready');
    },
  };
}

// Frames are a progressive enhancement: skip them for data savers and very slow connections.
export function canLoadFrames() {
  const c = navigator.connection;
  if (!c) return true;
  return !c.saveData && !/(^|-)2g$/.test(c.effectiveType || '');
}
