<!-- Part of the Accessibility & WCAG AbsolutelySkilled skill. Load this file when working with accessible dialog, tabs, or other custom widget implementations. -->

# Accessible Widget Examples

## Accessible Dialog (Modal)

```tsx
function Dialog({
  open, onClose, title, description, children
}: {
  open: boolean; onClose: () => void;
  title: string; description?: string; children: React.ReactNode;
}) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus first focusable element inside dialog
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // Trap focus inside dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-desc' : undefined}
      ref={dialogRef} onKeyDown={handleKeyDown}
    >
      <h2 id="dialog-title">{title}</h2>
      {description && <p id="dialog-desc">{description}</p>}
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

## Accessible Tabs

```tsx
function Tabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [selected, setSelected] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label="Content sections">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={i === selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={i === selected ? 0 : -1}
            ref={(el) => { tabRefs.current[i] = el; }}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onClick={() => setSelected(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={i !== selected}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
```
