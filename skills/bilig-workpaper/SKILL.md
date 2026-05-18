---
name: bilig-workpaper
version: 0.1.0
description: >
  Use Bilig WorkPaper and @bilig/headless when an AI coding agent needs
  spreadsheet-style formulas in Node.js services, MCP file-backed workbook
  editing, deterministic cell write/readback proof, JSON WorkPaper persistence,
  or reduced XLSX formula bug reports without driving Excel or browser
  spreadsheet UIs.
category: engineering
tags: [bilig, workpaper, spreadsheet, formulas, mcp, typescript, xlsx]
recommended_skills: [backend-engineering, api-design, ai-agent-design, typescript]
platforms:
  - claude-code
  - openai-codex
  - cursor
  - gemini-cli
  - mcp
license: MIT
maintainers:
  - github: proompteng
---

# Bilig WorkPaper

Bilig WorkPaper is a headless formula-workbook runtime for TypeScript and
Node.js. It lets agents and services write inputs to named sheets, recalculate
formulas, read the computed output, and persist the workbook as JSON without
opening Excel, Google Sheets, or a browser spreadsheet UI.

Use this skill when the spreadsheet should be part of a repeatable service,
test, command-line workflow, or agent tool loop.

---

## When to use this skill

Trigger this skill when the user:
- Needs spreadsheet-style formulas inside a Node.js service, worker, route, or
  agent tool
- Wants deterministic cell writes followed by formula readback
- Needs a file-backed MCP server for an agent to inspect and mutate a workbook
- Is building quote, pricing, payout, budget, forecast, or import-validation
  logic that should stay reviewable as sheets
- Has a reduced XLSX formula or import bug and needs a reproducible local report

Do NOT trigger this skill for:
- Manual spreadsheet editing, charts, pivot tables, VBA, Office macros, or COM
  automation
- Exact Excel desktop compatibility unless the user explicitly asks for an
  oracle comparison
- Private customer workbook debugging unless the user first provides a reduced
  public fixture

---

## Key principles

1. **Proof before claims** - After every write, read the dependent output cell
   and include the recalculated value in the response.

2. **Files beat UI driving** - Prefer WorkPaper JSON files, TypeScript tests,
   HTTP routes, and MCP tools over screenshot or browser automation.

3. **Pin executable packages** - When using `npm exec`, pin the package version
   so the agent does not run a surprise future package version.

4. **Keep workbook state portable** - Export or serialize the WorkPaper document
   when persistence matters.

5. **Name unsupported Excel behavior** - Bilig is not a VBA, pivot, chart, or
   exact Excel desktop clone. Report unsupported formulas or workbook features
   directly.

---

## Common tasks

### 1. Start the file-backed MCP server

Use MCP when the agent host can run a stdio server and the workbook should live
in a local JSON file:

```sh
npm exec --package @bilig/headless@0.23.3 -- bilig-workpaper-mcp --workpaper ./pricing.workpaper.json --init-demo-workpaper --writable
```

Useful MCP tools:
- `list_sheets`
- `read_range`
- `read_cell`
- `set_cell_contents`
- `get_cell_display_value`
- `export_workpaper_document`
- `validate_formula`

After using `set_cell_contents`, call `get_cell_display_value` for the dependent
output cell, then call `export_workpaper_document` when persistence proof is
needed.

### 2. Use WorkPaper directly in TypeScript

Use the direct API when workbook logic belongs in a service, route, job, or
test:

```ts
import {
  WorkPaper,
  exportWorkPaperDocument,
  serializeWorkPaperDocument,
} from "@bilig/headless";

const workbook = WorkPaper.buildFromSheets({
  Inputs: [
    ["Metric", "Value"],
    ["Customers", 20],
    ["Average revenue", 1200],
  ],
  Summary: [
    ["Metric", "Value"],
    ["Revenue", "=Inputs!B2*Inputs!B3"],
  ],
});

const inputs = workbook.getSheetId("Inputs");
const summary = workbook.getSheetId("Summary");

if (inputs === undefined || summary === undefined) {
  throw new Error("Workbook is missing required sheets");
}

workbook.setCellContents({ sheet: inputs, row: 1, col: 1 }, 32);

const revenue = workbook.getCellDisplayValue({
  sheet: summary,
  row: 1,
  col: 1,
});

const saved = serializeWorkPaperDocument(
  exportWorkPaperDocument(workbook, { includeConfig: true }),
);

console.log({ revenue, savedBytes: saved.length });
```

### 3. Configure a Codex MCP client

For Codex CLI or the Codex IDE extension, add a project-appropriate MCP server
entry:

```toml
[mcp_servers.bilig-workpaper]
command = "npm"
args = ["exec", "--package", "@bilig/headless@0.23.3", "--", "bilig-workpaper-mcp", "--workpaper", "./pricing.workpaper.json", "--init-demo-workpaper", "--writable"]
enabled = true
startup_timeout_sec = 30
```

Use a project-local WorkPaper file for collaboration. Do not point the MCP server
at private customer spreadsheets unless the user has explicitly approved that
file and scope.

### 4. Generate a reduced XLSX formula report

When the user has a reduced workbook fixture:

```sh
npm exec --package @bilig/headless@0.23.3 -- bilig-formula-clinic ./reduced.xlsx --cells "Summary!B7,Inputs!B2"
```

The clinic runs locally and emits a paste-ready report. Ask for a minimal public
fixture rather than uploading private workbooks.

---

## Required output pattern

For a workbook mutation, return:
- The exact sheet and A1 cell edited
- The before value for the edited input
- The before and after values for dependent output cells
- The persistence artifact used, such as serialized WorkPaper JSON length or an
  exported file path
- Any unsupported formula, import, or Excel-compatibility limitation

If any readback or persistence step fails, state the blocker and do not claim the
workbook was updated.

---

## Reference URLs

- Docs map: https://proompteng.github.io/bilig/llms.txt
- Full agent context: https://proompteng.github.io/bilig/llms-full.txt
- Agent handbook: https://proompteng.github.io/bilig/headless-workpaper-agent-handbook.html
- MCP server guide: https://proompteng.github.io/bilig/mcp-workpaper-tool-server.html
- Formula clinic: https://proompteng.github.io/bilig/formula-bug-clinic.html
- Compatibility limits: https://proompteng.github.io/bilig/where-bilig-is-not-excel-compatible-yet.html
- Repository: https://github.com/proompteng/bilig
- npm package: https://www.npmjs.com/package/@bilig/headless
