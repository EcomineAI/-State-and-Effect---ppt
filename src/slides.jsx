import React from 'react';
import {
  TitleSlide, IcebreakerSlide, OutlineSlide, ConceptSlide, PointsSlide, CodeSlide, RecapSlide,
} from './components/layouts.jsx';
import FullName from './samples/FullName.jsx.txt?raw';
import RenderLogger from './samples/RenderLogger.jsx.txt?raw';
import SnapshotLogger from './samples/SnapshotLogger.jsx.txt?raw';
import BatchCounter from './samples/BatchCounter.jsx.txt?raw';
import LoopTrap from './samples/LoopTrap.jsx.txt?raw';
import NameInput from './samples/NameInput.jsx.txt?raw';
import StateRecap from './samples/StateRecap.jsx.txt?raw';
import QuickCheck from './samples/QuickCheck.jsx.txt?raw';

/* ───────── Content (from State-and-Effect.pptx) ───────── */

const S1 = 'Introduction to State';
const S2 = 'More on State';
const S3 = 'Side Effects & useEffect';

const topics = [
  {
    no: '1.1', section: S1, file: 'state_basics.txt', short: 'Understanding State',
    title: 'Understanding State in React',
    subtitle: 'The component memory that surpasses normal JavaScript variables',
    left: { head: 'What state is', text: 'State is a built-in React object that stores data or information about a component. It represents the parts of an application that can change over time based on user action, network responses, or timers.' },
    right: { head: 'Why it matters', text: 'In standard JavaScript, mutating a variable does not notify React to redraw the screen. State acts as the memory of a component. When state updates via its setter, React schedules a re-render to redraw the screen and keep the UI in sync.' },
    status: 'Key idea: state is component memory that keeps the UI in sync',
    icon: 'chip', heading: 'Why plain variables are not enough',
    points: [
      { term: 'Silent Mutation', text: 'Standard variables (`let x = 0`) mutate silently in RAM without scheduling a UI repaint.' },
      { term: 'Component Memory', text: 'State persists across component re-renders while the component stays mounted.' },
      { term: 'Setter Signal', text: 'Calling a state setter function alerts React to queue an immediate UI update.' },
    ],
    code: {
      file: 'VariableVsState.js', title: 'Variable vs. state',
      subtitle: 'Both change a value in memory, but only state tells React to redraw the screen.',
      size: 16,
      panels: [
        { tag: 'NORMAL VARIABLE · NO REDRAW', tagKind: 'bad', caption: 'The value changes silently; the screen stays the same.',
          code: `// [Normal Variable]: Memory updates, but React never redraws the UI\nlet count = 0;\ncount = count + 1;` },
        { tag: 'REACT STATE · TRIGGERS UPDATE', tagKind: 'good', caption: 'The setter queues a re-render, so the UI stays in sync.',
          code: `// [React State]: Memory persists across renders + triggers immediate UI update\nconst [count, setCount] = useState(0);\nsetCount(count + 1);` },
      ],
    },
  },
  {
    no: '1.2', section: S1, file: 'usestate_hook.txt', short: 'Using the useState Hook',
    title: 'Using the useState Hook',
    subtitle: 'Array destructuring, syntax anatomy and initial state rules',
    left: { head: 'What useState does', text: '`useState` is a React Hook that allows you to add state variables and persistent memory to functional components.' },
    right: { head: 'How you call it', text: 'You call `useState` at the top level of your component. It takes one argument (the initial state) and returns a 2-element tuple: the current state value and a setter function. We unpack this with array destructuring: `const [name, setName] = useState(\'Guest\')`.' },
    status: 'Key idea: call useState at the top level and unpack [value, setValue]',
    icon: 'brackets', heading: 'Rules of the useState Hook',
    points: [
      { term: 'Top-Level Only', text: 'Never call `useState` inside loops, conditions, or nested functions.' },
      { term: 'Tuple Return', text: 'Returns `[state, setState]` — convention is `[value, setValue]`.' },
      { term: 'Initial Argument', text: 'Evaluated only on the initial mount; ignored on subsequent re-renders.' },
    ],
    code: {
      file: 'Greeting.jsx', title: 'Your first useState component',
      subtitle: 'Create state with an initial value, then change it through the setter.',
      size: 14.5,
      panels: [{ tag: 'GREETING COMPONENT', tagKind: '',
        code: `import { useState } from 'react';\n\nfunction Greeting() {\n  // name: current state value | setName: updater function\n  const [name, setName] = useState('Guest');\n\n  return (\n    <div>\n      <p>Hello, {name}!</p>\n      <button onClick={() => setName('Kuya')}>Change Name</button>\n    </div>\n  );\n}` }],
      notes: [
        '`name` holds the current state value; it starts as \'Guest\'.',
        '`setName` is the updater function for that value.',
        'Clicking the button calls `setName(\'Kuya\')`, so React re-renders and shows Hello, Kuya!',
      ],
    },
  },
  {
    no: '1.3', section: S1, file: 'events.txt', short: 'Handling User Events',
    title: 'Handling User Events',
    subtitle: 'Connecting user gestures to state updates with synthetic events',
    left: { head: 'What an event is', text: 'Event handling in React involves capturing user interactions (like clicks, keypresses, or form submissions) and executing an event handler function to update state.' },
    right: { head: 'How to wire it', text: 'React uses camelCase props like `onClick`, `onChange`, and `onSubmit`. Always pass a function reference (`onClick={handleClick}`) rather than calling the function immediately (`onClick={handleClick()}`). When clicked, the handler fires, calls the setter, and schedules a repaint.' },
    status: 'Key idea: pass a function reference, never call it inline',
    icon: 'cursor', heading: 'From click to re-render',
    points: [
      { term: 'Synthetic Events', text: 'React wraps native browser events in a cross-browser `SyntheticEvent` wrapper.' },
      { term: 'Pass Function Reference', text: 'Do not invoke handlers inline (avoid `onClick={fn()}`).' },
      { term: 'Action Pipeline', text: 'User action → event listener fires → setter invoked → React schedules re-render.' },
    ],
    code: {
      file: 'Counter.jsx', title: 'Wire a click to state',
      subtitle: 'The handler calls the setter, and React repaints the button.',
      size: 15,
      panels: [{ tag: 'COUNTER COMPONENT', tagKind: '',
        code: `function Counter() {\n  const [count, setCount] = useState(0);\n\n  // Event handler references the setter\n  const handleIncrement = () => {\n    setCount(count + 1);\n  };\n\n  return <button onClick={handleIncrement}>Clicked {count} times</button>;\n}` }],
      notes: [
        '`handleIncrement` is passed by reference — no parentheses after it.',
        'Each click calls `setCount(count + 1)`.',
        'The new state triggers a re-render and the button label updates.',
      ],
    },
  },
  {
    no: '2.1', section: S2, file: 'updating_state.txt', short: 'Updating State',
    title: 'Updating State',
    subtitle: 'The setter replaces the value; keep state minimal',
    left: { head: 'Definition', text: 'Updating state means calling the setter function (like `setCount`) to give React a new value. React then shows that new value on screen.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'The setter doesn’t edit the old value. It replaces it completely. Also, don’t keep values in state that you can calculate from other values. If you store the same thing twice, the two copies can get out of sync and cause bugs.' },
    status: 'Key idea: the setter replaces; calculate what you can, store only what you must',
    icon: 'clipboard', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'Setter Replaces', text: '`setUser(x)` swaps the whole value. It doesn’t merge in changes.' },
      { term: 'Keep It Minimal', text: 'If you can calculate it, don’t store it.' },
      { term: 'One Source of Truth', text: 'Each piece of data should live in only one place.' },
    ],
    code: {
      file: 'FullName.jsx', title: 'Calculate, don’t store',
      subtitle: '`fullName` is computed every render, so it can never go out of sync.',
      size: 12.5, panels: [{ tag: 'DEMO PANEL · FULLNAME', tagKind: '', code: FullName }],
      notes: ['`first` and `last` are the only state.', '`fullName` is calculated during render, never stored.', 'A stored copy would stay old when you type.'],
    },
  },
  {
    no: '2.2', section: S2, file: 'rerender.txt', short: 'State & Re-rendering',
    title: 'State & Re-rendering Mechanics',
    subtitle: 'How React decides whether to run your component again',
    left: { head: 'Definition', text: 'A re-render is when React runs your component function again to get new JSX, compares it with the previous result, and updates only the parts of the real DOM that changed.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'When you call a setter, React asks: “Is this the same value as before?” If you edited the old object and passed it back, it’s the same object, so React thinks nothing changed and skips the re-render. If you pass a new object or a different value, React re-renders and updates only what changed on screen.' },
    status: 'Key idea: same object means no re-render; a new object means re-render',
    icon: 'cycle', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'Same Value Check', text: 'React uses `Object.is` to check if the new state is the same as the old one.' },
      { term: 'Skip If Same', text: 'Same value or same object → no re-render.' },
      { term: 'Only Changed Parts', text: 'React runs the whole function again, but only touches the DOM nodes that changed.' },
    ],
    code: {
      file: 'RenderLogger.jsx', title: 'Spot the re-render trap',
      subtitle: 'Two handlers update the same `user` state. Only one re-renders.',
      size: 12.5, panels: [{ tag: 'DEMO PANEL · RENDERLOGGER', tagKind: '', code: RenderLogger }],
      notes: ['`badUpdate` edits the old object, so `Object.is` says “same” and React skips.', '`goodUpdate` passes a new object, so React re-renders.'],
    },
  },
  {
    no: '2.3', section: S2, file: 'snapshot.txt', short: 'State Is a Snapshot',
    title: 'State Is a Snapshot',
    subtitle: 'Each render has its own fixed copy of state',
    left: { head: 'Definition', text: 'A snapshot means each render has its own fixed copy of state. The value doesn’t change in the middle of a render.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'Calling `setCount(count + 1)` doesn’t change `count` right away. It tells React: “Next render, use this new value.” So if you `console.log(count)` right after the setter, you still see the old number. The new value only shows up when React renders again.' },
    status: 'Key idea: the setter schedules; the new value appears on the next render',
    icon: 'magnifier', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'No Instant Change', text: 'The setter schedules the update. It doesn’t change the variable immediately.' },
      { term: 'Fixed Per Render', text: 'Inside one render, `count` is always the same number.' },
      { term: 'New Render, New Value', text: 'The updated value appears on the next render.' },
    ],
    code: {
      file: 'SnapshotLogger.jsx', title: 'Log right after setting',
      subtitle: 'The log shows this render’s snapshot, not the new value.',
      size: 13.5, panels: [{ tag: 'DEMO PANEL · SNAPSHOTLOGGER', tagKind: '', code: SnapshotLogger }],
      notes: ['`setCount(count + 1)` asks for a new value on the next render.', '`console.log(count)` still prints the old snapshot.'],
    },
  },
  {
    no: '2.4', section: S2, file: 'batching.txt', short: 'Updater Functions & Batching',
    title: 'Updater Functions & Batching',
    subtitle: 'Stack updates with `prev =>`; React re-renders once',
    left: { head: 'Definition', text: 'An updater function is a function you pass to the setter, like `setCount(c => c + 1)`, that receives the latest state value.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'React batches updates. If you call setters several times in one click, React waits and re-renders only once. With `setCount(count + 1)` three times, all three read the same old `count`, so you only get +1. With `setCount(c => c + 1)`, each call gets the latest value, so they stack and you get +3.' },
    status: 'Key idea: many setter calls → one render; use prev => when it depends on the old value',
    icon: 'chip', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'Batching', text: 'Multiple setter calls in one event → one re-render.' },
      { term: 'Use prev =>', text: 'If the new value depends on the old value, use an updater function.' },
      { term: 'Stacking', text: 'Updater functions run in order, and each one builds on the last.' },
    ],
    code: {
      file: 'BatchCounter.jsx', title: 'Bad +3 vs. Good +3',
      subtitle: 'Both buttons call the setter three times. Only one adds 3.',
      size: 12.5, panels: [{ tag: 'DEMO PANEL · BATCHCOUNTER', tagKind: '', code: BatchCounter }],
      notes: ['`badAdd` reads the same old `count` three times → +1.', '`goodAdd` stacks updaters → +3.', 'Either way: one re-render.'],
    },
  },
  {
    no: '2.5', section: S2, file: 'infinite_loop.txt', short: 'The Infinite Loop Trap',
    title: 'The Infinite Loop Trap',
    subtitle: 'Setting state while rendering never ends',
    left: { head: 'Definition', text: 'An infinite loop happens when setting state causes a render, and that render sets state again, forever.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'Setting state causes a re-render. If you call a setter directly inside the component body (not inside a click or an effect), it runs on every render. That causes another render, which runs the setter again. React catches this and throws a “Too many re-renders” error.' },
    status: 'Key idea: set state in events or effects, never in the component body',
    icon: 'lock', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'Not in the Body', text: 'Never call a setter directly while rendering.' },
      { term: 'Keep the Arrow', text: '`onClick={() => setCount(count + 1)}`, not `onClick={setCount(count + 1)}`.' },
      { term: 'Events Only', text: 'Set state inside an event handler (or an effect), where it runs once per action.' },
    ],
    code: {
      file: 'LoopTrap.jsx', title: 'Break the loop',
      subtitle: 'Bad: `setCount` in the body → “Too many re-renders”. Good: inside an event.',
      size: 13, panels: [{ tag: 'DEMO PANEL · LOOPTRAP', tagKind: '', code: LoopTrap }],
      notes: ['Bad: `setCount(count + 1)` in the body → error: “Too many re-renders”.', 'Good: `<button onClick={() => setCount(count + 1)}>`'],
    },
  },
  {
    no: '2.6', section: S2, file: 'controlled.txt', short: 'Controlled Components',
    title: 'Controlled Components',
    subtitle: 'State is the boss of the input',
    left: { head: 'Definition', text: 'A controlled component is an input whose value comes from state, and every change updates that state.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'Normally an input keeps its own text. In a controlled input, React’s state is the boss. `value={name}` makes the input show what’s in state, and `onChange` saves each keystroke back to state. Because the text is always in state, you can check it, change it, or show it anywhere live.' },
    status: 'Key idea: value + onChange — state controls the input',
    icon: 'cursor', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'State Is the Boss', text: 'The input shows only what’s in state.' },
      { term: 'Every Keystroke Updates', text: '`onChange` → `setName(e.target.value)`.' },
      { term: 'Need Both', text: '`value` without `onChange` = an input you can’t type in.' },
    ],
    code: {
      file: 'NameInput.jsx', title: 'A controlled input',
      subtitle: 'Every keystroke goes through state and back to the screen.',
      size: 13, panels: [{ tag: 'DEMO PANEL · NAMEINPUT', tagKind: '', code: NameInput }],
      notes: ['`value={name}` — the input shows state.', '`onChange` saves each keystroke.', 'Remove `onChange` and the input freezes.'],
    },
  },
  {
    no: '2.7', section: S2, file: 'state_recap.txt', short: 'State Recap',
    title: 'State Recap',
    subtitle: 'Update the right way and the screen stays in sync',
    left: { head: 'Definition', text: 'State is a component’s memory. When you update it the right way, React re-renders and the screen stays in sync with your data.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'Every time you call a setter, React checks whether the value is new. If it is, React runs your component again, compares the new JSX with the old, and updates only the parts that changed. Bugs happen when we skip these rules: editing objects directly, expecting the value to change instantly, or setting state while rendering.' },
    status: 'Key idea: copy, don’t edit · snapshot rule · use prev =>',
    icon: 'file', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'Copy, Don’t Edit', text: 'Always give the setter a new object or array.' },
      { term: 'Snapshot Rule', text: 'The new value shows on the next render, not right away.' },
      { term: 'Use prev =>', text: 'When the new value depends on the old one.' },
    ],
    code: {
      file: 'StateRecap.jsx', title: 'All the rules in one component',
      subtitle: 'Calculated total, updater functions, a new array and a controlled input.',
      size: 11.5, panels: [{ tag: 'CODE PANEL · STATERECAP', tagKind: '', code: StateRecap }],
      notes: ['Rule 1: `total` is calculated.', 'Rule 2: `+3` uses updaters.', 'Rule 3: `[...todos, text]` is a new array.', 'Rule 5: the input is controlled.'],
    },
  },
  {
    no: '2.8', section: S2, file: 'quick_check.txt', short: 'Quick Check',
    title: 'Quick Check',
    subtitle: 'Three quick questions before we move on to side effects',
    left: { head: 'Definition', text: 'Three quick questions before we move on to side effects.' },
    right: { head: 'Explanation & Inner Mechanics', text: 'Ask the class to answer in the chat. Reveal the answers after about 10 seconds.' },
    status: 'State is how React remembers. Next up, useEffect: how React talks to things outside the component.',
    icon: 'clipboard', heading: 'Kuya’s Confession Room Rules',
    points: [
      { term: 'Q1', text: '`user.name = "Ana"; setUser(user);` Will it re-render? → No, same object' },
      { term: 'Q2', text: '`setCount(count + 1)` three times starting from 0. What’s the result? → 1' },
      { term: 'Q3', text: '`setCount(5); console.log(count);` when count was 0. What gets logged? → 0 (snapshot)' },
    ],
    code: {
      file: 'QuickCheck.jsx', title: 'Answer in the chat',
      subtitle: 'Reveal each answer after about 10 seconds.',
      size: 13.5, panels: [{ tag: 'CODE PANEL · QUICKCHECK', tagKind: '', code: QuickCheck }],
      notes: ['“State is how React remembers. Next up, useEffect: how React talks to things outside the component, like timers.”'],
    },
  },
  {
    no: '3.1', section: S3, file: 'use_effect.txt', short: 'Introduction to useEffect',
    title: 'Introduction to useEffect',
    subtitle: 'Synchronizing components with external systems beyond React',
    left: { head: 'What a side effect is', text: 'A side effect is any operation that interacts with the world outside the component: data fetching, document title modifications, timers, or subscriptions. `useEffect` is the Hook designed for this.' },
    right: { head: 'Where effects belong', text: 'React components should be pure functions that take props/state and return JSX. Side effects belong inside `useEffect`. The effect function runs after the component renders and the screen paints, ensuring that heavy external tasks never block initial UI rendering.' },
    status: 'Key idea: keep rendering pure; put side effects inside useEffect',
    icon: 'plug', heading: 'Keep rendering pure',
    points: [
      { term: 'Pure Rendering', text: 'Component rendering must remain pure; keep side effects inside `useEffect`.' },
      { term: 'Post-Paint Execution', text: 'Effects run after the browser paints the screen, preventing UI lag.' },
      { term: 'Synchronization', text: 'Think of `useEffect` as synchronizing state with external systems, not as a lifecycle hook.' },
    ],
    code: {
      file: 'TitleUpdater.jsx', title: 'Sync the page title with state',
      subtitle: 'A side effect reaches outside React to touch the browser window.',
      size: 14.5,
      panels: [{ tag: 'TITLE UPDATER', tagKind: '',
        code: `import { useState, useEffect } from 'react';\n\nfunction TitleUpdater() {\n  const [count, setCount] = useState(0);\n\n  // Side effect: reaches outside React to touch browser window\n  useEffect(() => {\n    document.title = \`Clicked \${count} times\`;\n  }, [count]);\n\n  return <button onClick={() => setCount(count + 1)}>Click {count}</button>;\n}` }],
      notes: [
        'The effect runs after the component renders and the screen paints.',
        '`[count]` re-runs the effect whenever `count` changes.',
        '`document.title` always matches the button\'s count.',
      ],
    },
  },
  {
    no: '3.2', section: S3, file: 'dependency_array.txt', short: 'The Dependency Array',
    title: 'The Dependency Array',
    subtitle: 'Controlling exactly when your Effect re-runs',
    left: { head: 'What it is', text: 'The dependency array is the optional second argument passed to `useEffect`. It controls whether React re-runs or skips the effect on subsequent renders.' },
    right: { head: 'Three behaviours', text: 'Passing no array runs the effect after every single render. Passing an empty array `[]` runs the effect only once when the component mounts. Passing dependencies `[userId]` runs the effect on mount and whenever `userId` changes between renders.' },
    status: 'Key idea: the array decides when the effect runs again',
    icon: 'brackets', heading: 'Choose when your Effect runs',
    points: [
      { term: 'No Array', text: 'Runs after every single render (can trigger infinite loops if setting state!).' },
      { term: 'Empty Array []', text: 'Runs exactly once after the initial component mount.' },
      { term: 'With Dependencies [a, b]', text: 'Re-runs only when `a` or `b` changes between renders.' },
    ],
    code: {
      file: 'UserProfile.jsx', title: 'Fetch only when the user changes',
      subtitle: 'The `[userId]` dependency re-runs the effect only when `userId` changes.',
      size: 14,
      panels: [{ tag: 'USER PROFILE', tagKind: '',
        code: `function UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n\n  // [userId] dependency: re-runs ONLY when userId changes\n  useEffect(() => {\n    fetchUserFromAPI(userId).then(data => setUser(data));\n  }, [userId]);\n\n  return <div>{user ? user.name : 'Loading...'}</div>;\n}` }],
      notes: [
        'On mount, and whenever `userId` changes, the effect fetches the user.',
        'Until data arrives, the UI shows Loading...',
        'When the request resolves, `setUser(data)` stores it and React re-renders.',
      ],
    },
  },
  {
    no: '3.3', section: S3, file: 'cleanup.txt', short: 'Using Effects & Cleanup Functions',
    title: 'Using Effects & Cleanup Functions',
    subtitle: 'Preventing memory leaks, ghost timers and stale subscriptions',
    left: { head: 'What cleanup is', text: 'A cleanup function is a function returned by your `useEffect` callback. React executes it when the component unmounts or right before re-running the effect.' },
    right: { head: 'Why it matters', text: 'Continuous operations like `setInterval`, WebSockets, or global event listeners keep running in memory even after a component is removed from the DOM unless stopped. Returning a cleanup function (`return () => clearInterval(id)`) guarantees that old subscriptions are destroyed before new ones start.' },
    status: 'Key idea: return a cleanup function to stop what the effect started',
    icon: 'trash', heading: 'Always clean up after yourself',
    points: [
      { term: 'Return a Function', text: 'Return `() => cleanup()` from your effect to tear down continuous tasks.' },
      { term: 'Prevent Memory Leaks', text: 'Avoid orphan timers, abandoned event listeners, and memory leaks.' },
      { term: 'Re-run Lifecycle', text: 'On effect re-runs, the previous cleanup executes first before the new effect runs.' },
    ],
    code: {
      file: 'Timer.jsx', title: 'A timer that cleans up after itself',
      subtitle: 'The returned function stops the interval when the effect is torn down.',
      size: 12.8,
      panels: [{ tag: 'TIMER · SYNCHRONIZATION WITH CLEANUP', tagKind: '',
        code: `function Timer() {\n  const [seconds, setSeconds] = useState(0);\n\n  useEffect(() => {\n    const id = setInterval(() => {\n      setSeconds(prev => prev + 1);\n    }, 1000);\n\n    // Cleanup function: runs on unmount or before effect re-runs\n    return () => {\n      clearInterval(id);\n    };\n  }, []);\n\n  return <div>Seconds elapsed: {seconds}</div>;\n}` }],
      notes: [
        'The empty array `[]` starts the interval once, on mount.',
        '`setSeconds(prev => prev + 1)` uses an updater function.',
        'The cleanup calls `clearInterval`, so no ghost timer survives unmount.',
      ],
    },
  },
];

