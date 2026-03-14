<!-- Part of the debugging-tools AbsolutelySkilled skill. Load this file when
     the task requires precise flag-level command reference for a specific tool. -->

# Debugging Tool Quick Reference

---

## Chrome DevTools

### Opening DevTools
| Action | Shortcut |
|---|---|
| Open DevTools | `F12` or `Cmd+Option+I` |
| Open Console | `Cmd+Option+J` |
| Open Sources | `Cmd+Option+P` then type file name |
| Toggle device mode | `Cmd+Shift+M` |

### Console
```javascript
console.log('%o', obj)         // interactive object inspector
console.table(arrayOfObjects)  // tabular display
console.time('label')          // start timer
console.timeEnd('label')       // stop and print elapsed
console.trace()                // print current call stack
console.group('name')          // collapsible group start
console.groupEnd()
```

### Sources panel - breakpoints
| Action | How |
|---|---|
| Add breakpoint | Click line number |
| Conditional breakpoint | Right-click line > Add conditional breakpoint |
| Logpoint | Right-click line > Add logpoint |
| DOM breakpoint | Elements panel > right-click node > Break on... |
| XHR breakpoint | Sources > XHR/fetch Breakpoints > `+` |
| Event listener breakpoint | Sources > Event Listener Breakpoints |

### Stepping controls
| Key | Action |
|---|---|
| `F8` | Resume / pause |
| `F10` | Step over (next line) |
| `F11` | Step into (enter function) |
| `Shift+F11` | Step out (exit current function) |

### Performance tab workflow
1. Record > perform action > Stop
2. Flame chart - x axis = time, y axis = call depth
3. Summary pie: Scripting / Rendering / Painting / Other / Idle
4. Bottom-Up: sort by Self Time to find hot functions
5. Call Tree: find cumulative time per function subtree
6. Long Tasks filter: `> 50ms` tasks flagged with red corner

### Memory tab - heap snapshot
1. **Heap snapshot** - point-in-time object graph
2. **Allocation instrumentation on timeline** - records every allocation over time
3. **Allocation sampling** - low-overhead statistical profiler

Snapshot views:
- **Summary** - objects grouped by constructor
- **Comparison** - delta between two snapshots (sort by `# Delta`)
- **Containment** - full object graph from roots
- **Statistics** - memory breakdown by category

### Network tab
| Column | Meaning |
|---|---|
| Waterfall | Timeline of each request |
| Time | Total duration |
| Size | Transfer size / decoded size |
| Initiator | What triggered the request |

Key filters: `XHR`, `JS`, `CSS`, `Img`, `WS` (WebSocket), `Fetch`

Throttle presets: Fast 3G, Slow 3G, Offline

---

## Node.js Inspector

```bash
node --inspect server.js            # listen on 127.0.0.1:9229
node --inspect=0.0.0.0:9229 server.js  # listen on all interfaces (dev only)
node --inspect-brk server.js        # break before first line

# Attach to running process
kill -USR1 <pid>                    # Linux/macOS
```

Connect via `chrome://inspect` > Remote Target > inspect.

**VS Code launch.json for attach:**
```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Node",
  "port": 9229,
  "restart": true,
  "localRoot": "${workspaceFolder}",
  "remoteRoot": "/app"
}
```

---

## strace

```bash
# Basic usage
strace command [args]                   # trace new process
strace -p <pid>                         # attach to running process
strace -f command                       # follow forks (child processes too)

# Output control
strace -o /tmp/out.log command          # write to file
strace -e trace=network command         # filter: network syscalls only
strace -e trace=openat,read command     # filter: specific syscalls
strace -e trace=file command            # filter: all file-related
strace -e trace=process command         # filter: process lifecycle

# Timing
strace -T command                       # show syscall duration
strace -tt command                      # absolute timestamps (microseconds)
strace -ttt command                     # epoch time

# Common filters
-e trace=network     # socket, connect, send, recv, ...
-e trace=file        # open, openat, stat, access, ...
-e trace=ipc         # mmap, mprotect, ...
-e trace=signal      # kill, sigaction, ...
-e trace=desc        # file descriptor ops: read, write, close, ...
```

**Reading output format:**
```
syscall(arg1, arg2, ...) = retval [errno string]
```
- Return `>= 0` = success (often fd number or bytes count)
- Return `-1` = failure; error name and description follow
- `+++ exited with 1 +++` = process exited with code 1

---

## ltrace

```bash
ltrace ./myapp                   # trace shared library calls
ltrace -p <pid>                  # attach to running process
ltrace -e malloc+free ./myapp    # filter to specific functions
ltrace -c ./myapp                # summary: count, time, function name
```

Use `ltrace` when you need to see calls to C library functions (`malloc`, `fopen`,
`strcmp`) rather than raw syscalls.

