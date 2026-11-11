import { Mark } from './Icons.jsx';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

/* ───────── engine HUD ───────── */

/** Counts real commits: the number shown is the render that is about to commit. */
function useRenders() {
  const committed = useRef(0);
  const n = committed.current + 1;
  useEffect(() => { committed.current = n; });
  return n;
}

function RenderBadge({ n }) {
  return <span key={n} className="rbadge">render #{n}</span>;
}

/** Shell: owns the event log so logging never re-renders the (memoised) demo itself. */
function Engine({ Demo, label }) {
  const [log, setLog] = useState([]);
  const [run, setRun] = useState(0);
  const push = useCallback((msg) => setLog((l) => [...l.slice(-3), msg]), []);
  return (
    <div className="demo" onKeyDown={(e) => e.stopPropagation()}>
      <div className="demo-head">
        <span><Mark name="play" size={9} /> {label || 'Live'}</span>
        <button type="button" className="mini ghost" onClick={() => { setLog([]); setRun((r) => r + 1); }}>reset</button>
      </div>
      <div className="demo-stage"><Demo key={run} log={push} /></div>
      <div className="demo-log" aria-live="polite">
        {log.length === 0 ? <i>engine idle…</i> : log.map((m, i) => <div key={i + m}>› {m}</div>)}
      </div>
    </div>
  );
}

/* ───────── demos (mirror the code on each slide) ───────── */

const PlainVar = memo(function PlainVar({ log }) {
  const n = useRenders();
  const count = useRef(0); // stands in for `let count`
  return (
    <div className="dm">
      <div className="dm-out">count on screen: <b>0</b></div>
      <button type="button" className="mini" onClick={() => { count.current += 1; log(`count = ${count.current} in memory · no render`); }}>count + 1</button>
      <RenderBadge n={n} />
    </div>
  );
});

const StateVar = memo(function StateVar({ log }) {
  const n = useRenders();
  const [count, setCount] = useState(0);
  return (
    <div className="dm">
      <div className="dm-out">count on screen: <b>{count}</b></div>
      <button type="button" className="mini" onClick={() => { setCount(count + 1); log(`setCount(${count + 1}) → re-render`); }}>setCount + 1</button>
      <RenderBadge n={n} />
    </div>
  );
});

const Greeting = memo(function Greeting({ log }) {
  const n = useRenders();
  const [name, setName] = useState('Guest');
  return (
    <div className="dm">
      <div className="dm-out big">Hello, {name}!</div>
      <button type="button" className="mini" onClick={() => { setName('Kuya'); log(name === 'Kuya' ? "setName('Kuya') · same value, bail out" : "setName('Kuya') → re-render"); }}>Change Name</button>
      <RenderBadge n={n} />
    </div>
  );
});

const Counter = memo(function Counter({ log }) {
  const n = useRenders();
  const [count, setCount] = useState(0);
  const handleIncrement = () => { setCount(count + 1); log(`onClick → setCount(${count + 1}) → render`); };
  return (
    <div className="dm">
      <button type="button" className="mini wide" onClick={handleIncrement}>Clicked {count} times</button>
      <RenderBadge n={n} />
    </div>
  );
});

const TitleUpdater = memo(function TitleUpdater({ log }) {
  const n = useRenders();
  const [count, setCount] = useState(0);
  useEffect(() => {
    const before = document.title;
    document.title = `Clicked ${count} times`;
    log(`effect: document.title = "Clicked ${count} times"`);
    return () => { document.title = before; };
  }, [count, log]);
  return (
    <div className="dm">
      <button type="button" className="mini wide" onClick={() => setCount(count + 1)}>Click {count}</button>
      <div className="dm-note">Watch the browser tab title ↑</div>
      <RenderBadge n={n} />
    </div>
  );
});

const USERS = { 1: 'Ada Lovelace', 2: 'Alan Turing', 3: 'Grace Hopper' };
const fetchUserFromAPI = (id) => new Promise((res) => setTimeout(() => res({ name: USERS[id] }), 700));

function UserProfile({ userId, log }) {
  const n = useRenders();
  const [user, setUser] = useState(null);
  useEffect(() => {
    log(`effect: fetch user ${userId}…`);
    let live = true;
    fetchUserFromAPI(userId).then((data) => { if (live) { setUser(data); log(`setUser(${data.name}) → render`); } });
    return () => { live = false; };
  }, [userId, log]);
  return (
    <div className="dm">
      <div className="dm-out big">{user ? user.name : 'Loading...'}</div>
      <RenderBadge n={n} />
    </div>
  );
}

