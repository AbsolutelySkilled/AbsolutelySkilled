# SKL - The AbsolutelySkilled Package Manager

## Context

The AI skills ecosystem is exploding (69,000+ community skills) but lacks a trustworthy, comprehensive package manager. The ClawHavoc incident (341 malicious skills, 12% of a marketplace) exposed critical security gaps. Vercel Skills (market leader, 230+ open issues) has pain points around registry staleness, security, versioning, and cross-platform compatibility. SKL will be the official AbsolutelySkilled package manager - a 10x improvement over Vercel Skills with security-first design, content-hash integrity, automated audit pipeline, and rich TUI powered by React Ink.

---

## Architecture

### Project Structure

```
AbsolutelySkilled/
  skl/                          # NEW - the skl tool
    packages/
      cli/                      # "skl" npm package + Bun-compiled binary
        src/
          cli.tsx               # Command router + React Ink app
          commands/             # 20 command modules (thin orchestrators)
            install.tsx
            uninstall.tsx
            search.tsx
            list.tsx
            upgrade.tsx
            lock.ts
            publish.ts
            info.tsx
            browse.tsx          # Full TUI browser (React Ink)
            top.tsx
            categories.tsx
            audit.tsx
            verify.ts
            trust.ts
            permissions.tsx
            registry.ts
            init.ts
            doctor.tsx
            config.ts
            export.ts
            import.tsx
          ui/                   # Reusable React Ink components
            Banner.tsx          # SKL logo + ANSI colors
            SkillCard.tsx       # Skill display with audit badge
            AuditReport.tsx     # Detailed audit visualization
            Picker.tsx          # Multi-select category picker
            ProgressBar.tsx     # Install/upgrade progress
            Table.tsx           # Formatted table output
          app.tsx               # Root React Ink app
        bin/cli.mjs             # Entry point shim
        package.json
        tests/
      sdk/                      # "@skl/sdk" npm package
        src/
          index.ts              # Public API surface
          client.ts             # Registry HTTP client
          types.ts              # Exported TypeScript types
        package.json
        tests/
      shared/                   # Internal shared utilities (not published)
        src/
          resolver.ts           # Parse skill specifiers (owner/repo, URLs, local, @skill)
          fetcher.ts            # Clone/download from GitHub/GitLab/local
          installer.ts          # Write files + create symlinks to agent dirs
          hasher.ts             # SHA-256 content hashing (cross-platform deterministic)
          lockfile.ts           # Global + local lock file management
          adapters.ts           # Agent format transform pipeline
          agents.ts             # 45+ agent definitions with paths + detection
          registry-client.ts    # Central API client (search, info, publish, telemetry)
          telemetry.ts          # Anonymous event tracking with opt-out
          auth.ts               # GitHub token chain (GITHUB_TOKEN -> GH_TOKEN -> gh CLI)
          skills-yaml.ts        # Parse per-repo skills.yaml manifests
          migration.ts          # Vercel Skills lock file import
          types.ts              # Shared TypeScript interfaces
        tests/
    api/                        # Central registry API (absolutelyskilled.pro/api)
      src/
        server.ts               # HTTP server
        crawler.ts              # GitHub topic crawler (runs every 6h)
        auditor.ts              # Automated audit pipeline runner
        db.ts                   # Database layer
        routes/
          search.ts             # GET /api/search
          skills.ts             # GET /api/skills/:name
          publish.ts            # POST /api/publish
          categories.ts         # GET /api/categories
          top.ts                # GET /api/top
          verify.ts             # GET /api/verify/:name
          telemetry.ts          # POST /api/telemetry
      package.json
    scripts/
      install.sh                # curl | bash install script
      build-binaries.ts         # Bun compile for all platforms
    package.json                # Workspace root (npm workspaces)
    tsconfig.json
  skills/                       # Existing 170+ skills
  website/                      # Existing Astro website
  skills.yaml                   # Existing registry index
```

### Module Dependency Graph

