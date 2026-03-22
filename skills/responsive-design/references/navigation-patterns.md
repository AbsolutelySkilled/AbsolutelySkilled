<!-- Part of the Responsive Design AbsolutelySkilled skill. Load this file when working with responsive navigation patterns like hamburger menus, drawers, or bottom tab bars. -->

# Responsive Navigation Patterns

## Hamburger drawer (mobile) / horizontal nav (desktop)

```css
/* Mobile: hide main nav, show toggle */
.nav-links {
  display: none;
  position: fixed;
  inset: 0;
  background: #ffffff;
  flex-direction: column;
  padding: 80px 24px 24px;
  gap: 8px;
  z-index: 50;
}

.nav-links.open {
  display: flex;
}

.nav-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
}

/* Desktop: inline nav, no toggle */
@media (min-width: 1024px) {
  .nav-links {
    display: flex;
    position: static;
    flex-direction: row;
    padding: 0;
    gap: 4px;
    background: transparent;
    inset: auto;
    z-index: auto;
  }

  .nav-toggle {
    display: none;
  }
}
```

## Bottom tab bar (mobile app-style)

```css
.bottom-tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 40;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 44px;
  color: #6b7280;
  font-size: 0.7rem;
  font-weight: 500;
  text-decoration: none;
}

.tab-item.active { color: #2563eb; }

@media (min-width: 1024px) {
  .bottom-tab-bar { display: none; }
}
```

> Always use `env(safe-area-inset-bottom)` for bottom-fixed elements on iOS.
> Use `env(safe-area-inset-top)` for fixed headers on notched devices.