const ProfileDemo = memo(function ProfileDemo({ log }) {
  const [userId, setUserId] = useState(1);
  return (
    <div className="dm col">
      <div className="seg">
        {[1, 2, 3].map((id) => (
          <button key={id} type="button" className={`mini ${id === userId ? 'on' : ''}`}
            onClick={() => { if (id === userId) log(`userId still ${id} · effect skipped`); setUserId(id); }}>
            userId {id}
          </button>
        ))}
      </div>
      <UserProfile userId={userId} log={log} />
    </div>
  );
});

function Timer({ log }) {
  const n = useRenders();
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    log(`mount: setInterval #${id}`);
    return () => { clearInterval(id); log(`cleanup: clearInterval #${id}`); };
  }, [log]);
  return (
    <div className="dm">
      <div className="dm-out">Seconds elapsed: <b>{seconds}</b></div>
      <RenderBadge n={n} />
    </div>
  );
}

const TimerDemo = memo(function TimerDemo({ log }) {
  const [on, setOn] = useState(true);
  return (
    <div className="dm col">
      <button type="button" className="mini" onClick={() => setOn(!on)}>{on ? 'Unmount <Timer />' : 'Mount <Timer />'}</button>
      {on ? <Timer log={log} /> : <div className="dm-note">Timer removed: interval cleared.</div>}
    </div>
  );
});

/* ───────── section 2 demos ───────── */

const FullName = memo(function FullName({ log }) {
  const n = useRenders();
  const [first, setFirst] = useState('Juan');
  const [last, setLast] = useState('Dela Cruz');
  const [stored] = useState('Juan Dela Cruz'); // BAD: the stored copy, never updated
  const fullName = `${first} ${last}`;
  return (
    <div className="dm">
      <input className="inp" value={first} onChange={(e) => { setFirst(e.target.value); log(`setFirst("${e.target.value}") → render`); }} />
      <input className="inp" value={last} onChange={(e) => { setLast(e.target.value); log(`setLast("${e.target.value}") → render`); }} />
      <div className="dm-out big"><Mark name="ok" size={14} /> {fullName}</div>
      <div className="dm-note"><Mark name="no" size={10} /> stored copy: <s>{stored}</s>{stored !== fullName && ' ← out of sync!'}</div>
      <RenderBadge n={n} />
    </div>
  );
});

const RenderLogger = memo(function RenderLogger({ log }) {
  const n = useRenders();
  const [user, setUser] = useState({ name: 'Bob' });
  function badUpdate() {
    const same = user;
    user.name = 'Charlie';
    setUser(user);
    log(`Bad: Object.is(old, new) = ${Object.is(same, user)} → skipped`);
  }
  function goodUpdate() {
    const next = { ...user, name: 'Charlie' };
    log(`Good: Object.is(old, new) = ${Object.is(user, next)} → render`);
    setUser(next);
  }
  return (
    <div className="dm">
      <div className="dm-out">user.name: <b>{user.name}</b></div>
      <button type="button" className="mini bad" onClick={badUpdate}>Bad Update</button>
      <button type="button" className="mini good" onClick={goodUpdate}>Good Update</button>
      <RenderBadge n={n} />
    </div>
  );
});

const SnapshotLogger = memo(function SnapshotLogger({ log }) {
  const n = useRenders();
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    log(`setCount(${count + 1}) · console.log(count) → ${count}`);
  }
  return (
    <div className="dm">
      <div className="dm-out">Count: <b>{count}</b></div>
      <button type="button" className="mini" onClick={handleClick}>Add 1 + Log</button>
      <RenderBadge n={n} />
    </div>
  );
});

const BatchCounter = memo(function BatchCounter({ log }) {
  const n = useRenders();
  const [count, setCount] = useState(0);
  function badAdd() {
    setCount(count + 1); setCount(count + 1); setCount(count + 1);
    log(`Bad +3: all read ${count} → ${count + 1} (1 render)`);
  }
  function goodAdd() {
    setCount((c) => c + 1); setCount((c) => c + 1); setCount((c) => c + 1);
    log(`Good +3: ${count} → ${count + 3} (1 render)`);
  }
  return (
    <div className="dm">
      <div className="dm-out">Count: <b>{count}</b></div>
      <button type="button" className="mini bad" onClick={badAdd}>Bad +3</button>
      <button type="button" className="mini good" onClick={goodAdd}>Good +3</button>
      <RenderBadge n={n} />
    </div>
  );
});

/* catches the real "Too many re-renders" error so the deck keeps running */
class Catch extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { this.props.onError(err.message.split('.')[0]); }
  render() { return this.state.err ? <div className="dm-err"><Mark name="boom" size={12} /> {this.state.err.message.split('.')[0]}</div> : this.props.children; }
}
function BadLoop() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // BAD: setter in the body
  return <p>Count: {count}</p>;
}

