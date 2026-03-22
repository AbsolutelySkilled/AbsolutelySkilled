<!-- Part of the react-ink AbsolutelySkilled skill. Load this file when
     implementing advanced patterns like game loops, chat UIs, routers,
     concurrent rendering, or subprocess output. -->

# Advanced Patterns

Patterns extracted from the 24 official Ink examples.

---

## Game loop with useReducer

For complex state like games, use `useReducer` with a tick-based game loop.

```tsx
import {useReducer, useEffect, useRef} from 'react';
import {useInput, useApp, Box, Text} from 'ink';

type State = {
  position: {x: number; y: number};
  direction: 'up' | 'down' | 'left' | 'right';
  score: number;
  gameOver: boolean;
};

type Action = {type: 'tick'} | {type: 'changeDirection'; direction: State['direction']} | {type: 'restart'};

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'tick': {
      const {x, y} = state.position;
      const delta = {up: {x: 0, y: -1}, down: {x: 0, y: 1}, left: {x: -1, y: 0}, right: {x: 1, y: 0}};
      const d = delta[state.direction];
      return {...state, position: {x: x + d.x, y: y + d.y}};
    }
    case 'changeDirection':
      return {...state, direction: action.direction};
    case 'restart':
      return initialState;
    default:
      return state;
  }
}

const initialState: State = {position: {x: 10, y: 5}, direction: 'right', score: 0, gameOver: false};

function Game() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const directionRef = useRef(state.direction);

  useInput((_input, key) => {
    if (key.upArrow) directionRef.current = 'up';
    if (key.downArrow) directionRef.current = 'down';
    if (key.leftArrow) directionRef.current = 'left';
    if (key.rightArrow) directionRef.current = 'right';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({type: 'changeDirection', direction: directionRef.current});
      dispatch({type: 'tick'});
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box flexDirection="column">
      <Text>Score: {state.score}</Text>
      <Text>Position: ({state.position.x}, {state.position.y})</Text>
    </Box>
  );
}
```

> Use `useRef` for direction to avoid stale closures in the interval callback. Dispatch both direction change and tick in the same interval.

---

## Chat UI with message history

```tsx
import {useState} from 'react';
import {useInput, Box, Text} from 'ink';

type Message = {id: number; text: string};

function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextId, setNextId] = useState(0);

  useInput((char, key) => {
    if (key.return && input.length > 0) {
      setMessages(prev => [...prev, {id: nextId, text: input}]);
      setNextId(prev => prev + 1);
      setInput('');
    } else if (key.backspace) {
      setInput(prev => prev.slice(0, -1));
    } else if (!key.ctrl && !key.meta && char) {
      setInput(prev => prev + char);
    }
  });

  return (
    <Box flexDirection="column">
      {messages.map(msg => (
        <Text key={msg.id} color="green">{'> '}{msg.text}</Text>
      ))}
      <Text>{'> '}{input}<Text color="gray">|</Text></Text>
    </Box>
  );
}
```

---

## React Router integration

Use `MemoryRouter` from react-router for in-memory page navigation.

```tsx
import {MemoryRouter, Routes, Route, useNavigate} from 'react-router';
import {useInput, useApp, Text, Box} from 'ink';

function Home() {
  const navigate = useNavigate();
  useInput((_input, key) => {
    if (key.return) navigate('/about');
  });
  return <Text color="green">Home - Press Enter to go to About</Text>;
}

function About() {
  const {exit} = useApp();
  useInput((input) => {
    if (input === 'q') exit();
  });
  return <Text color="blue">About - Press q to quit</Text>;
}

function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );
}
```

---

## Concurrent Suspense with progressive loading

Multiple Suspense boundaries resolve independently.

```tsx
import React, {Suspense} from 'react';
import {render, Text, Box} from 'ink';

const cache = new Map<string, {data?: string; promise?: Promise<void>}>();

function fetchItem(id: string, delay: number): string {
  const entry = cache.get(id) ?? {};
  if (entry.data) return entry.data;
  if (!entry.promise) {
    entry.promise = new Promise(resolve => {
      setTimeout(() => { entry.data = `Data for ${id}`; resolve(); }, delay);
    });
    cache.set(id, entry);
  }
  throw entry.promise;
}

function Item({id, delay}: {id: string; delay: number}) {
  const data = fetchItem(id, delay);
  return <Text color="green">{data}</Text>;
}

render(
  <Box flexDirection="column">
    <Suspense fallback={<Text dimColor>Loading fast...</Text>}>
      <Item id="fast" delay={200} />
    </Suspense>
    <Suspense fallback={<Text dimColor>Loading medium...</Text>}>
      <Item id="medium" delay={800} />
    </Suspense>
    <Suspense fallback={<Text dimColor>Loading slow...</Text>}>
      <Item id="slow" delay={1500} />
    </Suspense>
  </Box>,
  {concurrent: true}
);
```

