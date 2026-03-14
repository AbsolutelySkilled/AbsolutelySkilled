<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with navigation, sidebars, tabs, breadcrumbs, or command palettes. -->

# Navigation

## Top navigation bar (header)
- Height: 56-64px; sticky top with backdrop-filter blur
- Logo left, nav links center/right, actions far right
- Active link: primary color or underline indicator

```css
.nav-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.nav-header__logo { margin-right: auto; }
.nav-header__links { display: flex; align-items: center; gap: 4px; }
.nav-header__link { padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 500; color: #6b7280; text-decoration: none; transition: color 0.15s, background 0.15s; }
.nav-header__link:hover { background: #f3f4f6; color: #111827; }
.nav-header__link--active { color: #2563eb; background: #eff6ff; }
.nav-header__actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
```

## Sidebar navigation
- Width: 240-280px, collapsible to 64px (icon-only)
- Active: primary bg tint + primary text, or left border indicator
- Tooltip on hover when collapsed; nested items: indent 16px

```css
.sidebar {
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  width: 260px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  overflow: hidden;
  z-index: 50;
}
.sidebar--collapsed { width: 64px; }

.sidebar__brand { height: 60px; padding: 0 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
.sidebar__brand-label { font-size: 16px; font-weight: 700; white-space: nowrap; overflow: hidden; opacity: 1; transition: opacity 0.15s; }
.sidebar--collapsed .sidebar__brand-label { opacity: 0; width: 0; }

.sidebar__nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
.sidebar__item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #4b5563; cursor: pointer; text-decoration: none; white-space: nowrap; transition: background 0.15s, color 0.15s; position: relative; }
.sidebar__item:hover { background: #f3f4f6; color: #111827; }
.sidebar__item--active { background: #eff6ff; color: #2563eb; }
.sidebar__item--active-border { color: #2563eb; background: #eff6ff; border-left: 3px solid #2563eb; padding-left: 9px; }
.sidebar__item-icon { flex-shrink: 0; width: 20px; height: 20px; }
.sidebar__item-label { opacity: 1; transition: opacity 0.15s; }
.sidebar--collapsed .sidebar__item-label { opacity: 0; width: 0; overflow: hidden; }
.sidebar__item--nested { padding-left: 28px; font-size: 13px; }

/* Tooltip when collapsed */
.sidebar--collapsed .sidebar__item:hover::after {
  content: attr(data-label);
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 200;
  pointer-events: none;
}

.sidebar__footer { padding: 12px 8px; border-top: 1px solid #e5e7eb; flex-shrink: 0; }
```

## Horizontal tabs
- Active indicator: bottom border (2-3px) or pill background; height: 40-48px
- Scroll horizontally on overflow (mobile); `aria-role="tablist"` + `aria-selected`

```css
.tabs { display: flex; border-bottom: 1px solid #e5e7eb; position: relative; }
.tab { padding: 10px 16px; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color 0.15s, border-color 0.15s; white-space: nowrap; }
.tab:hover { color: #374151; }
.tab--active { color: #2563eb; border-bottom-color: #2563eb; }

/* Pill variant */
.tabs--pill { background: #f3f4f6; padding: 4px; border-radius: 10px; gap: 2px; border-bottom: none; }
.tabs--pill .tab { border-radius: 7px; border-bottom: none; margin-bottom: 0; padding: 6px 14px; }
.tabs--pill .tab--active { background: #fff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }

/* Animated sliding indicator */
.tabs--animated { position: relative; }
.tabs__indicator { position: absolute; bottom: -1px; height: 2px; background: #2563eb; border-radius: 2px 2px 0 0; transition: left 0.2s ease, width 0.2s ease; }

@media (max-width: 640px) {
  .tabs { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
  .tabs::-webkit-scrollbar { display: none; }
}
```

## Vertical tabs (settings pages)

```css
.tabs--vertical { display: flex; gap: 24px; }
.tabs--vertical .tab-list { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; }
.tabs--vertical .tab { display: flex; align-items: center; padding: 8px 14px; border-radius: 8px; border-bottom: none; margin-bottom: 0; width: 100%; text-align: left; }
.tabs--vertical .tab--active { background: #eff6ff; color: #2563eb; }
.tabs--vertical .tab-panels { flex: 1; min-width: 0; }
```

