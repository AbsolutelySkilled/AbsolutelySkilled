<!-- Part of the Competitive Analysis AbsolutelySkilled skill. Load this file when
     working with advanced SWOT techniques, TOWS matrix, competitive response
     modeling, or scenario planning. -->

# Advanced SWOT Techniques

## TOWS Matrix

The TOWS matrix is the action-oriented extension of SWOT. While SWOT identifies
factors, TOWS crosses them to generate strategies. This is where the actual value
of the exercise lives.

### How to build a TOWS matrix

Take the completed SWOT grid and systematically cross each quadrant pair:

```
                    | Strengths (S)              | Weaknesses (W)             |
                    | S1: [strength]             | W1: [weakness]             |
                    | S2: [strength]             | W2: [weakness]             |
                    | S3: [strength]             | W3: [weakness]             |
--------------------|----------------------------|----------------------------|
Opportunities (O)   | SO Strategies              | WO Strategies              |
O1: [opportunity]   | Use S to maximize O        | Overcome W to exploit O    |
O2: [opportunity]   |                            |                            |
--------------------|----------------------------|----------------------------|
Threats (T)         | ST Strategies              | WT Strategies              |
T1: [threat]        | Use S to minimize T        | Minimize W to avoid T      |
T2: [threat]        |                            |                            |
--------------------|----------------------------|----------------------------|
```

### Strategy types explained

**SO Strategies (Strength-Opportunity) - PURSUE AGGRESSIVELY**
These are your best plays. You have an internal advantage aligned with an external
opportunity. Examples:
- "Use our superior data pipeline (S) to capture the growing demand for real-time
  analytics (O)"
- "Leverage our strong brand in SMB (S) to expand into the adjacent mid-market
  segment (O)"

**WO Strategies (Weakness-Opportunity) - INVEST TO FIX**
You see an opportunity but have a weakness blocking you. Decide whether to invest
in fixing the weakness or partner around it. Examples:
- "Our lack of enterprise SSO (W) blocks us from the enterprise segment (O) -
  build SSO in Q2 to unlock enterprise deals"
- "We lack a mobile app (W) but mobile usage is growing 40% YoY (O) - partner
  with a mobile-first platform or acquire"

**ST Strategies (Strength-Threat) - DEFEND AND LEVERAGE**
An external threat exists but you have strengths to counter it. Examples:
- "A new competitor entered with lower pricing (T) but our deep integrations
  create high switching costs (S) - emphasize integration ecosystem in messaging"
- "AI-generated content threatens our writing tool (T) but our editorial
  workflow and brand trust are strong (S) - position as 'AI + human editorial'"

**WT Strategies (Weakness-Threat) - MITIGATE OR EXIT**
Your weakest position. An external threat targets an internal weakness. Be
honest about whether to defend or retreat. Examples:
- "Our legacy codebase (W) makes it hard to match the competitor's release
  speed (T) - start platform rewrite or consider acquisition"
- "We lack regulatory compliance (W) as new regulations approach (T) - hire
  compliance team immediately or exit the regulated segment"

---

## Weighted SWOT Scoring

Simple SWOT lists treat all items as equal. Weighted scoring forces prioritization
and makes the output actionable.

### Scoring methodology

For each SWOT item, score on two dimensions:

**For Strengths and Weaknesses:**
- Importance to the customer (1-5 scale)
- Your relative performance vs competitors (1-5 scale)
- Score = Importance x Performance

**For Opportunities and Threats:**
- Probability of occurring (1-5 scale)
- Impact if it occurs (1-5 scale)
- Score = Probability x Impact

### Scoring template

```
STRENGTHS
| Item                        | Importance | Performance | Score | Priority |
|-----------------------------|------------|-------------|-------|----------|
| [Strength 1]                | 5          | 4           | 20    | High     |
| [Strength 2]                | 3          | 5           | 15    | Medium   |
| [Strength 3]                | 4          | 3           | 12    | Medium   |

WEAKNESSES
| Item                        | Importance | Performance | Score | Priority |
|-----------------------------|------------|-------------|-------|----------|
| [Weakness 1]                | 5          | 2           | 10    | Critical |
| [Weakness 2]                | 3          | 1           | 3     | Low      |

OPPORTUNITIES
| Item                        | Probability | Impact | Score | Priority |
|-----------------------------|-------------|--------|-------|----------|
| [Opportunity 1]             | 4           | 5      | 20    | High     |
| [Opportunity 2]             | 2           | 5      | 10    | Medium   |

THREATS
| Item                        | Probability | Impact | Score | Priority |
|-----------------------------|-------------|--------|-------|----------|
| [Threat 1]                  | 4           | 4      | 16    | High     |
| [Threat 2]                  | 2           | 3      | 6     | Low      |
```

