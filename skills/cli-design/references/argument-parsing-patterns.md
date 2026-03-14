<!-- Part of the cli-design AbsolutelySkilled skill. Load this file when
     working with advanced argument parsing patterns like variadic args,
     mutually exclusive flags, custom coercion, or multi-language comparisons. -->

# Argument Parsing Patterns

Advanced patterns for argument parsing across Node.js, Python, Go, and Rust.
Load this file only when the task requires patterns beyond basic flags and
positional arguments.

---

## Variadic arguments

Accept a variable number of positional arguments.

**Node.js (Commander.js)**
```typescript
program
  .command('concat')
  .description('Concatenate multiple files')
  .argument('<files...>', 'one or more file paths')
  .action((files: string[]) => {
    // files is an array: ['a.txt', 'b.txt', 'c.txt']
    for (const file of files) {
      process.stdout.write(readFileSync(file));
    }
  });
```

**Python (click)**
```python
@cli.command()
@click.argument("files", nargs=-1, required=True, type=click.Path(exists=True))
def concat(files):
    """Concatenate multiple files."""
    for f in files:
        click.echo(open(f).read(), nl=False)
```

**Go (cobra)**
```go
var concatCmd = &cobra.Command{
    Use:   "concat <file> [file...]",
    Short: "Concatenate multiple files",
    Args:  cobra.MinimumNArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error {
        for _, path := range args {
            data, err := os.ReadFile(path)
            if err != nil { return err }
            cmd.OutOrStdout().Write(data)
        }
        return nil
    },
}
```

**Rust (clap)**
```rust
#[derive(Parser)]
struct Concat {
    /// One or more file paths
    #[arg(required = true, num_args = 1..)]
    files: Vec<PathBuf>,
}
```

---

## Mutually exclusive flags

Prevent the user from passing conflicting options.

**Node.js (Commander.js)** - no built-in support, validate manually:
```typescript
program
  .command('output')
  .option('--json', 'output as JSON')
  .option('--csv', 'output as CSV')
  .option('--table', 'output as table')
  .action((options) => {
    const formats = [options.json, options.csv, options.table].filter(Boolean);
    if (formats.length > 1) {
      console.error('Error: --json, --csv, and --table are mutually exclusive.');
      process.exit(2);
    }
    const format = options.json ? 'json' : options.csv ? 'csv' : 'table';
    render(format);
  });
```

**Python (click)** - use `cls=MutuallyExclusiveOption` or manual check:
```python
@cli.command()
@click.option("--json", "fmt", flag_value="json", help="Output as JSON.")
@click.option("--csv", "fmt", flag_value="csv", help="Output as CSV.")
@click.option("--table", "fmt", flag_value="table", default=True, help="Output as table.")
def output(fmt):
    """Render output in the chosen format."""
    render(fmt)
```

**Go (cobra)** - use `MarkFlagsMutuallyExclusive`:
```go
outputCmd.Flags().Bool("json", false, "output as JSON")
outputCmd.Flags().Bool("csv", false, "output as CSV")
outputCmd.MarkFlagsMutuallyExclusive("json", "csv")
```

**Rust (clap)** - use `conflicts_with`:
```rust
#[derive(Parser)]
struct Output {
    #[arg(long, conflicts_with = "csv")]
    json: bool,
    #[arg(long, conflicts_with = "json")]
    csv: bool,
}
```

---

## Custom type coercion

Parse flag values into specific types with validation.

**Node.js (Commander.js)** - custom parsing function:
```typescript
function parsePort(value: string): number {
  const port = parseInt(value, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new InvalidArgumentError('Port must be between 1 and 65535.');
  }
  return port;
}

program
  .option('-p, --port <number>', 'server port', parsePort, 3000);
```

**Python (click)** - use `click.IntRange` or custom `ParamType`:
```python
@click.option("--port", type=click.IntRange(1, 65535), default=3000, help="Server port.")
def serve(port):
    start_server(port)
```

