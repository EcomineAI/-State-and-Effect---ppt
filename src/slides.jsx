import React from 'react';
import {
  TitleSlide, OutlineSlide, ConceptSlide, PointsSlide, CodeSlide, RecapSlide,
} from './components/layouts.jsx';

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
    no: '2.1', section: S2, file: 'immutability.txt', short: 'Updating State & Immutability',
    title: 'Updating State & Immutability',
    subtitle: 'Immutable data structures, object spreading and functional updaters',
    left: { head: 'Replace, never mutate', text: 'State updating replaces old state with new state using the setter function. State in React is immutable; modifying it directly (e.g. `player.level = 2`) will break React\'s change detection.' },
    right: { head: 'Copy, then update', text: 'When state holds objects or arrays, you must copy the previous object with the spread operator (`{ ...prevPlayer, level: prevPlayer.level + 1 }`). Furthermore, when new state depends on previous state, always pass an updater function (`setScore(prev => prev + 1)`) to prevent stale closure traps during rapid updates.' },
    status: 'Key idea: never mutate state; copy it, and use updaters for sequences',
    icon: 'lock', heading: 'Never mutate, always replace',
    points: [
      { term: 'Never Mutate Directly', text: 'Direct mutations bypass React\'s change detection completely.' },
      { term: 'Spread Syntax', text: 'Use `...prev` to preserve existing properties when updating objects/arrays.' },
      { term: 'Functional Updater', text: 'Use `setState(prev => prev + 1)` whenever state calculation depends on previous state.' },
    ],
    code: {
      file: 'ScoreBoard.jsx', title: 'Update objects and sequences safely',
      subtitle: 'Copy with spread; use updater functions when the new value depends on the old one.',
      size: 16,
      panels: [
        { tag: 'IMMUTABLE · OBJECT UPDATE', tagKind: 'good', caption: 'Spread keeps existing properties; only `level` changes.',
          code: `// Updating an object immutably with spread:\nsetPlayer(prevPlayer => ({\n  ...prevPlayer,\n  level: prevPlayer.level + 1\n}));` },
        { tag: 'FUNCTIONAL · UPDATER', tagKind: 'good', caption: 'Each updater sees the latest value, so two calls add +2.',
          code: `// Safe sequential updates with functional updater:\nsetScore(prevScore => prevScore + 1);\nsetScore(prevScore => prevScore + 1); // Correctly increments by +2!` },
      ],
    },
  },
  {
    no: '2.2', section: S2, file: 'rerender.txt', short: 'State & Re-rendering Mechanics',
    title: 'State & Re-rendering Mechanics',
    subtitle: 'How React detects state changes using `Object.is` equality',
    left: { head: 'What a re-render is', text: 'A re-render is React\'s process of executing your component function again to compute new JSX and diff the virtual DOM against the real DOM.' },
    right: { head: 'How React decides', text: 'When a setter is called, React compares the new value to the previous value using `Object.is`. If they are identical (like mutating an object in-place and passing the same reference), React skips the re-render. If the reference or primitive differs, React recalculates the component and updates only changed DOM nodes.' },
    status: 'Key idea: same reference means no re-render; a new reference means re-render',
    icon: 'cycle', heading: 'How React decides to re-render',
    points: [
      { term: 'Object.is Comparison', text: 'React uses strict reference equality to determine if an update occurred.' },
      { term: 'Bailout Optimization', text: 'If new state is the same as old state by `Object.is`, React bails out without re-rendering.' },
      { term: 'Targeted DOM Diffing', text: 'React re-executes the function, but only updates the actual DOM nodes that changed.' },
    ],
    code: {
      file: 'RenderLogger.jsx', title: 'Spot the re-render trap',
      subtitle: 'Inside `RenderLogger`, two handlers update the same `user` state.',
      size: 15.5,
      panels: [
        { tag: 'TRAP · SAME REFERENCE', tagKind: 'bad', caption: '`Object.is` is true, so React skips the re-render.',
          code: `const [user, setUser] = useState({ name: 'Bob' });\n\n// [Trap] Same object reference: Object.is is TRUE -> NO RE-RENDER!\nconst badUpdate = () => {\n  user.name = 'Charlie';\n  setUser(user);\n};` },
        { tag: 'CORRECT · NEW REFERENCE', tagKind: 'good', caption: '`Object.is` is false, so React re-renders and updates the DOM.',
          code: `// [Correct] New object reference: Object.is is FALSE -> RE-RENDERS!\nconst goodUpdate = () => {\n  setUser({ ...user, name: 'Charlie' });\n};` },
      ],
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
    title={<>State and<br />Effect</>}
    subtitle="React state, re-rendering and useEffect"
    note="Introduction to State · More on State · Side Effects & useEffect"
    status={`Ready · ${topics.length} core topics · press → or space to begin`}
  />,
);

// outline slide index = 1; topic slides start at index 2, three per topic
const sectionNames = [S1, S2, S3];
const outlineSections = sectionNames.map((name) => ({
  name,
  items: topics
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.section === name)
    .map(({ t, i }) => ({ no: t.no, label: t.short, slide: 2 + i * 3 })),
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

export default slides;
