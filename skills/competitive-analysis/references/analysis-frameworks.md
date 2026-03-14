<!-- Part of the Competitive Analysis AbsolutelySkilled skill. Load this file when
     working with Porter's Five Forces, SWOT analysis, or positioning map construction. -->

# Analysis Frameworks

Deep-dive reference for the three core competitive analysis frameworks: Porter's Five
Forces for industry-level assessment, SWOT with strategic implications for product and
company assessment, and positioning map construction for visual competitive mapping.

---

## Porter's Five Forces

Porter's Five Forces is a framework for assessing the structural attractiveness of an
industry and the intensity of competitive pressure a business faces. It was developed by
Michael Porter at Harvard Business School and published in 1979. The model argues that
long-run profitability in an industry is determined by five structural forces - not just
the current rivals you face.

Use this framework when: entering a new market, evaluating a market for investment,
understanding why margins are high or low in your industry, or identifying where
structural advantage can be built.

---

### Force 1: Threat of New Entrants

**Question:** How easy is it for new competitors to enter your market?

**High threat** (bad for incumbents): Low capital requirements, no proprietary technology,
weak brand loyalty, no regulatory barriers, easy access to distribution channels.

**Low threat** (good for incumbents): High capital requirements, proprietary technology or
patents, strong brand loyalty, regulatory licensing, exclusive distribution relationships,
high switching costs for customers.

**Key barriers to entry to assess:**
- Economies of scale (can new entrants match your cost structure quickly?)
- Capital requirements (how much does it cost to build an MVP that competes?)
- Brand identity (how long does it take to build a trusted brand in this market?)
- Access to distribution (do incumbents lock up distribution channels?)
- Government policy / regulatory requirements
- Expected retaliation from incumbents (will incumbents fight back aggressively?)

**Assessment template:**
```
Threat of New Entrants: [Low / Medium / High]

Top barriers protecting incumbents:
1. [Barrier]
2. [Barrier]

Weakest barriers (where new entrants could attack):
1. [Weak point]
```

---

### Force 2: Bargaining Power of Buyers

**Question:** How much pricing and terms leverage do customers have over you?

**High buyer power** (bad for you): Buyers are concentrated (few, large customers),
products are commoditized, low switching costs, buyers can credibly threaten to
integrate backwards, buyers have full price transparency.

**Low buyer power** (good for you): Many fragmented buyers, differentiated product,
high switching costs, buyers depend on your product for their own revenue.

**Factors that increase buyer power:**
- Buyer concentration (top 10 customers = >50% of revenue is high risk)
- Commodity-like products with multiple substitutes
- Price transparency (buyers easily compare alternatives)
- Low switching costs
- Backward integration threat (buyer builds it themselves)

**Assessment template:**
```
Bargaining Power of Buyers: [Low / Medium / High]

Buyer concentration: [top N customers = X% of revenue]
Switching costs for buyers: [Low / Medium / High]
Backward integration threat: [Yes / Unlikely / No]

Implication for strategy:
[How does buyer power shape your pricing and contract strategy?]
```

---

### Force 3: Bargaining Power of Suppliers

**Question:** How much leverage do your suppliers have in setting terms and prices?

**High supplier power** (bad for you): Few suppliers for a critical input, no substitutes,
suppliers could integrate forward into your market, you are not a critical customer
for them.

**Low supplier power** (good for you): Many competing suppliers, commodity inputs,
you can switch suppliers easily, you are a significant customer for the supplier.

**Common supplier categories in software markets:**
- Cloud infrastructure providers (AWS, GCP, Azure) - high power, few alternatives
- AI model providers (OpenAI, Anthropic) - currently high power, growing alternatives
- Data providers - variable, depends on exclusivity
- Payment processors - moderate power (Stripe, Braintree have strong network effects)
- Distribution platforms (App Store, marketplace listings) - very high power

**Assessment template:**
```
Bargaining Power of Suppliers: [Low / Medium / High]

Critical suppliers:
- [Supplier]: [Input provided] | [Switching cost] | [Alternatives]

Highest-risk supplier dependency:
[Which supplier dependency creates the most strategic risk?]
```

---

### Force 4: Threat of Substitute Products

**Question:** How easily can customers solve the same problem using a completely
different category of product?

Substitutes are not direct competitors - they are different products or behaviors
that serve the same customer job. They cap the price ceiling for your market because
customers will switch to a substitute before paying above a threshold.

**High substitute threat:** The job can be accomplished with spreadsheets, manual
processes, or a general-purpose tool. The substitute is "good enough" for the
majority of the market.

**Low substitute threat:** The job requires specialized capability that only purpose-
built software can provide. The cost of the substitute is high (time, error rate,
specialized labor).

**How to identify substitutes:**
1. Start with the customer job, not the product category
2. Ask: "What would a customer do if this entire product category disappeared tomorrow?"
3. Include behavioral substitutes (hiring someone, doing it manually, not doing it at all)

**Common substitutes in software:**
- Spreadsheets (analytics, project management, CRM for small teams)
- Email + calendar (scheduling, communication)
- Manual processes (anything pre-software in regulated industries)
- Outsourced services (legal, accounting, design, compliance)
- General-purpose AI assistants (replacing point solutions)

