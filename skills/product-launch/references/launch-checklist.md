<!-- Part of the product-launch AbsolutelySkilled skill. Load this file when
     building or running a launch checklist, conducting a launch readiness
     review, or preparing a cross-functional launch plan. -->

# Launch Checklist

A comprehensive launch checklist organized by function and time horizon.
Copy this into your project management tool (Linear, Jira, Notion, etc.)
and assign an owner and due date to every item. Every item is binary: done
or not done. "Almost done" is not done.

---

## How to use this checklist

1. Assign a **launch tier** (T1-T4) at kickoff. Skip sections marked as
   "Tier 1 only" or "Tier 1-2 only" for lower-tier launches.
2. Assign an **owner** to every checked item before the launch plan is shared.
3. Set a **launch readiness review** 48 hours before go-live. Every item must
   be marked done or explicitly waived with a documented reason.
4. Any open blocker at the readiness review halts the launch.

---

## T-30 to T-14: Strategy and alignment

### Product
- [ ] Launch tier assigned (T1, T2, T3, or T4)
- [ ] GTM brief written and circulated to all stakeholders
- [ ] Target segment and positioning statement finalized
- [ ] Pricing and packaging confirmed (if applicable)
- [ ] Success metrics defined with numeric targets for Day 7 and Day 30
- [ ] Launch scorecard template distributed to metric owners
- [ ] Beta graduation criteria documented (if beta phase applies)

### Engineering
- [ ] Scope finalized and code-complete date agreed
- [ ] Feature flag strategy defined (on/off, percentage, cohort, or none)
- [ ] Rollout stages and hold points documented
- [ ] Rollback procedure written and owner assigned
- [ ] Database migration reversibility confirmed (if migrations apply)
- [ ] Dependent service owners notified of upcoming change

### Legal / Compliance *(Tier 1-2)*
- [ ] Terms of Service changes identified
- [ ] Privacy review scheduled (if new data collection or processing)
- [ ] Trademark search completed for any new product name or brand
- [ ] Regulatory approvals identified for relevant markets (GDPR, HIPAA, etc.)

---

## T-14 to T-7: Build and prepare

### Engineering
- [ ] Feature code merged to main and deployed behind feature flag
- [ ] Internal dogfood / dark launch enabled for internal users
- [ ] Load testing completed at 2x expected peak traffic
- [ ] Error monitoring and alerting configured for new code paths
- [ ] Latency and throughput baseline recorded
- [ ] Capacity plan reviewed and any scaling provisioned
- [ ] Runbook or on-call guide updated with launch-specific context
- [ ] Database migrations tested on a production-equivalent dataset

### Product
- [ ] In-app onboarding flow or tooltips implemented and QA'd
- [ ] Release notes written and reviewed
- [ ] Feature documentation or help center articles drafted

### Marketing *(Tier 1-2)*
- [ ] Blog post / announcement drafted
- [ ] Landing page copy and design drafted
- [ ] Social media posts drafted for launch day and T+3
- [ ] Email campaign to existing users drafted
- [ ] Press list identified and brief prepared *(Tier 1 only)*
- [ ] Embargo date and press contacts confirmed *(Tier 1 only)*

### Sales *(Tier 1-2)*
- [ ] Pitch deck updated with new feature or product
- [ ] Objection handling guide written for common questions
- [ ] Demo environment updated to show new functionality
- [ ] Sales training session scheduled

---

## T-7 to T-2: Review and approve

### Cross-functional
- [ ] Launch readiness review meeting scheduled (T-2 from go-live)
- [ ] RACI matrix shared with all owners
- [ ] Go/no-go criteria documented (what blockers halt the launch)

### Engineering
- [ ] Rollback procedure tested end-to-end in staging
- [ ] On-call rotation confirmed for launch day and T+72
- [ ] Alert thresholds calibrated (not too noisy, not too quiet)
- [ ] Feature flag configuration reviewed and locked

### Product
- [ ] Feature documentation published or scheduled to publish at launch
- [ ] In-app messaging tested across all supported browsers and devices
- [ ] Analytics instrumentation verified (events firing correctly)

