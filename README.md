<p align="center">
  <img src="https://avatars.githubusercontent.com/u/268155241?s=200&v=4" width="120" alt="AbsolutelySkilled logo" />
</p>

<h1 align="center">AbsolutelySkilled</h1>

<p align="center">
  A registry of production-ready skills for AI coding agents.
</p>

---

## What is this?

AbsolutelySkilled is a collection of skills that teach AI agents domain-specific knowledge - from framework APIs to marketing strategy. Each skill is a self-contained folder with structured markdown that agents load on demand.

Skills work with any agent that supports the SKILL.md format: Claude Code, Gemini CLI, OpenAI Codex, Cursor, and [40+ more agents](#supported-agents).

---

## Flagship Skills

These three skills form the backbone of AbsolutelySkilled - install them first and watch your AI agent transform from a code assistant into an autonomous development partner.

### Superhuman - AI-Native Development Lifecycle

Traditional development methods - Agile, Waterfall, TDD - were built around human constraints: limited parallelism, context switching costs, and meeting overhead. **Superhuman** throws all of that out and rebuilds the SDLC from scratch for AI agents.

Give it a feature request, and Superhuman will:

1. **Interview you** to extract requirements, constraints, and success criteria
2. **Decompose** the work into a dependency-graphed DAG of atomic sub-tasks
3. **Research** each task by exploring your codebase and docs in parallel
4. **Plan** test-first implementation strategies per task
5. **Execute** tasks in parallel waves - independent tasks run simultaneously via sub-agents
6. **Verify** every task with TDD, lint, typecheck, and build checks
7. **Converge** with a self code review, requirements validation, and full project verification

Everything is tracked on a persistent `.superhuman/board.md` that survives across sessions - resume where you left off, audit decisions, or hand off to another developer.

```
INTAKE --> DECOMPOSE --> DISCOVER --> PLAN --> EXECUTE --> VERIFY --> CONVERGE
```

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill superhuman
```

### Second Brain - Persistent Memory for AI Agents

Every time you start a new conversation, your AI agent forgets everything it learned in the last one. **Second Brain** fixes that.

It turns `~/.memory/` into a structured, hierarchical knowledge store that persists across projects, sessions, and tools. Your agent remembers your preferences, workflows, debugging techniques, and domain expertise - automatically loading only what's relevant to the current context.

- **Tag-indexed retrieval** - memories are scored against your current context and only the top matches are loaded (no wasted tokens)
- **100-line ceiling** - files stay small and split automatically, keeping context window usage efficient
- **Wiki-linked graph** - memories cross-reference each other with `[[wiki-links]]` for rich knowledge traversal
- **Auto-propose learnings** - after complex tasks, your agent suggests what to remember for next time
- **CRUSP lifecycle** - Create, Read, Update, Split, Prune - your memory stays fresh and organized

Your agent goes from amnesia to institutional knowledge in one install.

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill second-brain
```

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
| [superhuman](skills/superhuman/) | AI-native development lifecycle - task decomposition, dependency graphs, wave-based parallel execution |
| [system-design](skills/system-design/) | Distributed systems, load balancing, CAP theorem, architecture interviews |
| [microservices](skills/microservices/) | Service decomposition, communication patterns, saga, CQRS |
| [api-design](skills/api-design/) | REST, GraphQL, gRPC, OpenAPI spec, versioning, pagination |
| [database-engineering](skills/database-engineering/) | Schema design, indexing, query optimization, migrations |
| [performance-engineering](skills/performance-engineering/) | Profiling, benchmarking, memory leaks, latency optimization |
| [refactoring-patterns](skills/refactoring-patterns/) | Extract method, replace conditional with polymorphism, catalog of refactors |
| [monorepo-management](skills/monorepo-management/) | Turborepo, Nx, Bazel, workspace dependencies, build caching |
| [code-review-mastery](skills/code-review-mastery/) | Reviewing code effectively, giving actionable feedback, catching anti-patterns |
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
| [ai-agent-design](skills/ai-agent-design/) | Multi-agent systems, tool use, planning, memory architectures |

### UI/UX & Design

| Skill | Description |
|---|---|
| [ultimate-ui](skills/ultimate-ui/) | Build polished, modern UIs - spacing, color, typography, components, accessibility |
| [design-systems](skills/design-systems/) | Component libraries, tokens, theming, Storybook |
| [accessibility-wcag](skills/accessibility-wcag/) | ARIA, screen readers, keyboard navigation, WCAG compliance |
| [motion-design](skills/motion-design/) | CSS animations, Framer Motion, GSAP, micro-interactions |
| [responsive-design](skills/responsive-design/) | Mobile-first, fluid typography, container queries, breakpoint strategy |
| [figma-to-code](skills/figma-to-code/) | Translating Figma designs to pixel-perfect implementations |
| [color-theory](skills/color-theory/) | Palettes, contrast, brand colors, dark mode, semantic tokens |
| [ux-research](skills/ux-research/) | User interviews, usability testing, journey mapping, A/B test design |

### Developer Tools

| Skill | Description |
|---|---|
| [cmux](skills/cmux/) | Terminal multiplexer CLI - panes, surfaces, workspaces, browser automation |
| [second-brain](skills/second-brain/) | Persistent second brain for AI agents - tag-indexed, hierarchical knowledge |
| [git-advanced](skills/git-advanced/) | Rebase strategies, bisect, worktrees, hooks, monorepo workflows |
| [vim-neovim](skills/vim-neovim/) | Configuration, keybindings, plugins, Lua scripting |
| [regex-mastery](skills/regex-mastery/) | Pattern writing, lookaheads, named groups, performance, common recipes |
| [shell-scripting](skills/shell-scripting/) | Bash/Zsh scripting, argument parsing, error handling, portability |
| [debugging-tools](skills/debugging-tools/) | Chrome DevTools, lldb, strace, network debugging, memory profilers |
| [cli-design](skills/cli-design/) | Argument parsing, help text, interactive prompts, config files, distribution |
| [open-source-management](skills/open-source-management/) | OSS project maintenance - governance, changelogs, community, licensing |

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
| [appsec-owasp](skills/appsec-owasp/) | OWASP Top 10, secure coding, input validation, auth patterns |
| [penetration-testing](skills/penetration-testing/) | Ethical hacking, vulnerability assessment, exploit development |
| [cloud-security](skills/cloud-security/) | IAM, secrets management, network policies, compliance |
| [cryptography](skills/cryptography/) | Encryption, hashing, TLS, JWT, key management, zero-trust |
| [security-incident-response](skills/security-incident-response/) | Forensics, containment, root cause analysis, post-mortems |

### SEO & Search Visibility

| Skill | Description |
|---|---|
| [seo-mastery](skills/seo-mastery/) | Technical SEO, keyword research, link building, schema markup |
| [keyword-research](skills/keyword-research/) | Search intent taxonomy, keyword clustering, SERP analysis |
| [schema-markup](skills/schema-markup/) | JSON-LD structured data, Schema.org types, rich snippets |
| [core-web-vitals](skills/core-web-vitals/) | LCP, INP, CLS optimization, Lighthouse CI, RUM monitoring |
| [technical-seo](skills/technical-seo/) | Crawlability, indexing, sitemaps, canonicals, rendering strategies |
| [content-seo](skills/content-seo/) | Topic clusters, E-E-A-T, pillar pages, keyword cannibalization |
| [link-building](skills/link-building/) | Digital PR, guest posting, broken link building, toxic link audit |
| [local-seo](skills/local-seo/) | Google Business Profile, local citations, NAP consistency |
| [international-seo](skills/international-seo/) | hreflang tags, geo-targeting, multilingual content strategy |
| [ecommerce-seo](skills/ecommerce-seo/) | Product page optimization, faceted navigation, category taxonomy |
| [programmatic-seo](skills/programmatic-seo/) | Template-based page generation, data-driven landing pages at scale |
| [aeo-optimization](skills/aeo-optimization/) | Featured snippets, People Also Ask, voice search, knowledge panels |
| [geo-optimization](skills/geo-optimization/) | AI search engines, LLMs.txt, citation signals |
| [on-site-seo](skills/on-site-seo/) | Framework-aware SEO fixes (Next.js, Nuxt, Astro), meta tags, OG cards |
| [seo-audit](skills/seo-audit/) | Full-spectrum SEO audit methodology, structured scorecard |

### Marketing

| Skill | Description |
|---|---|
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

### Full Registry

**147+ skills** across 25 categories. See the complete categorized checklist in [TODO.local.md](TODO.local.md).

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

## License

[MIT](LICENSE)
