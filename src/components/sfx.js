/* Tiny sound effects, synthesised with the Web Audio API (no audio files needed).
   Browsers only allow sound after a click, so call audio() from a click handler. */
let ctx;

export function audio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Phone ringing: two bursts of four quick two-tone beeps. Returns a stop() function. */
export function ring(c) {
  const master = c.createGain();
  master.gain.value = 0.22;
  master.connect(c.destination);
  const t0 = c.currentTime + 0.02;
  const oscs = [];
  const beep = (start) => {
    [1000, 1250].forEach((f) => {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const g = c.createGain();
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(1, start + 0.006);
      g.gain.setValueAtTime(1, start + 0.07);
      g.gain.linearRampToValueAtTime(0, start + 0.085);
      o.connect(g);
      g.connect(master);
      o.start(start);
      o.stop(start + 0.09);
      oscs.push(o);
    });
  };
  for (let burst = 0; burst < 2; burst += 1) {
    for (let i = 0; i < 4; i += 1) beep(t0 + burst * 0.8 + i * 0.11);
  }
  return () => {
    try {
      master.gain.cancelScheduledValues(0);
      master.gain.setValueAtTime(0, c.currentTime);
      oscs.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } });
    } catch { /* ignore */ }
  };
}

/** A classic cartoon "brrrp": low sawtooth that sinks in pitch, fluttering, plus a little rasp. */
export function fart(c) {
  const t = c.currentTime + 0.02;
  const dur = 0.95;

  const master = c.createGain();
  master.gain.setValueAtTime(0, t);
  master.gain.linearRampToValueAtTime(0.6, t + 0.03);
  master.gain.setValueAtTime(0.6, t + dur - 0.2);
  master.gain.linearRampToValueAtTime(0, t + dur);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 520;
  lp.Q.value = 4;
  master.connect(lp);
  lp.connect(c.destination);

  // flutter: a fast square LFO opens and closes this gain
  const flutter = c.createGain();
  flutter.gain.value = 0.5;
  const lfo = c.createOscillator();
  lfo.type = 'square';
  lfo.frequency.setValueAtTime(34, t);
  lfo.frequency.linearRampToValueAtTime(17, t + dur);
  const lfoDepth = c.createGain();
  lfoDepth.gain.value = 0.5;
  lfo.connect(lfoDepth);
  lfoDepth.connect(flutter.gain);
  flutter.connect(master);

  // the tone
  const o = c.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(95, t);
  o.frequency.linearRampToValueAtTime(130, t + 0.12);
  o.frequency.exponentialRampToValueAtTime(48, t + dur);
  o.connect(flutter);

  // the rasp
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = buf;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 260;
  band.Q.value = 0.8;
  const noiseGain = c.createGain();
  noiseGain.gain.value = 0.35;
  noise.connect(band);
  band.connect(noiseGain);
  noiseGain.connect(flutter);

  [o, lfo, noise].forEach((n) => { n.start(t); n.stop(t + dur + 0.05); });
}
