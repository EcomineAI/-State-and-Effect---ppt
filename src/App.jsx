import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import slides from './slides.jsx';
import { DeckContext } from './deckContext.js';

const W = 960, H = 540, ANIM_MS = 420;
const clamp = (n) => Math.max(0, Math.min(slides.length - 1, n));
const fromHash = () => {
  const n = parseInt(window.location.hash.replace('#', ''), 10);
  return Number.isFinite(n) ? clamp(n - 1) : 0;
};

export default function App() {
  const rootRef = useRef(null);
  const [cur, setCur] = useState(fromHash);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1);
  const [scale, setScale] = useState(1);
  const [idle, setIdle] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const curRef = useRef(cur);
  const timer = useRef();

  const goTo = useCallback((n) => {
    const next = clamp(n);
    if (next === curRef.current) return;
    setDir(next > curRef.current ? 1 : -1);
    setPrev(curRef.current);
    curRef.current = next;
    setCur(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPrev(null), ANIM_MS);
    history.replaceState(null, '', `#${next + 1}`);
  }, []);
  const next = useCallback(() => goTo(curRef.current + 1), [goTo]);
  const back = useCallback(() => goTo(curRef.current - 1), [goTo]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  }, []);

  // responsive scaling of the fixed 960x540 stage
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    const onHash = () => goTo(fromHash());
    document.addEventListener('fullscreenchange', onFs);
    window.addEventListener('hashchange', onHash);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      window.removeEventListener('hashchange', onHash);
    };
  }, [goTo]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // let Space/Enter activate focused buttons (live demos) instead of advancing
      if ((e.key === ' ' || e.key === 'Enter') && e.target.closest?.('button, input, select')) return;
      const k = e.key;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); back(); }
      else if (k === 'Home') goTo(0);
      else if (k === 'End') goTo(slides.length - 1);
      else if (k === 'f' || k === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, back, goTo, toggleFullscreen]);

  // swipe
  useEffect(() => {
    let sx = null, sy = null;
    const down = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const up = (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : back)();
      sx = null;
    };
    window.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('touchend', up, { passive: true });
    return () => { window.removeEventListener('touchstart', down); window.removeEventListener('touchend', up); };
  }, [next, back]);

  // auto-hide controls
  useEffect(() => {
    let t;
    const wake = () => { setIdle(false); clearTimeout(t); t = setTimeout(() => setIdle(true), 2800); };
    wake();
    window.addEventListener('mousemove', wake);
    window.addEventListener('keydown', wake);
    window.addEventListener('touchstart', wake, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('touchstart', wake);
    };
  }, []);

  const ctx = useMemo(() => ({ toggleFullscreen, goTo }), [toggleFullscreen, goTo]);
  const pct = slides.length > 1 ? (cur / (slides.length - 1)) * 100 : 100;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <DeckContext.Provider value={ctx}>
      <div className="deck" ref={rootRef}>
        <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {slides.map((s, i) => {
            const state = i === cur ? 'active' : i === prev ? 'leaving' : null;
            if (!state) return null;
            return (
              <div key={i} className={`slide ${state} ${dir > 0 ? 'fwd' : 'bwd'}`} aria-hidden={state !== 'active'}>
                {s}
              </div>
            );
          })}
        </div>

        <div className={`controls ${idle ? 'idle' : ''}`} role="toolbar" aria-label="Presentation controls">
          <button type="button" onClick={back} disabled={cur === 0} aria-label="Previous slide" title="Previous (←)">
            <svg viewBox="0 0 12 12" width="12" height="12"><path d="M8 1 L3 6 L8 11" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>
          </button>
          <div className="meter" role="progressbar" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={cur + 1}>
            <i style={{ width: `${pct}%` }} />
          </div>
          <span className="count" aria-live="polite">{pad(cur + 1)} / {pad(slides.length)}</span>
          <button type="button" onClick={next} disabled={cur === slides.length - 1} aria-label="Next slide" title="Next (→)">
            <svg viewBox="0 0 12 12" width="12" height="12"><path d="M4 1 L9 6 L4 11" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>
          </button>
          <button type="button" onClick={toggleFullscreen} aria-label={isFs ? 'Exit fullscreen' : 'Enter fullscreen'} title="Fullscreen (F)">
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
              {isFs
                ? <path d="M5 1 V5 H1 M9 1 V5 H13 M5 13 V9 H1 M9 13 V9 H13" />
                : <path d="M1 5 V1 H5 M9 1 H13 V5 M13 9 V13 H9 M5 13 H1 V9" />}
            </svg>
          </button>
        </div>
      </div>
    </DeckContext.Provider>
  );
}