/* ───────── Deck assembly ───────── */

const slides = [];
const push = (el) => slides.push(el);

push(
  <TitleSlide
    title="State and|Effect"
    subtitle="React state, re-rendering and useEffect"
    note="Introduction to State · More on State · Side Effects & useEffect"
    status={`Ready · ${topics.length} core topics · press → or space to begin`}
  />,
);

push(<IcebreakerSlide />);

// title 0, icebreaker 1, outline 2; topics start at 3, three slides each
const TOPIC_START = 3;
const sectionNames = [S1, S2, S3];
const outlineSections = sectionNames.map((name) => ({
  name,
  items: topics
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.section === name)
    .map(({ t, i }) => ({ no: t.no, label: t.short, slide: TOPIC_START + i * 3 })),
}));
push(<OutlineSlide sections={outlineSections} status={`3 sections · ${topics.length} topics · click a topic to jump to it`} />);

topics.forEach((t) => {
  push(
    <ConceptSlide
      file={`${t.no.replace('.', '_')}_${t.file}`}
      section={`${t.no} ${t.section}`}
      title={t.title} subtitle={t.subtitle} left={t.left} right={t.right} status={t.status}
    />,
  );
  push(
    <PointsSlide
      file={`Key_Points_${t.no}.exe`} icon={t.icon} label={`${t.no} ${t.short}`}
      heading={t.heading} points={t.points}
      status={`Topic ${t.no} · ${t.section} · 3 key points`}
    />,
  );
  push(
    <CodeSlide
      file={t.code.file} section={`${t.no} ${t.short}`} title={t.code.title}
      subtitle={t.code.subtitle} panels={t.code.panels} notes={t.code.notes}
      size={t.code.size} demo={t.no}
    />,
  );
});

push(
  <RecapSlide
    title="Put it all together"
    subtitle="State remembers, immutability updates, and Effects synchronize with the outside world."
    steps={[
      { head: 'Remember with State', text: 'State is component memory. Calling the setter schedules a re-render that keeps the UI in sync.' },
      { head: 'Update Immutably', text: 'Never mutate. Copy objects with spread and use updater functions; React compares with `Object.is`.' },
      { head: 'Sync with Effects', text: 'Use `useEffect` for outside systems, control it with the dependency array, and return a cleanup.' },
    ]}
  />,
);

export const navItems = [
  { no: '⌂', label: 'Title', slide: 0 },
  { no: '?', label: 'Ice-breaker', slide: 1 },
  { no: '≡', label: 'Topics', slide: 2 },
  ...topics.map((t, i) => ({ no: t.no, label: t.short, slide: TOPIC_START + i * 3 })),
  { no: '★', label: 'Recap', slide: TOPIC_START + topics.length * 3 },
];

export default slides;
