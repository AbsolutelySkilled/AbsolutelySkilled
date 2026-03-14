<!-- Part of the technical-writing AbsolutelySkilled skill. Load this file when
     working with tutorials, getting-started guides, or how-to content. -->

# Tutorials

## The tutorial contract

A tutorial makes a promise: "Follow these steps and you will have a working
[thing]." Every element of the tutorial must serve that promise. If a paragraph
does not advance the reader toward the outcome, cut it.

## Structure template

```markdown
# How to [accomplish specific goal]

[1-2 sentences: what the reader will build/achieve and why it matters.]

## Prerequisites

- [Tool] version [X] or later ([install link])
- [Account/service] with [specific access level]
- Familiarity with [concept] (see [link] if new)

## Step 1: [Action verb] + [object]

[1-2 sentences of context if needed.]

```bash
[exact command]
```

[Expected output or how to verify the step worked.]

## Step 2: ...

## Verify it works

[How to confirm the entire tutorial succeeded - a curl command, a browser
check, a test run.]

## Next steps

- [Link to related tutorial]
- [Link to reference docs for deeper customization]
- [Link to production deployment guide]
```

## Writing rules for tutorials

### One action per step

Each numbered step should contain exactly one action. If a step requires the
reader to do two things, split it into two steps. This makes it easy to identify
where something went wrong.

**Bad:** "Install the CLI and configure your credentials"
**Good:** Step 3 - Install the CLI. Step 4 - Configure your credentials.

### Show the expected output

After every command or action, tell the reader what they should see. This builds
confidence and helps them diagnose problems.

```markdown
Run the migration:

```bash
npx prisma migrate dev --name init
```

You should see output like:
```
Applying migration `20250115_init`
Migration applied successfully.
```
```

### Progressive disclosure

Start with the simplest possible example, then layer complexity:

1. **Quickstart** - Minimal viable setup (5 minutes)
2. **Customization** - Configuration options
3. **Production** - Security, scaling, monitoring

Do not front-load the tutorial with configuration options. Get the reader to a
working state first, then teach customization.

### Prerequisites must be exhaustive

List every prerequisite including:
- Exact version numbers (not "recent version")
- Links to installation instructions
- Required accounts or API keys
- Prior knowledge (with links for those who lack it)

### Avoid branching paths

A tutorial should have one path. If different operating systems need different
commands, use tabs or callout boxes - not "if you're on Linux do X, if you're on
Mac do Y" scattered throughout the text.

## Testing tutorials

Tutorials must be tested. The author should follow their own tutorial from scratch
on a clean environment at least once before publishing. Ideally, automate tutorial
testing:

- Use a Dockerfile that starts from a clean base image
- Run the tutorial commands as a script
- Verify the expected outputs

## Common tutorial mistakes

| Mistake | Fix |
|---------|-----|
| Assuming tool is installed | Add to prerequisites with install link |
| Skipping "boring" steps | Include every step, even `cd` into directories |
| No expected output shown | Add expected output after every command |
| Tutorial only works on author's machine | Test on a clean environment |
| Mixing tutorial with reference | Keep tutorials focused on one path; link to reference for options |
| Starting with theory | Start with "do this" and explain "why" after the reader has a working result |