const LoopTrap = memo(function LoopTrap({ log }) {
  const n = useRenders();
  const [count, setCount] = useState(0);
  const [bad, setBad] = useState(false);
  return (
    <div className="dm">
      <div className="dm-out">Count: <b>{count}</b></div>
      <button type="button" className="mini good" onClick={() => { setCount(count + 1); log(`event → setCount(${count + 1}) → 1 render`); }}>Add 1</button>
      <button type="button" className="mini bad" onClick={() => { setBad(true); log('render → setCount → render → …'); }}>Setter in body</button>
      {bad && <Catch onError={(m) => log(`React: "${m}"`)}><BadLoop /></Catch>}
      <RenderBadge n={n} />
    </div>
  );
});

const NameInput = memo(function NameInput({ log }) {
  const n = useRenders();
  const [name, setName] = useState('');
  return (
    <div className="dm">
      <label className="dm-note"><Mark name="no" size={10} /> value, no onChange:</label>
      <input className="inp" value={name} readOnly onKeyDown={() => log('frozen: no onChange, state never changes')} placeholder="try typing…" />
      <label className="dm-note"><Mark name="ok" size={10} /> controlled:</label>
      <input className="inp" value={name} onChange={(e) => { setName(e.target.value); log(`onChange → setName("${e.target.value}")`); }} placeholder="type here" />
      <div className="dm-out">Hello, <b>{name}</b> · Characters: <b>{name.length}</b></div>
      <RenderBadge n={n} />
    </div>
  );
});

const StateRecap = memo(function StateRecap({ log }) {
  const n = useRenders();
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(['Study React']);
  const [text, setText] = useState('');
  const total = todos.length;
  return (
    <div className="dm">
      <div className="dm-out">Count: <b>{count}</b> · Total todos: <b>{total}</b></div>
      <button type="button" className="mini" onClick={() => { setCount((c) => c + 1); setCount((c) => c + 1); setCount((c) => c + 1); log('3 updaters → +3, 1 render'); }}>+3</button>
      <input className="inp sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="new todo" />
      <button type="button" className="mini" onClick={() => { if (!text.trim()) return; setTodos([...todos, text]); setText(''); log(`setTodos([...todos, "${text}"])`); }}>Add</button>
      <ul className="dm-list">{todos.slice(-3).map((t, i) => <li key={i}>{t}</li>)}</ul>
      <RenderBadge n={n} />
    </div>
  );
});

const QA = [
  ['Q1 · re-render?', 'No — same object'],
  ['Q2 · count after one click?', '1 — all read 0'],
  ['Q3 · what gets logged?', '0 — snapshot'],
];
const QuickCheck = memo(function QuickCheck({ log }) {
  const [shown, setShown] = useState([false, false, false]);
  const [left, setLeft] = useState(null);
  useEffect(() => {
    if (left === null) return;
    if (left === 0) { setShown([true, true, true]); log('answers revealed'); return; }
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left, log]);
  return (
    <div className="dm col">
      {QA.map(([q, a], i) => (
        <div key={q} className="qa">
          <span>{q}</span>
          {shown[i]
            ? <b className="ans">{a}</b>
            : <button type="button" className="mini" onClick={() => setShown(shown.map((s, j) => s || j === i))}>Reveal</button>}
        </div>
      ))}
      <button type="button" className="mini" onClick={() => { setShown([false, false, false]); setLeft(10); log('10 s countdown — answer in the chat!'); }}>
        {left ? <><Mark name="clock" size={10} /> {left}s</> : 'Start 10 s timer'}
      </button>
    </div>
  );
});

/* key: `${topic.no}` for single-panel slides, `${topic.no}-${panelIndex}` for split slides */
const DEMOS = {
  '1.1-0': [PlainVar, 'let count'], '1.1-1': [StateVar, 'useState'],
  '1.2': [Greeting], '1.3': [Counter],
  '2.1': [FullName], '2.2': [RenderLogger], '2.3': [SnapshotLogger], '2.4': [BatchCounter],
  '2.5': [LoopTrap], '2.6': [NameInput], '2.7': [StateRecap], '2.8': [QuickCheck, 'Quick Check'],
  '3.1': [TitleUpdater], '3.2': [ProfileDemo], '3.3': [TimerDemo],
};

export function hasDemo(key) { return key in DEMOS; }
export default function LiveDemo({ id }) {
  const d = DEMOS[id];
  return d ? <Engine Demo={d[0]} label={d[1]} /> : null;
}
