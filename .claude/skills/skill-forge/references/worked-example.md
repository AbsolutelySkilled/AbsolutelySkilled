<!-- Part of the skill-forge AbsolutelySkilled skill. Load this file for
     a complete end-to-end worked example of skill generation. -->

# Worked Example: Resend

**Input:** `https://github.com/resendlabs/resend-node`

## Research plan (Phase 1)

1. Fetch `README.md` - install, init, send() signature
2. Fetch `https://resend.com/docs/introduction` - overview
3. Fetch `https://resend.com/docs/api-reference/introduction` - API reference
4. Check `https://resend.com/llms.txt` - does it exist?
5. Fetch `https://resend.com/docs/api-reference/emails/send` - send endpoint
6. Fetch changelog - any recent breaking changes?

## Output folder

```
resend/
  SKILL.md
  sources.yaml
  evals.json
  references/
    api.md
```

Category: `communication`

## Key things to capture in SKILL.md

- `resend.emails.send()` signature and required params (`from`, `to`, `subject`, `html`)
- API key in `Authorization: Bearer` header
- Batch sending via `resend.batch.send()`
- Webhook events: `email.sent`, `email.delivered`, `email.bounced`
- Rate limits (if documented)
- Idempotency key support via `Idempotency-Key` header

## Common tasks section would include

1. Send a single email
2. Send a batch of emails
3. Send email with attachments
4. Retrieve email status
5. Handle webhook events
6. Manage API keys

## Gotcha to flag

Resend changed their Node SDK API in v2. If docs show both v1 and v2
patterns, note the version difference and flag for human review:

```markdown
<!-- VERIFY: Could not confirm if v1 `resend.sendEmail()` is still
     supported. v2 uses `resend.emails.send()`. Source:
     https://resend.com/docs/api-reference/emails/send -->
```

## Example eval for this skill

```json
{
  "id": "eval-001",
  "description": "Agent can send an email with Resend",
  "prompt": "Send a welcome email to user@example.com using Resend",
  "type": "code",
  "assertions": [
    { "type": "contains", "value": "resend.emails.send" },
    { "type": "contains", "value": "to:" },
    { "type": "not_contains", "value": "resend.sendEmail" },
    { "type": "code_valid", "language": "js" }
  ],
  "source": "https://resend.com/docs/api-reference/emails/send"
}
```
