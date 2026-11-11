import React, { useContext, useState } from 'react';
import Window from './Window.jsx';
import Icon from './Icons.jsx';
import Code from './Code.jsx';
import Inline from './Inline.jsx';
import LiveDemo, { hasDemo } from './Demos.jsx';
import { DeckContext } from '../deckContext.js';

/* 1 ─ Title (window centred on the blue desktop, rainbow rule, status bar) */
export function TitleSlide({ title, subtitle, note, status }) {
  return (
    <Window x={31} y={97} w={889} h={350} bar={29} title="state_and_effect.jsx" status={status} className="win-title-slide">
      <div className="ts">
        <Icon name="file" size={78} className="ts-icon" />
        <div className="ts-text">
          <h1 aria-label={title}>
            {title.split(' ').map((w, wi, arr) => (
              <span key={wi} className="tw-word">
                {[...w].map((ch, ci) => <span key={ci} className="tw" style={{ '--i': arr.slice(0, wi).join('').length + ci }}>{ch}</span>)}
                {wi < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <div className="rainbow"><i /><i /><i /><i /><i /><i /></div>
          <p className="ts-sub">{subtitle}</p>
          <p className="ts-note">{note}</p>
        </div>
      </div>
    </Window>
  );
}

/* 2 ─ Outline (menu bar, three ruled columns) */
export function OutlineSlide({ sections, status }) {
  const { goTo } = useContext(DeckContext);
  return (
    <Window title="outline.txt - Topics" menu={['File', 'Topics', 'View', 'Help']} status={status}>
      <div className="pad outline">
        <h2 className="h2">Topics</h2>
        <p className="lead">What we will cover in this lesson.</p>
        <div className="ol-cols">
          {sections.map((s) => (
            <div className="ol-col" key={s.name}>
              <h3 className="h3">{s.name}</h3>
              <ul>
                {s.items.map((it) => (
                  <li key={it.no}>
                    <button type="button" onClick={() => goTo(it.slide)}>
                      <b>{it.no}</b>
                      <span>{it.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

/* 3 ─ Concept (definition layout: heading, lead, two columns, golden-rule status bar) */
export function ConceptSlide({ file, section, title, subtitle, left, right, status }) {
  return (
    <Window title={`${file} - ${section}`} menu={['File', 'Rules', 'Concepts', 'Help']} status={status}>
      <div className="pad concept">
        <h2 className="h2">{title}</h2>
        <p className="lead"><Inline text={subtitle} /></p>
        <div className="cols2">
          <div>
            <h3 className="h3">{left.head}</h3>
            <p className="body"><Inline text={left.text} /></p>
          </div>
          <div>
            <h3 className="h3">{right.head}</h3>
            <p className="body"><Inline text={right.text} /></p>
          </div>
        </div>
      </div>
    </Window>
  );
}

/* 4 ─ Key points (verification layout: icon left, numbered list right) */
export function PointsSlide({ file, icon, label, heading, points, status }) {
  return (
    <Window title={file} bar={41} status={status}>
      <div className="pts">
        <div className="pts-left">
          <Icon name={icon} size={104} />
          <h3 className="h3c">{label}</h3>
          <p className="body c">Three key points to remember.</p>
        </div>
        <div className="pts-right">
          <h2 className="h2 two">{heading}</h2>
          <ol>
            {points.map((p) => (
              <li key={p.term}>
                <b>{p.term}:</b> <Inline text={p.text} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Window>
  );
}

/* 5 ─ Code: one or two panels (diff layout) */
function Panel({ tag, tagKind, code, caption, size, demo }) {
  const [run, setRun] = useState(false);
  return (
    <div className="panel">
      <div className="panel-tag">
        <span className={tagKind}>{tag.split('·')[0].trim()}</span>
        {tag.includes('·') && <span> · {tag.split('·')[1].trim()}</span>}
      </div>
      <Code code={code} size={size} />
      {demo && run ? <LiveDemo id={demo} /> : caption && <p className="panel-cap"><Inline text={caption} /></p>}
      {demo && (
        <button type="button" className={`runbtn ${run ? 'on' : ''}`} onClick={() => setRun(!run)}>
          {run ? '■ Stop' : '▶ Run it'}
        </button>
      )}
    </div>
  );
}

export function CodeSlide({ file, section, title, subtitle, panels, notes, size = 15, status, demo }) {
  const split = panels.length === 2;
  const [tab, setTab] = useState('run');
  const single = demo && hasDemo(demo);
  return (
    <Window y={22} h={492} bar={38} title={`Code: ${file} - ${section}`} status={status}>
      <div className="pad codeslide">
        <h2 className="h2 sm">{title}</h2>
        <p className="lead sm"><Inline text={subtitle} /></p>
        {split ? (
          <div className="panels two">
            {panels.map((p, i) => <Panel key={p.tag} {...p} size={size} demo={demo && hasDemo(`${demo}-${i}`) ? `${demo}-${i}` : null} />)}
          </div>
        ) : (
          <div className="panels one">
            <Panel {...panels[0]} size={size} />
            <aside className="notes">
              {single && (
                <div className="tabs" role="tablist">
                  <button type="button" role="tab" aria-selected={tab === 'run'} className={tab === 'run' ? 'on' : ''} onClick={() => setTab('run')}>▶ Run</button>
                  <button type="button" role="tab" aria-selected={tab === 'notes'} className={tab === 'notes' ? 'on' : ''} onClick={() => setTab('notes')}>Notes</button>
                </div>
              )}
              {single && tab === 'run' ? <LiveDemo id={demo} /> : (
                <>
                  <h3 className="h3 sm">Read it like this</h3>
                  {notes.map((n, i) => <p key={i} className="body sm"><Inline text={n} /></p>)}
                </>
              )}
            </aside>
          </div>
        )}
      </div>
    </Window>
  );
}

/* 6 ─ Closing recap (action-item layout: beige window, three ruled columns, button) */
export function RecapSlide({ title, subtitle, steps }) {
  const { goTo } = useContext(DeckContext);
  return (
    <Window x={59} y={27} w={841} h={481} bar={41} tone="beige" title="Recap - Key Takeaways">
      <div className="recap">
        <div className="recap-head">
          <Icon name="rocket" size={46} className="recap-icon" />
          <div>
            <h2 className="h2">{title}</h2>
            <p className="lead sm">{subtitle}</p>
          </div>
        </div>
        <div className="recap-cols">
          {steps.map((s, i) => (
            <div key={s.head}>
              <h3 className="h3">{i + 1}. {s.head}</h3>
              <p className="body sm"><Inline text={s.text} /></p>
            </div>
          ))}
        </div>
        <button className="pixbtn" type="button" onClick={() => goTo(0)}>
          Back to start
          <svg className="cursor" viewBox="0 0 16 24" width="18" height="27"><path d="M1 1 V19 L5.5 14.8 L9 22.5 L12 21 L8.6 13.6 L14.5 13.4 Z" fill="#fff" stroke="#10204f" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </Window>
  );
}
