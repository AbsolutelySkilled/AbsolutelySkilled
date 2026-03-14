<!-- Part of the internal-docs AbsolutelySkilled skill. Load this file when
     working with post-mortems, incident reviews, or blameless retrospectives. -->

# Post-Mortems

## Blameless culture

Blameless post-mortems are the foundation of a learning organization. The principle
is simple: people make mistakes because systems allow those mistakes to happen.
Blaming individuals creates fear, suppresses reporting, and prevents the
organization from fixing systemic issues.

**Blameless does NOT mean:**
- Nobody is accountable
- No changes are needed
- The incident was acceptable

**Blameless DOES mean:**
- We focus on system and process failures, not individual errors
- We assume everyone acted with the best information available at the time
- We create an environment where people report honestly without fear

### Language guide

| Instead of this | Write this |
|---|---|
| "Engineer X deployed the bad config" | "A configuration change was deployed that..." |
| "The team failed to catch the bug" | "The testing pipeline did not include a check for..." |
| "Nobody noticed the alert" | "The alert was not routed to the on-call channel" |
| "The developer should have known" | "The documentation did not cover this failure mode" |

## Severity framework

Use a consistent severity scale so post-mortems are prioritized appropriately:

| Severity | Criteria | Post-mortem required? | Review meeting? |
|---|---|---|---|
| SEV-1 | Complete service outage, data loss, or security breach affecting all users | Yes, within 48 hours | Yes, org-wide |
| SEV-2 | Partial outage or degradation affecting >10% of users for >30 minutes | Yes, within 1 week | Yes, team + stakeholders |
| SEV-3 | Minor degradation, brief outage, or issue affecting <10% of users | Optional but recommended | Team-only if written |
| SEV-4 | Near-miss or caught before user impact | Optional - consider a brief writeup | No |

## The 5 Whys technique

The 5 Whys is a root cause analysis method. Start with the symptom and ask "why"
repeatedly until you reach a systemic cause.

**Example:**

1. **Why** did users see 500 errors? Because the checkout service was returning errors.
2. **Why** was the checkout service returning errors? Because it couldn't connect to the database.
3. **Why** couldn't it connect? Because the connection pool was exhausted.
4. **Why** was the pool exhausted? Because a long-running query was holding connections.
5. **Why** was there a long-running query? Because the new report feature had no query timeout configured, and the ORM generated an unindexed full-table scan.

**Root cause:** Missing query timeout configuration and no index on the report query.

### 5 Whys pitfalls

- **Stopping too early** - "The config was wrong" is a symptom, not a root cause. Ask why the wrong config was possible.
- **Single-threading** - Most incidents have multiple contributing causes. Branch your "whys" when you hit a fork.
- **Going too deep** - "Why do humans make mistakes?" is too philosophical. Stop when you reach something you can fix with a concrete action.

## Timeline writing

The timeline is the backbone of a post-mortem. Write it in UTC with this format:

```markdown
## Timeline (all times UTC)

| Time | Event |
|---|---|
| 14:00 | Deploy of checkout-service v2.4.1 begins via CI/CD pipeline |
| 14:03 | Deploy completes. No alerts triggered |
| 14:15 | Monitoring shows p99 latency increase from 200ms to 1200ms |
| 14:18 | PagerDuty alert fires: "checkout-service latency > 1000ms" |
| 14:20 | On-call engineer acknowledges alert, begins investigation |
| 14:25 | Engineer identifies database connection pool exhaustion in metrics |
| 14:32 | Decision to rollback deploy. Rollback initiated |
| 14:38 | Rollback complete. Latency returns to normal within 2 minutes |
| 14:40 | Incident declared resolved |
```

### Timeline tips

- Include detection time, investigation steps, decision points, and resolution
- Note who was involved at each step (by role, not name, in a blameless doc)
- Include things that didn't work ("Attempted restart, no improvement")
- Be precise about timing - round to the nearest minute

## Action items that stick

The most common failure of post-mortems is action items that never get completed.
Make them stick with this framework:

### The SMART action item

| Component | Rule | Bad example | Good example |
|---|---|---|---|
| Specific | Describes exactly what to build/change | "Improve monitoring" | "Add p99 latency alert at 500ms on /checkout endpoint" |
| Measurable | Has a clear definition of done | "Better testing" | "Add integration test covering the N+1 query path" |
| Assigned | Has a single owner (not a team) | "Backend team" | "Alice (backend)" |
| Realistic | Achievable within the given timeframe | "Rewrite the service" | "Add query timeout of 30s to report queries" |
| Time-bound | Has a due date | "Soon" | "By 2024-03-15" |

### Priority categories

- **P0 - Immediate** (within 1 week): Prevents recurrence of this exact incident
- **P1 - Soon** (within 1 month): Reduces blast radius or improves detection
- **P2 - Planned** (within 1 quarter): Systemic improvements and tech debt

### Tracking action items

- Create tickets in the team's issue tracker immediately after the post-mortem meeting
- Link tickets back to the post-mortem document
- Review completion status in weekly team standup until all P0/P1 items are done
- Include action item completion rate in quarterly engineering metrics

## Post-mortem review meeting

### Agenda (45-60 minutes)

1. **Summary and timeline walkthrough** (10 min) - Author presents the incident
2. **Root cause discussion** (15 min) - Group validates or challenges the analysis
3. **Action item review** (15 min) - Assign owners and priorities for each item
4. **Process improvements** (5 min) - Meta-discussion on the incident response itself
5. **Closing** (5 min) - Confirm action items and document owner

### Facilitation rules

- The facilitator is NOT the author - get a neutral party
- Redirect any blame to systems: "Let's focus on what the system allowed to happen"
- Time-box tangents: "Great point, let's capture that as an action item"
- End with appreciation: thank the responders and the author
