<!-- Part of the developer-experience AbsolutelySkilled skill. Load this file when
     working with migration guides, breaking changes, or version upgrades. -->

# Migration Guide Template and Patterns

## Migration guide template

Use this structure for every major version migration guide.

```markdown
# Migrating from v<X> to v<Y>

## Who needs to migrate

<Describe which users are affected. Be specific - "all users" is rarely true.>

- Users of `client.payments.create()` (method signature changed)
- Users with custom retry logic (retry config format changed)
- Node.js 16 users (minimum version is now Node.js 18)

## Timeline

- **v<Y> release date:** YYYY-MM-DD
- **v<X> end of support:** YYYY-MM-DD (security patches only until then)
- **v<X> end of life:** YYYY-MM-DD (no further updates)

## Quick upgrade

For most users, the upgrade is:

  npm install @acme/sdk@<Y>
  npx @acme/migrate v<X>-to-v<Y>  # automated codemod (if available)

## Breaking changes

### 1. <Change title>

**What changed:** <factual description>
**Why:** <motivation - helps developers accept the change>

**Before (v<X>):**
  <old code>

**After (v<Y>):**
  <new code>

**Automated fix:** `npx @acme/migrate <specific-codemod>`
  or
**Manual fix:** <step-by-step instructions>

### 2. <Next change>
...

## Non-breaking changes worth knowing

<Optional: notable improvements that don't require action but developers
should be aware of>

## Verification

After migrating, verify your integration:

  npm test                              # run your test suite
  npx @acme/sdk doctor                  # built-in health check (if available)
  curl https://api.acme.com/v2/health   # verify API connectivity

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `TypeError: client.payments.create is not a function` | Using old method name | Rename to `client.paymentIntents.create()` |
| `AcmeVersionError: Unsupported API version` | SDK and API version mismatch | Set `apiVersion: "2026-01-15"` in constructor |
| ... | ... | ... |

## Getting help

- [GitHub Discussions](link) - ask the community
- [Discord #migration channel](link) - real-time help
- [Support ticket](link) - for blocking issues
```

## Breaking change classification

Not all breaking changes are equal. Classify them to set developer expectations:

| Severity | Description | Example | Communication |
|---|---|---|---|
| **High** | Changes behavior silently (same code, different result) | Default sort order changed | Blog post + email + prominent banner |
| **Medium** | Causes compile/runtime errors (loud failure) | Method renamed, param removed | Changelog + migration guide |
| **Low** | Only affects edge cases or advanced usage | Custom serializer interface changed | Changelog entry with migration note |

High-severity changes need the most communication because developers may not
notice the change until it causes production issues.

## Codemod patterns

Codemods are automated code transformations that handle mechanical migration
tasks. They dramatically reduce migration cost.

### When to provide a codemod
- Method or parameter renames (mechanical find-and-replace)
- Import path changes
- Configuration format changes
- Any change affecting > 100 call sites in a typical codebase

### When NOT to provide a codemod
- Logic changes that require human judgment
- Changes where the old and new patterns aren't 1:1 mappings
- Changes that affect < 5 call sites in a typical codebase

### Codemod implementation options

**JavaScript/TypeScript - jscodeshift:**
```javascript
// transforms/rename-create-payment.js
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  return j(fileInfo.source)
    .find(j.MemberExpression, {
      property: { name: "createPayment" }
    })
    .forEach(path => {
      path.node.property.name = "createPaymentIntent";
    })
    .toSource();
};
```

**Python - libcst:**
```python
import libcst as cst

class RenameCreatePayment(cst.CSTTransformer):
    def leave_Call(self, original_node, updated_node):
        if m.matches(updated_node.func, m.Attribute(attr=m.Name("create_payment"))):
            return updated_node.with_changes(
                func=updated_node.func.with_changes(
                    attr=cst.Name("create_payment_intent")
                )
            )
        return updated_node
```

**CLI wrapper:**
```bash
# Package the codemod as a CLI tool
npx @acme/migrate rename-create-payment --dir ./src
# Output: Transformed 23 files, 47 call sites updated
```

### Codemod testing
- Test against a fixture directory with known input/output pairs
- Include edge cases: dynamic property access, aliased imports, string references
- Run the codemod on your own SDK's test suite as a smoke test

## Multi-version support strategy

When maintaining multiple major versions simultaneously:

### Support matrix

| Version | Status | Support level | End of life |
|---|---|---|---|
| v3.x | Current | Full (features + fixes + security) | - |
| v2.x | Maintenance | Fixes + security only | 2026-12-31 |
| v1.x | End of life | No support | 2025-06-30 |

### Branch strategy
```
main           -> v3.x (current)
release/v2     -> v2.x (maintenance - cherry-pick critical fixes)
release/v1     -> v1.x (archived, no changes)
```

### Documentation strategy
- Default docs show the current version
- Provide a version switcher for at least current and previous major
- Archive older versions at a stable URL (e.g., `/docs/v1/`)
- Never delete old docs - developers on legacy versions need them

## Communication channels for breaking changes

Use multiple channels based on change severity:

| Channel | When | Audience |
|---|---|---|
| Changelog entry | Every breaking change | Developers reading release notes |
| Migration guide | Every major version | Developers upgrading |
| Blog post | High-severity changes | Broader developer community |
| Email to registered devs | High-severity changes | Active users |
| In-SDK deprecation warning | One version before removal | Developers running the code |
| Dashboard banner | High-severity API changes | Developers with active integrations |
| Status page notice | API version sunset | All API consumers |

### Communication timeline
1. **T-6 months**: Announce upcoming major version in blog + email
2. **T-3 months**: Release beta/RC with migration guide
3. **T-0**: Release major version, begin previous version maintenance period
4. **T+6 months**: Send reminder emails about previous version EOL
5. **T+12 months**: End of life for previous version

## Migration checklist for SDK authors

Before releasing a major version:

- [ ] Every breaking change has a before/after code example
- [ ] Migration guide is written and reviewed by someone who didn't make the changes
- [ ] Codemods exist for all mechanical changes
- [ ] Codemods are tested against real-world codebases (not just unit tests)
- [ ] Previous version has a documented end-of-support date
- [ ] Previous version docs are archived at a stable URL
- [ ] Deprecation warnings were shipped at least one minor version ago
- [ ] Changelog is complete with all breaking changes categorized
- [ ] Blog post / email / announcement is drafted
- [ ] Support team is briefed on common migration questions
