<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with data tables, list views, or tabular layouts. -->

# Tables

## Base table styling

Complete CSS for a clean data table:

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  padding: 12px 16px;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.table tbody tr:hover {
  background-color: var(--bg-hover, rgba(0, 0, 0, 0.03));
}
```

No outer border - it looks cleaner without one.

## Column alignment

- Text columns: left-aligned (always)
- Number columns: right-aligned (always, for decimal alignment)
- Status/badge columns: left-aligned
- Action columns: right-aligned
- Checkbox columns: center-aligned, 48px width

```css
.col-number { text-align: right; }
.col-action { text-align: right; }
.col-checkbox {
  text-align: center;
  width: 48px;
}
```

## Sortable columns

```css
.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  color: var(--text-primary);
}

.table th.sort-active {
  color: var(--text-primary);
}

.sort-icon {
  display: inline-block;
  margin-left: 4px;
  opacity: 0.4;
  font-size: 10px;
}

.sort-active .sort-icon {
  opacity: 1;
}
```

- Default sort: ascending on first click, toggle on subsequent clicks
- Show a chevron icon in the header; make it directional when active

## Row selection

```css
.table tr.selected td {
  background-color: var(--primary-50);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .table tr.selected td {
    background-color: rgba(var(--primary-rgb), 0.2);
  }
}

.table th.checkbox-col input[type="checkbox"]:indeterminate {
  opacity: 0.6;
}
```

- Checkbox in first column
- Show bulk action bar when one or more rows are selected
- Header checkbox uses indeterminate state for partial selection

## Responsive tables

Three approaches - pick based on context:

**1. Horizontal scroll wrapper** (best for data-heavy tables)

```css
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

**2. Stack on mobile** - each row becomes a card

```css
@media (max-width: 640px) {
  .table thead { display: none; }

  .table tr {
    display: block;
    margin-bottom: 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 8px;
  }

  .table td {
    display: flex;
    justify-content: space-between;
    border-bottom: none;
    padding: 6px 8px;
  }

  .table td::before {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
```

**3. Priority columns** - hide less important columns on mobile, show in expandable row

```css
@media (max-width: 640px) {
  .col-secondary { display: none; }
}

.row-expand-content {
  display: none;
  padding: 8px 16px;
  background: var(--bg-subtle);
}

.row-expanded .row-expand-content {
  display: block;
}
```

## Pagination

```css
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-hover);
}

.pagination-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-size-select {
  margin-left: 8px;
  font-size: 14px;
}
```

Label: "Showing 1-10 of 243 results". Page size options: 10, 25, 50, 100.

## Empty state

```css
.table-empty {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
}

.table-empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.4;
}

.table-empty-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.table-empty-description {
  font-size: 14px;
  margin-bottom: 16px;
}
```

- "No results found" for filtered empty state
- "No items yet" for a truly empty collection
- Always include an action button when there is something the user can do

## Loading state

```css
.skeleton-row td {
  padding: 12px 16px;
}

.skeleton-cell {
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--bg-subtle) 25%,
    var(--bg-hover) 50%,
    var(--bg-subtle) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

Show 3-5 skeleton rows. For a refresh (data already visible), use an overlay spinner instead of replacing rows with skeletons. Never show an empty table while loading.

## Row actions

```css
.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.table tr:hover .row-actions,
.table tr:focus-within .row-actions {
  opacity: 1;
}

@media (max-width: 640px) {
  .row-actions { opacity: 1; }
}

.row-action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.row-action-btn.destructive:hover {
  background: var(--error-50);
  color: var(--error);
}
```

Show on hover on desktop, always visible on mobile. Use a "More" dropdown for 3+ actions. Destructive actions must trigger a confirmation dialog.

## Number formatting

- Currency: right-aligned, consistent decimal places (`$1,234.56`)
- Percentages: right-aligned, 1-2 decimal places (`12.5%`)
- Dates: consistent format (`Jan 15, 2024` or `2024-01-15` - pick one per product)
- Large numbers: abbreviate (`1.2M`, `450K`) or use commas - never mix styles in the same table

## Table variants

**1. Simple list table** (no borders, minimal styling)

```css
.table-simple td,
.table-simple th {
  border-bottom: none;
  padding: 8px 0;
}
```

**2. Striped table** (alternate row backgrounds, no hover)

```css
.table-striped tbody tr:nth-child(even) td {
  background-color: var(--bg-subtle);
}
.table-striped tbody tr:hover td {
  background-color: var(--bg-subtle); /* no hover change */
}
```

**3. Bordered table** (all cell borders, for spreadsheet-like data)

```css
.table-bordered td,
.table-bordered th {
  border: 1px solid var(--border-color);
}
```

**4. Compact table** (8px padding, for dense data)

```css
.table-compact td,
.table-compact th {
  padding: 8px 12px;
  font-size: 13px;
}
```

## Common table mistakes

- Not right-aligning numbers - breaks decimal alignment and looks unprofessional
- Combining stripes AND hover - pick one interaction pattern
- No fixed header for long scrollable tables
- Using tables for layout - use CSS Grid instead
- Shrinking text to fit more columns - let the table scroll horizontally
- No empty state - a blank table is confusing
- No loading state - never flash an empty table before data arrives
