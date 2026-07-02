<!-- Part of the `absolute` skill (simplify command). Load this file IN ADDITION
     to the language reference whenever test files are in scope (*test*, *spec*,
     *_test.go, test_*.py, *.test.*, *.spec.*). -->

# Test Simplification Guide

Deep opinions for simplifying test code. These supplement the language reference
and the universal catalog -- apply all. When project config (a test lint rule,
CLAUDE.md) contradicts anything here, project config wins.

**Test files are the most conservative scope in this skill.** Verbose test setup
is often intentional, and "redundant" assertions frequently cover distinct edge
cases. NEVER remove an assertion, weaken a check, or reduce coverage to make a
test shorter. The goal is clearer tests that assert exactly the same things.
When unsure whether two assertions overlap, keep both and flag in the summary.

**Hard rule: never change what a test verifies.** Same inputs, same assertions,
same failure conditions. If a simplification could let a broken implementation
pass, do not make it.

---

## Structure: Arrange–Act–Assert

Group each test into arrange (setup), act (the call under test), assert
(expectations), separated by blank lines. Don't interleave assertions between
setup steps unless the ordering is the thing being tested.

```js
// Before -- tangled
const user = makeUser()
expect(user.active).toBe(false)
user.activate()
const log = getLog()
expect(user.active).toBe(true)
expect(log).toContain('activated')

// After -- arrange / act / assert
const user = makeUser()

user.activate()

expect(user.active).toBe(true)
expect(getLog()).toContain('activated')
```

---

## One Concept Per Test

A test that exercises several unrelated behaviors is hard to read and gives a
useless failure message. Prefer splitting by behavior -- BUT this adds tests,
which is a structural change: flag it in the summary rather than splitting
silently, unless the split is obvious and local.

Do NOT merge distinct tests into one to "reduce count" -- that loses the
per-behavior failure signal.

---

## Table-Driven / Parameterized Tests

When several tests differ only in input and expected output, collapse them into
one parameterized/table-driven test. This is a genuine simplification -- same
assertions, less duplication.

```go
// Before -- three near-identical tests
func TestAddPositive(t *testing.T) { if Add(1, 2) != 3 { t.Fatal() } }
func TestAddZero(t *testing.T)     { if Add(0, 0) != 0 { t.Fatal() } }
func TestAddNegative(t *testing.T) { if Add(-1, -1) != -2 { t.Fatal() } }

// After -- table-driven
func TestAdd(t *testing.T) {
	cases := []struct {
		name     string
		a, b, want int
	}{
		{"positive", 1, 2, 3},
		{"zero", 0, 0, 0},
		{"negative", -1, -1, -2},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if got := Add(c.a, c.b); got != c.want {
				t.Errorf("Add(%d,%d) = %d, want %d", c.a, c.b, got, c.want)
			}
		})
	}
}
```

Keep a `name`/label per case so failures identify the row. Do NOT table-ify tests
whose bodies genuinely differ -- forcing divergent logic into one loop with `if`
branches is worse than separate tests.

---

## Setup & Fixtures

- **Hoist truly shared setup** into `beforeEach`/`setUp`/`TestMain` when every
  test uses it identically -- but only what ALL tests share. Setup used by a
  subset belongs in those tests, not a shared hook (hidden setup hurts readability).
- **Builder/factory over repeated literals** -- if every test constructs the same
  object with tiny variations, a `makeUser({ ...overrides })` helper is clearer.
  Do not build a factory for one use.
- **Do not remove setup you can't prove is unused** -- a fixture may exist for a
  side effect (seeding, env), not just its return value.

---

## Assertions

- **Prefer specific matchers** -- `expect(x).toEqual([1,2])` over
  `expect(x.length).toBe(2)` + element checks, when the specific matcher asserts
  the same or more.
- **Do not weaken** -- replacing `toEqual` with `toContain`, or `assertEqual` with
  `assertTrue`, usually loosens the check. Never trade a strict assertion for a
  looser one to "simplify".
- **Keep negative/edge assertions** -- an assertion that looks redundant may pin a
  regression (e.g. asserting a field is *unchanged*). When in doubt, keep it.

---

## Mocking

- **Remove unused mocks/stubs** -- a mock that's set up but never invoked or
  verified is dead setup. Confirm it isn't providing a needed default first.
- **Prefer real objects over mocks** for simple, deterministic collaborators --
  but converting a mock to a real dependency can change what the test isolates.
  That's a behavior change in intent; flag it rather than doing it silently.
- **Do not delete verification** (`verify(...)`, `assert_called_with`) to shorten
  -- it's an assertion.

---

## Anti-Patterns to Avoid When Simplifying Tests

| Do NOT do this | Why |
|---|---|
| Remove an assertion that looks redundant | It may cover a distinct edge case / regression |
| Weaken a matcher (`toEqual` → `toContain`) | Loosens the check, lets bugs through |
| Merge distinct tests to cut count | Loses per-behavior failure signal |
| Table-ify tests whose bodies really differ | `if` branches in a loop are worse than separate tests |
| Hoist subset-only setup into a global hook | Hidden setup obscures what each test needs |
| Delete a mock/fixture without proving it's unused | It may seed state or provide a default |
| Rename test fixtures/data for "clarity" | Can break other tests referencing them; low ROI |
| Convert a mock to a real dependency silently | Changes what the test isolates -- flag it |