```
CLI Commands (thin orchestrators, 50-100 lines each)
  |
  v
Shared Core Modules (single-responsibility, <200 lines each)
  resolver -> fetcher -> installer
  hasher -> lockfile
  adapters (uses agents definitions)
  registry-client -> auth
  telemetry
  migration (uses lockfile)
  |
  v
SDK (wraps shared modules for external consumption)
  |
  v
API (serves registry data to CLI + SDK)
  crawler -> auditor -> db
```

---

## Data Models

### Skill Metadata (parsed from SKILL.md frontmatter)

```typescript
interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  platforms: AgentPlatform[];
  recommended_skills: string[];
  license: string;
  maintainers: { github: string }[];
}

type SkillCategory =
  | 'engineering' | 'operations' | 'marketing' | 'ai-ml'
  | 'design' | 'product' | 'devtools' | 'sales' | 'data'
  | 'infra' | 'monitoring' | 'cloud' | 'writing' | 'workflow'
  | 'analytics' | 'game-development' | 'developer-tools'
  | 'communication' | 'video';
```

### Global Lock File (~/.agents/.skl-lock.json)

```typescript
interface SKLGlobalLock {
  version: 4;  // Starts at 4 to continue from Vercel Skills v3, signaling a new tool with compatible lineage
  skills: Record<string, SKLLockEntry>;
  trustedSources: string[];      // allowlisted via `skl trust`
  config: {
    telemetry: boolean;
    defaultAgents: string[];
  };
  migrated?: {                    // set after Vercel Skills import
    from: 'vercel-skills';
    at: string;
    count: number;
  };
}

interface SKLLockEntry {
  source: string;                 // "owner/repo"
  sourceUrl: string;              // "https://github.com/owner/repo"
  skillPath: string;              // "skills/super-brainstorm"
  contentHash: string;            // SHA-256 of all skill files
  declaredVersion: string;        // from SKILL.md frontmatter
  auditScore: number | null;      // from registry (null if unaudited)
  installedAt: string;            // ISO-8601
  updatedAt: string;              // ISO-8601
  agents: string[];               // which agents this is installed for
  hashAtInstall: string;          // registry hash at time of install
}
```

### Local Lock File (./skl-lock.json)

```typescript
interface SKLLocalLock {
  version: 1;
  skills: Record<string, {
    source: string;
    contentHash: string;
    declaredVersion: string;
  }>;
}
// Minimal for clean git diffs. Alphabetically sorted.
```

### Registry Index Entry

```typescript
interface RegistryEntry {
  name: string;
  version: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  source: string;
  sourceUrl: string;
  skillPath: string;
  contentHash: string;
  audit: AuditReport;
  telemetry: {
    totalInstalls: number;
    weeklyInstalls: number;
    monthlyInstalls: number;
  };
  hashDrift: boolean;             // content changed without version bump
  lastCrawled: string;
  firstIndexed: string;
}

interface AuditReport {
  score: number;                  // 0.0 - 10.0
  categories: {
    promptInjection: CategoryScore;
    dangerousOps: CategoryScore;
    dataExfiltration: CategoryScore;
    supplyChain: CategoryScore;
    structuralQuality: CategoryScore;
    behavioralSafety: CategoryScore;
  };
  findings: AuditFinding[];
  lastAudited: string;
}

interface CategoryScore {
  score: number;                  // 0.0 - 10.0
  severity: 'clean' | 'info' | 'low' | 'medium' | 'high' | 'critical';
  findingCount: number;
}

interface AuditFinding {
  id: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  location?: string;              // file:line reference
  recommendation: string;
}
```

### Per-repo skills.yaml Manifest

```yaml
# skills.yaml (in repo root)
registry:
  name: my-org-skills
  description: Our engineering team skills
  homepage: https://myorg.com/skills

skills:
  - name: our-api-standards
    path: skills/api-standards
  - name: our-testing-patterns
    path: skills/testing-patterns
```

### Telemetry Event

