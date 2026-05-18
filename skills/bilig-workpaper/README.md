# bilig-workpaper

bilig-workpaper is a production-ready AI agent skill for claude-code,
openai-codex, cursor, gemini-cli, and mcp. It covers Bilig WorkPaper and
@bilig/headless for spreadsheet-style formulas in Node.js services, MCP
file-backed workbook editing, deterministic cell write/readback proof, JSON
WorkPaper persistence, and reduced XLSX formula bug reports without driving
Excel or browser spreadsheet UIs.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | engineering |
| Version | 0.1.0 |
| Platforms | claude-code, openai-codex, cursor, gemini-cli, mcp |
| License | MIT |

## How to Install

1. Make sure Node.js is installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill bilig-workpaper
```

3. The bilig-workpaper skill is now available in your AI coding agent.

## Overview

Bilig WorkPaper is a headless formula-workbook runtime for TypeScript and
Node.js. It lets agents and services write inputs to named sheets, recalculate
formulas, read the computed output, and persist the workbook as JSON without
opening Excel, Google Sheets, or a browser spreadsheet UI.

Use this skill for quote, pricing, payout, budget, forecast, import-validation,
and agent spreadsheet-tool workflows where readback proof matters.

## Tags

`bilig` `workpaper` `spreadsheet` `formulas` `mcp` `typescript` `xlsx`

## Platforms

- claude-code
- openai-codex
- cursor
- gemini-cli
- mcp

## Related Skills

Pair bilig-workpaper with these complementary skills:

- [backend-engineering](https://www.absolutelyskilled.pro/skill/backend-engineering)
- [api-design](https://www.absolutelyskilled.pro/skill/api-design)
- [ai-agent-design](https://www.absolutelyskilled.pro/skill/ai-agent-design)
- [typescript](https://www.absolutelyskilled.pro/skill/typescript)

## Frequently Asked Questions

### What is bilig-workpaper?

Use this skill when an AI coding agent needs spreadsheet-style formulas in a
Node.js service, MCP file-backed workbook editing, deterministic cell
write/readback proof, JSON WorkPaper persistence, or reduced XLSX formula bug
reports without driving Excel or a browser spreadsheet UI.

### How do I install bilig-workpaper?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill
bilig-workpaper` in your terminal. The skill will be immediately available in
your AI coding agent.

### What AI agents support bilig-workpaper?

This skill works with claude-code, openai-codex, cursor, gemini-cli, and mcp.
Install it once and use it across any supported AI coding agent.

### What command starts the file-backed MCP server?

```bash
npm exec --package @bilig/headless@0.23.3 -- bilig-workpaper-mcp --workpaper ./pricing.workpaper.json --init-demo-workpaper --writable
```

## Maintainers

- [@proompteng](https://github.com/proompteng)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/bilig-workpaper)*
