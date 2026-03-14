<!-- Part of the Tax Strategy AbsolutelySkilled skill. Load this file when
     evaluating R&D credit eligibility, calculating credit amounts, or
     documenting qualified research activities. -->

# R&D Tax Credit Qualification Guide

The federal R&D tax credit (IRC Section 41) is one of the most valuable and
least-claimed tax benefits available to US businesses. This guide covers the
four-part qualification test in detail, maps common software and engineering
activities to that test, explains how to calculate the credit, and outlines
the startup payroll tax offset procedure.

> **Disclaimer:** This guide is educational only and is not legal or tax advice.
> R&D credit claims are frequently audited. Always work with a qualified tax
> professional or R&D credit specialist to prepare and defend your claim.

---

## The Four-Part Qualification Test

Every activity claimed for the R&D credit must pass all four parts of IRC
Section 41(d). Failing any one part disqualifies the activity.

### Part 1: Qualified Purpose

The activity must be undertaken to develop or improve a **business component** -
defined as a product, process, computer software, technique, formula, or
invention intended to be held for sale, lease, or license, or used in a trade
or business.

**Passes:**
- Developing new SaaS features or products
- Improving the performance, reliability, or scalability of existing software
- Designing and building internal tools that improve business processes
- Developing proprietary algorithms, data models, or ML models

**Fails:**
- Market research or consumer surveys
- Style, taste, or cosmetic changes without functional improvement
- Reproducing an existing product by reverse engineering (copying)
- Research conducted outside the US (foreign research is not qualifying)

---

### Part 2: Technological in Nature

The activity must rely on principles of **engineering, physical science,
biological science, or computer science**. Most software development qualifies
because computer science is explicitly included.

**Passes:**
- Writing code, designing algorithms, or architecting systems
- Electrical or mechanical engineering design work
- Data science and machine learning model development
- Database schema design for performance or new capability

**Fails:**
- Pure business process design without a technical component
- Financial modeling or actuarial analysis
- Social science research or behavioral economics studies
- Management consulting or organizational design

---

### Part 3: Elimination of Technical Uncertainty

At the start of the activity, there must be **genuine uncertainty** about the
capability, methodology, or appropriate design of the business component.
The uncertainty does not need to be at the frontier of science - it just needs
to be uncertain to the taxpayer given their current knowledge.

**Key principle:** "Is there a technically unknown answer to be discovered?" is
the test - not "is this cutting-edge research?"

**Passes:**
- "We don't know if this microservices architecture will handle 10M concurrent
  users without degradation."
- "We are uncertain whether graph-based or embedding-based approaches will
  achieve acceptable accuracy for our recommendation system."
- "We do not know if our proposed compression algorithm will meet latency
  requirements at scale."
- "We are unsure which database technology will support our required query
  patterns at this data volume."

**Fails:**
- Copying a known working solution from documentation
- Routine maintenance, bug fixes for known issues using established methods
- Activities where the methodology and outcome are known in advance
- Training employees on established technologies

**Common misconception:** Uncertainty does not require that the activity
ultimately succeed or that the approach be novel to the industry - only that
it was uncertain to the company at the time.

---

### Part 4: Process of Experimentation

The taxpayer must evaluate one or more alternatives through a **process of
experimentation** - which includes modeling, simulation, systematic trial and
error, testing hypotheses, or evaluating design alternatives.

This is the broadest and most misunderstood part. It does not require a formal
scientific method; iterative software development and architecture evaluation
qualify.

**Passes:**
- Writing prototype code and evaluating its behavior against requirements
- Benchmarking multiple database configurations to find the optimal approach
- A/B testing two algorithm implementations against performance criteria
- Running load tests to identify bottlenecks and iterating on architecture
- Reviewing code, profiling performance, and making targeted improvements
- Building and evaluating ML model variants with different hyperparameters

**Fails:**
- Deploying a known, documented solution without adaptation
- Routine data entry or administrative activities
- Post-development quality assurance testing (testing known behavior)
- Production monitoring without associated development activity

---

## Applying the Four-Part Test: Software Examples

### Example 1: Building a new search feature

| Part | Analysis | Result |
|---|---|---|
| Qualified purpose | Improving a business component (software product) | Pass |
| Technological in nature | Relies on computer science, information retrieval algorithms | Pass |
| Technical uncertainty | Team is uncertain whether full-text, vector, or hybrid search will meet latency and relevance requirements | Pass |
| Process of experimentation | Team prototypes Elasticsearch vs. pgvector vs. Typesense, benchmarks each, and iterates | Pass |

