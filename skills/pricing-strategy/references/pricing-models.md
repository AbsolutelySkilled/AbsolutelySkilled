<!-- Part of the pricing-strategy AbsolutelySkilled skill. Load this file when
     working with detailed pricing model comparisons and selection. -->

# Pricing Models Deep Dive

## Model comparison matrix

| Model | How it works | Best for | Watch out for |
|---|---|---|---|
| Flat-rate | One price, one plan, all features | Simple products with homogeneous users | Leaves money on the table with power users; no upgrade path |
| Per-seat | Charge per user per month | Collaboration tools where every user gets equal value | Seat consolidation (users share logins); penalizes adoption |
| Usage-based | Charge per unit consumed | APIs, infrastructure, messaging platforms | Revenue unpredictability; customers may throttle usage to save money |
| Tiered (good/better/best) | 3-4 plans with increasing features and limits | Most SaaS products | Too many tiers cause paralysis; too few miss segments |
| Freemium | Free tier + paid tiers | Products with viral loops or network effects | Freeloaders consume resources; free tier cannibalizes paid |
| Free trial | Full access for limited time | Products with high activation energy | Short trials may not show value; long trials delay revenue |
| Reverse trial | Start on paid, auto-downgrade to free | Products where free users need to experience premium first | Churn spike at trial end if value is not proven |
| Hybrid (seat + usage) | Base per-seat fee + usage overage | Products with both collaboration and consumption value | Complex to understand; hard to predict bills |
| Revenue share | Take a percentage of customer's revenue | Marketplaces, payment processors | Revenue tied to customer success; volatile |
| Credit-based | Buy credits, spend on actions | AI/ML platforms, multi-product suites | Credit pricing is opaque; customers hoard or waste credits |

---

## Decision tree for model selection

**Step 1: Identify your value metric**

Ask: "When the customer gets more value, what number goes up?"
- More users collaborating -> per-seat
- More API calls / messages / compute -> usage-based
- More revenue processed -> revenue share
- Hard to isolate a single metric -> tiered flat-rate

**Step 2: Assess usage predictability**

- Customer can predict monthly usage -> usage-based works
- Usage is spiky or unpredictable -> add committed tiers or caps
- Customer budgets annually -> offer annual commitment discounts

**Step 3: Evaluate network effects**

- Free users create value for paid users (content, network, data) -> freemium
- Free users do not create value for anyone but themselves -> free trial
- Product requires team adoption to show value -> reverse trial

**Step 4: Consider sales motion**

- Self-serve (credit card, no human) -> transparent pricing on website
- Sales-assisted (demo, then close) -> show base pricing, "Contact Sales" for enterprise
- Enterprise-only (all deals negotiated) -> no public pricing, focus on value selling

---

## Per-seat pricing deep dive

**When it works:**
- Every seat gets roughly equal value (Slack, Figma, Notion)
- The product is inherently collaborative
- Adding users increases the product's value (network effect within the org)

**When it fails:**
- Some users are admins who log in once a month (penalized by per-seat)
- The product is used by one power user who generates value for many (analytics dashboards)
- Customers have seasonal workers or contractors (seat count fluctuates)

**Variants:**
- **Per active user** - Only charge for users who log in. Reduces friction for
  large orgs. Slack pioneered this.
- **Tiered seats** - Different seat types at different prices (viewer vs editor
  vs admin). Figma uses this.
- **Platform fee + seats** - Base platform fee plus per-seat cost. Covers fixed
  infrastructure costs. HubSpot uses this model.

---

## Usage-based pricing deep dive

**Choosing the value metric:**

The metric must satisfy three criteria:
1. **Easy to understand** - Customers can explain it to their CFO in one sentence
2. **Scales with value** - More usage = more value for the customer
3. **Predictable** - Customers can estimate their monthly bill before it arrives

Good metrics: API calls, messages sent, GB stored, compute hours, events tracked.
Bad metrics: "AI tokens" (opaque), "credits" (arbitrary), "processing units" (vague).

**Pricing tiers for usage-based:**

```
Tier 1: 0 - 10,000 units    -> $0.01 per unit
Tier 2: 10,001 - 100,000    -> $0.008 per unit
Tier 3: 100,001 - 1,000,000 -> $0.005 per unit
Tier 4: 1,000,000+          -> Custom pricing
```

**Volume vs graduated pricing:**
- **Volume pricing** - All units priced at the tier you land in. Simpler but creates
  cliff effects (going from 10,000 to 10,001 units suddenly reprices everything).
- **Graduated pricing** - Each unit priced at the tier where it falls. No cliff
  effects. More complex to explain. Stripe uses this.

Always use graduated pricing unless you have a strong reason not to. Cliff effects
cause customer frustration and gaming behavior.

---

## Freemium design framework

**The three laws of freemium:**

1. **The free tier must deliver real value** - Not a crippled demo. Users must
   complete the core value loop on free. If free users are frustrated, they leave -
   they do not upgrade.

2. **The free tier must have clear limits** - Limits should be generous enough to
   prove value but restrictive enough that growing teams naturally outgrow them.
   Good limits: storage, seats, features. Bad limits: time-bombing, watermarks.

3. **The upgrade path must be obvious** - Users should encounter the paywall at a
   moment of success ("You have used all 5 projects - upgrade to create more")
   not failure ("Error: limit exceeded").

**Freemium benchmarks:**

| Metric | Healthy range |
|---|---|
| Free to paid conversion | 2-5% |
| Time to first paid conversion | 14-90 days |
| Free user to paid user ratio | 20:1 to 50:1 |
| Monthly active free users | Should grow month over month |
| Viral coefficient from free users | > 0.3 (each free user brings 0.3 new users) |

---

## Reverse trial model

A reverse trial starts every new user on the full paid experience for a limited
period (typically 14 days), then automatically downgrades them to a free tier.

**Why it works:**
- Users experience the premium value before being asked to pay
- The loss aversion of downgrading is stronger than the aspiration of upgrading
- Eliminates the "I never tried the paid features" objection

**When to use:**
- Your paid features require setup/configuration time to show value
- The gap between free and paid is large and hard to preview
- You already have a freemium model with low conversion and want to boost it

**Examples:** Airtable, Loom, Zapier (variations of this approach)

**Implementation notes:**
- Clearly communicate the trial duration upfront (no surprises)
- Send reminders at day 7, day 12, and day 14
- At downgrade, show exactly which features they are losing with one-click re-upgrade
- Do not require a credit card for the reverse trial (that makes it a standard trial)
