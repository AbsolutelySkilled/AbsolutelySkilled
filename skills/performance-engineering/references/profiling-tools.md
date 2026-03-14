<!-- Part of the performance-engineering AbsolutelySkilled skill. Load this file when
     selecting or using profiling tools for performance analysis. -->

# Profiling Tools Reference

This reference covers the primary profiling tools used in Node.js and browser
performance analysis. Each section describes what the tool does, when to use it,
its overhead profile, and concrete usage instructions.

---

## Tool selection guide

| Situation | Best tool |
|---|---|
| First look at a production Node.js service | `clinic doctor` |
| Deep CPU flame graph for Node.js | `0x` or `clinic flame` |
| Async I/O and event loop bottlenecks | `clinic bubbleprof` |
| Browser page load performance (LCP, TTI) | Chrome DevTools Performance or Lighthouse |
| Automated Lighthouse CI in a pipeline | `lighthouse` CLI |
| Quick heap leak investigation | Chrome DevTools Memory tab |
| Programmatic Node.js heap snapshot | `v8.writeHeapSnapshot()` |

---

## Node.js built-in `--prof`

The V8 sampling profiler built into Node.js. Zero external dependencies, available
everywhere Node runs.

**Overhead:** Low (1-5% in most cases). Safe to use in staging environments.

**Usage:**

```bash
# 1. Start your process with profiling enabled
node --prof app.js

# 2. Apply load (with a load tester, real traffic, or a script)
# V8 writes isolate-<pid>-<seq>-v8.log during this time

# 3. Convert the log to human-readable output
node --prof-process isolate-*.log > profile.txt

# 4. Look for [Bottom up (heavy) profile] section
# Functions with high self-time % are the hot paths
```

**Interpreting output:**

The `--prof-process` output has two sections:
- `[Top down]` - call tree from root, shows inclusive time
- `[Bottom up (heavy) profile]` - sorted by self-time, shows where CPU actually spends time

Focus on the bottom-up section first. A function with 30%+ self-time is a primary
optimization candidate.

**Limitations:** Text-based output is hard to navigate for deep call stacks. Use `0x`
or Chrome DevTools for visual flame graphs.

---

## 0x - Flame Graph Generator

`0x` wraps `--prof` and converts the V8 log directly into an interactive HTML flame
graph. It is the fastest way to get a visual CPU profile for a Node.js process.

**Overhead:** Same as `--prof` (1-5%). Not recommended for production without traffic
isolation.

**Installation:**

```bash
npm install -g 0x
# or use npx without installing
```

**Usage:**

```bash
# Wrap any node command
npx 0x -- node server.js
npx 0x -- node -r ts-node/register server.ts

# Apply your load while the process runs, then send SIGINT (Ctrl+C)
# 0x writes: flamegraph.html in the current directory
```

**Reading a flame graph:**
- X-axis: proportion of time (wider = more time)
- Y-axis: call stack depth (callee on top of caller)
- Hot paths: wide bars near the top of a call chain
- Click any frame to zoom in; press Escape to zoom out
- Filter by file name in the search box to focus on application code vs. Node internals

**Tip:** Use the "invert" toggle to flip the graph - this puts hot self-time functions at
the top, similar to `--prof-process` bottom-up output.

---

## clinic.js

A suite of three diagnostic tools from NearForm, each targeting a different class of
Node.js performance problem.

**Installation:**

```bash
npm install -g clinic
```

### `clinic doctor`

General-purpose diagnostic. Runs your process, collects metrics, and produces an HTML
report with recommended next steps. Start here when you don't know where the problem is.

```bash
clinic doctor -- node server.js
# Apply load, then Ctrl+C
# Opens doctor-report/ in browser
```

The report shows CPU, memory, event loop delay, and active handles over time. It flags
symptoms like "event loop blocked" or "memory growing without GC collection" with
explanations and links to the relevant clinic sub-tool.

### `clinic flame`

Generates a flame graph optimized for Node.js, similar to `0x` but with additional
filtering for async frames and built-in Node internals suppression.

```bash
clinic flame -- node server.js
```

Prefer `clinic flame` over `0x` when you have async/await-heavy code and want async
frames visible in the flame graph.

### `clinic bubbleprof`

Visualizes asynchronous delays and I/O wait time as a bubble diagram. Best for
understanding where time goes between async operations (waiting on DB, network, timers).

```bash
clinic bubbleprof -- node server.js
```

Use `bubbleprof` when the CPU profiler shows low CPU utilization but latency is still
high - the bottleneck is I/O wait or async queuing, not CPU.

---

## Chrome DevTools - Performance Tab

The browser's built-in CPU and rendering profiler. Works for both frontend JavaScript
and (via `--inspect`) Node.js processes.

