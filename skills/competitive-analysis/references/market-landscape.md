<!-- Part of the Competitive Analysis AbsolutelySkilled skill. Load this file when
     working with market landscape mapping, Porter's Five Forces, strategic groups,
     or TAM/SAM/SOM analysis. -->

# Market Landscape - Deep Dive

## Porter's Five Forces

Use Porter's Five Forces to assess the structural attractiveness of a market before
entering or when evaluating competitive intensity.

### 1. Threat of New Entrants

How easy is it for new competitors to enter this market?

**Factors that raise barriers (good for incumbents):**
- High capital requirements (hardware, infrastructure)
- Strong network effects (marketplace, social platform)
- Regulatory requirements (fintech, healthcare)
- Proprietary technology or patents
- High switching costs for customers
- Brand loyalty and trust built over years

**Factors that lower barriers (bad for incumbents):**
- Open-source alternatives reduce build cost
- Cloud infrastructure eliminates hardware investment
- API-first platforms enable fast assembly of competing products
- Low switching costs (export data easily, no lock-in)

**Assessment template:**
```
Threat of New Entrants: [High / Medium / Low]
Key barriers: [list top 3]
Key enablers: [list top 2]
Implication: [one sentence on what this means for your strategy]
```

### 2. Bargaining Power of Suppliers

Who supplies the critical inputs to your product, and can they squeeze you?

For software companies, "suppliers" include:
- Cloud infrastructure providers (AWS, GCP, Azure)
- AI model providers (OpenAI, Anthropic, Google)
- Key open-source projects (if a critical dependency)
- Data providers (if your product depends on third-party data)
- Distribution platforms (App Store, Chrome Web Store)

**High supplier power indicators:**
- Few alternatives (one dominant AI model provider)
- High switching cost (deep integration with one cloud)
- Supplier could forward-integrate (AWS building competing products)

### 3. Bargaining Power of Buyers

How much leverage do your customers have?

**High buyer power indicators:**
- Few large customers account for most revenue
- Low switching costs (easy data export, standard formats)
- Buyers are price-sensitive (commodity market)
- Buyers have full information on alternatives
- The product is a small part of the buyer's total spend

**Low buyer power indicators:**
- Fragmented customer base (no single customer is >5% of revenue)
- High switching costs (data lock-in, workflow integration)
- Product is mission-critical with few alternatives

### 4. Threat of Substitutes

What completely different approaches could replace your product category?

Substitutes are not direct competitors - they are different solutions to the same
problem. Examples:
- Video conferencing substitutes for business travel
- AI code generation substitutes for hiring junior developers
- No-code tools substitute for custom software development
- Outsourcing substitutes for internal tool building

**Assessment:** For each substitute, evaluate:
- Performance trade-off: does the substitute do the job well enough?
- Price trade-off: is the substitute meaningfully cheaper?
- Switching cost: how hard is it for buyers to move to the substitute?

### 5. Competitive Rivalry

How intense is competition among existing players?

**High rivalry indicators:**
- Many competitors of similar size
- Slow market growth (fighting for share, not growth)
- Low differentiation (commodity features)
- High fixed costs (pressure to fill capacity)
- High exit barriers (can't easily leave the market)

**Low rivalry indicators:**
- Clear market leader with >40% share
- Fast market growth (enough for everyone)
- Strong differentiation between players
- High switching costs reduce churn between competitors

---

## Strategic Group Mapping

Strategic groups are clusters of competitors that follow similar strategies.
Mapping them reveals who you really compete against (not everyone in the market).

**How to build a strategic group map:**

1. Choose two strategic dimensions that separate competitors:
   - Price level (low/mid/high)
   - Product scope (point solution vs platform)
   - Target segment (SMB vs mid-market vs enterprise)
   - Geographic focus (regional vs global)
   - Go-to-market (self-serve vs sales-led vs channel)
   - Technology approach (cloud-native vs on-premise)

2. Plot competitors as circles on a 2D grid. Circle size = relative market share
   or revenue.

3. Draw boundaries around clusters. Competitors within a cluster are your direct
   strategic rivals. Competitors in other clusters compete differently.

**Example:**
```
Strategic Group Map: Project Management Tools

                    Enterprise
                         |
           [MS Project]  |  [ServiceNow]
           [Smartsheet]  |  [Jira]
                         |
  Point Solution --------+-------- Platform
                         |
           [Todoist]     |  [Notion]
           [Things]      |  [Monday.com]
                         |
                      SMB
```

**Mobility barriers:** The factors that make it hard to move between strategic groups.
A point solution cannot easily become a platform (requires years of development). A
sales-led enterprise tool cannot easily become self-serve (requires product rebuild).
These barriers protect your strategic group from invasion.

---

## TAM / SAM / SOM Analysis

Use TAM/SAM/SOM to size the market opportunity and set realistic targets.

**Definitions:**
- **TAM** (Total Addressable Market): Total revenue opportunity if you captured 100%
  of the market. Every possible customer, globally.
- **SAM** (Serviceable Addressable Market): The portion of TAM you can realistically
  reach with your current product, geography, and go-to-market.
- **SOM** (Serviceable Obtainable Market): The portion of SAM you can realistically
  capture in the next 1-3 years given competition and resources.

**Calculation methods:**

**Top-down (quick, less accurate):**
```
TAM = [Total # of potential customers] x [Average annual contract value]
SAM = TAM x [% in your target segment and geography]
SOM = SAM x [Realistic market share % in 1-3 years]
```

**Bottom-up (slower, more accurate):**
```
SOM = [# of customers you can reach with current sales capacity]
      x [Expected win rate]
      x [Average deal size]
SAM = SOM / [Your expected market share in reachable segment]
TAM = SAM / [% of total market your segment represents]
```

**Rules of thumb:**
- Always present both top-down and bottom-up. If they differ by >5x, your assumptions
  are wrong somewhere.
- Investors care about SAM more than TAM. A $100B TAM means nothing if your SAM is $50M.
- SOM should be achievable - tie it to your sales headcount, pipeline, and conversion rates.
- Update annually as the market evolves.

---

## Market Segmentation for Competitive Analysis

Segment the market to identify where you can win, not just where the market is big.

**Segmentation criteria:**
- **Company size:** SMB (<100 employees), Mid-market (100-1000), Enterprise (1000+)
- **Industry vertical:** Each vertical has different needs, budgets, and buying processes
- **Use case:** What specific job they hire your product for
- **Technical maturity:** Early adopters vs mainstream vs laggards
- **Current solution:** What they use today (competitor, spreadsheet, nothing)

**Competitive heat map:**

```
| Segment           | Your Strength | Comp A | Comp B | Status Quo | Priority |
|-------------------|---------------|--------|--------|------------|----------|
| SMB / SaaS        | Strong        | Strong | Weak   | Medium     | Defend   |
| Mid-market / SaaS | Medium        | Strong | Strong | Low        | Invest   |
| Enterprise / Fin  | Weak          | Medium | Strong | Low        | Monitor  |
| SMB / Ecommerce   | Medium        | Weak   | Weak   | Strong     | Attack   |
```

Priority definitions:
- **Defend:** You are strong here; protect the position
- **Invest:** Opportunity to gain share; allocate resources
- **Attack:** Competitors are weak; offensive opportunity
- **Monitor:** Not worth investing now; watch for changes
- **Abandon:** Low opportunity, strong competition; redirect resources
