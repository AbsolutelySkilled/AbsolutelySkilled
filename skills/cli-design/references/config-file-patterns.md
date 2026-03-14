<!-- Part of the cli-design AbsolutelySkilled skill. Load this file when
     working with CLI configuration files, XDG directories, schema validation,
     config migration, or environment variable conventions. -->

# Config File Patterns

Patterns for managing CLI configuration files across multiple scopes and
formats. Load this file only when the task involves config loading, dotfiles,
XDG compliance, or config schema validation.

---

## XDG Base Directory Specification

The XDG spec defines where config, data, cache, and state files live on Linux
and macOS. Following it keeps user home directories clean.

| Variable | Default | Purpose |
|----------|---------|---------|
| `XDG_CONFIG_HOME` | `~/.config` | User config files |
| `XDG_DATA_HOME` | `~/.local/share` | User data files |
| `XDG_STATE_HOME` | `~/.local/state` | User state (logs, history) |
| `XDG_CACHE_HOME` | `~/.cache` | Non-essential cached data |

**Config path resolution:**
```typescript
import { join } from 'path';
import { homedir } from 'os';

function configDir(toolName: string): string {
  return join(
    process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config'),
    toolName
  );
}

function dataDir(toolName: string): string {
  return join(
    process.env.XDG_DATA_HOME ?? join(homedir(), '.local', 'share'),
    toolName
  );
}

function cacheDir(toolName: string): string {
  return join(
    process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache'),
    toolName
  );
}
```

**Python:**
```python
from pathlib import Path
import os

def config_dir(tool: str) -> Path:
    base = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config"))
    return base / tool

def data_dir(tool: str) -> Path:
    base = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share"))
    return base / tool
```

---

## Config file formats

### JSON
```json
{
  "output": "dist",
  "verbose": false,
  "plugins": ["@mytool/plugin-a"]
}
```
Pros: universal parser support, strict syntax.
Cons: no comments, no trailing commas.

### YAML
```yaml
output: dist
verbose: false
plugins:
  - "@mytool/plugin-a"
```
Pros: human-readable, supports comments.
Cons: indentation sensitivity, security risks with `!!` tags.

### TOML
```toml
output = "dist"
verbose = false
plugins = ["@mytool/plugin-a"]
```
Pros: clear section boundaries, typed values, comments.
Cons: less familiar to web developers, verbose for nested structures.

### JavaScript / TypeScript
```typescript
// mytool.config.ts
import type { Config } from 'mytool';

export default {
  output: 'dist',
  verbose: false,
  plugins: ['@mytool/plugin-a'],
} satisfies Config;
```
Pros: type checking, dynamic values, IDE autocompletion.
Cons: security risk (arbitrary code execution), harder to lint.

### Recommendation

Offer JSON and YAML at minimum. Add TypeScript config support for
developer tools. Use cosmiconfig (Node.js) or `dynaconf` (Python) to
search multiple formats automatically.

---

## Full config loading hierarchy

A production CLI should merge config from all sources in this order:

```typescript
import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';

// 1. Define schema
const ConfigSchema = z.object({
  output: z.string().default('dist'),
  verbose: z.boolean().default(false),
  timeout: z.number().int().positive().default(30000),
  plugins: z.array(z.string()).default([]),
});

type Config = z.infer<typeof ConfigSchema>;

// 2. Load and merge
async function resolveConfig(cliFlags: Partial<Config>): Promise<Config> {
  const explorer = cosmiconfig('mytool');
  const result = await explorer.search();

  const merged = {
    // Layer 1: hardcoded defaults (handled by zod .default())
    // Layer 2: file config
    ...result?.config,
    // Layer 3: environment variables
    ...(process.env.MYTOOL_OUTPUT ? { output: process.env.MYTOOL_OUTPUT } : {}),
    ...(process.env.MYTOOL_VERBOSE ? { verbose: process.env.MYTOOL_VERBOSE === 'true' } : {}),
    ...(process.env.MYTOOL_TIMEOUT ? { timeout: parseInt(process.env.MYTOOL_TIMEOUT, 10) } : {}),
    // Layer 4: CLI flags (highest priority)
    ...Object.fromEntries(
      Object.entries(cliFlags).filter(([, v]) => v !== undefined)
    ),
  };

  // 3. Validate
  const parsed = ConfigSchema.safeParse(merged);
  if (!parsed.success) {
    console.error('Invalid configuration:');
    for (const issue of parsed.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(2);
  }

  return parsed.data;
}
```

