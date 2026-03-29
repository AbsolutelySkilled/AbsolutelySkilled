#!/usr/bin/env bash
# Validates the structure and quality of a generated skill directory.
# Usage: ./validate-skill.sh <path-to-skill-dir>
#
# Exit codes:
#   0 - all checks passed
#   1 - one or more checks failed

set -uo pipefail

SKILL_DIR="${1:?Usage: validate-skill.sh <path-to-skill-dir>}"
ERRORS=0
WARNINGS=0

red()    { printf "\033[31m%s\033[0m\n" "$1"; }
yellow() { printf "\033[33m%s\033[0m\n" "$1"; }
green()  { printf "\033[32m%s\033[0m\n" "$1"; }

fail()  { red    "FAIL: $1"; ((ERRORS++)); }
warn()  { yellow "WARN: $1"; ((WARNINGS++)); }
pass()  { green  "PASS: $1"; }

echo "Validating skill at: $SKILL_DIR"
echo "---"

# 1. SKILL.md exists
if [[ -f "$SKILL_DIR/SKILL.md" ]]; then
  pass "SKILL.md exists"
else
  fail "SKILL.md not found"
  echo "Cannot continue without SKILL.md"
  exit 1
fi

SKILL_FILE="$SKILL_DIR/SKILL.md"
LINE_COUNT=$(wc -l < "$SKILL_FILE" | tr -d ' ')

# 2. Line count check
if [[ "$LINE_COUNT" -gt 500 ]]; then
  fail "SKILL.md is $LINE_COUNT lines (hard limit: 500)"
elif [[ "$LINE_COUNT" -gt 300 ]]; then
  warn "SKILL.md is $LINE_COUNT lines (target: under 300, consider moving detail to references/)"
else
  pass "SKILL.md is $LINE_COUNT lines"
fi

# 3. Frontmatter exists
if head -1 "$SKILL_FILE" | grep -q '^---'; then
  pass "Frontmatter detected"
else
  fail "No YAML frontmatter (must start with ---)"
fi

# 4. Required frontmatter fields
for field in name version description; do
  if grep -q "^${field}:" "$SKILL_FILE"; then
    pass "Frontmatter field: $field"
  else
    fail "Missing frontmatter field: $field"
  fi
done