---

## Subprocess output capture

Execute and display output from child processes.

```tsx
import {useState, useEffect} from 'react';
import {spawn} from 'child_process';
import {Box, Text} from 'ink';
import stripAnsi from 'strip-ansi';

function SubprocessOutput({command, args}: {command: string; args: string[]}) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const child = spawn(command, args);
    const decoder = new TextDecoder();

    child.stdout.on('data', (data: Buffer) => {
      const text = stripAnsi(decoder.decode(data));
      setLines(prev => [...prev, ...text.split('\n').filter(Boolean)]);
    });

    return () => child.kill();
  }, [command, args]);

  return (
    <Box flexDirection="column">
      {lines.slice(-10).map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  );
}
```

> Use `strip-ansi` to clean ANSI escape codes from subprocess output. Slice to show only recent lines and prevent unbounded growth.

---

## Incremental rendering for high-frequency updates

For UIs that update at 60fps (progress bars, animations), enable incremental rendering.

```tsx
import {render, Box, Text} from 'ink';

function HighFrequencyUI() {
  // ... rapid state updates
  return (
    <Box flexDirection="column">
      <Text>FPS counter, progress bars, animations</Text>
    </Box>
  );
}

render(<HighFrequencyUI />, {incrementalRendering: true});
```

> `incrementalRendering: true` only re-renders the changed portions of the output instead of the entire screen. Pair with `concurrent: true` for complex UIs.

---

## Responsive layout with useWindowSize

Adapt layout based on terminal dimensions.

```tsx
import {useWindowSize, Box, Text} from 'ink';

function ResponsiveApp() {
  const {columns} = useWindowSize();
  const isWide = columns > 100;

  return (
    <Box flexDirection={isWide ? 'row' : 'column'} gap={2}>
      <Box width={isWide ? '30%' : '100%'} borderStyle="round">
        <Text>Sidebar</Text>
      </Box>
      <Box width={isWide ? '70%' : '100%'} borderStyle="round">
        <Text>Main Content</Text>
      </Box>
    </Box>
  );
}
```

---

## Focus management with IDs

Use `useFocusManager().focus(id)` for keyboard shortcuts that jump to specific components.

```tsx
import {useFocus, useFocusManager, useInput, Box, Text} from 'ink';

function FocusablePanel({id, label}: {id: string; label: string}) {
  const {isFocused} = useFocus({id});
  return (
    <Box borderStyle={isFocused ? 'bold' : 'round'} borderColor={isFocused ? 'green' : undefined} paddingX={1}>
      <Text>{label}</Text>
    </Box>
  );
}

function App() {
  const {focus} = useFocusManager();

  useInput((input) => {
    if (input === '1') focus('panel-1');
    if (input === '2') focus('panel-2');
    if (input === '3') focus('panel-3');
  });

  return (
    <Box gap={1}>
      <FocusablePanel id="panel-1" label="Panel 1" />
      <FocusablePanel id="panel-2" label="Panel 2" />
      <FocusablePanel id="panel-3" label="Panel 3" />
    </Box>
  );
}
```

> Number keys (1/2/3) jump directly to panels. Tab/Shift+Tab still works for sequential navigation.

---

## useTransition for responsive input

Keep input responsive during expensive computations.

```tsx
import {useState, useTransition} from 'react';
import {useInput, Box, Text} from 'ink';

function SearchWithTransition() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useInput((char, key) => {
    if (key.backspace) {
      setQuery(prev => prev.slice(0, -1));
    } else if (!key.ctrl && char) {
      setQuery(prev => prev + char);
    }

    startTransition(() => {
      // Expensive filtering runs without blocking input
      const filtered = allItems.filter(item => item.includes(query));
      setResults(filtered);
    });
  });

  return (
    <Box flexDirection="column">
      <Text>Search: {query}{isPending ? ' (searching...)' : ''}</Text>
      {results.slice(0, 5).map((r, i) => <Text key={i}>{r}</Text>)}
    </Box>
  );
}
```

> Requires `{concurrent: true}` in render options. The `startTransition` wrapper marks the state update as non-urgent, keeping the input field responsive.

---

## Alternate screen buffer

Use the alternate screen for full-screen apps (games, editors) that clean up on exit.

```tsx
render(<FullScreenApp />, {alternateScreen: true});
```

The terminal switches to an alternate buffer. When the app exits, the original terminal content is restored cleanly.
