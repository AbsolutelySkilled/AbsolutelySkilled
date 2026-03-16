<!-- Part of the meta-repo AbsolutelySkilled skill. Load this file when
     working with specific meta command flags or sub-commands. -->

# meta command reference

## meta git

Wraps common git commands and runs them in every child repo.

```bash
meta git clone <url>        # clone meta repo + all child repos
meta git status             # git status in every child repo
meta git pull               # git pull in every child repo
meta git push               # git push in every child repo
meta git checkout <branch>  # checkout branch in every child repo
meta git update             # clone any newly added repos in .meta
meta git branch             # list branches in every child repo
```

**Filtering flags** (inherited from loop):

| Flag | Description |
|---|---|
| `--include-only dir1,dir2` | Run only in listed directories |
| `--exclude dir1,dir2` | Skip listed directories |

---

## meta exec

Run any arbitrary shell command in every child repo.

```bash
meta exec "<command>"
meta exec "<command>" --parallel     # run concurrently, not sequentially
meta exec "<command>" --include-only=dir1,dir2
```

**Escaping shell expressions** — expressions like `$(pwd)` or backticks expand
in the parent shell before meta sees them. Escape them to expand inside each
child repo:

```bash
meta exec "echo \$(pwd)"
meta exec "echo \`pwd\`"
```

---

## meta project

Manage the list of child repos registered in `.meta`.

```bash
# Register a remote URL and clone it into <folder>
meta project create <folder> <git-url>

# Register an already-cloned directory
meta project import <folder> <git-url>

# Extract a directory from the current repo into its own repo
meta project migrate <folder> <git-url>
```

All three commands:
- Update the `projects` map in `.meta`
- Add `<folder>` to `.gitignore`

---

## meta npm / meta yarn

Run npm or yarn commands in every child repo.

```bash
meta npm install
meta npm run <script>
meta npm run <script> --parallel

meta yarn install
meta yarn <script>
```

These are thin wrappers around `meta exec "npm ..."` / `meta exec "yarn ..."`.

---

## meta init

Initialise a `.meta` file in the current directory (creates an empty `projects`
map if none exists).

```bash
meta init
```

---

## Available plugins

| Plugin | Install | Purpose |
|---|---|---|
| `meta-init` | bundled | `meta init` |
| `meta-project` | bundled | `meta project create/import/migrate` |
| `meta-git` | bundled | `meta git *` |
| `meta-exec` | bundled | `meta exec` |
| `meta-npm` | bundled | `meta npm *` |
| `meta-yarn` | bundled | `meta yarn *` |
| `meta-gh` | `npm i -g meta-gh` | GitHub CLI integration |
| `meta-loop` | `npm i -g meta-loop` | loop options pass-through |
| `meta-template` | `npm i -g meta-template` | project templating |
| `meta-bump` | `npm i -g meta-bump` | version bumping |
| `meta-release` | `npm i -g meta-release` | release automation |
| `meta-search` | `npm i -g meta-search` | search across child repos |

Install a plugin globally (`npm i -g meta-<plugin>`) or as a devDependency in
the meta repo root. meta discovers plugins by scanning `node_modules` for
packages prefixed `meta-`.
