import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icons.jsx';

/* ───────── 1. Boot-up intro ───────── */
const BOOT_LINES = ['loading useState…', 'mounting components…', 'syncing effects…'];
const BOOT_KEY = 'state-deck-booted';

export function shouldBoot() {
  try {
    if (window.location.hash && window.location.hash !== '#1') return false;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(BOOT_KEY);
  } catch { return true; }
}

export function BootScreen({ onDone }) {
  const [step, setStep] = useState(0); // lines shown "OK"
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    try { sessionStorage.setItem(BOOT_KEY, '1'); } catch { /* private mode */ }
    setLeaving(true);
    setTimeout(onDone, 450);
  };
  useEffect(() => {
    if (step < BOOT_LINES.length) {
      const t = setTimeout(() => setStep(step + 1), 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(finish, 450);
    return () => clearTimeout(t);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const skip = (e) => { e.preventDefault(); e.stopPropagation(); finish(); };
    window.addEventListener('keydown', skip, true);
    return () => window.removeEventListener('keydown', skip, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={`boot ${leaving ? 'out' : ''}`} onClick={finish} role="status">
      <div className="boot-box">
        <Icon name="file" size={64} />
        <div className="boot-name">StateOS <small>v19</small></div>
        <div className="boot-lines">
          {BOOT_LINES.map((l, i) => (
            <div key={l} className={i <= step ? 'on' : ''}>
              &gt; {l} {i < step && <b>OK</b>}
            </div>
          ))}
        </div>
        <div className="loader-track"><i style={{ width: `${(step / BOOT_LINES.length) * 100}%` }} /></div>
        <div className="boot-skip">click or press any key to skip</div>
      </div>
    </div>
  );
}
