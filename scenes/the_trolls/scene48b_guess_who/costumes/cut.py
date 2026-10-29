from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage as nd
# Cuts the monsters out of Alma's drawing into transparent PNGs (run from this folder: python3 cut.py).
# BOX is each monster's crop in the scan; CUT blanks out neighbours that overlap it; the white ghost's outline runs off the scan,
# so it is filled row by row. The PNGs here were then shrunk to at most 720 px.
import os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '..', 'scene47_troll_analytics', 'alma_monsters.jpg')
im = Image.open(SRC).convert('RGB'); A = np.asarray(im).astype(int)
BOX = {   # x0, y0, x1, y1 in the scan
  'pink_ghost': (0, 30, 610, 505), 'bird': (690, 30, 1320, 440), 'owl': (1185, 130, 1540, 590),
  'bat': (180, 290, 1510, 1130), 'white_ghost': (0, 790, 445, 1390), 'cat': (1110, 940, 1543, 1390),
  'pumpkin': (230, 1100, 1350, 2000), 'bee': (0, 1500, 320, 2000),
}
CUT = { 'pumpkin': [(0, 0, 500, 1360), (0, 1360, 262, 2000)], 'bat': [(680, 1020, 900, 1140), (0, 880, 360, 1200)], 'bee': [(278, 1560, 400, 2000), (258, 1600, 400, 2000)] }
CLOSE = {}
INKCLOSE = {}
sheet = Image.new('RGBA', (1600, 1000), (60, 90, 120, 255)); x = 0; y = 0; rowh = 0
for name, (x0, y0, x1, y1) in BOX.items():
    a = A[y0:y1, x0:x1]; mx, mn = a.max(2), a.min(2)
    paper = (mn > 200) & ((mx - mn) < 32)
    ax, ay = np.meshgrid(np.arange(x0, x1), np.arange(y0, y1))
    ink = nd.binary_closing(~paper, iterations=INKCLOSE.get(name, 4))
    for (mx0, my0, mx1, my1) in CUT.get(name, []): ink[(ax >= mx0) & (ax < mx1) & (ay >= my0) & (ay < my1)] = False
    if name == 'white_ghost':                 # its outline runs off the scan: fill it row by row (spans above, run parity in the wavy hem)
        dark = nd.binary_closing((mx < 95) & (ax < 372), iterations=2)
        body = np.zeros_like(dark)
        for r in range(dark.shape[0]):
            xs = np.where(dark[r])[0]
            if len(xs) < 2: continue
            if ay[r, 0] < 1285: body[r, xs[0]:xs[-1] + 1] = True; continue
            runs, inside, prev = [], False, -9
            for x in xs:
                if x != prev + 1: runs.append([x, x])
                else: runs[-1][1] = x
                prev = x
            for i, (r0, r1) in enumerate(runs):
                body[r, r0:r1 + 1] = True
                if i % 2 == 0 and i + 1 < len(runs): body[r, r1:runs[i + 1][0] + 1] = True
        body |= nd.binary_closing(body, structure=np.ones((9, 1)), iterations=2) & (ay < 1285)
        bucket = nd.binary_dilation((a[..., 0] > 170) & (a[..., 1] < 130) & (a[..., 2] < 110), iterations=6)
        handle = nd.binary_dilation((mx < 95) & (ax >= 340) & (ay < 1200), iterations=2)
        ink = nd.binary_fill_holes(nd.binary_closing(body | bucket | handle, iterations=2))
    lab, n = nd.label(~ink)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    fg = ~bg & ink
    fg = nd.binary_opening(fg, iterations=2)
    lab2, n2 = nd.label(fg, structure=np.ones((3, 3)))
    if n2:
        sizes = nd.sum(fg, lab2, range(1, n2 + 1)); keep = 1 + int(np.argmax(sizes))
        fg = lab2 == keep
    if name in CLOSE: fg = nd.binary_closing(fg, iterations=CLOSE[name])
    fg = nd.binary_fill_holes(fg)
    if name == 'white_ghost': fg |= ink & (ay < 1285)
    alpha = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
    out = Image.fromarray(a.astype('uint8')).convert('RGBA'); out.putalpha(alpha)
    bb = out.getbbox(); out = out.crop(bb)
    out.thumbnail((720, 720)); out.save(os.path.join(HERE, f'{name}.png')); print(name, out.size)
    t = out.copy(); t.thumbnail((380, 380))
    if x + t.width > 1600: x = 0; y += rowh + 10; rowh = 0
    sheet.alpha_composite(t, (x, y)); x += t.width + 10; rowh = max(rowh, t.height)
sheet.save(os.path.join(HERE, 'contact_sheet.png'))
