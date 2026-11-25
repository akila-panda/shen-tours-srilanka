#!/usr/bin/env python3
"""Download every file in src/images/manifest.tsv into assets-src/ (skips files already present)."""
import csv, os, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Wikimedia's robot policy asks for a contact in the User-Agent (https://w.wiki/4wJS).
UA = 'ShenToursAssetFetcher/0.1 (+https://github.com/akila-panda/shen-tours-srilanka)'

rows = list(csv.DictReader(open(os.path.join(ROOT, 'src/images/manifest.tsv')), delimiter='\t'))
failed = []
for r in rows:
    path = os.path.join(ROOT, r['local_path'])
    if os.path.exists(path) and os.path.getsize(path) > 0:
        print('skip', r['key'], flush=True)
        continue
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if 'wikimedia.org' in r['file_url']:
        time.sleep(4)  # be gentle: one request every few seconds
    try:
        req = urllib.request.Request(r['file_url'], headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=600) as resp, open(path + '.part', 'wb') as f:
            while chunk := resp.read(1 << 20):
                f.write(chunk)
        os.replace(path + '.part', path)
        print('ok', f"{os.path.getsize(path) / 1048576:.1f}MB", r['key'], flush=True)
    except Exception as e:  # keep going; report at the end
        if os.path.exists(path + '.part'):
            os.remove(path + '.part')
        failed.append(r['key'])
        print('FAIL', r['key'], e, flush=True)
print('DONE', 'failed:', ' '.join(failed) or 'none')
sys.exit(1 if failed else 0)