**Result: Qualifying activity.** Engineer wages and contractor costs on this project are eligible.

---

### Example 2: Migrating to a microservices architecture

| Part | Analysis | Result |
|---|---|---|
| Qualified purpose | Improving existing software for scalability and maintainability | Pass |
| Technological in nature | Software architecture, distributed systems design | Pass |
| Technical uncertainty | Uncertain whether service boundaries, inter-service communication patterns, and data consistency strategies will achieve the target reliability | Pass |
| Process of experimentation | Team designs multiple decomposition strategies, builds proof-of-concepts, evaluates trade-offs before committing | Pass |

**Result: Qualifying activity.** Note: routine lift-and-shift migration of known architecture would not qualify.

---

### Example 3: Routine bug fixes

| Part | Analysis | Result |
|---|---|---|
| Qualified purpose | Improving existing product | Pass |
| Technological in nature | Software development | Pass |
| Technical uncertainty | The cause and fix are either known or deterministic to find | Likely Fail |
| Process of experimentation | Standard debugging using known tools and methods | Likely Fail |

**Result: Generally not qualifying.** Exception: if the bug reveals a fundamental architectural issue requiring novel investigation, that investigation component may qualify.

---

### Example 4: Machine learning model development

| Part | Analysis | Result |
|---|---|---|
| Qualified purpose | Developing new ML capability for a product or process | Pass |
| Technological in nature | Computer science, statistics, applied mathematics | Pass |
| Technical uncertainty | Uncertain which model architecture, features, and training approach will achieve target accuracy | Pass |
| Process of experimentation | Iterative training runs, hyperparameter tuning, architecture evaluation, error analysis | Pass |

**Result: Strong qualifying activity.** ML development is among the clearest R&D credit opportunities for software companies.

---

### Example 5: Redesigning a UI/UX

| Part | Analysis | Result |
|---|---|---|
| Qualified purpose | Product improvement | Pass |
| Technological in nature | Pure design changes are not technological; if new frontend rendering techniques are involved, may partially qualify | Conditional |
| Technical uncertainty | Visual design choices are not technical uncertainty | Fail |
| Process of experimentation | User testing is not scientific experimentation under Sec. 41 | Fail |

**Result: Not qualifying.** Exception: if the redesign requires developing new rendering techniques, accessibility technology, or novel frontend architecture, the technical development component may qualify separately.

---

## Calculating the R&D Credit

### Method 1: Regular Credit (20%)

```
Regular Credit = 20% x (QREs - Base Amount)

Where:
  QREs        = Qualified Research Expenditures for the current year
  Base Amount = Fixed-base percentage x Average gross receipts (prior 4 years)
  Fixed-base  = Historical QREs / Historical gross receipts (capped at 16%)
  Minimum     = Base Amount cannot be less than 50% of current year QREs
```

The Regular Credit is more complex to calculate but often yields a larger
credit for companies with a long history and growing R&D spend relative
to revenue.

---

### Method 2: Alternative Simplified Credit (ASC) - 14%

The ASC is simpler and more commonly used by growth companies:

```
ASC = 14% x (Current Year QREs - 50% of Average QREs for prior 3 years)

If the company has no QREs in any of the prior 3 years:
ASC = 6% x Current Year QREs
```

**Example calculation:**

```
Current year QREs:           $2,000,000
Average QREs (prior 3 yrs):  $1,200,000

ASC = 14% x ($2,000,000 - 50% x $1,200,000)
    = 14% x ($2,000,000 - $600,000)
    = 14% x $1,400,000
    = $196,000 federal R&D credit
```

**Choice:** You must elect ASC on an original timely filed return. You cannot
switch between methods year-over-year without restriction. Most CPAs recommend
ASC for companies without extensive historical records or those experiencing
rapid QRE growth.

---

### State R&D Credits

Most US states offer their own R&D credits on top of the federal credit:

| State | Credit rate | Notes |
|---|---|---|
| California | 15% (in-house), 24% (basic) | Refundable for qualified small businesses |
| New York | 9% (qualified emerging technology) | For QETC companies only |
| Texas | No state income tax, but franchise tax credit | Limited application |
| Massachusetts | 10% | Carryforward up to 15 years |
| Georgia | 10% | Jobs creation requirements may apply |

State credits vary significantly in rates, carryforward periods, and whether
they are refundable. A state-by-state analysis is required for multi-state
businesses.

---

## Startup Payroll Tax Offset (Form 6765 Election)