---

## Environment variable conventions

Follow these naming rules for environment variables:

| Rule | Example | Notes |
|------|---------|-------|
| Prefix with tool name | `MYTOOL_OUTPUT` | Avoids collisions |
| Use SCREAMING_SNAKE_CASE | `MYTOOL_API_KEY` | Standard convention |
| Map flag names directly | `--output` becomes `MYTOOL_OUTPUT` | Predictable mapping |
| Boolean values | `MYTOOL_VERBOSE=true` | Accept `true`/`1`/`yes` |
| List values | `MYTOOL_PLUGINS=a,b,c` | Comma-separated |

**Python (click) auto-mapping:**
```python
@click.option("--output", envvar="MYTOOL_OUTPUT", default="dist")
@click.option("--verbose", envvar="MYTOOL_VERBOSE", is_flag=True)
```

**Rust (clap) auto-mapping:**
```rust
#[arg(long, env = "MYTOOL_OUTPUT", default_value = "dist")]
output: String,
```

---

## Schema validation

Always validate config files at load time. Report all errors at once rather
than failing on the first one.

**Node.js (zod):**
```typescript
const parsed = ConfigSchema.safeParse(rawConfig);
if (!parsed.success) {
  console.error('Config validation failed:');
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(2);
}
```

**Python (pydantic):**
```python
from pydantic import BaseModel, ValidationError

class Config(BaseModel):
    output: str = "dist"
    verbose: bool = False
    timeout: int = 30000
    plugins: list[str] = []

try:
    config = Config(**raw_config)
except ValidationError as e:
    for err in e.errors():
        click.echo(f"  {'.'.join(str(l) for l in err['loc'])}: {err['msg']}", err=True)
    raise SystemExit(2)
```

---

## Config migration

When the config schema changes between versions, provide an automatic
migration path.

```typescript
interface Migration {
  from: string;  // semver range
  to: string;
  migrate: (config: Record<string, unknown>) => Record<string, unknown>;
}

const migrations: Migration[] = [
  {
    from: '1.x',
    to: '2.0.0',
    migrate: (config) => {
      // Renamed "outDir" to "output" in v2
      if ('outDir' in config) {
        config.output = config.outDir;
        delete config.outDir;
      }
      return config;
    },
  },
];

function migrateConfig(
  config: Record<string, unknown>,
  fromVersion: string
): Record<string, unknown> {
  let current = config;
  for (const m of migrations) {
    if (satisfies(fromVersion, m.from)) {
      console.error(`Migrating config from ${m.from} to ${m.to}...`);
      current = m.migrate(current);
    }
  }
  return current;
}
```

---

## Config file creation / init command

Provide a `init` or `config` subcommand that creates a config file
interactively or with sensible defaults.

```typescript
program
  .command('init')
  .description('Create a configuration file')
  .option('--format <format>', 'config format (json, yaml, toml)', 'json')
  .action(async (options) => {
    const configPath = `.mytoolrc.${options.format}`;

    if (existsSync(configPath)) {
      console.error(`Error: ${configPath} already exists.`);
      process.exit(1);
    }

    const defaults = {
      output: 'dist',
      verbose: false,
      plugins: [],
    };

    const content = options.format === 'json'
      ? JSON.stringify(defaults, null, 2)
      : options.format === 'yaml'
      ? dumpYaml(defaults)
      : dumpToml(defaults);

    writeFileSync(configPath, content + '\n');
    console.log(`Created ${configPath}`);
  });
```

---

## Platform-specific config paths

| Platform | Config location | Notes |
|----------|----------------|-------|
| Linux | `~/.config/mytool/config.json` | XDG_CONFIG_HOME |
| macOS | `~/Library/Application Support/mytool/config.json` | Or XDG if set |
| Windows | `%APPDATA%\mytool\config.json` | APPDATA env var |

Use a library like `env-paths` (Node.js) or `dirs` (Rust) to resolve
platform-specific paths automatically:

```typescript
import envPaths from 'env-paths';
const paths = envPaths('mytool', { suffix: '' });
// paths.config -> platform-appropriate config dir
// paths.data   -> platform-appropriate data dir
// paths.cache  -> platform-appropriate cache dir
```

```rust
use dirs::config_dir;
let config = config_dir().unwrap().join("mytool").join("config.toml");
```
