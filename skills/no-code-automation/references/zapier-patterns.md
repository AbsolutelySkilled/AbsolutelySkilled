<!-- Part of the no-code-automation AbsolutelySkilled skill. Load this file when
     working with Zapier-specific automation patterns. -->

# Zapier Patterns

Advanced patterns for building reliable, maintainable Zapier automations beyond
simple two-step Zaps.

---

## Multi-step Zaps

Chain multiple actions in sequence. Each step can reference data from any
previous step using the data picker.

**Best practices:**
- Keep Zaps under 10 steps. Beyond that, split into separate Zaps connected
  via Webhooks by Zapier.
- Name each step descriptively: "Create HubSpot Contact" not "Action 3"
- Test each step individually before testing the full Zap

---

## Paths (conditional branching)

Paths split a Zap into multiple branches based on conditions. Each path has
its own set of filter rules and actions.

**When to use Paths:**
- Route data to different destinations based on a field value
- Apply different transformations based on record type
- Send different notifications based on priority level

**Limitations:**
- Maximum 3 paths per Paths step (use nested Paths for more)
- Each path counts as a separate task when it executes
- You cannot merge paths back together - each path ends independently

**Example: Route support tickets**
```
Trigger: New Zendesk Ticket
  Path A (Priority: Urgent) -> Create PagerDuty Incident + Slack #urgent
  Path B (Priority: High)   -> Slack #support-high + Assign to senior agent
  Path C (Default)           -> Add to support queue spreadsheet
```

---

## Formatter by Zapier

Built-in data transformation utilities. Use these instead of Code steps for
simple transformations:

| Formatter | Use case |
|---|---|
| Text - Split | Split "John Doe" into first and last name |
| Text - Replace | Clean up phone number formatting |
| Text - Truncate | Shorten descriptions for Slack messages |
| Numbers - Spreadsheet formula | Basic math operations |
| Date/Time - Format | Convert between date formats |
| Date/Time - Add/Subtract | Calculate due dates |
| Utilities - Lookup Table | Map values (e.g., country code -> country name) |
| Utilities - Line Item to Text | Convert arrays to comma-separated strings |

> Formatter steps are free - they don't count toward your task limit.

---

## Webhooks by Zapier

Two powerful modules for custom integrations:

### Catch Hook (trigger)
Creates a unique webhook URL that triggers the Zap when it receives a POST/GET
request. Use this when the source app doesn't have a native Zapier integration.

- The URL is unique per Zap and persistent
- Supports JSON, form-encoded, and XML payloads
- First request sets the sample data structure

### Send Hook (action)
Makes an HTTP request to any URL. Use this to call APIs that don't have native
Zapier integrations.

- Supports GET, POST, PUT, PATCH, DELETE
- Custom headers for authentication
- JSON or form-encoded body

**Pattern: Connect two Zaps**
Use Catch Hook + Send Hook to chain Zaps:
```
Zap 1: Trigger -> Process -> Webhooks: POST to Zap 2's Catch Hook URL
Zap 2: Catch Hook -> More processing -> Final action
```

---

## Code by Zapier

Execute custom JavaScript for transformations too complex for Formatter:

```javascript
// Code by Zapier - JavaScript
// Input variables are available as inputData object
const name = inputData.fullName.split(' ');
const amount = parseFloat(inputData.amount);

output = [{
  firstName: name[0],
  lastName: name.slice(1).join(' '),
  amountInCents: Math.round(amount * 100),
  isHighValue: amount > 1000
}];
```

**Constraints:**
- JavaScript only (no Python)
- 1 second execution time limit
- 128 MB memory limit
- No external HTTP requests (use Webhooks step instead)
- Must return an array of objects via the `output` variable
- Can use `fetch` via the async code variant for HTTP calls

---

## Error handling patterns

Zapier's error handling is limited compared to Make or n8n:

1. **Auto-replay** - Zapier can auto-replay failed tasks. Enable in Zap
   settings. It retries every 10 minutes for up to 3 days.
2. **Error notification** - Set up a Zapier Manager alert to get emailed
   when any Zap errors. Or create a separate Zap: "Error in Zapier" trigger.
3. **Defensive Formatter steps** - Add a Formatter "Utilities: Default Value"
   step before actions that might receive null values.
4. **Filter as guard** - Add Filter steps to skip records that would cause
   downstream errors (empty emails, invalid formats, etc.).

---

## Task optimization

Tasks are Zapier's billing unit. One task = one successful action step execution.

**Reduce task consumption:**
- Use Filter steps to skip unnecessary executions (filters are free)
- Use Formatter steps for transforms (formatters are free)
- Batch operations: use "Find or Create" actions instead of separate find + create
- Use Digest by Zapier to batch multiple triggers into a single execution
- Prefer Zap-level throttling over per-step delays

**Typical monthly usage by company size:**
- Small team (5 people, 10 automations): 2,000-5,000 tasks/month
- Mid-size (20 people, 30 automations): 10,000-25,000 tasks/month
- Growth (50+ people, 100+ automations): 50,000+ tasks/month
