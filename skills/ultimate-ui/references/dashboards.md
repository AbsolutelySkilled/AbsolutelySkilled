<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with dashboards, admin panels, KPI cards, or data-heavy app layouts. -->

# Dashboards

## Dashboard layout

- Sidebar (240-280px) + main content area
- Main content: top bar (filters, date range, title) + grid of widgets
- Widget grid: CSS Grid with auto-fill, varied sizes
- Max content width: 1440px; padding: 24-32px around content area

```css
.dashboard-shell { display: flex; min-height: 100vh; background-color: #f4f5f7; }

.dashboard-sidebar {
  width: 260px;
  flex-shrink: 0;
  background-color: #1e2235;
  color: #c8ccd8;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
}
.dashboard-sidebar.collapsed { width: 64px; }

.dashboard-main { flex: 1; min-width: 0; display: flex; flex-direction: column; max-width: 1440px; }
.dashboard-content { padding: 24px 32px; flex: 1; }
```

## KPI / stat cards

- Number: 28-32px, font-weight 700, color #111827
- Label: 12px, color #6b7280, font-weight 600, uppercase + letter-spacing
- Trend: green (#16a34a) up, red (#dc2626) down; grid: repeat(4,1fr) desktop

```css
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }

.kpi-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; }
.kpi-value { font-size: 30px; font-weight: 700; color: #111827; line-height: 1; }
.kpi-trend { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; }
.kpi-trend--up { color: #16a34a; }
.kpi-trend--down { color: #dc2626; }
.kpi-trend__label { font-size: 12px; color: #9ca3af; margin-left: 4px; font-weight: 400; }
```

## Chart containers

- Title: 16px font-weight 600, subtitle: 13px #6b7280; chart area: min-height 200px
- Same border/radius as KPI cards; skeleton on load, empty state when no data

```css
.chart-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.chart-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.chart-card__title { font-size: 16px; font-weight: 600; color: #111827; }
.chart-card__subtitle { font-size: 13px; color: #6b7280; margin-top: 2px; }
.chart-card__area { min-height: 200px; flex: 1; }
.chart-card__legend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; font-size: 12px; color: #6b7280; }
.chart-card__legend-item { display: flex; align-items: center; gap: 6px; }
.chart-card__legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.chart-skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-sweep 1.4s ease infinite;
  border-radius: 8px;
  min-height: 200px;
}
@keyframes skeleton-sweep {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.chart-empty { min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #9ca3af; font-size: 14px; }
```

## Data widgets

- Activity list: 36px avatar, 13px description, 11px timestamp #9ca3af
- Notification: unread dot 8px #3b82f6; "View all" link 13px #3b82f6 at bottom

```css
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
.activity-item:last-child { border-bottom: none; padding-bottom: 0; }
.activity-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; background-color: #e5e7eb; overflow: hidden; }
.activity-body { flex: 1; min-width: 0; }
.activity-description { font-size: 13px; color: #374151; line-height: 1.4; }
.activity-description strong { font-weight: 600; color: #111827; }
.activity-timestamp { font-size: 11px; color: #9ca3af; margin-top: 2px; }

.notification-unread-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6; flex-shrink: 0; margin-top: 5px; }

.widget-footer-link { display: block; text-align: center; font-size: 13px; font-weight: 500; color: #3b82f6; padding-top: 12px; border-top: 1px solid #f3f4f6; margin-top: 8px; text-decoration: none; }
.widget-footer-link:hover { color: #2563eb; }
```

## Filter bar

- Horizontal bar, sticky top, 48px height, background #fff, border-bottom #e5e7eb
- Applied filter chips: background #eff6ff, color #1d4ed8, border #bfdbfe, border-radius 8px

```css
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 32px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 20;
}

.filter-chip { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; background-color: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 500; border-radius: 8px; border: 1px solid #bfdbfe; white-space: nowrap; }
.filter-chip__remove { width: 14px; height: 14px; border-radius: 50%; cursor: pointer; opacity: 0.6; transition: opacity 0.15s; }
.filter-chip__remove:hover { opacity: 1; }
.filter-clear-all { font-size: 13px; color: #6b7280; background: none; border: none; cursor: pointer; text-decoration: underline; }
.filter-clear-all:hover { color: #374151; }
```

## Date range controls

- Presets: Today / Last 7d / Last 30d / This month / Custom
- Active preset: background #1d4ed8 color #fff; inactive: border #d1d5db

```css
.date-range-selector { display: flex; align-items: center; gap: 4px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 3px; }
.date-range-preset { font-size: 12px; font-weight: 500; color: #374151; padding: 5px 10px; border-radius: 6px; border: none; background: transparent; cursor: pointer; white-space: nowrap; transition: background 0.15s, color 0.15s; }
.date-range-preset:hover { background: #e5e7eb; }
.date-range-preset.active { background: #1d4ed8; color: #fff; }
.date-range-custom-inputs input[type="date"] { font-size: 12px; border: 1px solid #d1d5db; border-radius: 6px; padding: 4px 8px; color: #111827; }
```

## Dashboard grid patterns

```css
/* Equal auto-fill grid */
.widget-grid--equal { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

/* Mixed-size grid */
.widget-grid--mixed { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(180px, auto); gap: 20px; }
.widget--wide { grid-column: span 2; }
.widget--tall { grid-row: span 2; }
.widget--full { grid-column: 1 / -1; }

/* Named areas (3-col) */
.widget-grid--named {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  grid-template-areas:
    "kpi1 kpi2 kpi3"
    "chart chart activity"
    "table table map";
}
.widget--kpi1 { grid-area: kpi1; } .widget--kpi2 { grid-area: kpi2; } .widget--kpi3 { grid-area: kpi3; }
.widget--chart { grid-area: chart; } .widget--activity { grid-area: activity; }
.widget--table { grid-area: table; } .widget--map { grid-area: map; }

/* Masonry with fixed row tracks */
.widget-grid--masonry { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 80px; gap: 16px; }
.widget--masonry-sm { grid-row: span 2; }
.widget--masonry-md { grid-row: span 3; }
.widget--masonry-lg { grid-row: span 4; }
```

## Responsive dashboard

```css
@media (max-width: 1023px) {
  .dashboard-sidebar { width: 64px; }
  .dashboard-sidebar .nav-label { display: none; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .widget-grid--mixed { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 767px) {
  .dashboard-shell { flex-direction: column; }
  .dashboard-sidebar { width: 100%; height: 56px; flex-direction: row; align-items: center; padding: 0 16px; }
  .dashboard-content { padding: 16px; }
  .kpi-grid { grid-template-columns: 1fr; }
  .kpi-grid--scroll-mobile { display: flex; overflow-x: auto; gap: 12px; padding-bottom: 8px; scrollbar-width: none; }
  .kpi-grid--scroll-mobile::-webkit-scrollbar { display: none; }
  .kpi-grid--scroll-mobile .kpi-card { min-width: 180px; flex-shrink: 0; }
  .widget-grid--mixed { grid-template-columns: 1fr; }
  .widget--wide, .widget--tall { grid-column: span 1; grid-row: span 1; }
  .filter-bar { padding: 8px 16px; }
}
```

## Real-time updates

```css
@keyframes flash-positive {
  0%, 60% { background-color: #dcfce7; color: #15803d; }
  100% { background-color: transparent; color: inherit; }
}
@keyframes flash-negative {
  0%, 60% { background-color: #fee2e2; color: #b91c1c; }
  100% { background-color: transparent; color: inherit; }
}
.kpi-value--updated-up { animation: flash-positive 1.2s ease forwards; border-radius: 4px; padding: 0 4px; }
.kpi-value--updated-down { animation: flash-negative 1.2s ease forwards; border-radius: 4px; padding: 0 4px; }

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.75); }
}
.live-indicator { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #9ca3af; }
.live-indicator__dot { width: 7px; height: 7px; border-radius: 50%; background-color: #22c55e; animation: pulse-dot 2s ease-in-out infinite; }
.updated-label { font-size: 12px; color: #9ca3af; }
```

## Dashboard header

- Height: 60px; sticky top z-index 30; left: title 20px/700 + breadcrumb; right: action buttons + 32px avatar

```css
.dashboard-header { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: #fff; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; position: sticky; top: 0; z-index: 30; }
.dashboard-header__title { font-size: 20px; font-weight: 700; color: #111827; line-height: 1; }
.dashboard-header__breadcrumb { font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 4px; }
.dashboard-header__action-btn { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #374151; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 14px; cursor: pointer; transition: background 0.15s; }
.dashboard-header__action-btn:hover { background: #f3f4f6; }
.dashboard-header__avatar { width: 32px; height: 32px; border-radius: 50%; background-color: #e5e7eb; cursor: pointer; overflow: hidden; }
```

## Empty / error states

```css
.dashboard-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; text-align: center; gap: 12px; }
.dashboard-empty__icon { width: 48px; height: 48px; color: #d1d5db; }
.dashboard-empty__heading { font-size: 20px; font-weight: 600; color: #111827; }
.dashboard-empty__description { font-size: 14px; color: #6b7280; max-width: 360px; line-height: 1.5; }
.dashboard-empty__cta { margin-top: 8px; padding: 10px 20px; font-size: 14px; font-weight: 600; background: #1d4ed8; color: #fff; border-radius: 8px; border: none; cursor: pointer; }
.dashboard-empty__cta:hover { background: #1e40af; }

.widget-error { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 140px; color: #9ca3af; font-size: 13px; }
.widget-error__retry { font-size: 13px; font-weight: 500; color: #3b82f6; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
.widget-error__retry:hover { background: #eff6ff; }
```

## Common dashboard mistakes

- Too many KPIs (max 4-6 on first view)
- Charts without context (no comparison, no trend)
- No loading states per widget (whole-page spinner is bad)
- Fixed layouts that break on tablet
- Tiny text to fit more data (use scrollable widgets instead)
- No date range context shown to user
