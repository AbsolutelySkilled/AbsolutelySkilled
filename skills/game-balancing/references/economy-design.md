<!-- Part of the game-balancing AbsolutelySkilled skill. Load this file when
     working with in-game economy design, currency systems, or market balancing. -->

# Economy Design - Deep Dive

## Sink/Faucet Modeling

### Step 1: Map the flow

Create a directed graph of every resource in the game:

```
[Quest Rewards] ---> [Player Gold] ---> [NPC Shop]
[Monster Drops] ---> [Player Gold] ---> [Crafting Costs]
[Daily Login]   ---> [Player Gold] ---> [Repair Bills]
[Trading]       <--> [Player Gold] <--> [Auction House Tax]
```

Every arrow INTO the player stock is a faucet. Every arrow OUT is a sink.
Bidirectional arrows (trading) create secondary flows that need their own sinks.

### Step 2: Quantify hourly rates

For each faucet and sink, estimate the per-hour flow for three player archetypes:

| Archetype | Play style | Gold/hr earned | Gold/hr spent |
|---|---|---|---|
| Casual (bottom 25%) | Quests only, slow pace | 300 | 200 |
| Median (middle 50%) | Mixed quests + farming | 700 | 500 |
| Hardcore (top 25%) | Optimized farming routes | 1,500 | 800 |

**Red flag:** If hardcore earners accumulate 3x+ faster than they spend, you
need progressive sinks (higher repair costs at higher levels, luxury cosmetics,
prestige resets that cost currency).

### Step 3: Model over time

Simulate 100 hours of play for each archetype. Plot cumulative stock over time.
A healthy economy shows:

- Casual: slow but steady growth, can afford core items by midgame
- Median: comfortable growth, occasional saving for big purchases
- Hardcore: fast growth but with meaningful endgame sinks that prevent hoarding

### Inflation prevention

**Bounded currencies:** Cap how much a player can hold (e.g., 999,999 gold).
This is a blunt instrument but prevents extreme outliers.

**Decay mechanics:** Resources lose value over time (food spoils, gear degrades).
Adds realism but players may find it punishing. Use sparingly.

**Progressive taxation:** Auction house fees scale with transaction value. A 5%
fee on small trades, 15% on large trades. This drains more from wealthy players.

**Money sinks disguised as content:** Cosmetic housing, mount breeding, guild
upgrades - these are optional sinks that players choose to engage with. Most
effective because they feel rewarding, not punitive.

## Multiplayer Market Dynamics

### Player-driven economies

When players can trade freely, you lose direct control over pricing. Instead,
you control:

1. **Supply** - Drop rates determine how many items enter the economy
2. **Demand** - Crafting recipes and gear requirements determine consumption
3. **Transaction costs** - Auction house fees remove currency from circulation
4. **Item lifetime** - Durability, binding-on-equip, and seasonal resets control
   item supply over time

### Common multiplayer economy problems

**Bot farming:** Automated players generate resources 24/7, causing massive
inflation. Mitigation: daily earn caps, CAPTCHA-like mechanics for farming
activities, diminishing returns on repeated content.

**Market manipulation:** Wealthy players buy out all stock of an item to corner
the market. Mitigation: price ceilings on essential items, NPC vendors as price
anchors, limiting stack purchases.

**New player gap:** Veterans have millions; new players have nothing. The economy
prices items at veteran levels, making early game unplayable. Mitigation: level-
bracketed markets, starter-bound items, catch-up mechanics that give new players
accelerated earning.

### Dual currency systems

Most successful F2P games use two currencies:

| Currency | Earn method | Spend on | Flow rate |
|---|---|---|---|
| Soft (gold, coins) | Gameplay | Core items, upgrades | High volume, steady |
| Hard (gems, crystals) | Real money + small free drip | Cosmetics, convenience | Low volume, precious |

**Critical rule:** Never let hard currency buy power that soft currency cannot
eventually also buy. The conversion should be time, not exclusivity.

### Exchange rate management

If players can convert between soft and hard currency:

- Fixed rate (developer-set): Simple but may not reflect actual value
- Market rate (player-driven): Flexible but volatile
- Hybrid (developer floor/ceiling, market between): Best of both worlds

Set the floor at 80% of your target rate and the ceiling at 120%. This prevents
extreme manipulation while allowing organic price discovery.

## Economy Health Metrics

Track these weekly for live games:

| Metric | Healthy range | Action if outside |
|---|---|---|
| Average gold per player | Grows 2-5% per week | Below: increase faucets. Above: add sinks |
| Gini coefficient | 0.3-0.5 | Above 0.6: wealth too concentrated, add progressive sinks |
| Auction house velocity | 10-30% of items listed sell per day | Below 10%: prices too high. Above 30%: prices too low |
| Currency per hour played | Stable +/- 10% | Increasing: inflation. Decreasing: add content rewards |
| Sink participation rate | 60%+ of players use major sinks | Below 40%: sinks not attractive enough, redesign |
