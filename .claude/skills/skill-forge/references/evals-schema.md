<!-- Part of the skill-forge AbsolutelySkilled skill. Load this file when
     writing evals.json for a new skill. -->

# Evals Schema

## JSON structure

```json
{
  "skill": "<name>",
  "version": "0.1.0",
  "evals": [
    {
      "id": "eval-001",
      "description": "<what this tests>",
      "prompt": "<realistic user prompt that should trigger and use this skill>",
      "type": "factual|code|explanation",
      "assertions": [
        {
          "type": "contains",
          "value": "<string that must appear in response>"
        },
        {
          "type": "not_contains",
          "value": "<string that must NOT appear - catches hallucinations>"
        },
        {
          "type": "code_valid",
          "language": "<js|python|bash>"
        }
      ],
      "source": "<URL from sources.yaml that this eval tests>"
    }
  ]
}
```

## Assertion types

| Type | Purpose | Value |
|---|---|---|
| `contains` | Response must include this string | Exact substring match |
| `not_contains` | Response must NOT include this string | Catches hallucinated APIs, deprecated methods |
| `code_valid` | Any code block in the response must parse | Language: `js`, `python`, `bash` |

## Coverage targets

Write 10-15 evals covering these categories:

| Type | Count | What to test |
|---|---|---|
| Trigger test | 2-3 | Does the skill activate for on-topic prompts? |
| Core task | 4-5 | Can it produce correct code for the main tasks? |
| Gotcha / edge case | 2-3 | Does it handle auth errors, pagination, rate limits? |
| Anti-hallucination | 1-2 | Does it avoid inventing API methods that don't exist? |
| References load | 1 | Does it correctly reference a references/ file? |

## Worked example eval entry

```json
{
  "id": "eval-003",
  "description": "Agent can create a Stripe payment intent with correct params",
  "prompt": "Create a Stripe payment intent for $49.99 USD",
  "type": "code",
  "assertions": [
    { "type": "contains", "value": "stripe.paymentIntents.create" },
    { "type": "contains", "value": "amount: 4999" },
    { "type": "contains", "value": "currency: 'usd'" },
    { "type": "not_contains", "value": "stripe.charges.create" },
    { "type": "code_valid", "language": "js" }
  ],
  "source": "https://stripe.com/docs/api/payment_intents/create"
}
```

Notes on writing good evals:
- Prompts should be realistic user requests, not test-sounding queries
- `contains` assertions should target API method names, required params, or key concepts
- `not_contains` should catch deprecated or hallucinated methods
- Each eval should reference a specific source URL from sources.yaml
- Use `code_valid` for any eval of type `code`
