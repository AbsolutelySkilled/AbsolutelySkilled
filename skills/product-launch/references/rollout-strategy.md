<!-- Part of the product-launch AbsolutelySkilled skill. Load this file when
     working with rollout strategies, feature flags, or phased deployments. -->

# Rollout Strategy

Rollout strategy defines how a feature moves from 0% to 100% of users. The right
strategy depends on risk level, reversibility, infrastructure capabilities, and
whether the launch has a marketing component requiring a specific date.

---

## Rollout Strategy Matrix

Choose based on risk and launch type:

| Strategy | Risk Tolerance | Reversibility | Best For |
|---|---|---|---|
| Internal only | Minimal | Instant (flag off) | Dogfooding, early validation |
| Percentage rollout | Low-Medium | Fast (flag adjustment) | Most feature launches |
| Cohort-based | Medium | Moderate (per-cohort flags) | Pricing, billing, onboarding changes |
| Geographic | Medium-High | Moderate (per-region flags) | Infrastructure, latency-sensitive features |
| Time-based (canary) | Low | Fast (flag adjustment) | Backend/API changes, database migrations |
| Big-bang | High | Slow (requires hotfix) | Marketing-driven launches, major announcements |

---

## Percentage Rollout Playbook

The most common strategy. Use feature flags to gradually increase the percentage
of users who see the new feature.

### Standard Rollout Schedule

```
Stage 1:  Internal team (dogfood)     - 1-2 weeks
Stage 2:  1% of external users        - 24 hours hold
Stage 3:  5% of external users        - 24 hours hold
Stage 4:  25% of external users       - 48 hours hold
Stage 5:  50% of external users       - 48 hours hold
Stage 6:  100% of external users (GA) - monitor for 2 weeks
Stage 7:  Remove feature flag         - after 2-4 weeks of stability
```

### Hold Point Checks

At each stage, verify ALL of the following before advancing:

```
[ ] Error rate: < baseline + 0.1%
[ ] p99 latency: < SLA threshold (e.g., 500ms)
[ ] P0/P1 bugs: Zero open
[ ] Support tickets: < 2x baseline for affected feature area
[ ] Core business metrics: No degradation (conversion, revenue, engagement)
[ ] User feedback: No critical UX issues reported
```

If ANY check fails, do NOT advance. Investigate, fix, re-verify, then proceed.

### Accelerated Schedule (Low-Risk Features)

For low-risk, easily reversible changes (UI tweaks, copy changes, non-critical features):

```
Stage 1:  Internal team       - 2-3 days
Stage 2:  10% of users        - 24 hours hold
Stage 3:  50% of users        - 24 hours hold
Stage 4:  100% of users (GA)  - monitor for 1 week
```

### Conservative Schedule (High-Risk Features)

For database migrations, billing changes, auth changes, or platform-level features:

```
Stage 1:  Internal team only           - 2 weeks minimum
Stage 2:  1% of users (new accounts)   - 1 week hold
Stage 3:  5% of users                  - 1 week hold
Stage 4:  10% of users                 - 1 week hold
Stage 5:  25% of users                 - 1 week hold
Stage 6:  50% of users                 - 1 week hold
Stage 7:  100% of users (GA)           - monitor for 4 weeks
```

---

## Feature Flag Patterns

### Flag Types

| Type | Description | Example |
|---|---|---|
| Release flag | Controls rollout percentage, removed after GA | `new_checkout_flow` |
| Experiment flag | A/B test with measurement, removed after decision | `pricing_page_variant_b` |
| Ops flag | Kill switch for degraded performance, kept permanently | `disable_recommendations` |
| Permission flag | Unlocks paid/enterprise features, kept permanently | `advanced_analytics` |

### Flag Naming Convention

```
<type>_<feature>_<optional_variant>

Examples:
  release_new_dashboard
  experiment_onboarding_v2
  ops_disable_search_indexing
  permission_sso_login
```

### Flag Lifecycle

```
1. Create flag (disabled by default)
2. Develop feature behind flag
3. Test with flag on/off in staging
4. Roll out using percentage strategy
5. Reach 100% (GA)
6. Monitor for 2-4 weeks
7. Remove flag from code (make feature permanent)
8. Delete flag from flag management system
```

Step 7 is critical and often skipped. Flags left in code become technical debt.
Track flag age and set alerts for flags older than 90 days that are at 100%.

### Stale Flag Cleanup

Schedule monthly flag cleanup:

