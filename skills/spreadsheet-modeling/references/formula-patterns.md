<!-- Part of the spreadsheet-modeling AbsolutelySkilled skill. Load this file when
     working with advanced formulas, array formulas, LAMBDA, LET, dynamic arrays,
     or regex patterns in Excel or Google Sheets. -->

# Advanced Formula Patterns

## LET - Name intermediate calculations

LET eliminates repeated sub-expressions and makes complex formulas readable.

```
=LET(
  revenue, SUMIFS(Sales[Amount], Sales[Region], A1),
  cost, SUMIFS(Sales[Cost], Sales[Region], A1),
  margin, revenue - cost,
  margin_pct, IF(revenue=0, 0, margin / revenue),
  TEXT(margin_pct, "0.0%")
)
```

Use LET whenever a sub-expression appears more than once, or when naming an
intermediate step improves readability.

---

## LAMBDA - Reusable custom functions (no VBA)

LAMBDA lets you define custom functions in the Name Manager without VBA.

**Define in Name Manager (Formulas > Name Manager > New):**
```
Name: TAX
Refers to: =LAMBDA(amount, rate, amount * rate)
```

**Use in cells:**
```
=TAX(B5, Tax_Rate)
```

**LAMBDA with MAP for row-by-row processing:**
```
=MAP(Sales[Amount], LAMBDA(amt, IF(amt > 1000, amt * 0.9, amt)))
```

**LAMBDA with REDUCE for accumulation:**
```
=REDUCE(0, Sales[Amount], LAMBDA(acc, amt, acc + amt))
```

---

## Dynamic array functions (Excel 365+ / Google Sheets)

These functions return arrays that "spill" across multiple cells.

### FILTER - Extract rows matching criteria

```
=FILTER(Data, (Data[Region]="West") * (Data[Revenue]>10000), "No results")
```

Multiple criteria use `*` for AND, `+` for OR:
```
=FILTER(Data, (Data[Status]="Active") + (Data[Status]="Pending"))
```

### SORT and SORTBY

```
=SORT(FILTER(Data, Data[Region]="West"), 3, -1)
```

SORTBY sorts by a column that may not be in the output:
```
=SORTBY(Data[Name], Data[Revenue], -1)
```

### UNIQUE - Deduplicate

```
=UNIQUE(Data[Region])
```

Unique rows (all columns must match):
```
=UNIQUE(A2:C100)
```

### SEQUENCE - Generate number series

```
=SEQUENCE(12, 1, 1, 1)          -- 1 to 12 in a column
=SEQUENCE(1, 10, 0, 0.1)        -- 0.0 to 0.9 in a row
=DATE(2025, SEQUENCE(12), 1)     -- First of each month in 2025
```

### CHOOSECOLS / CHOOSEROWS - Select specific columns or rows

```
=CHOOSECOLS(Data, 1, 3, 5)      -- Return columns 1, 3, 5 only
=CHOOSEROWS(Data, 1, -1)         -- First and last row
```

---

## Text manipulation formulas

### TEXTJOIN - Concatenate with delimiter

```
=TEXTJOIN(", ", TRUE, FILTER(Data[Name], Data[Region]="West"))
```

### TEXTSPLIT (Excel 365) - Split delimited text

```
=TEXTSPLIT(A1, ",")              -- Split by comma into columns
=TEXTSPLIT(A1, , CHAR(10))       -- Split by newline into rows
```

### REGEXMATCH / REGEXEXTRACT / REGEXREPLACE (Google Sheets only)

```
=REGEXMATCH(A1, "^\d{3}-\d{4}$")
=REGEXEXTRACT(A1, "(\d+\.?\d*)")
=REGEXREPLACE(A1, "\s+", " ")
```

Excel has no native regex. Use LAMBDA + MID + SEQUENCE for pattern matching,
or VBA's `RegExp` object for complex patterns.

---

## Date and time patterns

### EOMONTH - End of month arithmetic

```
=EOMONTH(TODAY(), 0)             -- Last day of current month
=EOMONTH(TODAY(), -1) + 1        -- First day of current month
=EOMONTH(A1, 0) - EOMONTH(A1, -1)  -- Days in the month of A1
```

### NETWORKDAYS - Business day calculations

```
=NETWORKDAYS(start_date, end_date, holidays_range)
=WORKDAY(start_date, 10, holidays_range)    -- 10 business days from start
```

### Fiscal year / quarter mapping

```
=LET(
  month, MONTH(A1),
  fiscal_month, MOD(month - fiscal_start_month, 12) + 1,
  fiscal_quarter, ROUNDUP(fiscal_month / 3, 0),
  "Q" & fiscal_quarter
)
```

---

## Array formula patterns (legacy CSE)

For older Excel versions without dynamic arrays, use Ctrl+Shift+Enter (CSE):

**Multi-criteria SUMPRODUCT (works everywhere):**
```
=SUMPRODUCT((Data[Region]="West") * (Data[Year]=2025) * Data[Revenue])
```

**Conditional array count of unique values:**
```
=SUMPRODUCT((Data[Region]="West") / COUNTIF(
  IF(Data[Region]="West", Data[Product]),
  IF(Data[Region]="West", Data[Product])
))
```

> SUMPRODUCT does not need CSE entry and works in all Excel versions. Prefer it
> over CSE array formulas for maximum compatibility.

---

## Error handling patterns

### Nested IFERROR for fallback chains

```
=IFERROR(XLOOKUP(A1, Primary[ID], Primary[Value]),
  IFERROR(XLOOKUP(A1, Secondary[ID], Secondary[Value]),
    "Not found in any source"))
```

### IFNA vs IFERROR

Use IFNA when you only want to catch #N/A (lookup miss). Use IFERROR when any
error type should be handled. IFNA is safer because it does not mask unexpected
errors like #REF! or #VALUE! that indicate real problems.

```
=IFNA(XLOOKUP(A1, range, range), 0)     -- Only catches #N/A
=IFERROR(complex_formula, "Error")       -- Catches everything (use carefully)
```

### ISERROR / ISNA for conditional logic

```
=IF(ISNA(MATCH(A1, range, 0)), "New item", "Existing")
```
