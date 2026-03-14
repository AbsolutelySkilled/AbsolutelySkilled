<!-- Part of the game-balancing AbsolutelySkilled skill. Load this file when
     working with playtest planning, data collection, metrics analysis, or
     interpreting balance-related player feedback. -->

# Playtesting Guide - Deep Dive

## How to Run a Balance Playtest

### Playtest types

| Type | Sample size | Duration | Best for |
|---|---|---|---|
| Internal (team) | 3-5 | 30-60 min | Early feel checks, obvious breaks |
| Focused (recruited) | 8-15 | 1-2 hours | Specific mechanic validation |
| Open beta | 100-1000+ | Days-weeks | Statistical validation, economy stress test |
| A/B test (live) | 50%/50% split | 1-2 weeks | Comparing two balance configurations |

### Pre-playtest checklist

- [ ] Define the specific balance question being tested (e.g., "Is the level 10 boss too hard?")
- [ ] Instrument all relevant metrics (see metrics section below)
- [ ] Prepare a control group if doing A/B testing
- [ ] Write down your prediction before the test (prevents confirmation bias)
- [ ] Set success/failure criteria in advance (e.g., "Pass if 65-80% of testers complete it")
- [ ] Recruit testers matching your target audience skill level
- [ ] Prepare a post-session questionnaire (max 5 questions)

### During the playtest

**Observe without interfering.** Do not coach, hint, or explain. If a tester is
confused, that IS the data point. Note:

- Where they pause or hesitate
- Where they express frustration (verbal, facial, body language)
- Where they express delight or surprise
- Any strategies they discover that you didn't intend
- How long each section takes

### Post-session questions (template)

1. "What was the hardest part?" (open-ended, no prompting)
2. "Did you ever feel stuck? Where?" (identifies difficulty spikes)
3. "Did anything feel too easy or pointless?" (identifies trivial content)
4. "How did you feel about the rewards you received?" (economy feedback)
5. "Would you keep playing? Why or why not?" (retention signal)

## What Metrics to Track

### Core balance metrics

Instrument these from day one:

**Per-level/encounter:**
```
- completion_rate: % of players who finish
- attempt_count: average attempts before completion
- time_to_complete: median seconds
- death_count: average deaths per attempt
- health_remaining: % HP left on completion (for combat)
- items_used: consumables burned per attempt
```

**Per-session:**
```
- session_length: minutes played
- content_progressed: levels/quests completed
- resources_earned: currency and items gained
- resources_spent: currency and items consumed
- net_resource_change: earned minus spent
```

**Per-player (longitudinal):**
```
- total_playtime: cumulative hours
- current_level: progression status
- total_currency: economic stockpile
- churn_point: last content completed before quitting
- return_rate: % chance of playing again within 7 days
```

### Derived metrics

**Difficulty index** = `1 - completion_rate`. Values above 0.4 indicate a
problem for required content. Optional content can go up to 0.7.

**Economy velocity** = `resources_spent / resources_earned`. Healthy range is
0.6-0.85. Below 0.5 means players are hoarding. Above 0.9 means they feel poor.

**Engagement slope** = `session_length[this_week] / session_length[last_week]`.
Below 0.8 means engagement is dropping fast. Above 1.0 means the game is
gaining momentum.

**Power-to-content ratio** = `player_power_level / recommended_content_level`.
At 1.0, content is matched. Below 0.9, player is undergeared. Above 1.2, content
is trivially easy.

## Statistical Significance for Small Samples

Game playtests often have small sample sizes. Use these guidelines:

### Minimum sample sizes for confidence

| What you're measuring | Minimum testers | Why |
|---|---|---|
| "Is this level completable?" | 5-8 | Binary outcome, need to see at least 1 failure |
| "Is this boss too hard?" | 10-15 | Need enough attempts to estimate true completion rate |
| "Which economy config is better?" | 20+ per group | Comparing two distributions |
| "Is this drop rate felt as fair?" | 30+ | Perception is noisy, need larger sample |

### When you can NOT draw conclusions

- Fewer than 5 testers and all succeeded: You cannot claim the content is balanced.
  You can only say "we found no obvious breaks."
- One tester struggled but others didn't: This is signal, not proof. Note it and
  watch for the pattern in future tests.
- Testers are all from the dev team: Internal testers are 2-5x more skilled than
  the median player.

<!-- VERIFY: The "2-5x more skilled" claim is an industry rule of thumb, not from
     a specific study. The actual multiplier varies by game complexity. -->

### Quick significance check

For completion rate tests with small samples, use this rule of thumb:

If N testers attempt a level and K complete it:
- K/N > 0.8 and N >= 8: Probably fine for required content
- K/N between 0.5-0.8 and N >= 10: Borderline, likely needs tuning
- K/N < 0.5 and N >= 5: Almost certainly too hard

For more rigorous analysis, use a binomial confidence interval. With 10 testers
and 7 completions, the 95% confidence interval for true completion rate is
approximately 35-93%. This is why small samples are tricky - you need more data
to narrow the range.

## Interpreting Results

### The balance interpretation framework

For each metric that's outside healthy range, ask:

1. **Is this a skill problem or a design problem?**
   - Skill: Players don't know what to do (add tutorials, hints)
   - Design: Players know what to do but can't (tune numbers)

2. **Is this affecting the median or the tails?**
   - Median affected: Core balance issue, must fix
   - Only tails affected: Add difficulty options, don't change core

3. **Is the fix additive or subtractive?**
   - Prefer additive (buff the weak path, add a new tool for players)
   - Avoid subtractive (nerfing feels bad, removing options feels worse)

### Common playtest findings and responses

| Finding | Likely cause | Recommended response |
|---|---|---|
| 90%+ completion, zero deaths | Content is trivially easy | Increase enemy HP by 20% or reduce player damage by 15% |
| Below 50% completion | Content is too hard OR unclear | Check if failures are from deaths (too hard) or confusion (unclear) |
| High completion but low satisfaction | Content is tedious, not challenging | Reduce time/repetition, increase stakes and variety |
| Economy stockpile growing 3x faster than expected | Faucets too generous or sinks unappealing | Reduce lowest-effort faucet by 20% AND add an attractive new sink |
| Players all choosing one build/strategy | One path is clearly dominant | Buff alternatives by 10-15%, do NOT nerf the popular path first |
| Session lengths declining week over week | Content stagnation or frustration accumulation | Check churn points - where are players quitting? |

### The balance change process

1. Identify the problem metric
2. Hypothesize the cause (one specific thing)
3. Propose a single parameter change (10-20% adjustment)
4. Predict the expected metric change before implementing
5. Implement the change
6. Playtest again with same methodology
7. Compare actual vs predicted result
8. If prediction was wrong, re-hypothesize (don't just try a bigger change)

Repeat until the metric is within healthy range. Never skip step 4 - predicting
forces you to understand the system, not just react to symptoms.