```
For each flag older than 30 days at 100%:
  1. Verify feature is stable (no related incidents in 30 days)
  2. Remove flag checks from code (replace with unconditional path)
  3. Remove flag from flag management system
  4. Delete dead code from the "off" path
  5. Update tests to remove flag-based branching
```

---

## Cohort-Based Rollout

Roll out to user segments instead of random percentages. Useful when different
user types have different risk profiles.

### Common Cohort Strategies

```
Strategy 1: Free before paid
  1. Free tier users (lower risk, no revenue impact)
  2. Starter plan users
  3. Pro plan users
  4. Enterprise users (highest risk, most revenue)

Strategy 2: New before existing
  1. New sign-ups (no migration, no habit disruption)
  2. Low-activity existing users
  3. High-activity existing users

Strategy 3: Internal before external
  1. Employees and contractors
  2. Design partners / beta users
  3. All external users
```

### When to Use Cohort-Based

- Pricing or billing changes (free tier absorbs risk first)
- Onboarding flow changes (new users have no expectations)
- Breaking API changes (internal consumers migrate first)
- Data migration (small accounts are faster to rollback)

---

## Geographic Rollout

Roll out region by region. Useful for infrastructure changes, compliance
requirements, or when latency matters.

### Standard Geographic Order

```
1. Development region (where your team is, fastest to debug)
2. Lowest-traffic region (minimizes blast radius)
3. Moderate-traffic regions (one at a time)
4. Highest-traffic region (last, after confidence is high)
```

### Region-Specific Considerations

- **Data residency** - Ensure new feature complies with local data laws (GDPR, etc.)
- **Latency** - Test from the region, not just to the region
- **Peak hours** - Roll out during off-peak for each region
- **Support coverage** - Ensure support is available in the region's timezone

---

## Rollback Procedures

### Rollback Decision Criteria

Define these BEFORE launch. When any condition is met, execute rollback:

```
IMMEDIATE rollback (no discussion needed):
  - Data loss or corruption
  - Authentication/authorization bypass
  - Error rate > 5x baseline
  - Complete feature unavailability

ESCALATED rollback (discuss with on-call lead, decide in < 15 min):
  - Error rate > 2x baseline for > 10 minutes
  - p99 latency > 2x SLA for > 10 minutes
  - > 10 support tickets about the same issue in 1 hour
  - Revenue-impacting bug confirmed
```

### Rollback Execution Steps

```
1. Set feature flag to 0% (or "off")
   - This is the fastest rollback and should resolve most issues
   - Verify error rate returns to baseline within 5 minutes

2. If flag rollback insufficient, deploy previous version
   - Revert the most recent deployment
   - Verify system health

3. If data migration was involved
   - Execute reverse migration script (must be pre-tested)
   - Verify data integrity with validation queries
   - Notify affected users if data was temporarily inconsistent

4. Communicate
   - Update status page (if public-facing)
   - Notify support team
   - Notify stakeholders via Slack/email
   - If user-facing impact > 5 minutes, draft incident communication
```

### Post-Rollback Actions

```
1. Confirm system is stable (monitor for 30 minutes)
2. Create incident report with timeline
3. Root cause analysis within 24 hours
4. Fix identified issues
5. Re-test in staging
6. Schedule re-rollout with stakeholder approval
```

---

## Monitoring During Rollout

### Key Metrics to Watch

| Metric | Tool | Alert Threshold |
|---|---|---|
| Error rate (5xx) | APM / Datadog / New Relic | > baseline + 0.5% |
| p99 latency | APM | > SLA threshold |
| CPU / Memory | Infrastructure monitoring | > 80% utilization |
| Support tickets | Helpdesk (Zendesk, Intercom) | > 2x hourly baseline |
| Business metrics | Analytics (Amplitude, Mixpanel) | > 10% degradation |
| User feedback | Social media, community | Qualitative monitoring |

### Rollout Communication Template

Post in your team's launch channel at each stage:

```
[Rollout Update] <Feature Name>
Stage: X% -> Y%
Time: YYYY-MM-DD HH:MM UTC
Metrics since last stage:
  - Error rate: X.XX% (baseline: X.XX%)
  - p99 latency: XXXms (SLA: XXXms)
  - Support tickets: X (baseline: X)
  - Issues found: [None | List]
Decision: Advancing to Y% | Holding | Rolling back
Next check: YYYY-MM-DD HH:MM UTC
```
