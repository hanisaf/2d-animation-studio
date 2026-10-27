# scenes/talent_show/scene26_perfect_drop/fix_housam.py: builds housam_vocal.wav, a sung "Hussam" (حسام) that mix_audio.py lays over the
# song's "Housam" (17.18 s), which the Gemini singer pronounces "HOW-sam". The word is spoken by macOS's Arabic voice (Majed), then
# re-sung with the WORLD vocoder: each syllable is moved onto the song's beat, the pitch is set to the sung note (E4, ~330 Hz, measured
# from song.mp3 at 17.46–17.62 s) and the vocal tract is shifted up to sit nearer the singer's. Needs macOS `say` and pyworld:
#   python3 -m venv /tmp/v && /tmp/v/bin/pip install pyworld "setuptools<81" && /tmp/v/bin/python scenes/talent_show/scene26_perfect_drop/fix_housam.py
import os, subprocess, tempfile, warnings, numpy as np
warnings.filterwarnings('ignore')
import pyworld as pw
HERE = os.path.dirname(os.path.abspath(__file__))
FF = os.environ.get('FFMPEG') or os.path.join(HERE, '../../../node_modules/ffmpeg-static/ffmpeg')
SR, FP = 48000, 5.0                                                  # sample rate, WORLD frame period (ms)

with tempfile.TemporaryDirectory() as d:
    aiff = os.path.join(d, 'h.aiff')
    subprocess.run(['say', '-v', 'Majed', '-r', '150', '-o', aiff, 'حُسَام'], check=True)
    raw = subprocess.run([FF, '-loglevel', 'error', '-i', aiff, '-f', 'f64le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float64).copy()
f0, tt = pw.harvest(x, SR, f0_floor=60, f0_ceil=400, frame_period=FP)
sp, ap = pw.cheaptrick(x, f0, tt, SR), pw.d4c(x, f0, tt, SR)

# the spoken word's landmarks (seconds into Majed's "حُسَام" at -r 150, read off its loudness): the "h", the voiced "u",
# the "s", the voiced "aa", the "m" tail. The voicing tracker smears across the "s", so it's set unvoiced by hand.
SRC = np.array([.09, .12, .20, .34, .60, .72])
src = SRC / (FP / 1000)
v = (f0 > 0) & ~((tt > SRC[2]) & (tt < SRC[3] - .01)) & (tt > SRC[1] - .01)
# where they land in the song (seconds after 17.0 s): "Hu" on the word's beat, "sam" on the measured 330 Hz note
dst = np.array([.14, .19, .36, .44, .57, .63]) / (FP / 1000)
n = int(dst[-1]) + 1
pos = np.interp(np.arange(n), dst, src)                              # time warp: song frame → spoken frame
i0 = np.clip(np.floor(pos).astype(int), 0, len(f0) - 1)
SP, AP, V = sp[i0], ap[i0], v[i0]

# the melody: E4 with a little vibrato, scooping up into each syllable as singers do
t = np.arange(n) * FP / 1000
F0 = 330 * (1 + .012 * np.sin(2 * np.pi * 5.5 * t)) * (1 - .04 * np.exp(-((t - .19) / .03) ** 2) - .04 * np.exp(-((t - .44) / .03) ** 2))
F0 = np.where(V, F0, 0)

# move the vocal tract up (formants ×1.17) so the man's voice sits nearer the singer's
fft = SP.shape[1]; k = np.arange(fft); w = np.minimum(k / 1.17, fft - 1)
SP = np.array([np.interp(w, k, r) for r in SP])
y = pw.synthesize(np.ascontiguousarray(F0), np.ascontiguousarray(SP), np.ascontiguousarray(AP), SR, FP)
y = y[:int(.66 * SR)]
y *= np.minimum(1, np.arange(len(y)) / (.12 * SR))                 # fade in from the "h"
y /= np.abs(y).max() + 1e-9
# the file starts at 17.0 s in the song
subprocess.run([FF, '-y', '-loglevel', 'error', '-f', 'f64le', '-ac', '1', '-ar', str(SR), '-i', '-', '-c:a', 'pcm_s16le', os.path.join(HERE, 'housam_vocal.wav')],
               input=y.astype(np.float64).tobytes(), check=True)
print('wrote housam_vocal.wav', round(len(y) / SR, 2), 's')