---

## lldb

```bash
# Start with core dump
lldb ./myapp core

# Start and run
lldb ./myapp
(lldb) run [args]

# Attach to running process
lldb -p <pid>
```

### Key commands
| Command | Description |
|---|---|
| `bt` | Backtrace (full call stack) |
| `bt 20` | Show top 20 frames |
| `frame select 3` | Switch to frame 3 |
| `frame variable` | Show local variables in current frame |
| `print expr` | Evaluate and print expression |
| `po obj` | Print Objective-C / Swift object description |
| `memory read 0xaddr` | Dump memory at address |
| `watchpoint set variable x` | Break when `x` changes |
| `breakpoint set -n funcname` | Set breakpoint by function name |
| `breakpoint set -f file.c -l 42` | Set breakpoint at file:line |
| `continue` | Resume execution |
| `step` | Step into |
| `next` | Step over |
| `finish` | Step out |
| `quit` | Exit lldb |

### Reading a backtrace
```
frame #0: 0x00007fff libsystem_kernel.dylib`__pthread_kill
frame #1: 0x00007fff libsystem_pthread.dylib`pthread_kill
frame #2: 0x00007fff libsystem_c.dylib`abort
frame #3: 0x0000000100003a12 myapp`handle_request + 142 at server.c:87
frame #4: 0x000000010000290f myapp`main + 63 at main.c:12
```
Read bottom-to-top for call order. Frame 3 is where your code called `abort`. Frame
4 is the caller. `+ 142` is the byte offset into the function; the source location
follows.

---

## gdb

```bash
gdb ./myapp core                 # open core dump
gdb -p <pid>                     # attach to process
```

| Command | Description |
|---|---|
| `bt` | Backtrace |
| `frame N` | Select frame N |
| `info locals` | Local variables |
| `print expr` | Print expression |
| `list` | Show source around current line |
| `break file.c:42` | Set breakpoint |
| `watch var` | Watchpoint on variable |
| `continue` | Resume |
| `step` | Step into |
| `next` | Step over |
| `finish` | Step out |
| `quit` | Exit |

---

## curl

```bash
# Verbose - shows request and response headers
curl -v https://api.example.com/path

# Show only response headers
curl -sI https://api.example.com/path

# POST with JSON body
curl -X POST https://api.example.com/path \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Follow redirects, show final URL
curl -L -w "%{url_effective}\n" -o /dev/null -s https://short.url/x

# Time each phase (save format file first)
curl -w "dns:%{time_namelookup} connect:%{time_connect} tls:%{time_appconnect} total:%{time_total}\n" \
  -o /dev/null -s https://api.example.com/path

# Use specific DNS resolver (bypass system DNS)
curl --dns-servers 8.8.8.8 https://api.example.com/path

# Ignore TLS errors (testing only, never in production)
curl -k https://api.example.com/path
```

---

## tcpdump

```bash
# Capture on all interfaces, save to file
tcpdump -i any -w /tmp/capture.pcap

# Capture on specific interface, port filter
tcpdump -i eth0 port 443 -w /tmp/tls.pcap

# Print HTTP traffic to stdout (ASCII)
tcpdump -i eth0 -A port 80

# Filter by host
tcpdump host api.example.com

# Combined filter
tcpdump -i eth0 host api.example.com and port 443 -w /tmp/out.pcap

# Read a saved capture
tcpdump -r /tmp/capture.pcap

# Don't resolve hostnames (faster, shows IPs)
tcpdump -n -i eth0 port 80
```

Common Wireshark display filters:
```
http                              # all HTTP
http.request.method == "POST"    # POST requests only
tcp.analysis.retransmission      # retransmitted packets (packet loss)
tcp.flags.reset == 1             # TCP RST (connection reset)
dns                              # all DNS
http.response.code >= 500        # server errors
```

---

## dig (DNS)

```bash
dig api.example.com              # A record (IPv4)
dig AAAA api.example.com         # IPv6
dig MX example.com               # mail servers
dig TXT example.com              # TXT records (SPF, DKIM, etc.)
dig +trace api.example.com       # full resolution chain from root
dig @8.8.8.8 api.example.com     # query specific resolver (Google DNS)
dig +short api.example.com       # just the IP addresses
```

---

## git bisect

```bash
git bisect start
git bisect bad                   # current commit is broken
git bisect good v1.2.0           # this tag was working

# git checks out midpoint commit automatically
# Test it, then tell git the result:
git bisect good                  # this commit is fine
git bisect bad                   # this commit is broken

# Repeat until git identifies the first bad commit
# When done:
git bisect reset                 # return to original HEAD

# Automate with a test script
git bisect run ./test.sh         # script exits 0 = good, non-zero = bad
```