```typescript
interface TelemetryEvent {
  event: 'install' | 'uninstall' | 'search' | 'upgrade' | 'browse' | 'audit' | 'verify';
  skill?: string;
  source?: string;
  agent?: string;
  sklVersion: string;
  timestamp: string;
  ci: boolean;
  os: 'darwin' | 'linux' | 'win32';
}
// No PII. No IP logging. Opt-out via SKL_TELEMETRY=0 or DO_NOT_TRACK=1.
```

---

## CLI Commands (Full v1 Set)

### Tier 1 - Core

| Command | Description | Key flags |
|---------|-------------|-----------|
| `skl install <pkg>` | Install skills from GitHub, URL, or local path | `-g` global, `-y` skip prompts, `--agent <name>`, `--trust` |
| `skl uninstall <name>` | Remove installed skills | `--all`, `--agent <name>` |
| `skl search [query]` | Search the registry | `--category`, `--min-score`, `--limit` |
| `skl list` | List installed skills | `--agent`, `--json` |
| `skl upgrade [name]` | Upgrade skills to latest | `--all`, `--dry-run` |
| `skl lock` | Generate/update skl-lock.json | `--verify` |

### Tier 2 - Registry & Discovery

| Command | Description | Key flags |
|---------|-------------|-----------|
| `skl publish` | Register repo with central index | `--token` |
| `skl info <name>` | Detailed skill info + audit report | `--json` |
| `skl browse` | Interactive TUI browser (React Ink) | `--category` |
| `skl top [category]` | Top skills by installs | `--limit`, `--weekly` |
| `skl categories` | List all categories with counts | `--json` |

### Tier 3 - Security & Trust

| Command | Description | Key flags |
|---------|-------------|-----------|
| `skl audit <pkg>` | Run local audit on a skill | `--json`, `--verbose` |
| `skl verify [name]` | Verify installed hash vs registry | `--all` |
| `skl trust <source>` | Allowlist a source | `--remove` |
| `skl permissions <name>` | Show skill's access patterns | `--json` |

### Tier 4 - Advanced

| Command | Description | Key flags |
|---------|-------------|-----------|
| `skl registry add/rm/list` | Manage multiple registries | |
| `skl init [name]` | Scaffold a new skill | `--template` |
| `skl doctor` | Diagnose environment issues | |
| `skl config` | Manage skl settings | `--get`, `--set`, `--list` |
| `skl export` | Export installed skills list | `--format json\|yaml` |
| `skl import` | Import from export/lockfile/Vercel Skills | `--from vercel-skills` |

---

## Central API Design

**Base URL**: `https://absolutelyskilled.pro/api`

### Authentication Model

- **Read endpoints** (search, info, categories, top, verify): Public, no auth required
- **Write endpoints** (publish, telemetry): Require GitHub token validation
- **Publish authorization**: The token must have read access to the repo being published. The API validates by calling GitHub API with the provided token. Any user with repo access can register it.
- **No user accounts**: Auth is GitHub-native. The registry doesn't maintain its own user system.

### Database

SQLite via Turso (hosted libSQL) for simplicity and cost. Single database with tables:
- `skills` - registry entries with metadata, hashes, audit scores
- `audit_reports` - full audit findings per skill per crawl
- `telemetry_events` - raw events (aggregated into skill counts daily)
- `crawl_state` - last crawl timestamp per repo for incremental updates
- `known_repos` - repos registered via `skl publish` (crawled in addition to topic search)

### Endpoints

```
GET  /api/search?q=<query>&category=<cat>&minScore=<n>&limit=<n>&offset=<n>
  -> { results: RegistryEntry[], total: number }
  Auth: none

GET  /api/skills/:name
  -> RegistryEntry (full detail with audit)
  Auth: none

GET  /api/skills/:name/audit
  -> AuditReport (full findings)
  Auth: none

POST /api/publish
  Headers: Authorization: Bearer <github-token>
  Body: { repoUrl: string }
  -> Validates token has repo read access via GitHub API
  -> Adds repo to known_repos table (crawled on next cycle + immediate crawl)
  -> { status: 'queued', skillsFound: number }

GET  /api/categories
  -> { categories: { name: string, count: number, topSkills: string[] }[] }
  Auth: none

GET  /api/top?category=<cat>&limit=<n>&period=<weekly|monthly|all>
  -> { skills: RegistryEntry[] }
  Auth: none

GET  /api/verify/:name
  -> { contentHash: string, declaredVersion: string, auditScore: number }
  Auth: none

POST /api/telemetry
  Body: TelemetryEvent
  -> { ok: true }
  Auth: none (anonymous by design)
```

