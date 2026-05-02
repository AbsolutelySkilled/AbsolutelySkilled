<p align="center">
  <img src="https://avatars.githubusercontent.com/u/268155241?s=200&v=4" width="120" alt="AbsolutelySkilled logo" />
</p>

<h1 align="center">AbsolutelySkilled</h1>

<p align="center">
  A registry of production-ready skills for AI coding agents.
  <br />
  <a href="https://www.absolutelyskilled.pro/">www.absolutelyskilled.pro</a>
  <br /><br />
  <a href="https://skills.sh/registry/absolutelyskilled/absolutelyskilled">
    <img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AbsolutelySkilled/AbsolutelySkilled/main/data/installs.json&query=%24._total&label=total%20installs&color=brightgreen" alt="Total Installs" />
  </a>
</p>

---

## What is this?

AbsolutelySkilled is a collection of skills that teach AI agents domain-specific knowledge - from framework APIs to marketing strategy. Each skill is a self-contained folder with structured markdown that agents load on demand.

Skills work with any agent that supports the SKILL.md format: Claude Code, Gemini CLI, OpenAI Codex, Cursor, and [40+ more agents](#supported-agents).

---

## Flagship Skills

These skills form the backbone of AbsolutelySkilled - install them first and watch your AI agent transform from a code assistant into an autonomous development partner.

### Absolute Brainstorm - Relentless Design Interview

A structured design interrogation that reads your entire codebase before asking a single question - every assumption challenged, every dependency resolved, one decision at a time.

**Install:**

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill absolute-brainstorm
```

**Usage:**

```bash
/absolute-brainstorm "Add real-time notifications to our app"
/absolute-brainstorm "Redesign the authentication flow to support SSO"
/absolute-brainstorm "Build a platform with chat, billing, analytics, and admin dashboard"
```

**How it works:**

1. **Reads everything** - docs/, README, CLAUDE.md, recent commits, project structure
2. **Explores the codebase** - searches code before every question so it only asks what can't be inferred
3. **Enters plan mode** - all reasoning happens in plan mode with ultrathink-level depth
4. **One question at a time** - strictly linear, dependency-resolved. Decision B is never asked until Decision A is locked
5. **Marks (Recommended)** on every option set - with clear rationale, no wishy-washy "it depends"
6. **No fake options** - only proposes multiple approaches at genuine design forks. If the answer is obvious, says so
7. **Decomposes large projects** - flags multi-system requests and breaks them into sub-projects automatically
8. **Writes a spec** to `docs/plans/YYYY-MM-DD-<topic>-design.md`
9. **Self-reviews via subagent** - catches gaps and contradictions before you see it
10. **You choose what's next** - writing-plans, absolute-human, direct implementation, or something else

### Absolute-Human - AI-Native Development Lifecycle

A complete SDLC replacement for AI agents - decomposes features into dependency-graphed tasks, executes them in parallel waves with TDD verification, and tracks everything on a persistent board.

**Install:**

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill absolute-human
```

**Usage:**

```bash
/absolute-human "Add OAuth2 login with Google and GitHub providers"
/absolute-human "Migrate the REST API to GraphQL"
/absolute-human "Build a real-time chat feature with WebSocket support"
```

**How it works:**

1. **Interview** - extracts requirements, constraints, and success criteria
2. **Decompose** - breaks work into a dependency-graphed DAG of atomic sub-tasks
3. **Discover** - explores your codebase and docs in parallel per task
4. **Plan** - creates test-first implementation strategies per task
5. **Execute** - runs independent tasks simultaneously via sub-agents in parallel waves
6. **Verify** - validates every task with TDD, lint, typecheck, and build checks
7. **Converge** - self code review, requirements validation, and full project verification

Everything is tracked on a persistent `.absolute-human/board.md` that survives across sessions - resume where you left off, audit decisions, or hand off to another developer.

```
INTAKE --> DECOMPOSE --> DISCOVER --> PLAN --> EXECUTE --> VERIFY --> CONVERGE
```

### Second Brain - Persistent Memory for AI Agents

A structured, hierarchical knowledge store in `~/.memory/` that gives your AI agent persistent memory across projects, sessions, and tools - automatically loading only what's relevant to the current context.

**Install:**

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill second-brain
```

**Usage:**

```bash
# Memories are loaded automatically at conversation start
# After complex tasks, your agent proposes what to remember

"Remember that we always use Bun instead of npm"
"What do you know about our auth system?"
"Update my memory about the deployment process"
```

**How it works:**

- **Tag-indexed retrieval** - memories are scored against your current context and only the top matches are loaded (no wasted tokens)
- **100-line ceiling** - files stay small and split automatically, keeping context window usage efficient
- **Wiki-linked graph** - memories cross-reference each other with `[[wiki-links]]` for rich knowledge traversal
- **Auto-propose learnings** - after complex tasks, your agent suggests what to remember for next time
- **CRUSP lifecycle** - Create, Read, Update, Split, Prune - your memory stays fresh and organized

### Skill Audit - Security Analysis for AI Agent Skills

A deep, context-aware security scanner for AI agent skills - combines a Python mechanical pre-scan with AI-powered semantic analysis across 6 threat categories to catch prompt injection, data exfiltration, supply chain attacks, and behavioral risks that regex tools miss.

**Install:**

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill skill-audit
```

**Usage:**

```bash
/skill-audit skills/suspicious-tool
/skill-audit skills/suspicious-tool --json
/skill-audit skills/                          # Batch scan entire registry
```

**How it works:**

1. **Mechanical pre-scan** - `scripts/audit.py` handles deterministic checks: unicode smuggling, base64 payloads, frontmatter validation, file size limits, phantom dependencies, orphaned references
2. **Prompt injection analysis** - reads every instruction as an attacker would: direct overrides, persona hijacking, instruction laundering, conditional triggers, multi-step manipulation
3. **Permission and exfiltration audit** - flags destructive commands, credential access, webhook data theft, DNS exfiltration, covert channels
4. **Supply chain verification** - maintainer provenance, dependency confusion, typosquatting, suspicious URLs, scope creep detection
5. **Behavioral safety** (AI-only) - unbounded agent loops, user consent bypass, hallucination amplification, context pollution, trust transitivity
6. **Structured verdicts** - PASS / FAIL / REVIEW REQUIRED with severity-ranked findings table and per-finding recommendations

Output as a human-readable table report (default) or JSON for CI/tooling integration.

### Video Creator - End-to-End Programmatic Video Production

A 7-step orchestrator that takes you from "make me a video about X" to a finished 4K video - using Remotion, ElevenLabs TTS, royalty-free music, and SFX. No video editing knowledge required.

**Install:**

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill video-creator
```

**Usage:**

```bash
/video-creator "Create a 60-second product demo for my SaaS dashboard"
/video-creator "Make an explainer video about how our API works"
/video-creator "Build a social clip announcing our new feature"
```

**How it works:**

1. **Deep interview** - up to 30 questions about your product, audience, tone, assets, and visual preferences
2. **Generate script** - structured YAML with scenes, timing, narration text, and audio cues
3. **Visual verification** - build minimal Remotion compositions, preview in browser, iterate on design
4. **Build full project** - complete Remotion compositions with all animations matching the approved script
5. **Add background audio + SFX** - source royalty-free music, place sound effects at trigger points
6. **Add narration** - ElevenLabs TTS with voice selection (deferred to save costs until visuals are approved)
7. **4K render** - final preview, user approval, render at 3840x2160

Companion skills: [remotion-video](skills/remotion-video/), [video-scriptwriting](skills/video-scriptwriting/), [video-audio-design](skills/video-audio-design/), [video-analyzer](skills/video-analyzer/)

### Supaguard - Synthetic Monitoring from Your Codebase

A production monitoring skill that reads your source code, generates Playwright monitoring scripts, and deploys them as recurring checks via the supaguard CLI - all without committing any test scripts to your repository.

**Install:**

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill supaguard
```

**Usage:**

```bash
# Point at your app and the agent does the rest
"Set up monitoring for my Next.js app"
"Monitor the login flow on production"
"Create an uptime check for our checkout page"
```

**How it works:**

1. **Reads your source code** - scans components, routes, data-testids, API endpoints, and forms
2. **Identifies critical flows** - login, checkout, page load, dashboard access
3. **Generates Playwright scripts** - written to `/tmp/`, never committed to your repo
4. **Tests in the cloud** - runs the script via `supaguard checks test` before deploying
5. **Interactive deployment** - walks you through naming, scheduling, regions, and alerting one step at a time
6. **Multi-region monitoring** - US East, EU North, India Central with configurable cron schedules

Companion skills: [playwright-testing](skills/playwright-testing/), [cli-design](skills/cli-design/)

### Codedocs - AI-Agent-Friendly Codebase Documentation

Generates a structured `docs/` tree from your codebase that AI agents can navigate instantly - module docs, pattern docs, an overview map, and a file-to-doc index with 70%+ coverage enforcement.

**Install:**

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill codedocs
```

**Usage:**

```bash
codedocs:generate                              # Generate docs for your entire repo
codedocs:generate --output documentation/      # Custom output directory
codedocs:generate packages/api                 # Specific subdirectory (monorepos)
codedocs:generate --exhaustive                 # Force exhaustive coverage
codedocs:ask "how does the auth flow work?"    # Answer from docs, not source
codedocs:status                                # Check coverage and find gaps
codedocs:update --scope src/auth/              # Update after a refactor
codedocs:update --diff HEAD~5..HEAD            # Update from recent commits
```

**How it works:**

- **OVERVIEW.md** - architecture, tech stack, entry points, and a module map that routes any question to the right doc
- **Module docs** - one per bounded context, covering public API, internal structure, dependencies, and implementation notes. Large modules (15+ files) are automatically split into sub-module docs
- **Pattern docs** - cross-cutting concerns like error handling, logging, auth, and testing strategy documented once instead of scattered across every module
- **INDEX.md** - a file-to-module lookup table so any agent can instantly answer "which doc covers this file?"
- **Coverage-first** - runs a recursive census of your repo, verifies 70%+ file coverage (scaled by repo size), and flags gaps before writing. A huge repo generates 30-80 doc files, not 8-12

---

## Install Skills

Skills are installed using the [`skills`](https://github.com/vercel-labs/skills) CLI via `npx`.

### Quick Start

```bash
# Install all skills from this registry
npx skills add AbsolutelySkilled/AbsolutelySkilled

# List available skills before installing
npx skills add AbsolutelySkilled/AbsolutelySkilled --list

# Install a specific skill
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill clean-code

# Install multiple specific skills
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill clean-code --skill backend-engineering

# Install globally (available across all projects)
npx skills add AbsolutelySkilled/AbsolutelySkilled -g

# Install to a specific agent
npx skills add AbsolutelySkilled/AbsolutelySkilled -a claude-code

# Non-interactive install (CI/CD friendly)
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill clean-code -g -a claude-code -y

# Install all skills to all agents
npx skills add AbsolutelySkilled/AbsolutelySkilled --all
```

### Install Options

| Option | Description |
|---|---|
| `-g, --global` | Install to user directory instead of project |
| `-a, --agent <agents...>` | Target specific agents (e.g., `claude-code`, `codex`, `cursor`) |
| `-s, --skill <skills...>` | Install specific skills by name (use `'*'` for all) |
| `-l, --list` | List available skills without installing |
| `--copy` | Copy files instead of symlinking |
| `-y, --yes` | Skip all confirmation prompts |
| `--all` | Install all skills to all agents without prompts |

### Installation Scope

| Scope | Flag | Location | Use Case |
|---|---|---|---|
| **Project** | (default) | `./<agent>/skills/` | Committed with your project, shared with team |
| **Global** | `-g` | `~/<agent>/skills/` | Available across all projects |

### Managing Skills

```bash
# List installed skills
npx skills list

# Search for skills
npx skills find <query>

# Check for updates
npx skills check

# Update all installed skills
npx skills update

# Remove a skill
npx skills remove <skill-name>
```

### Supported Agents

The CLI supports 40+ agents including Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, Windsurf, Cline, Roo Code, and many more. See the full list in the [skills CLI documentation](https://github.com/vercel-labs/skills#supported-agents).

## Structure

```
skills/
  <skill-name>/
    SKILL.md           # Core skill content (under 500 lines)
    evals.json         # Test suite validating the skill works
    sources.yaml       # Crawl provenance (optional for domain skills)
    references/        # Deep-dive files loaded on demand
      <topic>.md
```

## Available Skills

### Software Engineering

| Skill | Description |
|---|---|
| [clean-code](skills/clean-code/) | Clean Code principles - naming, functions, SOLID, TDD, code smells, error handling |
| [clean-architecture](skills/clean-architecture/) | Clean Architecture principles - dependency rule, layers, boundaries, component design |
| [backend-engineering](skills/backend-engineering/) | Backend systems design - databases, APIs, distributed systems, caching, observability |
| [frontend-developer](skills/frontend-developer/) | Frontend engineering - components, performance, accessibility, CSS patterns, testing |
| [absolute-brainstorm](skills/absolute-brainstorm/) | Relentless design interview - ultrathink reasoning, codebase-first questions, dependency-resolved decision trees |
| [absolute-human](skills/absolute-human/) | AI-native development lifecycle - task decomposition, dependency graphs, wave-based parallel execution |
| [system-design](skills/system-design/) | Distributed systems, load balancing, CAP theorem, architecture interviews |
| [microservices](skills/microservices/) | Service decomposition, communication patterns, saga, CQRS |
| [api-design](skills/api-design/) | REST, GraphQL, gRPC, OpenAPI spec, versioning, pagination |
| [database-engineering](skills/database-engineering/) | Schema design, indexing, query optimization, migrations |
| [performance-engineering](skills/performance-engineering/) | Profiling, benchmarking, memory leaks, latency optimization |
| [absolute-simplify](skills/absolute-simplify/) | Autonomous code simplification - clean code, reduce complexity, remove redundancy |
| [refactoring-patterns](skills/refactoring-patterns/) | Extract method, replace conditional with polymorphism, catalog of refactors |
| [monorepo-management](skills/monorepo-management/) | Turborepo, Nx, Bazel, workspace dependencies, build caching |
| [code-review-mastery](skills/code-review-mastery/) | Reviewing code effectively, giving actionable feedback, catching anti-patterns |
| [address-pr-comments](skills/address-pr-comments/) | Address PR review comments - read open threads, make code changes, post batch replies via gh CLI |
| [live-dependency-resolver](skills/live-dependency-resolver/) | Live package version lookup across npm, pip, Go, cargo, gem - never hallucinate versions |
| [edge-computing](skills/edge-computing/) | Edge functions, CDN logic, Cloudflare Workers, latency optimization |
| [event-driven-architecture](skills/event-driven-architecture/) | Event sourcing, CQRS, message brokers, eventual consistency |
| [localization-i18n](skills/localization-i18n/) | Translation workflows, RTL, pluralization, ICU message format |

### DevOps & Infrastructure

| Skill | Description |
|---|---|
| [docker-kubernetes](skills/docker-kubernetes/) | Containerization, orchestration, Helm charts, service mesh |
| [ci-cd-pipelines](skills/ci-cd-pipelines/) | GitHub Actions, Jenkins, GitLab CI, deployment strategies |
| [terraform-iac](skills/terraform-iac/) | Infrastructure as code, modules, state management, drift detection |
| [cloud-aws](skills/cloud-aws/) | AWS services, well-architected framework, cost optimization |
| [cloud-gcp](skills/cloud-gcp/) | GCP services, BigQuery, Cloud Run, Pub/Sub patterns |
| [observability](skills/observability/) | Logging, metrics, tracing, alerting, SLOs, incident response |
| [signoz](skills/signoz/) | Open-source observability - distributed tracing, logs, metrics, dashboards, OpenTelemetry |
| [sentry](skills/sentry/) | Error monitoring, performance tracing, session replay, cron monitoring, source maps |
| [linux-admin](skills/linux-admin/) | Shell scripting, systemd, networking, security hardening |
| [site-reliability](skills/site-reliability/) | SRE practices, error budgets, toil reduction, capacity planning |
| [email-deliverability](skills/email-deliverability/) | SPF, DKIM, DMARC, warm-up, bounce handling, reputation |

### AI & Machine Learning

| Skill | Description |
|---|---|
| [a2a-protocol](skills/a2a-protocol/) | Agent-to-Agent protocol - interoperability, multi-agent communication, discovery |
| [a2ui](skills/a2ui/) | Agent-to-User Interface - Google's protocol for agent-driven declarative UIs |
| [mastra](skills/mastra/) | TypeScript AI framework - agents, workflows, tools, memory, RAG, MCP |
| [prompt-engineering](skills/prompt-engineering/) | LLM prompting techniques, chain-of-thought, few-shot, RAG patterns |
| [llm-app-development](skills/llm-app-development/) | Building production LLM apps, guardrails, evaluation, fine-tuning |
| [ml-ops](skills/ml-ops/) | Model deployment, monitoring, A/B testing, feature stores |
| [computer-vision](skills/computer-vision/) | Image classification, object detection, segmentation pipelines |
| [nlp-engineering](skills/nlp-engineering/) | Text processing, embeddings, search, classification, summarization |
| [data-science](skills/data-science/) | EDA, statistical analysis, visualization, hypothesis testing |
| [skillsbao-registry](skills/skillsbao-registry/) | Chinese search and installation registry for AI skills across Claude Code, OpenCode, Cursor, and other agent tools |
| [ai-agent-design](skills/ai-agent-design/) | Multi-agent systems, tool use, planning, memory architectures |

### UI/UX & Design

| Skill | Description |
|---|---|
| [absolute-ui](skills/absolute-ui/) | Build polished, modern UIs - spacing, color, typography, components, accessibility, animations, design systems |
| [accessibility-wcag](skills/accessibility-wcag/) | ARIA, screen readers, keyboard navigation, WCAG compliance |
| [figma-to-code](skills/figma-to-code/) | Translating Figma designs to pixel-perfect implementations |
| [ux-research](skills/ux-research/) | User interviews, usability testing, journey mapping, A/B test design |

### Developer Tools

| Skill | Description |
|---|---|
| [cmux](skills/cmux/) | Terminal multiplexer CLI - panes, surfaces, workspaces, browser automation |
| [vite-plus](skills/vite-plus/) | Vite+ unified toolchain - scaffolding, migration, dev/build/test/lint, monorepo tasks |
| [second-brain](skills/second-brain/) | Persistent second brain for AI agents - tag-indexed, hierarchical knowledge |
| [git-advanced](skills/git-advanced/) | Rebase strategies, bisect, worktrees, hooks, monorepo workflows |
| [vim-neovim](skills/vim-neovim/) | Configuration, keybindings, plugins, Lua scripting |
| [regex-mastery](skills/regex-mastery/) | Pattern writing, lookaheads, named groups, performance, common recipes |
| [shell-scripting](skills/shell-scripting/) | Bash/Zsh scripting, argument parsing, error handling, portability |
| [debugging-tools](skills/debugging-tools/) | Chrome DevTools, lldb, strace, network debugging, memory profilers |
| [cli-design](skills/cli-design/) | Argument parsing, help text, interactive prompts, config files, distribution |
| [open-source-management](skills/open-source-management/) | OSS project maintenance - governance, changelogs, community, licensing |
| [meta-repo](skills/meta-repo/) | Multi-repository management with `meta` - coordinating git/shell commands across many repos, polyrepo orchestration |

### Testing & QA

| Skill | Description |
|---|---|
| [test-strategy](skills/test-strategy/) | Unit, integration, e2e, contract testing - when to use what |
| [cypress-testing](skills/cypress-testing/) | E2E testing, component testing, custom commands, CI integration |
| [playwright-testing](skills/playwright-testing/) | Browser automation, visual regression, API testing |
| [jest-vitest](skills/jest-vitest/) | Unit testing patterns, mocking, snapshot testing, coverage |
| [load-testing](skills/load-testing/) | k6, Artillery, JMeter, performance benchmarks, capacity planning |
| [api-testing](skills/api-testing/) | REST/GraphQL testing, contract testing, mock servers |
| [chaos-engineering](skills/chaos-engineering/) | Fault injection, resilience testing, game days, failure modes |

### Security

| Skill | Description |
|---|---|
| [skill-audit](skills/skill-audit/) | AI-powered security audit for agent skills - prompt injection, exfiltration, supply chain, behavioral safety |
| [appsec-owasp](skills/appsec-owasp/) | OWASP Top 10, secure coding, input validation, auth patterns |
| [penetration-testing](skills/penetration-testing/) | Ethical hacking, vulnerability assessment, exploit development |
| [cloud-security](skills/cloud-security/) | IAM, secrets management, network policies, compliance |
| [cryptography](skills/cryptography/) | Encryption, hashing, TLS, JWT, key management, zero-trust |
| [security-incident-response](skills/security-incident-response/) | Forensics, containment, root cause analysis, post-mortems |

### SEO & Search Visibility

| Skill | Description |
|---|---|
| [absolute-seo](skills/absolute-seo/) | Comprehensive SEO - technical, on-page, E-E-A-T, schema, CWV, local, link building, international, e-commerce, programmatic, GEO/AEO, audits |
| [keyword-research](skills/keyword-research/) | Tri-surface keyword research - organic, AEO (snippets/PAA), GEO (AI citations) scoring |

### Marketing

| Skill | Description |
|---|---|
| [absolute-marketing](skills/absolute-marketing/) | Unified marketing - copy, content, SEO, email, social, paid ads, CRO, brand, growth, pricing, launches |
| [content-marketing](skills/content-marketing/) | Blog strategy, SEO content, content calendars, repurposing |
| [email-marketing](skills/email-marketing/) | Campaigns, drip sequences, deliverability, A/B testing |
| [social-media-strategy](skills/social-media-strategy/) | Platform-specific tactics, scheduling, analytics, engagement |
| [growth-hacking](skills/growth-hacking/) | Viral loops, referral programs, activation funnels, retention |
| [copywriting](skills/copywriting/) | Headlines, landing pages, CTAs, persuasion frameworks (AIDA, PAS) |
| [brand-strategy](skills/brand-strategy/) | Positioning, voice and tone, brand architecture, storytelling |
| [developer-advocacy](skills/developer-advocacy/) | Talks, demos, blog posts, SDK examples, community engagement |
| [video-production](skills/video-production/) | Script writing, editing workflows, thumbnails, YouTube SEO |

### Sales

| Skill | Description |
|---|---|
| [sales-playbook](skills/sales-playbook/) | Outbound sequences, objection handling, discovery calls, MEDDIC |
| [crm-management](skills/crm-management/) | Salesforce/HubSpot workflows, pipeline management, forecasting |
| [sales-enablement](skills/sales-enablement/) | Battle cards, competitive intel, case studies, ROI calculators |
| [proposal-writing](skills/proposal-writing/) | RFP responses, SOWs, pricing strategies, win themes |
| [account-management](skills/account-management/) | Expansion playbooks, QBRs, stakeholder mapping, renewal strategy |
| [lead-scoring](skills/lead-scoring/) | ICP definition, scoring models, intent signals, qualification frameworks |

### HR & People Operations

| Skill | Description |
|---|---|
| [recruiting-ops](skills/recruiting-ops/) | Job descriptions, sourcing, screening, interview frameworks |
| [interview-design](skills/interview-design/) | Structured interviews, rubrics, coding challenges, assessment |
| [onboarding](skills/onboarding/) | 30/60/90 plans, buddy systems, knowledge transfer, ramp metrics |
| [performance-management](skills/performance-management/) | OKRs, reviews, calibration, PIPs, career ladders |
| [compensation-strategy](skills/compensation-strategy/) | Market benchmarking, equity, leveling, total rewards |
| [employee-engagement](skills/employee-engagement/) | Surveys, pulse checks, retention strategies, culture building |

### Finance & Accounting

| Skill | Description |
|---|---|
| [financial-modeling](skills/financial-modeling/) | DCF, LBO, revenue forecasting, scenario analysis, cap tables |
| [budgeting-planning](skills/budgeting-planning/) | FP&A, variance analysis, rolling forecasts, cost allocation |
| [startup-fundraising](skills/startup-fundraising/) | Pitch decks, term sheets, due diligence, investor relations |
| [tax-strategy](skills/tax-strategy/) | Corporate tax, R&D credits, transfer pricing, compliance |
| [bookkeeping-automation](skills/bookkeeping-automation/) | Chart of accounts, reconciliation, AP/AR, month-end close |
| [financial-reporting](skills/financial-reporting/) | P&L, balance sheet, cash flow, board decks, KPI dashboards |

### Legal & Compliance

| Skill | Description |
|---|---|
| [contract-drafting](skills/contract-drafting/) | NDAs, MSAs, SaaS agreements, licensing, redlining |
| [privacy-compliance](skills/privacy-compliance/) | GDPR, CCPA, data processing, consent management, DPIAs |
| [ip-management](skills/ip-management/) | Patents, trademarks, trade secrets, open-source licensing |
| [employment-law](skills/employment-law/) | Offer letters, termination, contractor vs employee, workplace policies |
| [regulatory-compliance](skills/regulatory-compliance/) | SOC 2, HIPAA, PCI-DSS, audit preparation, controls |

### Product Management

| Skill | Description |
|---|---|
| [product-strategy](skills/product-strategy/) | Vision, roadmapping, prioritization frameworks (RICE, ICE, MoSCoW) |
| [user-stories](skills/user-stories/) | Acceptance criteria, story mapping, backlog grooming, estimation |
| [product-analytics](skills/product-analytics/) | Funnels, cohort analysis, feature adoption, metrics (NSM, AARRR) |
| [posthog](skills/posthog/) | PostHog integration - product analytics, feature flags, A/B testing, session replay, surveys |
| [competitive-analysis](skills/competitive-analysis/) | Market landscape, feature comparison, positioning, SWOT |
| [product-launch](skills/product-launch/) | Go-to-market, beta programs, launch checklists, rollout strategy |
| [product-discovery](skills/product-discovery/) | Jobs-to-be-done, opportunity solution trees, assumption mapping |

### Support & Customer Success

| Skill | Description |
|---|---|
| [customer-support-ops](skills/customer-support-ops/) | Ticket triage, SLA management, macros, escalation workflows |
| [knowledge-base](skills/knowledge-base/) | Help center architecture, article writing, search optimization |
| [customer-success-playbook](skills/customer-success-playbook/) | Health scores, churn prediction, expansion signals, QBRs |
| [community-management](skills/community-management/) | Forum moderation, engagement programs, advocacy, feedback loops |
| [support-analytics](skills/support-analytics/) | CSAT, NPS, resolution time, deflection rate, trend analysis |

### Business Strategy

| Skill | Description |
|---|---|
| [api-monetization](skills/api-monetization/) | Usage-based pricing, rate limiting, developer tiers, Stripe metering |
| [saas-metrics](skills/saas-metrics/) | MRR, churn, LTV, CAC, cohort analysis, board reporting |
| [pricing-strategy](skills/pricing-strategy/) | Packaging, freemium, usage-based, enterprise tiers, price testing |
| [partnership-strategy](skills/partnership-strategy/) | Co-marketing, integrations, channel partnerships, affiliates |

### Monitoring

| Skill | Description |
|---|---|
| [supaguard](skills/supaguard/) | Synthetic monitoring from source code - Playwright script generation, multi-region checks, alerting |

### Operations & Automation

| Skill | Description |
|---|---|
| [incident-management](skills/incident-management/) | On-call rotations, runbooks, post-mortems, status pages, war rooms |
| [no-code-automation](skills/no-code-automation/) | Zapier, Make, n8n, workflow automation, internal tooling |

### Data Engineering

| Skill | Description |
|---|---|
| [data-pipelines](skills/data-pipelines/) | ETL/ELT, Airflow, dbt, Spark, streaming vs batch |
| [data-warehousing](skills/data-warehousing/) | Star schema, slowly changing dimensions, Snowflake, BigQuery |
| [data-quality](skills/data-quality/) | Validation, monitoring, lineage, Great Expectations, contracts |
| [analytics-engineering](skills/analytics-engineering/) | dbt models, semantic layers, metrics definitions, self-serve analytics |
| [real-time-streaming](skills/real-time-streaming/) | Kafka, Flink, event sourcing, CDC, stream processing patterns |

### Mobile Development

| Skill | Description |
|---|---|
| [react-native](skills/react-native/) | Expo, navigation, native modules, performance, OTA updates |
| [ios-swift](skills/ios-swift/) | SwiftUI, UIKit, Core Data, App Store guidelines, performance |
| [android-kotlin](skills/android-kotlin/) | Jetpack Compose, Room, coroutines, Play Store, architecture |
| [mobile-testing](skills/mobile-testing/) | Detox, Appium, device farms, crash reporting, beta distribution |

### Game Development

| Skill | Description |
|---|---|
| [unity-development](skills/unity-development/) | C# scripting, ECS, physics, shaders, UI toolkit |
| [game-design-patterns](skills/game-design-patterns/) | State machines, object pooling, event systems, command pattern |
| [pixel-art-sprites](skills/pixel-art-sprites/) | Sprite creation, animation, tilesets, palette management |
| [game-audio](skills/game-audio/) | Sound design, adaptive music, spatial audio, FMOD/Wwise |
| [game-balancing](skills/game-balancing/) | Economy design, difficulty curves, progression systems, playtesting |

### Technical Writing

| Skill | Description |
|---|---|
| [codedocs](skills/codedocs/) | AI-agent-friendly codebase docs - generate layered docs, answer questions docs-first, update incrementally via git diff |
| [technical-writing](skills/technical-writing/) | API docs, tutorials, architecture docs, ADRs, runbooks |
| [developer-experience](skills/developer-experience/) | SDK design, onboarding, changelog, migration guides |
| [internal-docs](skills/internal-docs/) | RFCs, design docs, post-mortems, runbooks, knowledge management |

### Project Management

| Skill | Description |
|---|---|
| [agile-scrum](skills/agile-scrum/) | Sprint planning, retrospectives, velocity, Kanban, estimation |
| [project-execution](skills/project-execution/) | Risk management, dependency tracking, stakeholder communication |
| [remote-collaboration](skills/remote-collaboration/) | Async workflows, documentation-driven, meeting facilitation |

### Blockchain & Web3

| Skill | Description |
|---|---|
| [web3-smart-contracts](skills/web3-smart-contracts/) | Solidity, auditing, DeFi patterns, gas optimization, security |

### Cross-Functional

| Skill | Description |
|---|---|
| [technical-interviewing](skills/technical-interviewing/) | Coding challenges, system design interviews, rubric calibration |
| [customer-research](skills/customer-research/) | Surveys, interviews, NPS, behavioral analytics, persona building |
| [presentation-design](skills/presentation-design/) | Slide structure, storytelling frameworks, data visualization |
| [spreadsheet-modeling](skills/spreadsheet-modeling/) | Formulas, pivot tables, dashboards, macros, financial models |

### Video Creation

| Skill | Description |
|---|---|
| [video-creator](skills/video-creator/) | End-to-end video orchestrator - 7-step workflow from interview to 4K render |
| [remotion-video](skills/remotion-video/) | Core Remotion framework - compositions, animations, rendering, project setup |
| [video-scriptwriting](skills/video-scriptwriting/) | Interactive script writing - interview framework, YAML scene format, pacing |
| [video-audio-design](skills/video-audio-design/) | Audio design - ElevenLabs TTS, background music, SFX generation, mixing |
| [video-analyzer](skills/video-analyzer/) | FFmpeg + AI vision analysis - frame extraction, scene detection, design system extraction |

### Full Registry

**155+ skills** across 25 categories.

## Creating Skills

Use the `skill-forge` skill to generate new skills:

```
/skill-forge <url-or-topic>
```

- **URL input** - provide a GitHub repo or docs URL and skill-forge crawls it
- **Domain topic** - provide a topic like "marketing" or "typescript" and skill-forge runs a brainstorm session to scope and build the skill

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide on creating and submitting skills.

## Contributing

We welcome contributions! Whether it's a new skill for a framework you love or fixing a typo in an existing one, check out the [contributing guide](CONTRIBUTING.md).

## Star History

<a href="https://www.star-history.com/?repos=AbsolutelySkilled%2FAbsolutelySkilled&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=AbsolutelySkilled/AbsolutelySkilled&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=AbsolutelySkilled/AbsolutelySkilled&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/image?repos=AbsolutelySkilled/AbsolutelySkilled&type=date&legend=top-left" />
 </picture>
</a>

## License

[MIT](LICENSE)