**Go (cobra + pflag)** - implement `pflag.Value` interface:
```go
type portValue uint16

func (p *portValue) String() string { return fmt.Sprintf("%d", *p) }
func (p *portValue) Set(s string) error {
    v, err := strconv.ParseUint(s, 10, 16)
    if err != nil || v < 1 || v > 65535 {
        return fmt.Errorf("port must be between 1 and 65535")
    }
    *p = portValue(v)
    return nil
}
func (p *portValue) Type() string { return "port" }
```

**Rust (clap)** - use `value_parser`:
```rust
#[arg(short, long, default_value_t = 3000, value_parser = clap::value_parser!(u16).range(1..=65535))]
port: u16,
```

---

## Required flags vs required positional args

**Rule of thumb**: if there is one primary input, make it positional. If there
are multiple required inputs with no natural order, make them required options.

```
# Good: single primary input as positional
mytool compile <file>

# Good: multiple required inputs as named options
mytool deploy --env staging --tag v1.2.3

# Bad: multiple positionals with no obvious order
mytool deploy staging v1.2.3    # which is env, which is tag?
```

---

## Flag groups and conditional requirements

**Go (cobra)** - require flags together:
```go
cmd.MarkFlagsRequiredTogether("username", "password")
cmd.MarkFlagRequired("config")
```

**Rust (clap)** - require conditionally:
```rust
#[arg(long, requires = "password")]
username: Option<String>,
#[arg(long, requires = "username")]
password: Option<String>,
```

**Node.js / Python** - validate manually in the action handler. Check for
incomplete flag groups and print a clear error:
```typescript
if (options.username && !options.password) {
  console.error('Error: --username requires --password.');
  process.exit(2);
}
```

---

## Negatable flags

Allow users to explicitly disable a default-on behavior.

**Node.js (Commander.js)**:
```typescript
program
  .option('--color', 'enable colored output (default)')
  .option('--no-color', 'disable colored output');
// options.color is true by default, false if --no-color is passed
```

**Python (click)**:
```python
@click.option("--color/--no-color", default=True, help="Toggle colored output.")
```

**Rust (clap)**:
```rust
#[arg(long, default_value_t = true, action = clap::ArgAction::Set)]
color: bool,
```

---

## Environment variable fallback

Let environment variables serve as defaults for flags the user does not pass.

**Node.js (Commander.js)** - use `envVar` or manual fallback:
```typescript
program
  .option('--api-key <key>', 'API key')
  .action((options) => {
    const apiKey = options.apiKey ?? process.env.MYTOOL_API_KEY;
    if (!apiKey) {
      console.error('Error: --api-key or MYTOOL_API_KEY is required.');
      process.exit(2);
    }
  });
```

**Python (click)** - use `envvar` parameter:
```python
@click.option("--api-key", envvar="MYTOOL_API_KEY", required=True, help="API key.")
```

**Go (cobra + viper)** - bind flags to env vars via viper:
```go
viper.SetEnvPrefix("MYTOOL")
viper.AutomaticEnv()
viper.BindPFlag("api-key", cmd.Flags().Lookup("api-key"))
```

**Rust (clap)** - use `env`:
```rust
#[arg(long, env = "MYTOOL_API_KEY")]
api_key: String,
```

---

## Library comparison matrix

| Feature | Commander.js | click | cobra | clap |
|---------|-------------|-------|-------|------|
| Language | Node.js | Python | Go | Rust |
| Subcommands | Yes | Yes | Yes | Yes |
| Auto help | Yes | Yes | Yes | Yes |
| Shell completions | Plugin | Built-in | Built-in | clap_complete |
| Mutually exclusive | Manual | Via flag_value | Built-in | Built-in |
| Env var fallback | Manual | Built-in | Via viper | Built-in |
| Type coercion | Custom fn | ParamType/Range | pflag.Value | value_parser |
| Negatable flags | --no-X | --flag/--no-flag | Manual | ArgAction |
| Variadic args | `<args...>` | `nargs=-1` | `Args` validators | `num_args` |