---

## Crawler Design

Runs every 6 hours as a cron job.

### Flow

```
1. Build repo list from TWO sources:
   a. GitHub Search API: topic:skl-skills (paginated)
   b. known_repos table (repos registered via `skl publish`)
2. Deduplicate by repo URL
3. For each discovered repo:
   a. Check if repo is new or changed since last crawl
   b. Fetch skills.yaml from repo root (or scan for SKILL.md files)
   c. For each skill in the repo:
      - Compute content hash (SHA-256 of all files in skill folder)
      - If hash unchanged -> skip
      - If hash changed:
        i.  Parse SKILL.md frontmatter for metadata
        ii. Check if declaredVersion changed
        iii. Run audit pipeline (Stage 1: mechanical + Stage 2: AI)
        iv. Update registry entry with new hash, audit score, metadata
        v.  If content changed but version unchanged -> set hashDrift: true
3. Mark repos not seen in 30 days as inactive
4. Aggregate telemetry data for install counts
```

### Rate Limit Strategy

- Use authenticated GitHub API (5,000 req/hr)
- Conditional requests (If-None-Match) to skip unchanged repos
- Batch tree SHA requests to minimize API calls
- Exponential backoff on rate limit hits

---

## Security Pipeline (Automated)

Runs automatically when crawler detects content changes. No manual steps.

### Stage 1: Mechanical Pre-scan (deterministic)

Uses skill-audit's audit.py script:
- Unicode anomalies (zero-width chars, RTL overrides, homoglyphs)
- Base64/hex encoded blocks (>40 chars)
- File structure validation (SKILL.md exists, frontmatter fields, file sizes)
- Supply chain checks (name consistency, orphaned references)

### Stage 2: AI Semantic Analysis

6-category deep analysis (from skill-audit):
1. **Prompt injection & manipulation** - override attempts, persona hijacking, jailbreaks
2. **Dangerous operations & permissions** - destructive commands, privilege escalation
3. **Data exfiltration & network abuse** - outbound data, webhook abuse, covert channels
4. **Supply chain & trust** - missing provenance, phantom dependencies, typosquatting
5. **Structural quality** - missing evals, metadata gaps, oversized files
6. **Behavioral safety** - unbounded loops, unrestricted tool access, consent bypass

### Install-time Behavior

| Condition | Behavior |
|-----------|----------|
| Indexed, score >= 7.0 | Green checkmark, install proceeds |
| Indexed, score 4.0-6.9 | Yellow warning, require confirmation |
| Indexed, score < 4.0 | Red block, require `--trust` flag |
| Indexed, critical findings | Block, require `--trust` flag |
| Unindexed skill | "UNAUDITED" warning, suggest `skl audit` locally |
| Trusted source (via `skl trust`) | Skip warnings, install proceeds |

---

## Content Hashing (Cross-platform Deterministic)

```typescript
// hasher.ts - SHA-256 of skill folder contents
function computeContentHash(skillDir: string): string {
  // 1. List all files recursively (sorted alphabetically)
  // 2. For each file: normalize path to forward slashes
  // 3. For each file: read content, normalize line endings to LF
  // 4. Concatenate: "path\0content\0" for each file
  // 5. SHA-256 the concatenated buffer
  // This ensures identical hashes on Windows, macOS, and Linux
}
```

Fixes the cross-platform hash mismatch bug that Vercel Skills has (Windows/Linux line-ending differences).

