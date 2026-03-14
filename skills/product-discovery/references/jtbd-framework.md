<!-- Part of the product-discovery AbsolutelySkilled skill. Load this file when
     working with jobs-to-be-done analysis, switch interviews, or outcome-driven innovation. -->

# Jobs-to-be-Done Framework

## Job statement syntax

A well-formed job statement follows this structure:

```
When [situation/context],
I want to [motivation/desired progress],
so I can [expected outcome].
```

**Rules for writing job statements:**

1. The situation must describe a real, recurring circumstance - not a one-off event
2. The motivation must be solution-agnostic - describe the progress, not a feature
3. The outcome should connect to a functional, emotional, or social benefit
4. The statement should be testable: you can observe whether someone is in this situation
5. Aim for the "Goldilocks level" - not too abstract ("live better") and not too specific ("click a button")

**Example - good vs. bad:**

| Quality | Statement |
|---|---|
| Too abstract | "When managing my life, I want to feel less stressed, so I can be happy." |
| Too specific | "When I open the app, I want to see a pie chart, so I can check my categories." |
| Just right | "When I receive my monthly paycheck, I want to quickly allocate it across bills, savings, and discretionary spending, so I can avoid overdrafts and make progress toward my savings goal." |

## The three layers of a job

Every job has functional, emotional, and social dimensions. Interviewing for all three
produces richer insight than functional alone.

### Functional job
The practical task the customer needs to accomplish. This is what most teams focus on
and what product requirements typically capture.

- Directly observable
- Measured by speed, accuracy, thoroughness
- Example: "Reconcile bank transactions with accounting records"

### Emotional job
How the customer wants to feel during and after completing the job. Often the real driver
of switching behavior - people leave products that make them feel anxious or incompetent
even if the product technically works.

- Not directly observable - must be inferred from language and behavior
- Measured by confidence, satisfaction, peace of mind
- Example: "Feel confident that I am not missing any expenses at tax time"

### Social job
How the customer wants to be perceived by others. Social jobs are especially powerful
in B2B contexts where purchasing decisions are visible to colleagues and managers.

- Context-dependent - the same person has different social jobs at work vs. home
- Measured by perception, status, belonging
- Example: "Be seen by my CFO as someone who has the financials under control"

## Switch interviews (forces of progress)

Switch interviews are retrospective interviews conducted after someone has recently
switched to or from a product. They reveal the four forces that drive or inhibit switching:

```
                    DEMAND SIDE (pulls toward switch)
                    ================================
    Push of current    +    Pull of new solution
    situation               (attraction)
    (dissatisfaction)

                          vs.

                    SUPPLY SIDE (resists switch)
                    ============================
    Anxiety of new     +    Habit of current
    solution                situation
    (uncertainty)           (inertia)
```

### The four forces

| Force | Direction | Interview question |
|---|---|---|
| **Push** | Toward switching | "What was going wrong with your old way of doing this?" |
| **Pull** | Toward switching | "What attracted you to the new solution? What did you hope it would do?" |
| **Anxiety** | Against switching | "What concerns did you have before switching? What almost stopped you?" |
| **Habit** | Against switching | "What did you like about the old way? What was comfortable about it?" |

### Running a switch interview

1. **Recruit recent switchers** - People who switched within the last 90 days. Memory
   fades quickly; the emotional context disappears first.
2. **Timeline first** - Map the chronological journey: first thought of switching, research
   phase, decision moment, first use, ongoing use. Get exact dates when possible.
3. **Probe each force** - At each phase, ask about pushes, pulls, anxieties, and habits.
4. **Look for the "struggling moment"** - The specific event that moved someone from
   passive dissatisfaction to active searching. This is your highest-value insight.
5. **Document the forces diagram** - After the interview, fill in the four-forces diagram
   with direct quotes from the participant.

### Patterns to look for across interviews

- **Consistent pushes** across 4+ participants indicate a market-level problem, not an individual complaint
- **Strong anxieties** suggest your marketing and onboarding must address specific fears
- **Weak pulls** mean your value proposition is not landing - people are leaving the old solution, not choosing yours
- **Strong habits** indicate you need migration tools, data import, or familiar UX patterns

## Outcome-driven innovation (ODI)

ODI, developed by Tony Ulwick, quantifies jobs-to-be-done by measuring customer-defined
outcomes. It produces a numeric score for each outcome that reveals where customers are
over-served (table stakes) and under-served (opportunities).

### ODI process

1. **Define the job** - Use the job statement syntax above
2. **Map the job steps** - Break the job into 5-15 sequential steps (the "job map")
3. **Extract desired outcomes** - For each step, ask: "What does success look like?"
   Write outcomes in the format:
   ```
   Minimize the [time/likelihood/effort] of [undesired outcome]
   ```
   or
   ```
   Increase the [speed/accuracy/reliability] of [desired outcome]
   ```
4. **Survey customers** - For each outcome, ask two questions on a 1-5 scale:
   - "How important is this outcome to you?" (importance)
   - "How satisfied are you with how well current solutions achieve this?" (satisfaction)
5. **Calculate the opportunity score:**
   ```
   Opportunity = Importance + max(Importance - Satisfaction, 0)
   ```
   - Score > 12: Under-served (high opportunity)
   - Score 10-12: Appropriately served
   - Score < 10: Over-served (table stakes, do not invest)

### Job map template

A job map captures the universal steps a customer goes through when executing a job,
regardless of which solution they use:

| Step | Description | Example (personal budgeting) |
|---|---|---|
| **1. Define** | Determine goals and plan approach | Decide savings target and budget categories |
| **2. Locate** | Gather needed inputs and resources | Collect bank statements, receipts, income records |
| **3. Prepare** | Set up the environment for execution | Open spreadsheet/app, set up categories |
| **4. Confirm** | Verify readiness before proceeding | Check that all transactions are imported |
| **5. Execute** | Perform the core task | Categorize transactions, allocate amounts |
| **6. Monitor** | Track progress during execution | Watch running totals, compare to budget |
| **7. Modify** | Make adjustments based on monitoring | Reallocate from one category to another |
| **8. Conclude** | Finish and document the output | Save the budget, set reminders for next period |

Each step generates 3-8 desired outcomes. A complete job map typically produces 50-150
outcomes to survey.

## When to use which JTBD technique

| Technique | Best for | Effort | Output |
|---|---|---|---|
| Job statement writing | Framing the problem space | Low (1-2 hours) | Shared language for the team |
| Switch interviews | Understanding why people change solutions | Medium (5-8 interviews) | Forces diagram, struggling moments |
| ODI scoring | Quantitative prioritization of outcomes | High (survey of 100+ users) | Ranked opportunity scores |
| Job mapping | Detailed process understanding | Medium (workshop + interviews) | Step-by-step outcome list |
