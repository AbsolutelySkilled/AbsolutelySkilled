<!-- Part of the game-balancing AbsolutelySkilled skill. Load this file when
     working with XP curves, level scaling, power formulas, or prestige systems. -->

# Progression Formulas - Deep Dive

## XP Curve Formulas

### Standard exponential curve

```
xp_required(level) = base_xp * level ^ exponent
```

**Parameters:**
- `base_xp`: XP for level 1. Determines the pace of early game. Typical: 50-200.
- `exponent`: Controls curve steepness. Typical range: 1.5-2.5.

**Cumulative XP (total XP from level 1 to N):**

```
total_xp(N) = sum(base_xp * i^exponent for i in 1..N)
```

For quick estimation: `total_xp(N) ~= base_xp * N^(exponent+1) / (exponent+1)`

### Worked example: 50-level RPG

Parameters: base_xp=100, exponent=1.8, earn_rate=200 XP/hr at midgame

| Level | XP required | Cumulative | Hours to reach | Session count (30min) |
|---|---|---|---|---|
| 1 | 100 | 100 | 0.5 | 1 |
| 5 | 1,552 | 4,237 | 3.5 | 7 |
| 10 | 6,310 | 22,540 | 14 | 28 |
| 20 | 25,119 | 130,891 | 55 | 110 |
| 30 | 60,753 | 394,200 | 130 | 260 |
| 40 | 115,478 | 885,700 | 245 | 490 |
| 50 | 191,310 | 1,680,000 | 400 | 800 |

**Analysis:** Level 50 takes ~400 hours. For a hardcore MMO, this is reasonable
(~6 months at 2hr/day). For a casual game, this is too long - reduce exponent to
1.5 or add catch-up mechanics.

### Alternative curves

**Fibonacci-style:** Each level requires the sum of the previous two levels' XP.
Creates a naturally accelerating curve that feels organic.

```
xp(1) = base
xp(2) = base
xp(n) = xp(n-1) + xp(n-2)
```

**Stepped:** XP requirements jump at tier boundaries (every 10 levels) but are
flat within a tier. Good for games with clear "chapter" boundaries.

```
xp(level) = tier_base[floor(level/10)] * (1 + (level % 10) * 0.1)
```

**Logarithmic (inverted):** Early levels are hard, later levels are easier. Rare
but useful for "mastery" systems where early learning is the bottleneck.

```
xp(level) = base * log(level + 1) / log(2)
```

## Power Scaling

### Stat growth formulas

Player stats (HP, attack, defense) should grow in a way that maintains the
challenge delta against enemies. Common approaches:

**Linear growth (simple):**
```
stat(level) = base_stat + (growth_per_level * level)
```
Easy to balance but feels flat at high levels.

**Compound growth (percentage-based):**
```
stat(level) = base_stat * (1 + growth_rate) ^ level
```
Growth_rate of 0.03-0.08 (3-8% per level) is typical. Creates exponential curves
that feel rewarding but require exponential enemy scaling to match.

**Diminishing returns (soft cap):**
```
stat(level) = max_stat * (1 - e^(-growth_rate * level))
```
Approaches a maximum asymptotically. Good for stats that should cap out (crit
chance, cooldown reduction) to prevent game-breaking values.

### Enemy scaling strategies

**Fixed scaling:** Each enemy has set stats. Players outlevel them and feel
powerful. Good for linear games with no backtracking.

**Level-matched scaling:** Enemies scale to player level. Maintains challenge
but can feel like the player never progresses. Use sparingly - only for specific
"challenge" zones.

**Bracket scaling:** Enemies have a level range (e.g., goblin: level 3-7). Within
that range, they scale. Outside it, they're fixed. Best of both worlds.

**Recommended formula for bracket scaling:**
```
enemy_stat(player_level) = base_stat * clamp(player_level / enemy_center_level, 0.7, 1.3)
```
This keeps enemies within 70-130% of their intended difficulty relative to the
player's level.

## Prestige / Reset Loop Design

### When to add prestige

Add a prestige/rebirth/new-game-plus system when:
- The main progression has a natural endpoint (max level reached)
- You want to extend game lifetime without adding new content
- Players enjoy optimizing and min-maxing

### Prestige reward scaling

Each prestige cycle should offer a permanent bonus that makes the next cycle
faster. Typical structure:

| Prestige level | Bonus | Total multiplier | Time to complete cycle |
|---|---|---|---|
| 0 (first play) | None | 1.0x | 40 hours |
| 1 | +25% XP gain | 1.25x | 32 hours |
| 2 | +25% XP gain | 1.56x | 25 hours |
| 3 | +25% XP gain | 1.95x | 20 hours |
| 5 | +25% XP gain | 3.05x | 13 hours |
| 10 | +25% XP gain | 9.31x | 4.3 hours |

**Critical rule:** The time savings should be meaningful but never trivial. If
prestige 10 takes less than 10% of the original time, you've made it too fast
and players will feel the loop is pointless.

**Target:** Each prestige should reduce cycle time by 15-25%. Diminishing returns
should kick in around prestige 5-7 to prevent infinite acceleration.

### Prestige cost design

What the player sacrifices on prestige:

- **Full reset (harsh):** Lose all levels, items, currency. Only keep prestige
  bonuses. High stakes, high reward feeling.
- **Partial reset (moderate):** Keep key unlocks (recipes, achievements) but lose
  levels and consumables. Most common choice.
- **Soft reset (gentle):** Keep almost everything, gain a small permanent bonus.
  Low stakes, good for casual audiences.

## Skill Tree Balancing

### Node costing

Each node in a skill tree should cost points proportional to its power:

```
node_cost = base_cost * power_tier_multiplier * depth_multiplier
```

Where:
- `power_tier_multiplier`: 1.0 (minor), 1.5 (moderate), 2.5 (major), 4.0 (capstone)
- `depth_multiplier`: 1.0 + (0.2 * distance_from_root)

### Path balance validation

No single path through a skill tree should be more than 15% stronger than
alternatives at equivalent point investment. Test by:

1. Calculate total DPS/effectiveness for each complete path
2. Normalize to points spent
3. If any path exceeds the mean by >15%, reduce its strongest node or buff
   competing paths

### Respec economics

Always allow respecs. The cost should be:
- Free for the first 3 respecs (experimentation phase)
- Scaling cost afterward: `respec_cost = base * 2^(respec_count - 3)`
- Hard cap the cost at a value achievable in 1-2 hours of play
- Optional: free respec on major patches that change balance
