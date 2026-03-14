<!-- Part of the Vite+ AbsolutelySkilled skill. Load this file when
     working with Node.js version management or vp env commands. -->

# Vite+ Environment & Runtime Management

Vite+ manages Node.js versions globally and per-project through `vp env`.
Managed runtimes are stored in `~/.vite-plus` (override with `VITE_PLUS_HOME`).

---

## Operating modes

### Managed mode (default)

Shims always resolve to Vite+-managed Node.js. Enable with `vp env on`.

### System-first mode

Prioritizes system Node.js, falls back to Vite+-managed runtime. Enable with
`vp env off`. Useful when you need to use a system-installed Node.js for
specific projects or environments.

---

## Command reference

### Setup

| Command | Purpose |
|---|---|
| `vp env setup` | Create shims in `VITE_PLUS_HOME/bin` |
| `vp env on` | Switch to managed mode |
| `vp env off` | Switch to system-first mode |
| `vp env print` | Output shell configuration snippet |

### Version management

| Command | Purpose |
|---|---|
| `vp env pin <version>` | Lock project to Node.js version (writes `.node-version`) |
| `vp env unpin` | Remove version pin |
| `vp env default <version>` | Set global default Node.js version |
| `vp env use <version>` | Apply version for current shell session only |
| `vp env install <version>` | Download and install a Node.js version |
| `vp env uninstall <version>` | Remove an installed Node.js version |
| `vp env exec <version> -- <cmd>` | Run a command with a specific Node.js version |

### Inspection

| Command | Purpose |
|---|---|
| `vp env current` | Display resolved environment (Node version, package manager) |
| `vp env which <tool>` | Show tool path resolution |
| `vp env list` | List installed Node.js versions |
| `vp env list-remote` | List available Node.js versions for download |
| `vp env doctor` | Run environment diagnostics |

---

## Project workflow

1. Pin the Node.js version: `vp env pin 22`
2. This writes a `.node-version` file to the project root
3. All `vp` commands (`vp install`, `vp dev`, `vp build`) automatically use
   the pinned version
4. Team members running `vp env install` will get the correct version

---

## Toolchain management

| Command | Purpose |
|---|---|
| `vp upgrade` | Update the Vite+ toolchain to latest |
| `vp implode` | Complete removal of Vite+ and all managed runtimes |
| `vpx <pkg>` / `vp dlx <pkg>` | Execute a package binary without installing globally |