**Overhead:** Recording adds 5-15% overhead. Always test in a separate browser profile
without extensions.

### Browser profiling

1. Open DevTools > Performance tab
2. Click the record button (circle icon)
3. Reproduce the slow interaction
4. Click stop
5. Analyze the flame chart

**Key sections in the Performance timeline:**
- **Network** - resource loading waterfall
- **Main** - JavaScript execution flame chart on the main thread
- **Compositor / Raster** - paint and layout work
- **Long Tasks** - red diagonal stripes indicate tasks > 50ms (block user input)

**Identifying long tasks:** Any red-striped block on the Main thread is a long task.
Click it to see the full call stack. Long tasks over 50ms delay user interaction responses (INP).

### Node.js remote profiling via `--inspect`

```bash
# Start Node with inspector
node --inspect server.js
# or break on start:
node --inspect-brk server.js
```

Then open `chrome://inspect` in Chrome, click "inspect" next to your process.
This opens a full DevTools instance connected to the Node process. Use the
Performance tab identically to browser profiling.

---

## Chrome DevTools - Memory Tab

Three modes for investigating heap usage:

### Heap snapshot

Takes a full snapshot of all live objects. Compare two snapshots to find leaks:

1. DevTools > Memory > Heap snapshot > Take snapshot (baseline)
2. Trigger the suspected leak operation N times
3. Take a second snapshot
4. Select "Comparison" view from the dropdown
5. Sort by "# Delta" (new objects) or "Size Delta" (retained bytes)

Objects with positive size delta that are unexpected are your leak candidates. Click
any object to see its retainer path - the chain of references keeping it alive.

### Allocation instrumentation

Records all allocations over time with call stacks. More expensive than snapshots but
shows exactly which code paths are allocating memory.

```
DevTools > Memory > Allocation instrumentation on timeline > Start
```

### Allocation sampling

Low-overhead sampling of allocations. Good for long-running production-like sessions
where instrumentation is too expensive.

---

## Lighthouse

Google's automated auditing tool for web performance, accessibility, SEO, and best
practices. Measures Core Web Vitals and provides scored recommendations.

**CLI usage:**

```bash
npm install -g lighthouse

# Run against a URL, output to HTML report
lighthouse https://example.com --output html --output-path ./report.html

# Run in CI mode (JSON output, no browser window)
lighthouse https://example.com --output json --chrome-flags="--headless"
```

**Key performance metrics Lighthouse measures:**
- **FCP** (First Contentful Paint) - target < 1.8s
- **LCP** (Largest Contentful Paint) - target < 2.5s
- **TBT** (Total Blocking Time) - proxy for INP; target < 200ms
- **CLS** (Cumulative Layout Shift) - target < 0.1
- **Speed Index** - how quickly content is visually populated

**Lighthouse CI for continuous monitoring:**

```bash
npm install -g @lhci/cli

# Add to CI pipeline
lhci autorun --collect.url=https://staging.example.com \
             --assert.preset=lighthouse:recommended
```

Set `budgets.json` to fail CI when performance regresses:

```json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "total-blocking-time", "budget": 200 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 150 }
    ]
  }
]
```

---

## `v8.writeHeapSnapshot()` - Programmatic Snapshots

For automated leak detection in long-running processes without manual DevTools interaction:

```typescript
import { writeHeapSnapshot } from 'v8';
import { setInterval } from 'timers';

// Take a snapshot every 30 minutes to track growth
setInterval(() => {
  const filename = writeHeapSnapshot();
  console.log(`Heap snapshot written: ${filename}`);
}, 30 * 60 * 1000).unref();

// Or trigger via HTTP endpoint for on-demand snapshots
app.post('/debug/heap-snapshot', (_req, res) => {
  const filename = writeHeapSnapshot();
  res.json({ filename });
});
```

The generated `.heapsnapshot` file can be loaded in Chrome DevTools > Memory > Load.

**Security note:** Never expose a heap snapshot endpoint publicly - snapshots contain
all in-memory data including secrets, tokens, and user data.

---

## Choosing between tools - decision flowchart

```
Is the problem CPU (high CPU %) or I/O wait (low CPU, high latency)?
  CPU -> Use 0x or clinic flame for a flame graph
  I/O -> Use clinic bubbleprof to visualize async delays

Is it a Node.js backend or browser frontend?
  Node.js -> 0x / clinic / --prof / --inspect + Chrome DevTools
  Browser -> Chrome DevTools Performance + Lighthouse

Do you need automated CI performance regression detection?
  YES -> Lighthouse CI with performance budgets
  NO  -> Manual DevTools or 0x run

Is memory growing unboundedly?
  YES -> Chrome DevTools Memory > Heap snapshot comparison
        or v8.writeHeapSnapshot() + programmatic diff
```
