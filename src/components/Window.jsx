import React, { useContext } from 'react';
import { DeckContext } from '../deckContext.js';

/**
 * Retro desktop-window chrome (title bar, optional menu bar, optional status bar).
 * All geometry is in 960x540 slide coordinates.
 */
export default function Window({
  x = 31, y = 25, w = 890, h = 487, bar = 41,
  title, menu, status, tone = 'white', children, className = '',
}) {
  const { toggleFullscreen, goTo } = useContext(DeckContext);
  return (
    <section
      className={`win tone-${tone} ${className}`}
      style={{ left: x, top: y, width: w, height: h }}
    >
      <header className="win-bar" style={{ height: bar }}>
        <span className="win-title">{title}</span>
        <span className="win-btns">
          <span className="wbtn" aria-hidden="true"><i className="g-min" /></span>
          <button className="wbtn" type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Fullscreen (F)"><i className="g-max" /></button>
          <button className="wbtn close" type="button" onClick={() => goTo(0)} aria-label="Back to first slide" title="Back to start"><i className="g-x" /></button>
        </span>
      </header>
      {menu && (
        <nav className="win-menu" aria-hidden="true">
          {menu.map((m) => <span key={m}>{m}</span>)}
        </nav>
      )}
      <div className="win-body">{children}</div>
      {status && <footer className="win-status">{status}</footer>}
    </section>
  );
}