# 5. Description is not too vague (must be > 50 chars)
DESC_LINE=$(grep -A5 '^description:' "$SKILL_FILE" | head -6 | tr '\n' ' ')
DESC_LEN=${#DESC_LINE}
if [[ "$DESC_LEN" -lt 50 ]]; then
  fail "Description too short ($DESC_LEN chars) - must be a specific trigger condition"
else
  pass "Description length: $DESC_LEN chars"
fi

# 6. Check for VERIFY flags (informational)
VERIFY_COUNT=$(grep -c "VERIFY:" "$SKILL_FILE" 2>/dev/null || echo 0)
if [[ "$VERIFY_COUNT" -gt 5 ]]; then
  warn "$VERIFY_COUNT VERIFY flags (target: < 5) - needs more research"
elif [[ "$VERIFY_COUNT" -gt 0 ]]; then
  yellow "INFO: $VERIFY_COUNT VERIFY flag(s) for human review"
else
  pass "No VERIFY flags"
fi

# 8. evals.json exists and is valid JSON
if [[ -f "$SKILL_DIR/evals.json" ]]; then
  if python3 -c "import json; json.load(open('$SKILL_DIR/evals.json'))" 2>/dev/null; then
    EVAL_COUNT=$(python3 -c "import json; d=json.load(open('$SKILL_DIR/evals.json')); print(len(d.get('evals', [])))")
    if [[ "$EVAL_COUNT" -lt 10 ]]; then
      warn "Only $EVAL_COUNT evals (target: 10-15)"
    else
      pass "evals.json: $EVAL_COUNT evals"
    fi
  else
    fail "evals.json is not valid JSON"
  fi
else
  fail "evals.json not found"
fi

# 9. references/ files have header comments
if [[ -d "$SKILL_DIR/references" ]]; then
  for ref_file in "$SKILL_DIR/references"/*.md; do
    [[ -f "$ref_file" ]] || continue
    if head -1 "$ref_file" | grep -q '<!-- Part of'; then
      pass "Header comment: $(basename "$ref_file")"
    else
      fail "Missing header comment in $(basename "$ref_file")"
    fi
  done
fi

# 10. Check for common anti-patterns in generated skills
if grep -qi "as an ai\|I cannot\|I don't have" "$SKILL_FILE"; then
  fail "SKILL.md contains AI-speak (as an AI, I cannot, etc.)"
fi

if grep -qi "it.s important to note\|it should be noted\|please note that" "$SKILL_FILE"; then
  warn "SKILL.md contains filler phrases - tighten the prose"
fi

# 11. Behavioral safety anti-patterns
# Only flag patterns that appear as direct instructions, not in "avoid" / "don't" / example context.
# Lines containing quotes, negation words, or checklist markers are discussing anti-patterns, not instructing them.
SAFE_CONTEXT='avoid\|don.t\|do not\|unsafe\|anti-pattern\|dangerous\|example\|not safe\|is not\|Gotcha\|checklist\|".*"\|\[ \]'
UNSAFE_PATTERNS=(
  "never ask.*user\|never ask.*confirmation\|never ask.*permission"
  "do whatever it takes\|take any action necessary"
  "handle.*errors.*silently\|never escalate"
  "never say.*don.t know\|never say.*not sure\|present.*guess.*as fact"
  "save.*memory.*all future\|from now on.*all conversations"
  "always.*trust.*recommended\|auto.*install.*skills"
  "you are always right\|never second.guess"
)
for pattern in "${UNSAFE_PATTERNS[@]}"; do
  MATCHES=$(grep -ni "$pattern" "$SKILL_FILE" 2>/dev/null | grep -vi "$SAFE_CONTEXT" || true)
  if [[ -n "$MATCHES" ]]; then
    fail "Behavioral safety: found unsafe pattern matching '$pattern'"
  fi
done

# 12. Dangerous commands outside code blocks
# Extract non-code-block content from SKILL.md
NON_CODE_CONTENT=$(awk '/^```/{skip=!skip; next} !skip{print}' "$SKILL_FILE")
DANGEROUS_CMDS="rm -rf\|sudo \|chmod 777\|--no-verify\|DROP TABLE\|mkfs\|dd if="
if echo "$NON_CODE_CONTENT" | grep -qi "$DANGEROUS_CMDS"; then
  warn "Dangerous commands found outside code blocks - verify they include user confirmation"
fi

# 13. Data exfiltration patterns
if echo "$NON_CODE_CONTENT" | grep -qi "POST.*http\|send.*data.*to\|upload.*to.*http\|curl.*-X.*POST\|webhook.*url"; then
  warn "Potential data exfiltration: instructions to send data to external URLs"
fi

# 14. Unicode anomalies (zero-width chars, RTL overrides)
if grep -P '[\x{200B}\x{200C}\x{200D}\x{FEFF}\x{2060}-\x{2064}\x{202A}-\x{202E}]' "$SKILL_FILE" 2>/dev/null; then
  fail "Unicode anomaly: zero-width or directional override characters detected in SKILL.md"
fi
if [[ -d "$SKILL_DIR/references" ]]; then
  for ref_file in "$SKILL_DIR/references"/*; do
    [[ -f "$ref_file" ]] || continue
    if grep -P '[\x{200B}\x{200C}\x{200D}\x{FEFF}\x{2060}-\x{2064}\x{202A}-\x{202E}]' "$ref_file" 2>/dev/null; then
      fail "Unicode anomaly in $(basename "$ref_file")"
    fi
  done
fi

# 15. Reference file size
if [[ -d "$SKILL_DIR/references" ]]; then
  for ref_file in "$SKILL_DIR/references"/*.md; do
    [[ -f "$ref_file" ]] || continue
    REF_LINES=$(wc -l < "$ref_file" | tr -d ' ')
    if [[ "$REF_LINES" -gt 400 ]]; then
      fail "$(basename "$ref_file") is $REF_LINES lines (limit: 400)"
    fi
  done
fi

echo "---"
echo "Results: $ERRORS error(s), $WARNINGS warning(s)"

if [[ "$ERRORS" -gt 0 ]]; then
  red "Validation FAILED"
  exit 1
else
  green "Validation PASSED"
  exit 0
fi