For qualified small businesses (QSBs) with no income tax liability, the R&D
credit can be applied against employer payroll taxes (FICA - Social Security
and Medicare taxes).

**Eligibility requirements:**
- Gross receipts of less than $5 million in the current tax year
- No gross receipts for any period before the 5-year period ending with the
  current tax year (i.e., the company is 5 years old or younger)

**Maximum offset:** Up to $500,000 per year against employer FICA taxes
(the employer's 6.2% Social Security portion only - not the 1.45% Medicare
portion for regular offset; Medicare offset was added in 2023 up to $250K
additional).

**How it works:**
1. Calculate R&D credit on Form 6765 as normal
2. Make the payroll tax offset election on Form 6765 (Part III)
3. The elected amount is claimed on Form 941 (quarterly payroll tax return)
   starting the first quarter after the income tax return is filed
4. The credit reduces the employer's FICA liability for each payroll period
   until the elected amount is exhausted

**Example:**

```
Startup founded 2022, no revenue until 2023
2024 QREs:       $800,000
ASC credit:      6% x $800,000 = $48,000 (no prior 3-year QREs)
Payroll tax offset election: $48,000

If annual employer FICA is $120,000:
  Q1 2025: Offset $12,000 of the $30,000 quarterly FICA deposit
  Q2 2025: Offset $12,000
  Q3 2025: Offset $12,000
  Q4 2025: Offset $12,000
  Credit exhausted after 4 quarters
```

---

## Documentation Best Practices

The IRS can disallow R&D credits entirely if documentation is inadequate.
The Cohan rule (allowing estimates for ordinary business deductions) does not
apply to R&D credits - the taxpayer bears the burden of substantiation.

**Contemporaneous documentation (created during the activity, not reconstructed):**

| Document type | What to capture | Retention |
|---|---|---|
| Project descriptions | Technical uncertainty, hypotheses being tested, experimentation approach | Indefinitely |
| Time records | Employee name, project name, hours or percentage, date | 7 years minimum |
| Payroll records | W-2 wages cross-referenced to qualified projects | 7 years minimum |
| Technical artifacts | Design docs, architecture diagrams, code commits, test results, PR descriptions | 7 years minimum |
| Contractor agreements | Contracts specifying that research is performed in the US and IP belongs to the company | 7 years minimum |
| Meeting notes | Sprint planning, architecture reviews, technical discussions showing experimentation | 7 years minimum |

**Common audit red flags:**
- Time percentages that are round numbers (50%, 25%) without supporting records
- All employees claiming the same R&D percentage
- No technical documentation linking activities to the four-part test
- R&D credit claims that suddenly appear or spike without corresponding increase in headcount or technical complexity
- Contractor costs claimed without a written contract specifying US-based performance

**Practical approach for small teams:**
If formal time tracking is not in place, a "contemporaneous estimate" approach
is acceptable - have each qualified employee complete a project allocation
survey at the end of each quarter, allocating their time to specific projects.
Pair with technical artifacts (Jira tickets, GitHub commit history, design docs)
to substantiate the allocation.

---

## Common Disallowed Activities

These activities are explicitly excluded from the R&D credit regardless of how
technical they appear:

- **Funded research** - Research where another party (grant, contract) funds the
  activity and bears the financial risk; the funded party cannot claim the credit
- **Foreign research** - Any research conducted outside the United States
- **Social sciences, arts, or humanities** - Not eligible regardless of methodology
- **Commercial production** - Quality control testing on existing production processes
- **Surveys and studies** - Market research, efficiency surveys, management studies
- **Computer software developed for internal use** - With narrow exceptions for
  software that meets the high threshold of innovation and significant economic risk
  tests (internal-use software rules are more restrictive than general software)
- **Pre-qualified research** - Funded research where the contractor does not own
  the results and bears no financial risk

---

## Filing and Claiming the Credit

1. **Calculate on Form 6765** - "Credit for Increasing Research Activities"
2. **Pass through to Form 3800** - "General Business Credit" if individual or
   pass-through entity
3. **Elect payroll offset on Form 6765** if applicable (startup election)
4. **Carryforward** - Unused credits carry forward 20 years; carry back 1 year
5. **AMT interaction** - C-Corps may face Alternative Minimum Tax limitations;
   individual owners of pass-throughs may have AMT implications - review annually

**Amended returns:** R&D credits can be claimed on amended returns for open
tax years (generally 3 years from original filing). This means companies that
failed to claim credits in prior years can potentially recover them retroactively.
