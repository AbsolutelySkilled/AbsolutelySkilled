# observability

observability is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex. Implementing logging, metrics, distributed tracing, alerting, or defining SLOs.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | monitoring |
| Version | 0.1.0 |
| Platforms | claude-code, gemini-cli, openai-codex |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill observability
```

3. The observability skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

Observability is the ability to understand what a system is doing from the outside by
examining its outputs - without needing to modify the system or guess at internals.
The three pillars are **logs** (what happened), **metrics** (how the system is
performing), and **traces** (where time is spent across service boundaries). These
pillars are only useful when correlated - a spike in your p99 metric should link to
traces, and those traces should link to logs. Invest in correlation from day one, not
as a retrofit.

---

## Tags

`observability` `logging` `metrics` `tracing` `alerting` `slo`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Related Skills

Pair observability with these complementary skills:

- [site-reliability](https://www.absolutelyskilled.pro/skill/site-reliability)
- [incident-management](https://www.absolutelyskilled.pro/skill/incident-management)
- [performance-engineering](https://www.absolutelyskilled.pro/skill/performance-engineering)
- [sentry](https://www.absolutelyskilled.pro/skill/sentry)

## Frequently Asked Questions

### What is observability?

Use this skill when implementing logging, metrics, distributed tracing, alerting, or defining SLOs. Triggers on structured logging, Prometheus, Grafana, OpenTelemetry, Datadog, distributed tracing, error tracking, dashboards, alert fatigue, SLIs, SLOs, error budgets, and any task requiring system observability or monitoring setup.


### How do I install observability?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill observability` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support observability?

This skill works with claude-code, gemini-cli, openai-codex. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/observability)*
