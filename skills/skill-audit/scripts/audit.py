#!/usr/bin/env python3
"""
skill-audit mechanical pre-scan

Deterministic checks that AI should not waste time on:
- Unicode anomalies (zero-width chars, RTL overrides)
- Encoded content (base64/hex blocks)
- Structural validation (frontmatter, evals, file sizes)
- Supply chain checks (name consistency, orphaned refs, dependency verification)

Usage: python3 audit.py <skill-directory> [--batch]
Output: JSON to stdout
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

# --- Unicode codepoints to detect ---
SUSPICIOUS_UNICODE = set(
    "\u200B\u200C\u200D"  # zero-width space, non-joiner, joiner
    "\uFEFF"              # BOM / zero-width no-break space
    "\u2060\u2061\u2062\u2063\u2064"  # word joiner, invisible separators
    "\u202A\u202B\u202C\u202D\u202E"  # LTR/RTL embedding and overrides
)

# Base64 pattern: 40+ base64 chars, not part of a URL or hash
BASE64_RE = re.compile(r"(?<![a-zA-Z0-9/+=:._-])[A-Za-z0-9+/]{40,}={0,2}(?![a-zA-Z0-9/+=])")
URL_OR_HASH_RE = re.compile(r"https?://|sha[0-9]+:|[0-9a-f]{40,}")

REQUIRED_FRONTMATTER = ["version", "description", "category"]
TEXT_EXTENSIONS = {".md", ".txt", ".yaml", ".yml", ".sh", ".py", ".js", ".ts"}


def parse_frontmatter(skill_md_path: Path) -> dict:
    """Extract YAML frontmatter from SKILL.md. Works with or without PyYAML."""
    content = skill_md_path.read_text(encoding="utf-8", errors="replace")
    lines = content.split("\n")
    if not lines or lines[0].strip() != "---":
        return {}
    end = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end == -1:
        return {}
    fm_text = "\n".join(lines[1:end])
    if yaml:
        try:
            return yaml.safe_load(fm_text) or {}
        except Exception:
            pass
    # Fallback: simple key-value parsing without PyYAML
    result = {}
    for line in lines[1:end]:
        if ":" in line and not line.startswith(" ") and not line.startswith("\t"):
            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip()
            if val.startswith("[") and val.endswith("]"):
                result[key] = [v.strip().strip("'\"") for v in val[1:-1].split(",") if v.strip()]
            elif val == ">" or val == "|":
                result[key] = ""  # multiline, just mark as present
            elif val:
                result[key] = val.strip("'\"")
            else:
                result[key] = None
    # Check for maintainers as a block
    in_maintainers = False
    maintainers = []
    for line in lines[1:end]:
        if line.startswith("maintainers:"):
            in_maintainers = True
            continue
        if in_maintainers:
            if line.startswith("  ") or line.startswith("\t"):
                maintainers.append(line.strip())
            else:
                in_maintainers = False
    if maintainers:
        result["maintainers"] = maintainers
    return result


def collect_text_files(skill_dir: Path) -> list[Path]:
    """Collect all text files in the skill directory."""
    files = []
    for root, _, filenames in os.walk(skill_dir):
        for fname in filenames:
            fpath = Path(root) / fname
            if fpath.suffix in TEXT_EXTENSIONS:
                files.append(fpath)
    return files


def scan_skill(skill_dir: Path, registry_dir: Path | None = None) -> dict:
    """Run all mechanical checks against a single skill. Returns scan result dict."""
    skill_dir = skill_dir.resolve()
    skill_name = skill_dir.name
    findings = []

    def add(severity, category, rule, file, line=None, evidence="", message=""):
        findings.append({
            "severity": severity,
            "category": category,
            "rule": rule,
            "file": file,
            "line": line,
            "evidence": evidence[:200] if evidence else "",
            "message": message,
        })

    # --- Structural checks ---

    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        add("high", "structural", "missing-skill-md", skill_name,
            message="No SKILL.md found - not a valid skill")
        return {"name": skill_name, "path": str(skill_dir), "findings": findings}

    frontmatter = parse_frontmatter(skill_md)

    for field in REQUIRED_FRONTMATTER:
        if field not in frontmatter or not frontmatter[field]:
            add("low", "structural", f"missing-metadata-{field}", "SKILL.md",
                message=f"Missing required frontmatter field: {field}")

    if "maintainers" not in frontmatter or not frontmatter.get("maintainers"):
        add("medium", "supply-chain", "missing-maintainers", "SKILL.md",
            message="No maintainers field - skill provenance cannot be verified")

    if not (skill_dir / "evals.json").exists():
        add("medium", "structural", "missing-evals", skill_name,
            message="No evals.json found - skill quality cannot be verified")

    # Name consistency
    fm_name = frontmatter.get("name", "")
    if fm_name and fm_name != skill_name:
        add("medium", "structural", "name-mismatch", "SKILL.md",
            evidence=f"{fm_name} vs {skill_name}",
            message="Frontmatter name does not match directory name")

    # License check
    if "license" not in frontmatter:
        add("low", "structural", "missing-license", "SKILL.md",
            message="No license field in frontmatter - legal risk for consumers")

    # --- File size checks ---

    skill_md_lines = skill_md.read_text(encoding="utf-8", errors="replace").split("\n")
    if len(skill_md_lines) > 500:
        add("low", "structural", "oversized-skill-md", "SKILL.md",
            evidence=f"{len(skill_md_lines)} lines",
            message="SKILL.md exceeds 500-line recommended limit")

    refs_dir = skill_dir / "references"
    if refs_dir.is_dir():
        for ref in refs_dir.iterdir():
            if ref.is_file():
                ref_lines = ref.read_text(encoding="utf-8", errors="replace").split("\n")
                rel = f"references/{ref.name}"
                if len(ref_lines) > 400:
                    add("low", "structural", "oversized-reference", rel,
                        evidence=f"{len(ref_lines)} lines",
                        message="Reference file exceeds 400-line recommended limit")

    # --- Unicode anomaly detection ---

    for fpath in collect_text_files(skill_dir):
        rel = str(fpath.relative_to(skill_dir))
        try:
            lines = fpath.read_text(encoding="utf-8", errors="replace").split("\n")
        except Exception:
            continue
        for i, line in enumerate(lines, 1):
            if any(ch in SUSPICIOUS_UNICODE for ch in line):
                add("critical", "injection", "unicode-smuggling", rel, line=i,
                    evidence=line[:80],
                    message="Zero-width or directional override characters detected - may hide malicious content")

    # --- Encoded content detection ---

    for fpath in collect_text_files(skill_dir):
        if fpath.suffix not in {".md", ".txt"}:
            continue
        rel = str(fpath.relative_to(skill_dir))
        try:
            lines = fpath.read_text(encoding="utf-8", errors="replace").split("\n")
        except Exception:
            continue
        for i, line in enumerate(lines, 1):
            if BASE64_RE.search(line) and not URL_OR_HASH_RE.search(line):
                add("high", "injection", "encoded-content", rel, line=i,
                    evidence=line[:80],
                    message="Suspicious base64-encoded block - may hide instructions or payloads")

    # --- Orphaned reference check ---

    if refs_dir.is_dir():
        skill_content = skill_md.read_text(encoding="utf-8", errors="replace")
        for ref in refs_dir.iterdir():
            if ref.is_file() and ref.name not in skill_content:
                add("info", "structural", "orphaned-reference", f"references/{ref.name}",
                    message="Reference file not linked from SKILL.md")

    # --- Supply chain: dependency verification ---

    recommended = frontmatter.get("recommended_skills", [])
    if recommended and registry_dir and registry_dir.is_dir():
        for dep in recommended:
            dep_path = registry_dir / dep / "SKILL.md"
            if not dep_path.exists():
                add("medium", "supply-chain", "phantom-dependency", "SKILL.md",
                    evidence=dep,
                    message=f'Recommended skill "{dep}" not found in registry - potential dependency confusion')

    # --- Empty skill check ---

    body_lines = [l for l in skill_md_lines if l.strip()
                  and not l.strip().startswith("#") and not l.strip() == "---"]
    # Skip frontmatter lines
    in_fm = False
    actionable = []
    for l in skill_md_lines:
        if l.strip() == "---":
            in_fm = not in_fm
            continue
        if in_fm:
            continue
        if l.strip() and not l.strip().startswith("#"):
            actionable.append(l)
    if len(actionable) < 10:
        add("medium", "structural", "empty-skill", "SKILL.md",
            evidence=f"{len(actionable)} actionable lines",
            message="SKILL.md has very little actionable content")

    return {"name": skill_name, "path": str(skill_dir), "findings": findings}


AGENT_FIELDS = {"tools", "disallowedTools", "permissionMode", "maxTurns", "initialPrompt", "background", "isolation"}


def is_agent_definition(frontmatter: dict) -> bool:
    """Check if frontmatter contains agent-specific fields (not a skill)."""
    return bool(AGENT_FIELDS & set(frontmatter.keys()))


def scan_agent_definition(file_path: Path, registry_dir: Path | None = None) -> dict:
    """Run agent-specific mechanical checks against an agent definition file."""
    file_path = file_path.resolve()
    agent_name = file_path.stem
    findings = []

    def add(severity, category, rule, file, line=None, evidence="", message=""):
        findings.append({
            "severity": severity,
            "category": category,
            "rule": rule,
            "file": file,
            "line": line,
            "evidence": evidence[:200] if evidence else "",
            "message": message,
        })

    if not file_path.exists():
        add("high", "structural", "missing-file", agent_name,
            message="Agent definition file not found")
        return {"name": agent_name, "path": str(file_path), "type": "agent", "findings": findings}

    frontmatter = parse_frontmatter(file_path)
    rel = file_path.name

    # --- Permission mode checks ---

    perm_mode = frontmatter.get("permissionMode", "")
    if perm_mode == "bypassPermissions":
        add("critical", "agent-perms", "bypass-permissions", rel,
            evidence=f"permissionMode: {perm_mode}",
            message="Agent bypasses ALL permission checks - unrestricted execution")
    elif perm_mode in ("auto", "dontAsk", "acceptEdits"):
        add("medium", "agent-perms", "non-default-permission-mode", rel,
            evidence=f"permissionMode: {perm_mode}",
            message=f"Non-default permission mode '{perm_mode}' - verify this is intended")

    # --- Tool access checks ---

    tools = frontmatter.get("tools", "")
    disallowed = frontmatter.get("disallowedTools", "")
    if tools:
        tool_list = [t.strip() for t in tools.split(",")] if isinstance(tools, str) else tools
        dangerous_tools = {"Bash", "Write", "Edit"}
        has_dangerous = dangerous_tools & set(tool_list)
        if has_dangerous and not disallowed:
            add("high", "agent-perms", "no-disallowed-tools", rel,
                evidence=f"tools: {tools}",
                message=f"Agent has {', '.join(has_dangerous)} without disallowedTools restrictions")

    # --- Bypass + Bash combo ---

    if perm_mode == "bypassPermissions" and tools:
        tool_list = [t.strip() for t in tools.split(",")] if isinstance(tools, str) else tools
        if "Bash" in tool_list:
            add("critical", "agent-perms", "bypass-plus-bash", rel,
                evidence=f"permissionMode: bypassPermissions + tools includes Bash",
                message="Critical combination: unrestricted permissions with arbitrary command execution")

    # --- maxTurns checks ---

    max_turns = frontmatter.get("maxTurns")
    if max_turns is not None:
        try:
            turns = int(max_turns)
            if turns > 50:
                add("medium", "agent-perms", "high-max-turns", rel,
                    evidence=f"maxTurns: {turns}",
                    message="High maxTurns value - agent may loop extensively")
        except (ValueError, TypeError):
            pass

    # --- Background + permissive mode ---

    background = frontmatter.get("background")
    if str(background).lower() == "true" and perm_mode in ("bypassPermissions", "auto"):
        add("critical", "agent-perms", "background-permissive", rel,
            evidence=f"background: true + permissionMode: {perm_mode}",
            message="Background agent with permissive mode - unsupervised unrestricted execution")

    # --- Skill preloading checks ---

    skills = frontmatter.get("skills", [])
    if skills and registry_dir and registry_dir.is_dir():
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(",")]
        for skill_name in skills:
            skill_path = registry_dir / skill_name / "SKILL.md"
            if not skill_path.exists():
                add("high", "agent-perms", "unaudited-preloaded-skill", rel,
                    evidence=skill_name,
                    message=f'Preloaded skill "{skill_name}" not found in registry - unaudited skill gains agent permissions')

    # --- Unicode checks on the file ---

    try:
        lines = file_path.read_text(encoding="utf-8", errors="replace").split("\n")
    except Exception:
        lines = []
    for i, line in enumerate(lines, 1):
        if any(ch in SUSPICIOUS_UNICODE for ch in line):
            add("critical", "injection", "unicode-smuggling", rel, line=i,
                evidence=line[:80],
                message="Zero-width or directional override characters detected")

    return {"name": agent_name, "path": str(file_path), "type": "agent", "findings": findings}


def scan_registry(registry_dir: Path) -> list[dict]:
    """Scan all skills in a registry directory."""
    registry_dir = registry_dir.resolve()
    results = []
    for entry in sorted(registry_dir.iterdir()):
        if entry.is_dir() and (entry / "SKILL.md").exists():
            results.append(scan_skill(entry, registry_dir=registry_dir))
    return results


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 audit.py <skill-or-registry-path> [--batch]", file=sys.stderr)
        sys.exit(2)

    target = Path(sys.argv[1]).resolve()
    batch = "--batch" in sys.argv

    if not target.exists():
        print(json.dumps({"error": f"Path not found: {target}"}))
        sys.exit(2)

    if batch or (target.is_dir() and not (target / "SKILL.md").exists() and not target.suffix == ".md"):
        # Registry mode
        results = scan_registry(target)
        output = {
            "mode": "batch",
            "skills_scanned": len(results),
            "results": results,
        }
    elif target.is_file() and target.suffix == ".md" and target.name != "SKILL.md":
        # Possible agent definition file - check if it has agent-specific fields
        fm = parse_frontmatter(target)
        if is_agent_definition(fm):
            registry_dir = target.parent.parent if target.parent else None
            result = scan_agent_definition(target, registry_dir=registry_dir)
            output = {"mode": "agent", "results": [result]}
        else:
            # Treat as a regular file - not a skill or agent
            print(json.dumps({"error": f"File does not appear to be a skill directory or agent definition: {target}"}))
            sys.exit(2)
    else:
        # Single skill mode
        registry_dir = target.parent if target.is_dir() else None
        result = scan_skill(target, registry_dir=registry_dir)
        output = {"mode": "single", "results": [result]}

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
