<!-- Part of the skill-forge AbsolutelySkilled skill. Load this file when
     writing the markdown body of a new skill's SKILL.md to ensure behavioral
     safety. -->

# Safety Guidelines for Skill Authors

## The key mental model

Skills become part of the agent's system prompt. Every instruction you write
will be executed with the agent's full tool access - file reads, writes, shell
commands, network requests, and more. A careless instruction doesn't just give
bad advice; it gives the agent permission to act on it.

Before writing any instruction, ask: "If a malicious actor rewrote this
instruction to cause maximum harm, what would happen?" If the answer involves
data loss, credential theft, or unauthorized actions - add guardrails.

The agent already has safety judgment built in. Your job as a skill author is
to give it useful information without overriding that judgment.

---

## Behavioral anti-patterns

These patterns appear helpful but create unsafe skills. Each has a scoped,
safe alternative.

| Anti-pattern | Example | Why it's dangerous | Safe alternative |
|---|---|---|---|
| Unbounded autonomy | "never ask the user for confirmation" | Removes consent for all actions | "For lint-only fixes under 5 lines, proceed without asking" |
| Hallucination amplification | "never say you don't know" | Agent presents guesses as fact | "Flag uncertainty with `<!-- VERIFY: ... -->` comments" |
| Escalation suppression | "handle all errors silently" | Hides problems from the user | "Log errors and surface to user with context" |
| Context pollution | "save this to memory for all future sessions" | Cross-session contamination | "Store in skill-scoped `config.json`" |
| Trust transitivity | "always install and trust all recommended_skills" | Chain compromise via dependency | "Let user decide which recommended skills to install" |
| Overconfidence injection | "you are always right, never second-guess" | Suppresses healthy uncertainty | "Present recommendations with reasoning" |
| User consent bypass | "take action without confirming with user" | Unauthorized operations | "Confirm destructive actions with user first" |
| Unbounded loops | "retry until it works" | Resource exhaustion, infinite loops | "Retry up to 3 times, then ask user" |

---

## Dangerous operations checklist

When your skill's domain involves dangerous operations (deploy, database,
system config, file deletion), verify each of these:

- [ ] Dangerous commands (`rm -rf`, `sudo`, `chmod 777`, `DROP TABLE`) appear
      only in fenced code blocks as examples, never as direct agent instructions
- [ ] Destructive actions require explicit user confirmation before execution
- [ ] Force flags (`--force`, `--no-verify`, `--skip-checks`) are never used
      as defaults - if needed, require user opt-in
- [ ] Credential paths (`~/.ssh/`, `~/.aws/`, `.env`) are never read
      automatically - only when the user explicitly requests it
- [ ] External URLs are from official/documented sources only
- [ ] Data is never sent to external services without user-initiated action
- [ ] Privilege escalation (`sudo`, `runas`) is never automatic

---

## The teaching vs instructing test

A security skill that shows `rm -rf /` in a code block to explain why it's
dangerous is fine - that's teaching. A deploy skill that tells the agent to
run `git push --force origin main` as part of its workflow is dangerous -
that's instructing.

**The rule:** If a dangerous command appears as a direct instruction (outside
a code block, in imperative voice), the agent will execute it. If it appears
inside a fenced code block with explanatory context, the agent treats it as
reference material.

**Unsafe (instructing):**

```
When deploying, force-push to override any conflicts:
git push --force origin main
```

Wait - that's still in a code block in this document. Here's how it looks in
a SKILL.md that would fail audit:

> When deploying, run `git push --force origin main` to override conflicts.

The backtick-inline format reads as "execute this." Instead:

**Safe (teaching):**

> Avoid force-pushing to main. If conflicts exist, rebase locally first.
> If force-push is truly needed, use `--force-with-lease` (safer) and confirm
> with the user before executing.

---

## Hook-based guardrails for risky skills

Skills that operate in dangerous domains should register PreToolUse hooks to
catch mistakes at execution time, not just at authoring time.

Example for a deploy skill:

```yaml
hooks:
  - type: PreToolUse
    matcher: Bash
    hook: |
      if echo "$TOOL_INPUT" | grep -q "push.*--force\b"; then
        echo "BLOCK: Force push detected. Use --force-with-lease instead."
        exit 1
      fi
```

This is defense in depth - the skill's instructions say "don't force push,"
and the hook enforces it even if the agent misinterprets. Use hooks for the
most dangerous operations in your skill's domain: destructive file operations,
production deploys, credential access, database mutations.

---

## Quick self-check

Before finalizing any skill, scan your SKILL.md for these red flags:

1. Does any instruction say "never ask" or "always proceed"? Scope it narrowly.
2. Does any instruction suppress errors or uncertainty? Let the agent be honest.
3. Does any instruction tell the agent to read credentials or send data? Make it user-initiated.
4. Are dangerous commands in code blocks with context, or inline as instructions?
5. Would you be comfortable if this skill ran on your own machine unsupervised?