---

## Agent Format Adapters

SKILL.md is the canonical format. Transform on install:

```typescript
// adapters.ts
type AdapterFn = (skillMd: string, meta: SkillMetadata) => string;

const adapters: Record<string, AdapterFn> = {
  'skill-md': (md) => md,                    // Claude Code, Codex - as-is
  'mdc': (md) => stripFrontmatter(md),       // Cursor - strip YAML frontmatter
  'generic-md': (md) => extractBody(md),     // Generic agents - body only
};

// Agent -> adapter mapping (in agents.ts)
const agentAdapterMap: Record<string, string> = {
  'claude-code': 'skill-md',
  'codex': 'skill-md',
  'cursor': 'mdc',
  'windsurf': 'generic-md',
  // ... 45+ agents
};
```

---

## SDK (@skl/sdk)

```typescript
import { SKL } from '@skl/sdk';

const skl = new SKL({
  registry: 'https://absolutelyskilled.pro/api',  // default
  token: process.env.GITHUB_TOKEN,                  // optional for private repos
});

// Search
const results = await skl.search('backend', {
  category: 'engineering',
  minAuditScore: 7.0,
  limit: 20,
});

// Skill info
const info = await skl.info('api-design');

// Read skill content
const content = await skl.read('api-design');

// Format for a specific agent
const formatted = await skl.format('api-design', 'cursor');

// Install programmatically
await skl.install('super-brainstorm', { agents: ['claude-code'] });

// List installed
const installed = await skl.list();

// Verify integrity
const verified = await skl.verify('super-brainstorm');

// Audit locally
const audit = await skl.audit('./path/to/skill');

// Categories
const cats = await skl.categories();

// Top skills
const top = await skl.top('engineering', { limit: 10 });
```

---

## Migration (Vercel Skills Import)

```
On first `skl list` or `skl install`:
  1. Check for ~/.agents/.skill-lock.json (Vercel Skills format)
  2. If found:
     a. Parse lock file (v3 schema - older versions are wiped by Vercel Skills itself)
     b. Display: "Found N skills from Vercel Skills. Import? [Y/n]"
     c. For each skill:
        - Map: source, sourceUrl, skillPath, installedAt, updatedAt
        - Drop: sourceType (always "github"), pluginName (not used in skl), dismissed (UI state)
        - Convert skillFolderHash (GitHub tree SHA) -> recompute as SHA-256 content hash
        - Look up audit score from registry (null if not indexed)
        - Write to skl lock format
     d. Set migrated.from = 'vercel-skills'
  3. Also check for ./skills-lock.json (project-level Vercel Skills lock)
  4. Existing symlinks are preserved (compatible ~/.agents/skills/ paths)
```

---

## Distribution

### 1. npm package

```bash
npm install -g skl
# or
npx skl install super-brainstorm
```

### 2. curl | bash (standalone binary via Bun compile)

```bash
curl -fsSL https://skl.sh/install | bash
```

**install.sh script**:
```bash
# Detect OS + arch
# Download pre-compiled binary from GitHub releases
# Place in ~/.local/bin/skl (or /usr/local/bin with sudo)
# Verify checksum
# Print success message
```

**Build matrix** (via Bun compile):
- darwin-arm64 (macOS Apple Silicon)
- darwin-x64 (macOS Intel)
- linux-x64
- linux-arm64
- win-x64 (.exe)

### 3. GitHub Releases

Each release publishes:
- npm package (`skl`)
- npm package (`@skl/sdk`)
- Platform binaries (5 targets)
- SHA-256 checksums

---

## React Ink TUI Components

Key interactive components:

### Banner (shown on first run / help)
```
███████╗██╗  ██╗██╗
██╔════╝██║ ██╔╝██║
███████╗█████╔╝ ██║
╚════██║██╔═██╗ ██║
███████║██║  ██╗███████╗
╚══════╝╚═╝  ╚═╝╚══════╝
The AbsolutelySkilled Package Manager
```

