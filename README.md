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

Skills work with any agent that supports the SKILL.md format: Claude Code, Gemini CLI, OpenAI Codex, and MCP-compatible tools.

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

| Skill | Category | Description |
|---|---|---|
| [mastra](skills/mastra/) | ai-ml | TypeScript AI framework - agents, workflows, tools, memory, RAG, MCP |

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
