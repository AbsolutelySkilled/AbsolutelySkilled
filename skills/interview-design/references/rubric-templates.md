<!-- Part of the interview-design AbsolutelySkilled skill. Load this file when
     designing scoring rubrics or calibrating interviewers on evaluation criteria. -->

# Rubric Templates

Rubrics work only when every interviewer applies them before the interview, not
after. Print or share these with the panel before the first candidate. Calibrate
on a practice response together to align on what each level looks like.

---

## How to use these templates

1. Copy the relevant template for each interview round
2. Fill in the role-specific context under each dimension
3. Run a calibration session - interviewers score the same practice response
   independently, then compare and discuss
4. Treat any dimension with >1 point spread in calibration as "needs discussion"

**Score key used throughout:**

| Score | Label | Meaning |
|---|---|---|
| 4 | Strong Yes | Clear signal; would raise the bar on the team |
| 3 | Yes | Solid hire; meets the bar for this level |
| 2 | No | Does not yet meet the bar; significant gaps |
| 1 | Strong No | Critical gaps; declined regardless of other scores |

---

## Coding Interview Rubric

**Round purpose:** Assess technical problem-solving, code quality, and
communication under time pressure.

---

### Dimension 1: Problem Decomposition

| Score | Behavioral indicators |
|---|---|
| 4 | Independently breaks problem into clean subproblems before writing any code. Names data structures without prompting. Explains why they chose a particular decomposition. Proactively identifies edge cases (empty input, overflow, duplicate entries) and handles them before the interviewer asks. |
| 3 | Breaks problem into subproblems with light prompting ("what would you tackle first?"). Solves the core case correctly. Handles most edge cases when prompted. Can explain their decomposition after the fact. |
| 2 | Jumps straight into coding without a plan. Solution handles the happy path but misses edge cases. Requires significant hints to identify what is missing. Difficulty explaining why code is structured as it is. |
| 1 | Cannot break the problem down even with hints. Solution is incorrect or incomplete. Does not know where to start without a near-full solution provided. |

---

### Dimension 2: Code Quality and Clarity

| Score | Behavioral indicators |
|---|---|
| 4 | Variable and function names clearly communicate intent. No need to ask "what does this variable do?" Functions are small with a single responsibility. Would pass code review with minimal comments. |
| 3 | Names are reasonable; code is mostly readable. Minor issues (e.g., one vague variable name) that do not impede understanding. Reviewer would approve with small suggestions. |
| 2 | Names are generic (`temp`, `data`, `flag`). Functions mix multiple responsibilities. Reviewer would request significant changes before approving. |
| 1 | Code is incomprehensible without extensive explanation from the candidate. |

---

### Dimension 3: Complexity Analysis

| Score | Behavioral indicators |
|---|---|
| 4 | States time and space complexity unprompted and correctly. Can reason about trade-offs between solutions with different complexity profiles. Identifies when a more complex algorithm is not worth it for small inputs. |
| 3 | States complexity correctly when asked. Understands that nested loops are typically O(n^2). May not spontaneously discuss trade-offs. |
| 2 | Incorrect complexity analysis or significant prompting required. Confuses time and space complexity. |
| 1 | Cannot reason about complexity even when asked directly. |

---

### Dimension 4: Communication and Collaboration

| Score | Behavioral indicators |
|---|---|
| 4 | Asks clarifying questions before writing code. Narrates thinking as they work ("I'm going to use a hashmap here because..."). Receives and integrates hints gracefully. Tells the interviewer when they are stuck rather than going silent. |
| 3 | Occasionally narrates thinking. Handles hints without frustration. May not ask clarifying questions spontaneously but does when prompted. |
| 2 | Long stretches of silence. Does not integrate hints - either ignores them or abandons their approach entirely. Seems frustrated when challenged. |
| 1 | Non-communicative. Cannot describe what they are doing. Hostile to hints or suggestions. |

---

## System Design Interview Rubric

