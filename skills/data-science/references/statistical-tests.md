<!-- Part of the Data Science AbsolutelySkilled skill. Load this file when choosing a statistical test, checking test assumptions, or selecting a non-parametric alternative. -->
# Statistical Tests Reference

Decision framework for choosing, applying, and validating statistical tests.
When in doubt, check assumptions first - the wrong test on violated assumptions
produces misleading results silently.

---

## Decision Tree: Choosing the Right Test

```
What is your outcome variable type?
│
├─ CONTINUOUS (revenue, time, score)
│   │
│   ├─ How many groups are you comparing?
│   │   │
│   │   ├─ ONE GROUP vs a known value
│   │   │   └─ One-sample t-test (or Wilcoxon signed-rank if non-normal)
│   │   │
│   │   ├─ TWO GROUPS
│   │   │   ├─ Are they independent? (different people)
│   │   │   │   ├─ Normal + equal variance -> Independent t-test
│   │   │   │   ├─ Normal + unequal variance -> Welch's t-test (default)
│   │   │   │   └─ Non-normal or small n -> Mann-Whitney U
│   │   │   └─ Are they paired? (same people, before/after)
│   │   │       ├─ Normal differences -> Paired t-test
│   │   │       └─ Non-normal differences -> Wilcoxon signed-rank
│   │   │
│   │   └─ THREE OR MORE GROUPS
│   │       ├─ Normal + equal variance -> One-way ANOVA
│   │       │   └─ Post-hoc: Tukey HSD (controls family-wise error rate)
│   │       └─ Non-normal or unequal variance -> Kruskal-Wallis
│   │           └─ Post-hoc: Dunn test with Bonferroni correction
│   │
│   └─ Are you looking at a relationship between two continuous variables?
│       ├─ Linear relationship? -> Pearson correlation (r)
│       └─ Non-linear / ordinal? -> Spearman rank correlation (rho)
│
├─ CATEGORICAL (converted, clicked, churned)
│   │
│   ├─ TWO variables (e.g., group vs outcome)
│   │   ├─ Expected cell count >= 5 in all cells -> Chi-square test
│   │   └─ Small samples (expected count < 5) -> Fisher's Exact Test
│   │
│   └─ ORDINAL outcome (Likert scale, rating 1-5)
│       ├─ Two groups -> Mann-Whitney U
│       └─ Three+ groups -> Kruskal-Wallis
│
└─ TIME-TO-EVENT (time to churn, time to convert)
    ├─ Comparing survival curves -> Log-rank test
    └─ Controlling for covariates -> Cox proportional hazards
```

---

## Assumption Checks

Every parametric test has assumptions. Always verify them explicitly.

### Normality

**When to check:** Before t-tests, ANOVA, Pearson correlation.

```python
from scipy import stats
import numpy as np

def check_normality(data, name="variable"):
    n = len(data)
    # Shapiro-Wilk: reliable for n < 5000
    if n <= 5000:
        stat, p = stats.shapiro(data)
        test_name = "Shapiro-Wilk"
    else:
        # Kolmogorov-Smirnov with estimated parameters - for large samples
        stat, p = stats.normaltest(data)  # D'Agostino-Pearson
        test_name = "D'Agostino-Pearson"

    print(f"{name} ({test_name}): stat={stat:.4f}, p={p:.4f}")
    if p < 0.05:
        print(f"  -> Non-normal. Consider Mann-Whitney U or log-transform.")
    else:
        print(f"  -> Cannot reject normality at alpha=0.05.")
    return p > 0.05
```

**Visual check (always do this too):**
```python
import matplotlib.pyplot as plt
from scipy import stats

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].hist(data, bins=30)
axes[0].set_title("Histogram")
stats.probplot(data, plot=axes[1])
axes[1].set_title("Q-Q Plot")
plt.tight_layout()
```

A Q-Q plot with points close to the diagonal line = approximately normal.
Heavy tails = leptokurtic; S-shape = skewed.

### Equal Variance (Homoscedasticity)

**When to check:** Before independent t-test, ANOVA.

```python
# Levene's test - robust to non-normality (prefer over Bartlett's)
stat, p = stats.levene(group_a, group_b)
print(f"Levene's test: stat={stat:.4f}, p={p:.4f}")
if p < 0.05:
    print("Unequal variances - use Welch's t-test (equal_var=False)")
    t_stat, p_val = stats.ttest_ind(group_a, group_b, equal_var=False)
else:
    print("Equal variances - standard t-test is fine")
    t_stat, p_val = stats.ttest_ind(group_a, group_b, equal_var=True)
```

**Rule of thumb:** If the ratio of the larger variance to the smaller variance
exceeds 4:1, assume unequal variances even if Levene's is borderline.

