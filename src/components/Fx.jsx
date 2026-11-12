import React, { useMemo } from 'react';

/* ── pixel clouds drifting across the desktop ── */
const CLOUD = [
  '....wwww........',
  '..wwwwwwww..ww..',
  '.wwwwwwwwwwwwww.',
  'wwwwwwwwwwwwwwww',
  '.ssssssssssssss.',
];
function CloudSprite() {
  return (
    <svg viewBox="0 0 16 5" shapeRendering="crispEdges" width="100%" height="100%">
      {CLOUD.flatMap((row, y) => [...row].map((k, x) => (k === '.' ? null
        : <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={k === 'w' ? '#fff' : '#d6e8fc'} />)))}
    </svg>
  );
}
const CLOUDS = [
  { top: 6, w: 150, dur: 95, delay: -10, op: 0.85 },
  { top: 19, w: 96, dur: 130, delay: -70, op: 0.6 },
  { top: 33, w: 120, dur: 110, delay: -40, op: 0.7 },
  { top: 72, w: 80, dur: 150, delay: -100, op: 0.45 },
  { top: 86, w: 130, dur: 120, delay: -20, op: 0.5 },
];
export function Clouds() {
  return (
    <div className="clouds" aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <div key={i} className="cloud" style={{ top: `${c.top}%`, width: c.w, height: c.w * 5 / 16, opacity: c.op, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}>
          <CloudSprite />
        </div>
      ))}
    </div>
  );
}

/* ── pixel confetti burst (mount it to fire) ── */
const COLORS = ['#d9442b', '#f08a24', '#f5c318', '#2e8b2e', '#0947cc', '#8b4fd6', '#7fb2ff'];
export function Confetti({ count = 36 }) {
  const bits = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const d = 90 + Math.random() * 140;
    return {
      x: Math.cos(a) * d, y: Math.sin(a) * d - 60, r: Math.round(Math.random() * 4) * 90,
      c: COLORS[i % COLORS.length], s: 5 + (i % 3) * 2, delay: Math.random() * 0.08,
    };
  }), [count]);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <i key={i} style={{ '--x': `${b.x}px`, '--y': `${b.y}px`, '--r': `${b.r}deg`, background: b.c, width: b.s, height: b.s, animationDelay: `${b.delay}s` }} />
      ))}
    </div>
  );
}

/* ── twinkling pixel sparkles around an element ── */
const SPOTS = [[4, 10], [18, 78], [46, 4], [70, 92], [88, 30], [30, 52], [60, 64], [10, 96]];
export function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      {SPOTS.map(([t, l], i) => (
        <svg key={i} viewBox="0 0 5 5" shapeRendering="crispEdges" style={{ top: `${t}%`, left: `${l}%`, animationDelay: `${i * 0.35}s` }}>
          <rect x="2" y="0" width="1" height="5" fill="#f5c318" />
          <rect x="0" y="2" width="5" height="1" fill="#f5c318" />
          <rect x="2" y="2" width="1" height="1" fill="#fff" />
        </svg>
      ))}
    </div>
  );
}

/* ── short "loading section…" bar shown when entering a new section ── */
export function SectionLoader({ name }) {
  return (
    <div className="loader" role="status">
      <div className="loader-box">
        <div className="loader-title">Loading {name}<span className="dots" /></div>
        <div className="loader-track"><i /></div>
      </div>
    </div>
  );
}

/* ── easter egg: tiny pixel pig-man peeks out when "June" is on screen ── */
const PORK = [
  '..nn........nn..',
  '.nKkn......nkKn.',
  '.nkkknnnnnnkkkn.',
  '..nkkkkkkkkkkn..',
  '.nkkkkkkkkkkkkn.',
  '.nkkwekkkkwekkn.',
  '.nkkeekkkkeekkn.',
  'nkkkkkKKKKkkkkkn',
  'nkkkkKkeekKkkkkn',
  'nkkkkKkeekKkkkkn',
  '.nkkkkKKKKkkkkn.',
  '..nkkkkkkkkkkn..',
  '...nnnwwwwnnn...',
  '..nddddwrwdddn..',
  '.nddddwwrwwdddn.',
  'nddddddrrdddddn.',
];
const PORK_PAL = { n: '#10204f', k: '#f4a6b8', K: '#d97a92', w: '#ffffff', e: '#10204f', d: '#2b2f3a', r: '#c8321e' };
export function JohnPork() {
  const [ring, setRing] = React.useState(false);
  return (
    <button type="button" className="pork" onClick={() => setRing(!ring)} title="Who is this?" aria-label="Easter egg">
      {ring && <span className="pork-bubble">John Pork is calling<span className="dots" /></span>}
      <svg viewBox="0 0 16 16" shapeRendering="crispEdges" width="18" height="18">
        {PORK.flatMap((row, y) => [...row].map((k, x) => (PORK_PAL[k]
          ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={PORK_PAL[k]} /> : null)))}
      </svg>
    </button>
  );
}
