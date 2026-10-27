# scenes/talent_show/scene26_perfect_drop/mix_audio.py: builds audio.mp3 = song.mp3 (the Gemini song, 149.8 s) + the teaser's sound after it.
# The song ends dead at 146.9 s; this adds the mic hitting the stage, a little PA feedback, drips, Neptune's splash, two mic taps,
# Neptune's cartoon voice (vowel-like syllables, like the studio's synthesized voices; the bubbles carry the words) and a bubbly
# sting for THE END. It also fixes the singer's "HOW-sam" (17.18 s): her vocal is ducked under the word and housam_vocal.wav
# (a sung "Hussam", حسام, made by fix_housam.py) is laid on top. The times match T_ in scene.js. Run from the project root:
#   python3 scenes/talent_show/scene26_perfect_drop/mix_audio.py
import os, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
FF = os.environ.get('FFMPEG') or os.path.join(HERE, '../../../node_modules/ffmpeg-static/ffmpeg')
SR, END = 48000, 160.6
raw = subprocess.run([FF, '-loglevel', 'error', '-i', os.path.join(HERE, 'song.mp3'), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
song = np.frombuffer(raw, np.float32).reshape(-1, 2)
mix = np.zeros((int(END * SR), 2), np.float32); mix[:len(song)] = song[:len(mix)]
rng = np.random.default_rng(26)

def add(t0, sig, gain=1.0, pan=0.0):
    i = int(t0 * SR); sig = sig[: max(0, len(mix) - i)]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * gain * l * 1.41; mix[i:i + len(sig), 1] += sig * gain * r * 1.41
def tt(d): return np.arange(int(d * SR)) / SR
def band_duck(t0, t1, lo, hi, gain):                   # turn a frequency band down between t0 and t1 (short-time FFT, overlap-add)
    N, hop = 2048, 512; a, b = int(t0 * SR) - N, int(t1 * SR) + N; seg = mix[a:b].copy(); out = np.zeros_like(seg); wsum = np.zeros(len(seg))
    win = np.hanning(N); f = np.fft.rfftfreq(N, 1 / SR)
    band = np.clip(np.minimum((f - lo * .7) / (lo * .3), (hi * 1.3 - f) / (hi * .3)), 0, 1)
    for i in range(0, len(seg) - N, hop):
        tc = (a + i + N / 2) / SR; g = gain(tc); m = 1 - band * (1 - g)
        for c in range(2): out[i:i + N, c] += np.fft.irfft(np.fft.rfft(seg[i:i + N, c] * win) * m, N) * win
        wsum[i:i + N] += win ** 2
    mix[a + N:b - N] = (out / np.maximum(wsum, 1e-3)[:, None])[N:-N]          # only the fully covered middle
def lowpass(x, a):                                    # one-pole low-pass, a in (0, 1): smaller = darker
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y
def echo(x, delay=.17, fb=.35, n=4):                   # the gym PA: a few slap-back repeats
    out = np.concatenate([x, np.zeros(int(delay * n * SR))]); d = int(delay * SR)
    for k in range(1, n + 1): out[k * d:k * d + len(x)] += x * fb ** k
    return out

# "Housam" → "Hussam": duck the singer's vowel band under the word (hardest under "HOW"), then lay the re-sung word on top, with a
# little room so it sits in the mix. housam_vocal.wav starts at 17.0 s.
band_duck(17.08, 17.66, 250, 4000, lambda tc: max(.15, 1 - .8 * np.clip(min((tc - 17.08) / .06, (17.42 - tc) / .06), 0, 1) - .45 * np.clip(min((tc - 17.36) / .04, (17.62 - tc) / .04), 0, 1)))
hv = np.frombuffer(subprocess.run([FF, '-loglevel', 'error', '-i', os.path.join(HERE, 'housam_vocal.wav'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout, np.float32)
hv = hv + sum(np.concatenate([np.zeros(int(d * SR), np.float32), hv])[:len(hv)] * g for d, g in ((.031, .25), (.053, .18), (.079, .12), (.11, .08)))
add(17.0, hv, .3)

# the mic hits the stage: a low body thump, a gritty click, then a short PA feedback whine
t = tt(.7); thud = np.sin(2 * np.pi * (70 * t - 30 * t * t)) * np.exp(-t * 9) + lowpass(rng.normal(0, 1, len(t)), .08) * np.exp(-t * 25) * .8
add(147.15, thud, .9)
add(147.15, rng.normal(0, 1, int(.02 * SR)) * np.exp(-np.arange(int(.02 * SR)) / 200), .35)
t = tt(1.3); add(147.3, np.sin(2 * np.pi * 2350 * t + 3 * np.sin(2 * np.pi * 5 * t)) * np.sin(np.pi * t / 1.3) ** 2 * .9, .07)
# drips: a quick upward "plip"
for d in (148.9, 149.55, 150.15):
    t = tt(.09); add(d, np.sin(2 * np.pi * (900 * t + 9000 * t * t)) * np.exp(-t * 40), .35, .2)
# the splash as Neptune rises: a burst of filtered noise and a cluster of bubbles
t = tt(1.0); splash = (rng.normal(0, 1, len(t)) - lowpass(rng.normal(0, 1, len(t)), .05)) * np.exp(-t * 4) * (1 - np.exp(-t * 60))
add(151.1, splash, .35)
for k in range(14):
    b0 = 151.15 + rng.uniform(0, .9); f = rng.uniform(500, 1400); t = tt(.07)
    add(b0, np.sin(2 * np.pi * (f * t + 6000 * t * t)) * np.exp(-t * 50), .18, rng.uniform(-.5, .5))
# two mic taps through the PA
for d in (152.7, 152.95):
    t = tt(.12); add(d, echo(np.sin(2 * np.pi * 110 * t) * np.exp(-t * 35) + rng.normal(0, .3, len(t)) * np.exp(-t * 120)), .6)

# ---- cartoon voices: each syllable is a harmonic tone shaped by two vowel formants, with a pitch glide ----
VOW = {'a': (750, 1250), 'e': (500, 1900), 'i': (320, 2300), 'o': (480, 900), 'u': (350, 800)}
def syl(f0, d, vowel, glide=0.0, bright=1.0):
    t = tt(d); f = f0 * (1 + glide * t / d) * (1 + .03 * np.sin(2 * np.pi * 6 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR; F1, F2 = VOW[vowel]; out = np.zeros_like(t)
    for h in range(1, 28):
        fh = h * f0
        if fh > 5000: break
        w = np.exp(-((fh - F1) / 160) ** 2) + .7 * np.exp(-((fh - F2) / 260) ** 2) + .12 / h * bright
        out += w * np.sin(h * ph)
    env = np.minimum(1, t / .018) * np.minimum(1, (d - t) / .07)
    return out * env / 3
def say(t0, sylls, base, gain=.5, pa=False, pan=0.0):
    for (dt, d, v, g, mul) in sylls:
        s = syl(base * mul, d, v, g)
        add(t0 + dt, echo(s) if pa else s, gain, pan)
# Neptune (a big, goofy, booming announcer, ~205 Hz), through the PA: "Tes-ting… tes-ting…"
say(153.25, [(0, .16, 'e', .05, 1.0), (.2, .22, 'i', -.15, .95), (.7, .16, 'e', .05, 1.05), (.9, .3, 'i', -.25, .9)], 205, .45, pa=True)
# "KING Nep-tune is in the house!"
say(155.1, [(0, .42, 'i', .25, 1.15), (.5, .14, 'e', 0, 1.0), (.66, .16, 'u', -.05, .95), (.86, .1, 'i', 0, 1.0), (1.0, .1, 'i', 0, 1.0), (1.14, .1, 'a', 0, .98), (1.3, .5, 'a', .3, 1.1)], 205, .5, pa=True)
# Neptune cracks himself up
say(157.0, [(0, .1, 'a', .1, 1.25), (.13, .1, 'a', .1, 1.3), (.26, .14, 'a', -.1, 1.35)], 205, .3, pa=True)
# the sting for THE END: a rising bubbly arpeggio over a soft chord
for k, n in enumerate([0, 4, 7, 12, 16, 19]):
    f = 392 * 2 ** (n / 12); t = tt(.5); add(158.9 + k * .09, np.sin(2 * np.pi * f * t) * np.exp(-t * 5), .16, -.4 + .16 * k)
t = tt(1.6)
pad = sum(np.sin(2 * np.pi * 196 * 2 ** (n / 12) * t) for n in (0, 4, 7, 12)) / 4 * np.minimum(1, t / .4) * np.minimum(1, (1.6 - t) / 1.0)
add(159.0, pad, .16)

peak = np.abs(mix).max()
if peak > .98: mix *= .98 / peak
subprocess.run([FF, '-y', '-loglevel', 'error', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(HERE, 'audio.mp3')],
               input=mix.astype(np.float32).tobytes(), check=True)
print('wrote audio.mp3', round(len(mix) / SR, 2), 's, peak', round(float(peak), 3))