### Independence

This cannot be tested statistically - it must be verified by design.

- Are observations truly independent? (Repeated measures from the same user violate this)
- Is there clustering? (Users within the same country, sessions from the same user)
- Time series data is almost never independent (use autocorrelation tests)

---

## Test Reference Table

| Test | Use Case | Parametric | Python |
|------|----------|------------|--------|
| One-sample t-test | Sample mean vs known value | Yes | `stats.ttest_1samp` |
| Welch's t-test | Two independent groups, unequal variance | Yes | `stats.ttest_ind(equal_var=False)` |
| Independent t-test | Two independent groups, equal variance | Yes | `stats.ttest_ind` |
| Paired t-test | Same subjects, two conditions | Yes | `stats.ttest_rel` |
| One-way ANOVA | Three+ independent groups | Yes | `stats.f_oneway` |
| Chi-square | Two categorical variables | No | `stats.chi2_contingency` |
| Fisher's Exact | Small sample categorical | No | `stats.fisher_exact` |
| Mann-Whitney U | Two independent groups, non-normal | No | `stats.mannwhitneyu` |
| Wilcoxon signed-rank | Paired, non-normal | No | `stats.wilcoxon` |
| Kruskal-Wallis | Three+ groups, non-normal | No | `stats.kruskal` |
| Pearson r | Linear relationship, continuous | Yes | `stats.pearsonr` |
| Spearman rho | Monotonic relationship, ordinal/non-normal | No | `stats.spearmanr` |
| Log-rank | Survival curve comparison | No | `lifelines.statistics.logrank_test` |

---

## Multiple Comparisons

When running multiple tests, the probability of at least one false positive
grows rapidly. With 20 independent tests at alpha=0.05, you expect 1 false positive
by chance alone.

**Bonferroni correction** (conservative, use when tests are independent):
```python
alpha_corrected = 0.05 / n_tests  # Divide by number of tests
```

**Benjamini-Hochberg (FDR)** (less conservative, use when tests are correlated):
```python
from statsmodels.stats.multitest import multipletests

p_values = [0.001, 0.02, 0.04, 0.11, 0.23]
reject, p_adjusted, _, _ = multipletests(p_values, method="fdr_bh", alpha=0.05)
print(list(zip(reject, p_adjusted)))
```

**When to use what:**
- Family-wise error rate control (avoid any false positive) -> Bonferroni
- False discovery rate control (control fraction of false positives) -> BH
- Post-hoc ANOVA comparisons -> Tukey HSD (already controls FWER)

---

## Effect Sizes

A statistically significant result with a negligible effect size is rarely
worth acting on. Always report effect size alongside p-values.

| Test | Effect Size Measure | Small | Medium | Large |
|------|--------------------|----|--------|-------|
| t-test | Cohen's d | 0.2 | 0.5 | 0.8 |
| Chi-square (2x2) | Phi | 0.1 | 0.3 | 0.5 |
| Chi-square (larger) | Cramer's V | 0.1 | 0.3 | 0.5 |
| ANOVA | Eta-squared (eta^2) | 0.01 | 0.06 | 0.14 |
| Correlation | r | 0.1 | 0.3 | 0.5 |

```python
import numpy as np

# Cohen's d for two groups
def cohens_d(a, b):
    pooled_std = np.sqrt((np.std(a, ddof=1) ** 2 + np.std(b, ddof=1) ** 2) / 2)
    return (np.mean(b) - np.mean(a)) / pooled_std

# Cramer's V for chi-square
def cramers_v(chi2_stat, n, min_dim):
    return np.sqrt(chi2_stat / (n * (min_dim - 1)))

# Eta-squared for one-way ANOVA
def eta_squared(f_stat, df_between, df_within):
    return (f_stat * df_between) / (f_stat * df_between + df_within)
```

---

## Common Pitfalls

| Pitfall | Example | Fix |
|---------|---------|-----|
| Using t-test on proportions | Comparing click rates | Use chi-square or z-test for proportions |
| Bartlett's test with non-normal data | Testing variance equality before ANOVA on skewed data | Use Levene's test instead |
| Ignoring tied ranks in Mann-Whitney | Lots of zero values in outcome | Use `method='exact'` for small n or report rank-biserial r |
| Running chi-square with small expected counts | < 5 expected in any cell | Use Fisher's Exact Test |
| Confusing one-tailed vs two-tailed | Directional hypothesis but using two-tailed p | Decide the direction before collecting data; one-tailed doubles power but is only valid with a prior directional hypothesis |
| Using Pearson r on non-linear relationships | Quadratic relationship appears as r ~ 0 | Plot scatter first; use Spearman for monotonic non-linear |