### Marketing *(Tier 1-2)*
- [ ] Blog post finalized and approved by stakeholders
- [ ] Landing page live in staging and reviewed
- [ ] Email campaign reviewed, tested on mobile, and scheduled
- [ ] Social media posts approved and scheduled
- [ ] Press brief sent to journalists under embargo *(Tier 1 only)*

### Customer Success / Support
- [ ] Support team briefed on new feature or product (live or async)
- [ ] Help center articles published or staged for publish
- [ ] Known issues documented with workarounds
- [ ] Internal FAQ distributed to support agents
- [ ] Escalation path defined: who gets paged for P0s on launch day
- [ ] Support surge plan in place (extra coverage on launch day and T+1)

### Sales *(Tier 1-2)*
- [ ] Sales training completed
- [ ] Demo environment reviewed by sales lead
- [ ] CRM fields or opportunity stages updated to track launch influence

### Legal / Compliance *(Tier 1-2)*
- [ ] Terms of Service changes approved and publish date confirmed
- [ ] Privacy policy updated (if applicable)
- [ ] Compliance sign-off email received and filed

---

## T-2: Launch readiness review

Run a 30-45 minute meeting. Walk through every open item:

1. **Status** - Done, in progress, or blocked?
2. **Owner** - Confirmed and available on launch day?
3. **Risk** - What is the impact if this item is incomplete?
4. **Decision** - Launch, delay, or waive with documented reason?

End with a formal go/no-go decision. Record the outcome and distribute
to all stakeholders. If go with conditions, state conditions explicitly.

---

## Launch day (T-0)

### Pre-launch (T-0, morning)
- [ ] Final go/no-go check with eng, product, and marketing leads
- [ ] Feature flag enabled for Stage 1 (dark launch or closed beta) or
      rolled to target percentage if skipping beta
- [ ] Monitoring dashboard open and active on launch day
- [ ] On-call engineer confirmed available and pager tested
- [ ] Support team confirmed available and ready
- [ ] Rollback procedure printed or pinned in incident channel

### Launch actions
- [ ] Blog post published (if Tier 1-2)
- [ ] Social media posts published or released from scheduled queue
- [ ] Email campaign sent (if applicable)
- [ ] Landing page set to public (if staged)
- [ ] In-app announcements or banners enabled
- [ ] Press embargo lifted and journalist follow-up sent *(Tier 1 only)*
- [ ] Internal announcement sent (all-hands Slack, company email)

### Post-launch monitoring (T+0 to T+72)
- [ ] Error rate vs pre-launch baseline tracked hourly for first 4 hours
- [ ] p99 latency vs SLA monitored
- [ ] Activation metric tracked against Day 7 target (leading indicator)
- [ ] Support ticket volume tracked against surge plan threshold
- [ ] Feature flag percentage incremented per rollout plan (if phased)
- [ ] Rollback criteria checked at each percentage increment hold point

---

## T+7 to T+30: Post-launch

### Metrics review (T+7)
- [ ] Day 7 actuals vs targets recorded in launch scorecard
- [ ] Any metric below 50% of target triggers an investigation
- [ ] Rollout completed to 100% (if still ramping)
- [ ] Known issues resolved or triaged to backlog

### Retrospective (T+30)
- [ ] Retrospective meeting scheduled with cross-functional leads
- [ ] Metrics vs targets reviewed (all six buckets)
- [ ] What went well documented
- [ ] What went wrong documented (process issues, not blame)
- [ ] Action items written with owners and due dates
- [ ] Launch checklist updated based on retrospective findings
- [ ] Lessons added to team's launch playbook

---

## Rollback procedure template

Fill this in before every Tier 1-2 launch:

**Rollback trigger criteria:**
- Error rate exceeds `___`% above pre-launch baseline for `___` minutes
- P0 or P1 bug reported affecting `___`% of users
- Activation rate below `___`% of target after `___` hours at 100%
- Any data loss or security incident

**Rollback steps:**
1. Incident commander declared: `[name]`
2. Feature flag disabled or percentage rolled back to 0%: `[engineer name]`
3. Database migration reversed (if applicable): `[engineer name]`
4. Internal incident Slack channel opened: `#launch-incident-[feature]`
5. Customer-facing status page updated (if user-visible): `[owner]`
6. External communications paused: `[marketing owner]`
7. Post-incident review scheduled within 48 hours