## Breadcrumbs

```css
.breadcrumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; font-size: 13px; color: #6b7280; }
.breadcrumbs__item { display: flex; align-items: center; gap: 4px; }
.breadcrumbs__link { color: #6b7280; text-decoration: none; transition: color 0.15s; }
.breadcrumbs__link:hover { color: #2563eb; text-decoration: underline; }
.breadcrumbs__separator { color: #d1d5db; font-size: 12px; user-select: none; }
.breadcrumbs__current { color: #111827; font-weight: 600; }
```

## Pagination
- Show "Showing 1-10 of 243"; current page: primary bg pill
- Max 7 visible page numbers with ellipsis; disabled state at boundaries

```css
.pagination { display: flex; align-items: center; gap: 4px; font-size: 14px; }
.pagination__btn { min-width: 36px; height: 36px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s, color 0.15s; }
.pagination__btn:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.pagination__btn--active { background: #2563eb; border-color: #2563eb; color: #fff; }
.pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination__ellipsis { min-width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #9ca3af; user-select: none; }
.pagination__summary { margin-left: 16px; font-size: 13px; color: #6b7280; }
```

## Command palette / search modal
- Trigger: Cmd+K / Ctrl+K; max-width 560px; keyboard navigable (arrow keys)
- Grouped results with section headers; highlight matching text; close on Escape

```css
.command-palette-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 300; display: flex; align-items: flex-start; justify-content: center; padding-top: 80px; }
.command-palette { width: 100%; max-width: 560px; background: #fff; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); overflow: hidden; }
.command-palette__input-wrap { display: flex; align-items: center; padding: 14px 16px; border-bottom: 1px solid #e5e7eb; gap: 10px; }
.command-palette__input { flex: 1; border: none; outline: none; font-size: 16px; color: #111827; background: transparent; }
.command-palette__results { max-height: 360px; overflow-y: auto; padding: 8px 0; }
.command-palette__group-label { padding: 6px 16px 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #9ca3af; }
.command-palette__result { display: flex; align-items: center; gap: 10px; padding: 8px 16px; font-size: 14px; color: #374151; cursor: pointer; transition: background 0.1s; }
.command-palette__result:hover, .command-palette__result--focused { background: #f3f4f6; }
.command-palette__result mark { background: #fef08a; color: inherit; border-radius: 2px; padding: 0 1px; }
.command-palette__hint { padding: 10px 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; display: flex; gap: 16px; }
.command-palette__hint kbd { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 4px; padding: 1px 5px; font-size: 11px; color: #4b5563; }
```

## Mega menu

```css
.mega-menu-wrap { position: relative; }
.mega-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  min-width: 640px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, transform 0.15s;
}
.mega-menu--open { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
.mega-menu__col-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #9ca3af; margin-bottom: 10px; }
.mega-menu__link { display: block; padding: 6px 0; font-size: 14px; color: #374151; text-decoration: none; transition: color 0.15s; }
.mega-menu__link:hover { color: #2563eb; }
```

## Segmented control

```css
.segmented-control { display: inline-flex; background: #f3f4f6; border-radius: 10px; padding: 3px; gap: 2px; position: relative; }
.segmented-control__option { padding: 6px 16px; font-size: 13px; font-weight: 500; color: #6b7280; border-radius: 8px; cursor: pointer; border: none; background: none; transition: color 0.15s; position: relative; z-index: 1; }
.segmented-control__option--active { color: #111827; }
.segmented-control__thumb { position: absolute; top: 3px; height: calc(100% - 6px); background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: left 0.2s ease, width 0.2s ease; z-index: 0; }
```

## Navigation state management
- Active state must reflect current URL/route; use `aria-current="page"` for screen readers
- Highlight parent nav item when on child page
- Preserve scroll position in sidebar on navigation; URL should always reflect nav state

## Common navigation mistakes
- Too many top-level items (max 5-7 in main nav)
- No active state indicator
- Sidebar that doesn't collapse on tablet
- Dropdown menus that close on slight mouse movement (add 100-150ms delay)
- No keyboard navigation support
- Breadcrumbs that don't match actual hierarchy
