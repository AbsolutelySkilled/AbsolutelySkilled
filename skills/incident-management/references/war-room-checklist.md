<!-- Part of the incident-management AbsolutelySkilled skill. Load this file when
     activating or running a war room for an active incident. -->

# War Room Checklist

## Activation criteria

Open a war room when any of these conditions are met:

- SEV1 incident declared
- SEV2 not mitigated within 30 minutes
- Incident affects multiple services or teams
- Incident has customer-visible impact and no clear cause after 15 minutes
- Incident commander requests a war room for any reason

---

## War room activation checklist (first 5 minutes)

The person who activates the war room (usually the on-call engineer or IC) runs
through this checklist:

- [ ] Open a dedicated video call (use the team's standing war room link)
- [ ] Create or identify the incident channel (e.g., #inc-2026-03-14-checkout)
- [ ] Post the incident summary in the channel:
  ```
  INCIDENT ACTIVE
  Severity: [SEV1/SEV2]
  Summary: [One sentence - what is broken]
  Impact: [Who is affected and how]
  Started: [HH:MM UTC]
  IC: [@name]
  War room: [video call link]
  ```
- [ ] Assign roles (see Role Cards below)
- [ ] Confirm all role holders have joined the war room
- [ ] Scribe creates the incident timeline document

---

## Role cards

### Incident Commander (IC)

**Primary job:** Coordinate the response. You are NOT debugging.

**Checklist:**
- [ ] Confirm severity classification
- [ ] Assign all roles (Communications Lead, Technical Lead, Scribe)
- [ ] Run 15-minute checkpoints (see Checkpoint Script)
- [ ] Make escalation decisions
- [ ] Approve rollback or mitigation actions
- [ ] Decide when to declare resolution
- [ ] Assign post-mortem owner before closing the war room

**Rules:**
- Do not investigate the issue yourself. Delegate.
- If you are also the most qualified person to debug, hand off IC to someone else.
- If the war room exceeds 2 hours, rotate IC or bring in a fresh one.

### Communications Lead

**Primary job:** Keep customers, stakeholders, and support informed.

**Checklist:**
- [ ] Post first status page update within 10 minutes of war room opening
- [ ] Update status page every 30 minutes (or sooner if there is new information)
- [ ] Notify internal stakeholders (support team, account managers for affected customers)
- [ ] Draft the resolution update for IC review before publishing
- [ ] Compile a list of customer reports or support tickets for the post-mortem

**Rules:**
- Use the templates from `references/status-page-guide.md`
- Every update must be reviewed by IC before publishing (exception: "still investigating" updates)
- Never share internal details, blame, or unconfirmed root causes externally

### Technical Lead

**Primary job:** Drive the investigation and fix.

**Checklist:**
- [ ] Follow the relevant runbook (if one exists)
- [ ] Announce investigation steps before executing them
- [ ] Report findings to IC at each checkpoint
- [ ] Propose mitigation options with trade-offs
- [ ] Execute the approved fix
- [ ] Confirm metrics are recovering after the fix

**Rules:**
- Announce all production commands before running them
- If the runbook does not cover this scenario, say so immediately
- If you need help, tell the IC. Do not silently struggle.

### Scribe

**Primary job:** Maintain a real-time timeline of the incident.

**Checklist:**
- [ ] Create the timeline document (use the team's incident template)
- [ ] Log every significant action with a UTC timestamp
- [ ] Log who did what (not just what happened)
- [ ] Log decisions and the reasoning behind them
- [ ] Log things that were tried but did not work
- [ ] At resolution, hand the timeline to the post-mortem owner

**Rules:**
- Capture facts, not interpretations
- If something is unclear, ask for clarification and log the answer
- The timeline is the primary input for the post-mortem - completeness matters

---

## Checkpoint script (every 15 minutes)

The IC runs this script at each checkpoint. Read it aloud:

```
CHECKPOINT - [HH:MM UTC]

1. STATUS CHECK
   "Technical Lead: What do we know now that we didn't know 15 minutes ago?"

2. NEXT STEPS
   "What are we trying next? Who is doing it?"

3. ESCALATION CHECK
   "Do we need to bring in anyone else? Any dependent teams?"

4. COMMUNICATIONS CHECK
   "Communications Lead: Is the status page current? When is the next update due?"

5. TIMELINE CHECK
   "Scribe: Are we capturing everything? Anything to add?"

6. SEVERITY CHECK
   "Has the severity changed? Should we escalate or de-escalate?"
```

---

## War room rules

Post these rules in the incident channel at the start of every war room:

```
WAR ROOM RULES
1. One conversation at a time. IC moderates.
2. Announce all production commands BEFORE running them.
3. No side investigations without telling the IC.
4. If you join late, read the timeline first. Do not ask "what happened?"
5. Mute when not speaking (video call).
6. Keep the channel for incident discussion only. Use threads for tangents.
7. If you do not have a role, observe silently unless asked.
```

---

## War room closure checklist

When the IC declares the incident resolved:

- [ ] Confirm metrics have returned to baseline for at least 15 minutes
- [ ] Communications Lead posts the resolution update on the status page
- [ ] IC assigns a post-mortem owner and sets a deadline (within 48 hours)
- [ ] Scribe finalizes the timeline and shares it with the post-mortem owner
- [ ] IC posts a summary in the incident channel:
  ```
  INCIDENT RESOLVED
  Duration: [X hours Y minutes]
  Root cause: [One sentence]
  Fix applied: [One sentence]
  Post-mortem owner: [@name]
  Post-mortem deadline: [date]
  ```
- [ ] IC thanks everyone who participated
- [ ] Close the war room video call
- [ ] Archive the incident channel (do not delete - it is a historical record)

---

## War room anti-patterns

| Anti-pattern | Why it is harmful | What to do instead |
|---|---|---|
| IC also debugging | Coordination stops, chaos increases | IC delegates all investigation |
| No scribe | Post-mortem has no accurate timeline | Always assign a scribe, even for SEV2 |
| Side conversations | IC loses track of what is happening | Enforce "one conversation" rule |
| Heroic solo debugging | Others cannot help or learn; single point of failure | Announce all actions; pair on investigation |
| No checkpoints | Investigation drifts; people work on the wrong thing | IC runs checkpoint script every 15 minutes |
| War room stays open after resolution | Fatigue, wasted time | Close promptly once metrics are stable |
