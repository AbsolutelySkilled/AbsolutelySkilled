#!/usr/bin/env bash
set -euo pipefail

# Fetches per-skill install counts from skills.sh and writes to data/installs.json.
# This file is consumed by:
#   - The Astro website (build-time fallback + runtime fetch from GitHub raw)
#   - The README badge via shields.io dynamic endpoint
#
# Run manually:   ./scripts/fetch-installs.sh
# Runs in CI via: .github/workflows/update-badges.yml (every 12 hours)

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$REPO_ROOT/data/installs.json"

mkdir -p "$(dirname "$OUTPUT")"

echo "Fetching install counts from skills.sh..."

curl -sf 'https://skills.sh/api/search?q=AbsolutelySkilled&limit=500' | \
  python3 -c "
import json, sys
from datetime import datetime, timezone

data = json.load(sys.stdin)
skills = [s for s in data['skills'] if s['source'] == 'absolutelyskilled/absolutelyskilled']

installs = {}
total = 0
for s in skills:
    slug = s['id'].split('/')[-1]
    count = s.get('installs', 0)
    if count > 0:
        installs[slug] = count
        total += count

installs['_total'] = total
installs['_fetchedAt'] = datetime.now(timezone.utc).isoformat()

with open('$OUTPUT', 'w') as f:
    json.dump(installs, f, indent=2, sort_keys=True)
    f.write('\n')

print(f'Updated {len(installs) - 2} skills, total: {total}')
"