### Browse (interactive TUI browser)
- Category sidebar + skill list + detail pane
- Keyboard navigation (j/k/enter/q)
- Search filter at top
- Audit score badges (green/yellow/red)
- Install directly from browser

### Category Picker (for `skl install --category`)
- Multi-select with space, confirm with enter
- Sorted by audit score + installs
- Shows skill count per category

### Audit Report (for `skl info` / `skl audit`)
- 6-category breakdown with scores
- Color-coded severity badges
- Finding details with recommendations

---

## Telemetry

### Collection
- Anonymous events on install, uninstall, search, upgrade, browse, audit, verify
- Payload: event type, skill name, source, agent, skl version, timestamp, CI flag, OS
- No PII, no IP logging server-side

### Opt-out
- `SKL_TELEMETRY=0` env var
- `DO_NOT_TRACK=1` env var (standard)
- `skl config set telemetry false`

### First-run Notice
```
skl collects anonymous usage data (skill names, commands).
No personal data is collected. Opt out: SKL_TELEMETRY=0
Learn more: absolutelyskilled.pro/telemetry
```

---

## Implementation Phases

### Phase 1: Foundation
- Project scaffolding (monorepo, workspaces, TypeScript config)
- shared/ core modules: resolver, fetcher, hasher, auth, types
- Lock file management (global + local)
- Agent definitions (port from Vercel Skills + extend)

### Phase 2: Core Commands
- install, uninstall, list, upgrade, lock
- React Ink app shell + Banner component
- Format adapters (skill-md, mdc, generic-md)

### Phase 3: Registry Client + Discovery
- registry-client module
- search, info, browse, top, categories commands
- React Ink TUI components (Browse, Picker, SkillCard)
- Telemetry module

### Phase 4: Security Commands
- audit, verify, trust, permissions commands
- Integration with skill-audit's audit.py
- AuditReport component

### Phase 5: Central API
- API server with routes
- Database setup
- Crawler implementation
- Automated audit pipeline

### Phase 6: Advanced Commands
- registry add/rm/list, init, doctor, config, export, import
- Vercel Skills migration
- Multi-registry support

### Phase 7: SDK
- @skl/sdk package
- Public API matching CLI capabilities
- TypeScript types export

### Phase 8: Distribution & Polish
- Bun compile build pipeline
- install.sh script
- GitHub Actions CI/CD
- Platform binary releases
- Documentation

---

## Verification Plan

1. **Unit tests**: Each shared module has test coverage (hasher, resolver, lockfile, adapters)
2. **Integration tests**: Full install/uninstall/upgrade cycles against test repos
3. **Cross-platform tests**: Hash determinism on macOS/Linux/Windows via CI matrix
4. **API tests**: Registry endpoint testing
5. **E2E tests**: curl install -> skl install -> verify -> upgrade flow
6. **Migration tests**: Vercel Skills lock file import with various schemas
7. **Security tests**: Audit pipeline catches known-bad skill patterns
8. **Binary tests**: Bun-compiled binary works on all platforms

---

## Key Files to Reference During Implementation

| File | Purpose |
|------|---------|
| `vercel-skills/src/cli.ts` | Command routing pattern (improve: split into modules) |
| `vercel-skills/src/add.ts` | Install flow (improve: decompose 1400 lines) |
| `vercel-skills/src/installer.ts` | Symlink pattern (reuse, improve cross-platform) |
| `vercel-skills/src/agents.ts` | Agent definitions (port + extend with adapter mapping) |
| `vercel-skills/src/skill-lock.ts` | Lock design (evolve to content-hash + dual-lock) |
| `vercel-skills/src/source-parser.ts` | Specifier parsing (reuse patterns) |
| `vercel-skills/src/find.ts` | Interactive search (replace with React Ink) |
| `vercel-skills/src/telemetry.ts` | Telemetry pattern (similar approach) |
| `skills/skill-audit/scripts/audit.py` | Audit pipeline to integrate |
| `skills/skill-audit/SKILL.md` | 6-category audit system design |