**Round purpose:** Assess architectural thinking, scalability reasoning, and
ability to navigate ambiguity in open-ended problems.

---

### Dimension 1: Requirements Clarification

| Score | Behavioral indicators |
|---|---|
| 4 | Asks structured scoping questions before drawing anything: scale (DAU, QPS), read/write ratio, latency SLAs, consistency requirements, geographic distribution. Captures answers visibly. Explicitly states assumptions made. |
| 3 | Asks at least 3 meaningful clarifying questions. May miss one dimension (e.g., does not ask about consistency) but covers scale and latency. States assumptions at the start of the design. |
| 2 | Asks one or two surface questions, then jumps to design. Does not state assumptions. Design later requires backtracking when constraints are revealed. |
| 1 | Immediately starts drawing without asking any questions. Design is untethered from actual requirements. |

---

### Dimension 2: High-Level Design Quality

| Score | Behavioral indicators |
|---|---|
| 4 | Draws clean component boundaries. Identifies all major components (load balancer, app layer, database, cache, queue) with correct relationships. Explains the responsibility of each component. Notes where data flows and in what format. |
| 3 | Correct high-level design with minor gaps (e.g., misses a CDN or doesn't specify database type). Components and relationships are clear. Could build from this diagram. |
| 2 | Design has significant omissions or incorrect component relationships. Unclear how components communicate. Single-point-of-failure not acknowledged. |
| 1 | Design is incomplete or fundamentally incorrect for the stated requirements. |

---

### Dimension 3: Scalability and Bottleneck Analysis

| Score | Behavioral indicators |
|---|---|
| 4 | Identifies the bottleneck in their design proactively and proposes a mitigation. Uses back-of-envelope math to justify component choices ("at 10k QPS we need at least 5 app servers"). Discusses horizontal vs vertical scaling trade-offs for specific components. |
| 3 | Can identify bottlenecks when prompted. Knows that databases are often the first bottleneck. Can describe caching and read replicas as mitigations. |
| 2 | Does not think about scale until pushed. Proposes general solutions ("just add more servers") without reasoning. Cannot estimate required capacity. |
| 1 | Cannot identify bottlenecks even when told where to look. No concept of horizontal scaling. |

---

### Dimension 4: Trade-off Articulation

| Score | Behavioral indicators |
|---|---|
| 4 | For every significant design decision, names the trade-off: "I chose eventual consistency here because strong consistency would require a distributed transaction which hurts write latency." Adjusts the design when the interviewer changes a constraint without starting over from scratch. |
| 3 | Can explain the primary trade-off for major design choices when asked. Adapts to changed constraints with moderate prompting. |
| 2 | Presents a single design as "the answer" without acknowledging alternatives. Struggles to adapt when a constraint changes. |
| 1 | Cannot discuss trade-offs. Defensive about design choices. Cannot adjust when constraints change. |

---

## Behavioral Interview Rubric (STAR)

**Round purpose:** Assess past behavior as a predictor of future behavior across
key competencies.

---

### Dimension: STAR Response Completeness

| Score | Behavioral indicators |
|---|---|
| 4 | Provides clear Situation and Task context without over-explaining. Actions are specific and personal ("I did X" not "we did X"). Result is quantified or concretely described. Includes a reflection or learning unprompted. |
| 3 | All four STAR components present, though one may be thin. Actions are mostly specific. Result is stated, though may not be quantified. |
| 2 | Missing one component (usually Result or specific Actions). Answers tend toward the hypothetical ("what we would normally do") rather than a specific past event. Difficult to tell what the candidate personally did vs the team. |
| 1 | Cannot provide a specific example. Speaks only in generalities. No concrete result described. |

---

### Dimension: Ownership and Accountability

| Score | Behavioral indicators |
|---|---|
| 4 | Takes clear personal ownership of both successes and failures. When describing something that went wrong, explains exactly what they did to fix it and what they changed afterward. Does not deflect to circumstances or other people. |
| 3 | Takes ownership in most cases. May occasionally frame failures as externally caused, but can reflect on their own contribution when probed. |
| 2 | Consistently credits others for successes and blames others or circumstances for failures. Difficulty identifying their own contribution. |
| 1 | No evidence of personal ownership. All outcomes attributed to the team or to luck. |

---

### Dimension: Impact and Scope

| Score | Behavioral indicators |
|---|---|
| 4 | Examples are proportional to the seniority of the role. Impact is clearly described and significant (e.g., "reduced P99 latency by 40%", "drove adoption across 3 teams"). Can describe how they influenced decisions beyond their direct scope. |
| 3 | Examples are reasonable for the level. Impact is described, though may lack quantification. Scope is appropriate for individual contributor level. |
| 2 | Examples are too small for the target level (task-level, not project-level). Impact is vague or unmeasured. |
| 1 | Cannot describe meaningful impact. Examples are entirely task execution with no broader outcome. |

---

## Culture / Values Interview Rubric

**Round purpose:** Assess alignment with how the team operates and makes
decisions - not personality, not "vibe."

> Before using this rubric, define your values explicitly. The rubric below
> uses example values (Direct Communication, Customer Obsession, Long-term
> Thinking). Replace with your team's actual values.

---

### Dimension: Direct Communication

| Score | Behavioral indicators |
|---|---|
| 4 | Gives a specific example of delivering difficult feedback directly, including the setting, what they said, and how it was received. Can describe a time they received hard feedback and acted on it. Speaks candidly about past disagreements. |
| 3 | Shows directness in their example, but may have softened the delivery in ways that reduced impact. Open about receiving feedback. |
| 2 | Example involves conflict avoidance or routing concerns through a third party. Difficulty recalling a time they delivered hard feedback directly. |
| 1 | No examples of direct communication. Describes a style that relies on consensus or avoiding difficult conversations entirely. |

---

### Dimension: Customer Obsession

| Score | Behavioral indicators |
|---|---|
| 4 | Brings up the end user unprompted when describing technical decisions. Can give a specific example of changing a technical plan because of customer feedback or data. Understands the difference between what customers ask for and what they need. |
| 3 | Can describe customer-driven decisions when asked. Aware of the end user, though it may not be their primary frame for technical choices. |
| 2 | Discusses technical decisions entirely in terms of technical elegance or internal process. Customer is an afterthought in examples. |
| 1 | Cannot provide an example involving customer impact. Decisions are purely internally-motivated. |

---

### Dimension: Long-term Thinking

| Score | Behavioral indicators |
|---|---|
| 4 | Can give a specific example of accepting short-term pain (shipping slower, taking on tech debt deliberately) for long-term gain. Explains the reasoning and the outcome. Thinks about second-order effects of decisions. |
| 3 | Shows awareness of long-term trade-offs in examples. May not always have acted on long-term thinking but can reason about it. |
| 2 | Examples are dominated by short-term metrics (shipping fast, hitting the sprint goal) without consideration of downstream effects. |
| 1 | No evidence of thinking beyond the immediate task or sprint. |

---

## Rubric Calibration Worksheet

Use this worksheet when running calibration sessions with new interviewers.

**Instructions:**
1. Each interviewer reads the same candidate response (transcript or recording)
2. Score each dimension independently - do not share scores yet
3. Reveal all scores simultaneously
4. For any dimension with a spread of 2+, discuss: what evidence led to each score?
5. Reach consensus and document the "anchor" score with a one-sentence rationale

| Dimension | Interviewer A | Interviewer B | Interviewer C | Consensus | Rationale |
|---|---|---|---|---|---|
| Problem Decomposition | | | | | |
| Code Quality | | | | | |
| Complexity Analysis | | | | | |
| Communication | | | | | |

**Calibration is complete when:** every interviewer can independently arrive at
the consensus score when presented with the same evidence, within 1 point.