**Assessment template:**
```
Threat of Substitutes: [Low / Medium / High]

Primary substitutes:
- [Substitute]: [Jobs it addresses] | [Why customers use it] | [Its ceiling/limitation]

Price ceiling implication:
[At what price do customers substitute away from your category?]
```

---

### Force 5: Rivalry Among Existing Competitors

**Question:** How intense is the competition among current players in the market?

**High rivalry** (bad for margins): Many similarly sized competitors, slow market
growth, high fixed costs, low differentiation, high exit barriers.

**Low rivalry** (good for margins): Few players, fast market growth, high
differentiation, niche focus, low exit barriers.

**Factors that drive rivalry intensity:**
- Number and balance of competitors (many equal-sized players = high rivalry)
- Market growth rate (slow growth means share must be taken from rivals)
- Product differentiation (commodity = price war; differentiated = less direct rivalry)
- Switching costs (low switching = competitors constantly poach each other's customers)
- Exit barriers (high sunk costs keep weak competitors fighting instead of exiting)

**Assessment template:**
```
Rivalry Among Competitors: [Low / Medium / High]

Number of significant competitors: [N]
Market growth rate: [Declining / Slow / Fast / Hypergrowth]
Differentiation level: [Commodity / Low / Moderate / High]
Key dynamics:
[What drives the most competitive pressure right now?]
```

---

### Five Forces Summary Template

```
PORTER'S FIVE FORCES ASSESSMENT
Market: [name]
Date: [YYYY-MM-DD]

Force                          | Rating | Key Driver
-------------------------------|--------|------------------------------------------
Threat of New Entrants         | [L/M/H]| [One sentence]
Bargaining Power of Buyers     | [L/M/H]| [One sentence]
Bargaining Power of Suppliers  | [L/M/H]| [One sentence]
Threat of Substitutes          | [L/M/H]| [One sentence]
Rivalry Among Competitors      | [L/M/H]| [One sentence]

Overall Industry Attractiveness: [Low / Medium / High]

Strategic implication:
[2-3 sentences on what this means for competitive strategy and where to build moats]
```

---

## SWOT Analysis - Full Template

SWOT is a four-quadrant framework for structured assessment. Its value is not the
grid itself but the strategic options that emerge from crossing quadrants. The TOWS
matrix (SO, ST, WO, WT) is where the actionable strategy lives.

### Gathering inputs before filling the grid

SWOT degraded to a brainstorm produces garbage. Require evidence for every cell:

**Strengths sources:** NPS verbatims, win reasons from CRM, product metrics, competitive
win rates by segment, analyst reports, customer advisory board feedback.

**Weaknesses sources:** Lost deal reasons, support ticket themes, churned customer exit
surveys, product areas with low feature adoption, sales objection logs.

**Opportunities sources:** Market research reports, competitor weaknesses (their
negative reviews), technology shifts enabling new capabilities, regulatory changes
opening new segments, underserved customer jobs.

**Threats sources:** Competitor funding announcements, hiring signals from competitors
(job posts reveal roadmap direction), technology shifts enabling substitutes, platform
dependency risks, macro trends reducing demand.

---

### SWOT Grid Template

```
SWOT ANALYSIS
Subject: [Product / Company / Business Unit / Competitor]
Date: [YYYY-MM-DD]
Prepared by: [Name / Team]

STRENGTHS (internal, positive)
  Evidence required for each item
  S1: [Strength] - Evidence: [metric, quote, data point]
  S2: [Strength] - Evidence: [metric, quote, data point]
  S3: [Strength] - Evidence: [metric, quote, data point]

WEAKNESSES (internal, negative)
  Evidence required for each item
  W1: [Weakness] - Evidence: [metric, quote, data point]
  W2: [Weakness] - Evidence: [metric, quote, data point]
  W3: [Weakness] - Evidence: [metric, quote, data point]

OPPORTUNITIES (external, positive)
  Evidence required for each item
  O1: [Opportunity] - Source: [report, signal, data point]
  O2: [Opportunity] - Source: [report, signal, data point]
  O3: [Opportunity] - Source: [report, signal, data point]

THREATS (external, negative)
  Evidence required for each item
  T1: [Threat] - Source: [competitor action, trend, signal]
  T2: [Threat] - Source: [competitor action, trend, signal]
  T3: [Threat] - Source: [competitor action, trend, signal]
```

---

### TOWS Matrix - Strategic Options

The TOWS matrix crosses the four SWOT quadrants to generate four types of strategic
options. This is the "so what?" layer that makes SWOT actionable.

```
TOWS MATRIX

                  | OPPORTUNITIES (O)       | THREATS (T)
------------------|-------------------------|-------------------------
STRENGTHS (S)     | SO - Maxi/Maxi          | ST - Maxi/Mini
                  | Use strengths to pursue | Use strengths to reduce
                  | opportunities           | impact of threats
                  |                         |
                  | SO1: [S? + O?] = [action]| ST1: [S? + T?] = [action]
                  | SO2: [S? + O?] = [action]| ST2: [S? + T?] = [action]
------------------|-------------------------|-------------------------
WEAKNESSES (W)    | WO - Mini/Maxi          | WT - Mini/Mini
                  | Fix weaknesses to       | Minimize weaknesses and
                  | capture opportunities   | avoid threats (defensive)
                  |                         |
                  | WO1: [W? + O?] = [action]| WT1: [W? + T?] = [action]
                  | WO2: [W? + O?] = [action]| WT2: [W? + T?] = [action]
```

**Action item quality rules:**
- Each action must be specific: who does what, by when, with what success metric
- SO actions are offensive growth moves - prioritize these
- ST actions are defensive moat-building - critical for market leaders
- WO actions are investment/build priorities - typically roadmap items
- WT actions are risk mitigation - often process or partnership plays

---

### Worked SWOT example (condensed)

```
Subject: Acme Deploy (deployment automation tool)
Date: 2025-Q1

S1: One-click rollback - fastest in market (NPS drivers: "rollback saved us" x34)
S2: Multi-cloud support (AWS + GCP + Azure natively)
W1: No on-premise support - blocks 30% of enterprise deals (source: CRM lost reasons)
W2: Dashboard UX rated poor (G2 average: 3.2/5 for "ease of use")
O1: Enterprise compliance wave - SOC2 automation demand up 3x (Gartner 2024)
O2: AI-generated deployment configs trend - 60% of teams trialing AI assist
T1: AWS CodeDeploy native expansion (AWS ecosystem lock-in risk)
T2: New entrant DeployAI raised $20M targeting our SMB base (TechCrunch Jan 2025)

SO: S2 + O1 = Launch multi-cloud SOC2 compliance bundle before AWS adds it
ST: S1 + T2 = Lead with rollback safety in DeployAI competitive messaging
WO: W1 + O1 = Build on-premise beta for 3 reference enterprise customers by Q3
WT: W2 + T2 = Accelerate UX redesign before DeployAI targets our SMB churners
```

---

## Positioning Map Construction Guide

A positioning map (perceptual map) is a 2x2 grid that plots competitors visually on
two strategically meaningful axes. The goal is to reveal clusters (contested space)
and gaps (open space) in the market.

### Step 1 - Choose the right axes

The axes make or break the map. Bad axes produce a map where everyone clusters in
one quadrant and the picture is meaningless.

**Good axis criteria:**
1. **Customer decision criteria** - The axis must represent something customers
   actually weigh when choosing. If customers do not think about it, it is not useful.
2. **Real variance** - Competitors must actually differ on this dimension. If everyone
   scores "high" on ease of use, ease of use is not a good axis.
3. **Orthogonality** - The two axes should be independent (not correlated). Testing:
   "If I moved a product along Axis 1, would its Axis 2 position automatically change?"
   If yes, the axes are correlated.

**Axis discovery process:**
- List the top 5-7 reasons customers choose or reject products in this market
- Identify the two that create the most meaningful segmentation
- Validate against win/loss data: do these dimensions predict outcomes?

---

### Step 2 - Score each competitor

Score each competitor on each axis using a consistent method:

**Option A - Evidence-based scoring:**
Use G2/Capterra review themes, hands-on trial notes, customer interviews.
Score 1-10 on each axis. Document the rationale for each score.

**Option B - Qualitative placement:**
Place each competitor in a quadrant (high/high, high/low, low/high, low/low)
based on their primary positioning and target customer.

---

### Step 3 - Draw and interpret the map

**Full template:**

```
POSITIONING MAP
Market: [name]
Axes: [Y axis label] (vertical) vs [X axis label] (horizontal)
Date: [YYYY-MM-DD]

                    High [Y Axis Label]
                           |
  [Competitor C]           |      [Competitor A]
                           |
  Low [X Axis Label] ------+------ High [X Axis Label]
                           |
                           |  [Competitor B]  [Competitor D]
                    Low [Y Axis Label]

Quadrant interpretation:
- Top-left  ([Low X, High Y]): [What this position means for buyers]
- Top-right ([High X, High Y]): [What this position means for buyers]
- Bot-left  ([Low X, Low Y]): [What this position means for buyers]
- Bot-right ([High X, Low Y]): [What this position means for buyers]

Where we are: [Your product position and why it is strategically defensible]

Open space identified: [Any quadrant with high customer demand but no strong competitor]

Strategic implication: [What this map tells us about where to position or invest]
```

---

### Common positioning map pitfalls

| Pitfall | What happens | Fix |
|---|---|---|
| Axes chosen to make you look good | Map is dishonest; strategy built on it fails | Choose axes based on customer decision criteria, not self-flattery |
| Too many competitors plotted | Map is unreadable; message is lost | Limit to 6-8 competitors; group others into "others" cluster |
| Map never updated | Competitors reposition; map becomes misleading | Rebuild every 6 months or after major competitor moves |
| Axes with no variance | Everyone clusters; no insight generated | Test axis: if 3+ competitors share the same score, choose a different axis |
| Open space assumed to mean opportunity | White space may exist because there is no demand there | Validate open space with customer research before repositioning |
