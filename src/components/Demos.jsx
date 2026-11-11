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
        <span>▶ {label || 'Live'}</span>
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

const Player = memo(function Player({ log }) {
  const n = useRenders();
  const [player, setPlayer] = useState({ name: 'Ana', level: 1 });
  return (
    <div className="dm">
      <div className="dm-out mono">{JSON.stringify(player)}</div>
      <button type="button" className="mini" onClick={() => { setPlayer((p) => ({ ...p, level: p.level + 1 })); log('new object via spread → render'); }}>Level up</button>
      <RenderBadge n={n} />
    </div>
  );
});

const Score = memo(function Score({ log }) {
  const n = useRenders();
  const [score, setScore] = useState(0);
  return (
    <div className="dm">
      <div className="dm-out">score: <b>{score}</b></div>
      <button type="button" className="mini" onClick={() => {
        setScore((s) => s + 1); setScore((s) => s + 1);
        log('2 updates queued → batched into 1 render');
      }}>+1 twice</button>
      <RenderBadge n={n} />
    </div>
  );
});

const Trap = memo(function Trap({ log }) {
  const n = useRenders();
  const [user, setUser] = useState({ name: 'Bob' });
  return (
    <div className="dm">
      <div className="dm-out">on screen: <b>{user.name}</b></div>
      <button type="button" className="mini bad" onClick={() => {
        user.name = 'Charlie'; setUser(user);
        log(`Object.is(old, new) = true → skipped (memory says "${user.name}")`);
      }}>badUpdate</button>
      <RenderBadge n={n} />
    </div>
  );
});

const Correct = memo(function Correct({ log }) {
  const n = useRenders();
  const [user, setUser] = useState({ name: 'Bob' });
  return (
    <div className="dm">
      <div className="dm-out">on screen: <b>{user.name}</b></div>
      <button type="button" className="mini good" onClick={() => {
        const next = { ...user, name: 'Charlie' };
        log(`Object.is(old, new) = ${Object.is(user, next)} → render`);
        setUser(next);
      }}>goodUpdate</button>
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

/* key: `${topic.no}` for single-panel slides, `${topic.no}-${panelIndex}` for split slides */
const DEMOS = {
  '1.1-0': [PlainVar, 'let count'], '1.1-1': [StateVar, 'useState'],
  '1.2': [Greeting], '1.3': [Counter],
  '2.1-0': [Player, 'setPlayer'], '2.1-1': [Score, 'setScore'],
  '2.2-0': [Trap, 'badUpdate'], '2.2-1': [Correct, 'goodUpdate'],
  '3.1': [TitleUpdater], '3.2': [ProfileDemo], '3.3': [TimerDemo],
};

export function hasDemo(key) { return key in DEMOS; }
export default function LiveDemo({ id }) {
  const d = DEMOS[id];
  return d ? <Engine Demo={d[0]} label={d[1]} /> : null;
}
