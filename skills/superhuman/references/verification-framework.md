<!-- Part of the Superhuman AbsolutelySkilled skill. Load this file when the agent needs guidance on TDD verification per sub-task, verification signals, integration testing, and failure handling. -->

# Verification Framework

Every Superhuman sub-task must prove it works before closing. This reference covers the TDD workflow, verification signals, integration testing, and the verification report format.

---

## TDD Workflow Per Sub-task

### The Red-Green-Refactor Cycle

```
RED:      Write tests that describe the desired behavior -> tests FAIL
GREEN:    Write the minimum code to make tests pass -> tests PASS
REFACTOR: Clean up the code while keeping tests green -> tests PASS
```

### Step-by-Step

1. **Read the acceptance criteria** from the task's execution plan
2. **Write test file(s)** that encode each acceptance criterion as a test case
3. **Run tests** - confirm they FAIL (red phase proves tests are meaningful)
4. **Implement the code** to make each test pass, one at a time
5. **Run tests** - confirm they PASS (green phase)
6. **Refactor** if needed - rename, extract, simplify - while keeping tests green
7. **Final run** - all tests pass, lint clean, types check

### Test Categories Per Sub-task

| Category | What to Test | Priority |
|----------|-------------|----------|
| Happy path | Primary use case works correctly | Required |
| Edge cases | Boundary values, empty inputs, nulls | Required |
| Error handling | Invalid inputs, failure modes | Required |
| Integration points | Interactions with other components | If applicable |

### Test Naming Convention
Follow the project's existing convention. If none exists, use:
```
describe("{ComponentOrFunction}", () => {
  it("should {expected behavior} when {condition}", () => {
    // ...
  });
});
```

---

## Verification Signals

Every completed sub-task must pass ALL applicable signals before closing.

### Signal Matrix

| Signal | Command | Required | Notes |
|--------|---------|----------|-------|
| Tests | `npm test` / `pytest` / project test cmd | Always | All new and existing tests must pass |
| Lint | `npm run lint` / `eslint` / project lint cmd | Always | Zero new warnings or errors |
| Type Check | `tsc --noEmit` / `mypy` / `pyright` | If typed | No new type errors |
| Build | `npm run build` / project build cmd | If applicable | Project must still build |
| Format | `prettier --check` / `black --check` | If configured | Code matches project format |

### Signal Priority
If time-constrained, verify in this order:
1. Tests (non-negotiable)
2. Build (catch compile/bundling errors)
3. Type check (catch type mismatches)
4. Lint (catch style/convention issues)
5. Format (lowest priority, auto-fixable)

### Detecting Project Commands
Before running verification, detect what's available:
1. Check `package.json` scripts for `test`, `lint`, `build`, `typecheck`
2. Check for `Makefile`, `pyproject.toml`, `Cargo.toml` for project-specific commands
3. Check for CI config (`.github/workflows/`, `.gitlab-ci.yml`) to see what CI runs
4. If nothing is configured, at minimum run the test file directly

---

## Integration Verification

### When to Run Integration Checks
After each wave completes, run integration verification if:
- Tasks in the wave have shared dependencies
- Tasks in the wave create interfaces consumed by the next wave
- The wave includes both implementation and test tasks

### Integration Check Protocol

1. **Import Resolution**
   - Verify all cross-file imports resolve
   - Check that types exported by one task match types expected by another
   - Run `tsc --noEmit` or equivalent to catch import issues

2. **Combined Test Run**
   - Run the full test suite (not just new tests)
   - If full suite is too slow, run tests for all files modified in this wave

3. **Build Verification**
   - Run the project build to catch bundling/compilation issues
   - Check for circular dependency warnings

4. **Runtime Smoke Test** (if applicable)
   - Start the application/server
   - Hit the key endpoints or render the key pages
   - Verify no runtime errors in console

### Cross-Wave Integration
After the final wave, before CONVERGE:
- Run the FULL test suite
- Run the FULL build
- Verify no regressions in existing functionality

---

## Failure Handling

### Failure Categories and Responses

| Failure Type | Likely Cause | Response |
|---|---|---|
| Test fails (new test) | Implementation bug | Fix the code, re-run (up to 2 retries) |
| Test fails (existing test) | Regression introduced | Identify what broke it, fix without changing the test |
| Lint error | Code style violation | Auto-fix if possible, manual fix otherwise |
| Type error | Type mismatch | Fix the types - don't use `any` or `# type: ignore` |
| Build failure | Import error, syntax error | Fix the root cause, re-build |
| Runtime error | Logic bug, missing dependency | Debug, fix, re-verify |

### Retry Budget
- Each sub-task gets a maximum of 2 retry attempts
- Each retry includes the previous failure context in the agent prompt
- If all retries are exhausted, the task is marked `failed`

### Escalation Protocol
When a task is marked `failed`:
1. Write a failure summary to the board including:
   - What was attempted
   - What failed and why
   - All error outputs from each attempt
2. Flag the task for user attention
3. Continue with non-dependent tasks
4. Do NOT attempt workarounds that bypass tests or checks

### What NOT to Do on Failure
- Do NOT suppress or skip failing tests
- Do NOT add `@ts-ignore`, `// eslint-disable`, or `# type: ignore` to pass checks
- Do NOT reduce test coverage to make the suite pass
- Do NOT modify existing passing tests to accommodate bugs
- Do NOT mark a task as "done" if any verification signal fails

---

## Verification Report Format

Each sub-task's verification results are recorded on the board in this format:

```
### Verification: SH-{id}
- Status: PASS | FAIL
- Tests: {passed}/{total} passing ({new_tests} new tests added)
- Lint: clean | {N} issues
- Type Check: pass | {N} errors
- Build: pass | fail
- Retries Used: {N}/2
- Notes: {any relevant context}
```

### Example - Passing Task
```
### Verification: SH-003
- Status: PASS
- Tests: 24/24 passing (8 new tests added)
- Lint: clean
- Type Check: pass
- Build: pass
- Retries Used: 0/2
- Notes: All acceptance criteria verified
```

### Example - Failed Task
```
### Verification: SH-006
- Status: FAIL
- Tests: 18/21 passing (3 failures in notification delivery tests)
- Lint: clean
- Type Check: pass
- Build: pass
- Retries Used: 2/2
- Notes: Email service mock not matching production API response format.
  Needs user input on correct response schema. See error log below.
  Error: Expected {status: "sent"} but received {status: "queued", id: "..."}
```
