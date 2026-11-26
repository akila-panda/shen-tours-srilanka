#!/usr/bin/env python3
"""Turn a clip from assets-src/video into a numbered WebP frame sequence for the scroll scrubber.

  python3 tools/make_frames.py road d    # desktop set for the "road" sequence
  python3 tools/make_frames.py road m    # phone set
  python3 tools/make_frames.py road      # both

Each sequence writes public/media/<name>/<set>/0001.webp … and a poster
(public/media/<name>/poster-<set>.webp, the first frame at a higher quality) for the HTML.
Needs ffmpeg and cwebp (brew install ffmpeg webp).
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# A small grade so the grey overcast footage sits with the laterite and ink palette.
GRADE = 'eq=contrast=1.06:saturation=1.1:gamma=0.98'

# start/end in seconds; count = frames in the set; vf = ffmpeg crop/scale for that set.
SEQUENCES = {
    'road': {
        'src': 'assets-src/video/pexels-road2.mp4',
        'start': 0.0,
        'end': 23.0,
        'sets': {
            # 16:9 landscape, the full frame. Foliage compresses badly, so a light blur
            # (invisible once the canvas is moving) halves the size: about 45 KB a frame.
            'd': {'count': 120, 'vf': f'{GRADE},scale=1280:-2:flags=lanczos,gblur=sigma=0.8', 'q': 44},
            # Portrait 9:16 crop, a little left of centre so the car is in the opening frame.
            'm': {'count': 80, 'vf': f'{GRADE},crop=ih*9/16:ih:iw*0.25:0,scale=540:-2:flags=lanczos,gblur=sigma=0.5', 'q': 44},
        },
    },
}


def run(cmd):
    subprocess.run(cmd, check=True)


def make(name, set_key):
    seq = SEQUENCES[name]
    cfg = seq['sets'][set_key]
    out = ROOT / 'public' / 'media' / name / set_key
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    fps = cfg['count'] / (seq['end'] - seq['start'])
    with tempfile.TemporaryDirectory() as tmp:
        run([
            'ffmpeg', '-v', 'error', '-y',
            '-ss', str(seq['start']), '-to', str(seq['end']),
            '-i', str(ROOT / seq['src']),
            '-vf', f"fps={fps:.5f},{cfg['vf']}",
            '-frames:v', str(cfg['count']),
            '-q:v', '2', f'{tmp}/%04d.jpg',
        ])
        frames = sorted(Path(tmp).glob('*.jpg'))
        for f in frames:
            run(['cwebp', '-quiet', '-q', str(cfg['q']), '-m', '6', str(f), '-o', str(out / f'{f.stem}.webp')])
        run(['cwebp', '-quiet', '-q', '78', '-m', '6', str(frames[0]),
             '-o', str(out.parent / f'poster-{set_key}.webp')])
    total = sum(p.stat().st_size for p in out.glob('*.webp'))
    print(f'{name}/{set_key}: {len(frames)} frames, {total / 1e6:.1f} MB')


if __name__ == '__main__':
    name = sys.argv[1]
    for key in (sys.argv[2:] or SEQUENCES[name]['sets'].keys()):
        make(name, key)
