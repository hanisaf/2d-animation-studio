# Joins the main take and the encore take into audio.mp3: the main take, trimmed by `cut` s so riddle 1 starts on 12.0, plays to its own
# ending, then the encore with its first beat (`fin_beat` s into the file) on J. Usage: python3 stitch.py main.mp3 encore.mp3 out.mp3 cut fin_beat J
import subprocess, sys, numpy as np
main, fin, out_f, cut, fin_beat, J = sys.argv[1], sys.argv[2], sys.argv[3], *map(float, sys.argv[4:7])
sr = 44100
def load(f): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','2','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout,np.float32).reshape(-1,2).copy()
a, b = load(main)[int(cut*sr):], load(fin)
b0 = J - fin_beat
out = np.zeros((int(b0*sr) + len(b), 2), np.float32); out[:len(a)] += a[:len(out)]
fb = np.ones(len(b)); n = int(.01*sr); fb[:n] = np.linspace(0, 1, n); out[int(b0*sr):] += b * fb[:,None]
n = int(1.5*sr); out[-n:] *= np.linspace(1, 0, n)[:,None] ** 2   # the finale take is cut at 30 s: fade it
out /= max(1, np.abs(out).max()/.98)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','-','-b:a','192k',out_f], input=out.tobytes(), check=True)
print('dur %.2f, finale file starts at %.3f' % (len(out)/sr, b0))
