// Small Web Audio effects, synthesized locally so the three-file game stays offline.
class SoccerAudio {
  constructor() { this.enabled=true; this.context=null; this.voices=new Set(); }
  unlock() {
    if(!this.enabled) return;
    try {
      const Audio=window.AudioContext||window.webkitAudioContext;
      if(!Audio) return;
      this.context ||= new Audio();
      if(this.context.state==='suspended') this.context.resume().catch(()=>{});
    } catch { /* The match remains playable when audio is unavailable. */ }
  }
  stop() {
    for(const source of this.voices) { try { source.stop(); } catch {} }
    this.voices.clear();
  }
  track(source,output) {
    this.voices.add(source);
    source.onended=()=>{this.voices.delete(source);source.disconnect();output.disconnect();};
  }
  tone(from,to,duration,type='sine',delay=0,volume=.07) {
    const c=this.context,at=c.currentTime+delay,source=c.createOscillator(),gain=c.createGain();
    source.type=type;source.frequency.setValueAtTime(from,at);source.frequency.exponentialRampToValueAtTime(to,at+duration);
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
    source.connect(gain);gain.connect(c.destination);this.track(source,gain);source.start(at);source.stop(at+duration+.01);
  }
  cheer() {
    const c=this.context,duration=.85,buffer=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),data=buffer.getChannelData(0);
    let seed=47;
    for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)|0;data[i]=(seed/2147483648)*(.65+.35*Math.sin(i/c.sampleRate*43));}
    const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),at=c.currentTime;
    source.buffer=buffer;filter.type='bandpass';filter.frequency.value=1400;filter.Q.value=.7;
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.14,at+.08);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
    source.connect(filter);filter.connect(gain);gain.connect(c.destination);this.track(source,gain);
    source.onended=()=>{this.voices.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};source.start();source.stop(at+duration);
  }
  play(event) {
    if(!this.enabled||!this.context||this.context.state==='closed') return;
    switch(event) {
      case 'kickoff': this.tone(1800,2200,.18,'sine');this.tone(2000,1800,.23,'sine',.23);break;
      case 'shot': this.tone(180,45,.13,'triangle',0,.13);break;
      case 'chip': this.tone(230,65,.12,'triangle',0,.11);this.tone(550,1150,.19,'sine',.03,.045);break;
      case 'steal': this.tone(300,150,.1,'square',0,.035);break;
      case 'tackle': this.tone(380,700,.12,'triangle');break;
      case 'save': this.tone(120,45,.13,'triangle',0,.13);this.tone(480,270,.17,'sine',.08);break;
      case 'bounce': this.tone(240,85,.08,'triangle',0,.055);break;
      case 'goal': case 'kids-goal':
        this.cheer();
        (event==='goal'?[523,659,784,1047]:[440,392,330]).forEach((note,i)=>this.tone(note,note,.2,'triangle',i*.13,.08));break;
      case 'fulltime':
        [0,.18,.36].forEach((delay,i)=>this.tone(2100,1800,i===2?.4:.12,'sine',delay,.06));break;
    }
  }
}
