import React, { useContext, useState } from 'react';
import Window from './Window.jsx';
import Icon, { Mark } from './Icons.jsx';
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
          <h1 aria-label={title.replace('|', ' ')}>
            {title.split('|').map((line, li, lines) => {
              const before = lines.slice(0, li).join('').length;
              return (
                <React.Fragment key={li}>
                  {li > 0 && <br />}
                  {[...line].map((ch, ci) => (
                    <span key={ci} className="tw" style={{ '--i': before + ci }}>{ch === ' ' ? ' ' : ch}</span>
                  ))}
                </React.Fragment>
              );
            })}
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
        <p className="lead">What we will cover today. Click a topic to jump to it.</p>
        <div className="ol-cols">
          {sections.map((s) => (
            <div className={`ol-col ${s.items.length > 4 ? 'wide' : ''}`} key={s.name}>
              <h3 className="h3">{s.name} <span className="ol-n">· {s.items.length}</span></h3>
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
      {demo && run ? <div className="panel-demo"><LiveDemo id={demo} /></div> : <Code code={code} size={size} />}
      {caption && <p className="panel-cap"><Inline text={caption} /></p>}
      {demo && (
        <button type="button" className={`runbtn ${run ? 'on' : ''}`} onClick={() => setRun(!run)}>
          {run ? <><Mark name="stop" size={9} color="currentColor" /> Stop</> : <><Mark name="play" size={9} color="currentColor" /> Run it</>}
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
                  <button type="button" role="tab" aria-selected={tab === 'run'} className={tab === 'run' ? 'on' : ''} onClick={() => setTab('run')}><Mark name="play" size={9} color="currentColor" /> Run</button>
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

/* 1b ─ Ice-breaker: situational A–D questions + one identification question */
const QUIZ = [
  {
    kind: 'choice',
    q: 'You tap the heart on a friend’s post. The like count goes from 41 to 42 instantly, and the page does NOT reload. What made that happen?',
    choices: ['The whole page was downloaded again', 'The app remembered a new value and redrew just that number', 'Your phone restarted the app', 'The post was deleted and posted again'],
    answer: 1,
    why: 'The app keeps the count in memory and updates only that part of the screen. In React, that memory is called state.',
  },
  {
    kind: 'choice',
    q: 'You type a message in a chat app. As you type, a “Send” button turns from grey to blue. What is the app watching?',
    choices: ['The time of day', 'Your battery level', 'What you typed (the input’s current value)', 'Your internet speed'],
    answer: 2,
    why: 'Every keystroke updates a value, and the button reacts to it. That’s a controlled input (topic 2.6).',
  },
  {
    kind: 'id',
    q: 'Identification: What do you call the data a React component remembers between renders, which redraws the screen when it changes?',
    answer: 'State',
    why: 'And that’s exactly today’s lesson.',
  },
];
const LETTERS = ['A', 'B', 'C', 'D'];

export function IcebreakerSlide() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [shown, setShown] = useState(false);
  const item = QUIZ[idx];
  const done = item.kind === 'choice' ? picked !== null : shown;
  const go = (n) => { setIdx(n); setPicked(null); setShown(false); };
  return (
    <Window title={`icebreaker.exe - Question ${idx + 1} of ${QUIZ.length}`} bar={41}
      status={done ? item.why : item.kind === 'choice' ? 'Answer in the chat: A, B, C or D' : 'Type your answer in the chat, then reveal'}>
      <div className="ib">
        <Icon name={item.kind === 'id' ? 'magnifier' : 'cursor'} size={88} />
        <div className="ib-main">
          <h2 className="h2 sm">{item.kind === 'id' ? 'Identification' : 'Situational'}</h2>
          <p className="ib-q">{item.q}</p>
          {item.kind === 'choice' ? (
            <div className="ib-choices">
              {item.choices.map((c, i) => {
                const st = picked === null ? '' : i === item.answer ? 'right' : i === picked ? 'wrong' : 'dim';
                return (
                  <button key={c} type="button" className={`ib-choice ${st}`} onClick={() => setPicked(i)} disabled={picked !== null}>
                    <b>{LETTERS[i]}</b><span>{c}</span>
                    {st === 'right' && <Mark name="ok" size={14} />}
                    {st === 'wrong' && <Mark name="no" size={12} />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="ib-id">
              <span className="ib-blank">{shown ? item.answer : '_ _ _ _ _'}</span>
              {!shown && <button type="button" className="pixbtn sm" onClick={() => setShown(true)}>Reveal answer</button>}
            </div>
          )}
          <div className="ib-nav">
            <button type="button" className="mini" disabled={idx === 0} onClick={() => go(idx - 1)}>Prev</button>
            <span>{QUIZ.map((_, i) => <i key={i} className={i === idx ? 'on' : ''} />)}</span>
            <button type="button" className="mini" disabled={idx === QUIZ.length - 1} onClick={() => go(idx + 1)}>Next question</button>
          </div>
        </div>
      </div>
    </Window>
  );
}