Priority thresholds:
- Score 15-25: High priority - address immediately
- Score 8-14: Medium priority - plan for next quarter
- Score 1-7: Low priority - monitor but do not invest

---

## Competitive Response Modeling

Predict how competitors will react to your moves before you make them.

### Response matrix

For each strategic move you are considering, model the likely competitive response:

```
YOUR MOVE: [Describe your planned action]

| Competitor | Most Likely Response    | Response Time | Your Counter-move      |
|------------|-------------------------|---------------|------------------------|
| Comp A     | [What they will do]     | [Days/weeks]  | [How you respond]      |
| Comp B     | [What they will do]     | [Days/weeks]  | [How you respond]      |
| Comp C     | [What they will do]     | [Days/weeks]  | [How you respond]      |
```

### Competitor response archetypes

**The Fast Follower:** Copies your features within 1-3 months. Counter by
continuously shipping and building switching costs before they catch up.

**The Price Warrior:** Responds to your moves by cutting prices. Counter by
competing on value, not price. Raise switching costs through integrations.

**The Platform Player:** Responds by bundling your feature into their larger
platform. Counter by being 10x better at the specific job and building a
specialist brand.

**The Indifferent Incumbent:** Does not respond at all (too big, too slow, or
does not perceive you as a threat). Exploit the window aggressively before they
wake up.

**The Legal Challenger:** Responds with patent claims, cease-and-desist, or
regulatory complaints. Counter by ensuring your IP is clean and having legal
counsel review competitive claims.

### Modeling guidelines

1. Base predictions on past behavior - how did this competitor respond to the
   last market entrant or price change?
2. Consider their incentives and constraints - a public company may not cut
   prices due to margin pressure
3. Factor in response time - if it takes them 6 months to ship a feature, you
   have a 6-month window
4. Plan two moves ahead - what do you do after they respond?

---

## Scenario Planning

Use scenario planning when the competitive landscape is uncertain and multiple
futures are plausible.

### Four-scenario framework

1. Choose two critical uncertainties about the market (things that could go
   either way and would significantly change the landscape)
2. Cross them to create four scenarios
3. Name each scenario memorably
4. Develop strategy implications for each

**Template:**

```
Uncertainty 1: [e.g., "AI adoption speed" - fast vs slow]
Uncertainty 2: [e.g., "Regulatory environment" - permissive vs restrictive]

                    Fast AI Adoption
                         |
  "AI Gold Rush"         |         "Regulated AI Boom"
  (Fast + Permissive)    |         (Fast + Restrictive)
                         |
  Permissive ------------+------------ Restrictive
                         |
  "Slow Burn"            |         "Locked Down"
  (Slow + Permissive)    |         (Slow + Restrictive)
                         |
                    Slow AI Adoption
```

### For each scenario, document:

```
SCENARIO: [Name]
Assumptions: [What must be true for this to happen]
Probability: [Low / Medium / High]
Competitive implications:
  - Winner: [Who benefits most]
  - Loser: [Who suffers most]
  - Our position: [Where we stand]
Strategy:
  - If this scenario unfolds: [What we do]
  - Early warning signals: [What to watch for]
  - Hedging move (do now regardless): [Low-cost action that helps in this scenario]
```

### Hedging strategies

The most valuable output of scenario planning is identifying "no-regret moves" -
actions that help regardless of which scenario unfolds:

- Building platform flexibility (helps in all scenarios)
- Investing in customer relationships (always valuable)
- Maintaining financial reserves (optionality)
- Building data assets (competitive moat in any future)

And "option-creating moves" - small investments that give you the right (but not
obligation) to pursue a strategy if a specific scenario unfolds:

- Proof-of-concept with a new technology (option on that technology)
- Partnership discussion with a potential acquirer (option on exit)
- Pilot in a new segment (option on expansion)
