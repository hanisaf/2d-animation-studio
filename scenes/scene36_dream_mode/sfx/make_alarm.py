# Synthesizes the alarm-clock rings mixed over the song (Gemini's track has none): a hammer rattling between two bells.
#   python3 sfx/make_alarm.py → sfx/alarm.wav (180 s, silent except the rings), then mix it with song_gemini.mp3 into audio.mp3:
#   ffmpeg -i song_gemini.mp3 -i sfx/alarm.wav -filter_complex "[0][1]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.97" -b:a 192k audio.mp3
import numpy as np, wave
SR, DUR = 44100, 180.17
RINGS = [(167.2, 168.4, .95), (172.05, 174.2, .45)]          # (start, end, level): the boss's RIIING, then Danny's real clock at the wake-up
out = np.zeros(int(SR * DUR))
bells = [[2380, 3410, 5150, 6900], [2610, 3720, 5530, 7300]]   # two slightly different bells, with inharmonic partials
amps = [1, .55, .32, .18]
for t0, t1, lvl in RINGS:
    rate, k, t = 19.0, 0, t0                                    # the hammer strikes ~19 times a second, alternating bells
    while t < t1:
        n = int(.09 * SR); tt = np.arange(n) / SR
        tone = sum(a * np.sin(2 * np.pi * f * tt + k) for f, a in zip(bells[k % 2], amps)) * np.exp(-tt * 38)
        clank = np.random.default_rng(k).standard_normal(n) * np.exp(-tt * 400) * .25
        env = min(1, (t - t0) / .03) * min(1, (t1 - t) / .12)
        i = int(t * SR); out[i:i + n] += (tone + clank)[:len(out) - i] * lvl * env
        t += 1 / rate; k += 1
out = np.clip(out / 2.2, -1, 1)
st = (np.stack([out, out * .92], 1) * 32767).astype(np.int16)
with wave.open('sfx/alarm.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
