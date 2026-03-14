<!-- Part of the Unity Development AbsolutelySkilled skill. Load this file when working with Unity UI Toolkit - UXML layout, USS styling, C# bindings, custom controls, or ListView. -->

# UI Toolkit Reference

---

## 1. Architecture Overview

UI Toolkit is Unity's retained-mode UI system inspired by web technologies.

| Concept | Web Equivalent | Unity Name |
|---|---|---|
| HTML | DOM elements | UXML (VisualElement tree) |
| CSS | Stylesheets | USS (Unity Style Sheets) |
| JavaScript | Event handlers | C# (UQuery + event callbacks) |
| Shadow DOM | Component encapsulation | Custom VisualElements |

**When to use UI Toolkit vs UGUI:**
- UI Toolkit: Editor extensions, HUD overlays, menus, settings screens, new projects
- UGUI: World-space UI in 3D scenes, projects already using UGUI extensively, features
  not yet in UI Toolkit (e.g., some advanced text effects)

---

## 2. UXML Layout

UXML defines the visual hierarchy. Think of it as HTML for Unity.

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <ui:VisualElement name="root" class="container">
        <ui:Label text="Player Stats" class="header" />
        <ui:VisualElement class="stat-row">
            <ui:Label text="Health" class="stat-label" />
            <ui:ProgressBar name="health-bar" value="75" high-value="100" />
        </ui:VisualElement>
        <ui:Button name="heal-btn" text="Heal" class="action-btn" />
        <ui:ScrollView name="inventory-scroll">
            <ui:ListView name="item-list" />
        </ui:ScrollView>
    </ui:VisualElement>
</ui:UXML>
```

**Built-in elements:**

| Element | Use for |
|---|---|
| `VisualElement` | Generic container (like `<div>`) |
| `Label` | Text display |
| `Button` | Clickable actions |
| `TextField` | Text input |
| `Toggle` | Boolean checkbox |
| `Slider` / `SliderInt` | Numeric range input |
| `ProgressBar` | Value display bar |
| `ScrollView` | Scrollable container |
| `ListView` | Virtualized list (handles 10k+ items) |
| `Foldout` | Collapsible section |
| `DropdownField` | Select from options |
| `RadioButton` / `RadioButtonGroup` | Exclusive selection |

---

## 3. USS Styling

USS follows CSS syntax with Unity-specific properties prefixed with `-unity-`.

```css
/* Base container */
.container {
    flex-grow: 1;
    padding: 16px;
    background-color: rgba(0, 0, 0, 0.8);
}

/* Flexbox layout (default is column) */
.stat-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

/* Typography */
.header {
    font-size: 24px;
    -unity-font-style: bold;
    -unity-text-align: middle-center;
    color: rgb(255, 220, 100);
    margin-bottom: 16px;
}

/* Buttons with hover state */
.action-btn {
    height: 40px;
    border-radius: 6px;
    background-color: rgb(60, 120, 200);
    color: white;
    -unity-font-style: bold;
    transition: background-color 0.2s ease;
}
.action-btn:hover {
    background-color: rgb(80, 150, 240);
}
.action-btn:active {
    background-color: rgb(40, 90, 160);
}
```

**Key differences from CSS:**
- No `px` units in USS - all numeric values are unitless (interpreted as pixels) or use `%`
- Use `-unity-` prefix for Unity-specific properties
- Flexbox is the only layout model (no grid, no float)
- Default flex-direction is `column` (not row)
- No media queries - use C# to adapt to screen size
- Selectors: `.class`, `#name`, `Type`, `:hover`, `:active`, `:focus`, `:checked`

---

## 4. C# Bindings and Events

Query elements and wire up logic in C#.

```csharp
public class StatsUI : MonoBehaviour
{
    [SerializeField] private UIDocument uiDocument;
    [SerializeField] private StyleSheet additionalStyles;

    private ProgressBar _healthBar;
    private Button _healBtn;
    private ListView _itemList;

    private void OnEnable()
    {
        var root = uiDocument.rootVisualElement;

        // Optional: add stylesheet at runtime
        root.styleSheets.Add(additionalStyles);

        // Query by name (# selector equivalent)
        _healthBar = root.Q<ProgressBar>("health-bar");
        _healBtn = root.Q<Button>("heal-btn");
        _itemList = root.Q<ListView>("item-list");

        // Query by class (. selector equivalent)
        var allLabels = root.Query<Label>(className: "stat-label").ToList();

        // Register events
        _healBtn.clicked += OnHealClicked;

        // Generic event registration
        _healBtn.RegisterCallback<PointerEnterEvent>(OnHoverStart);
        _healBtn.RegisterCallback<PointerLeaveEvent>(OnHoverEnd);
    }

    private void OnDisable()
    {
        _healBtn.clicked -= OnHealClicked;
        _healBtn.UnregisterCallback<PointerEnterEvent>(OnHoverStart);
        _healBtn.UnregisterCallback<PointerLeaveEvent>(OnHoverEnd);
    }

    private void OnHealClicked() => Debug.Log("Heal!");
    private void OnHoverStart(PointerEnterEvent evt) => Debug.Log("Hover");
    private void OnHoverEnd(PointerLeaveEvent evt) => Debug.Log("Leave");

    public void UpdateHealth(int current, int max)
    {
        _healthBar.value = current;
        _healthBar.highValue = max;
        _healthBar.title = $"{current}/{max}";
    }
}
```

---

## 5. ListView (Virtualized)

ListView only creates VisualElements for visible rows. Essential for large lists.

```csharp
public class InventoryUI : MonoBehaviour
{
    [SerializeField] private UIDocument uiDocument;
    [SerializeField] private VisualTreeAsset itemTemplate; // UXML for one row

    private List<ItemData> _items;
    private ListView _listView;

    private void OnEnable()
    {
        _listView = uiDocument.rootVisualElement.Q<ListView>("item-list");

        _listView.makeItem = () => itemTemplate.Instantiate();

        _listView.bindItem = (element, index) =>
        {
            var item = _items[index];
            element.Q<Label>("item-name").text = item.Name;
            element.Q<Label>("item-count").text = $"x{item.Count}";
        };

        _listView.itemsSource = _items;
        _listView.fixedItemHeight = 40;  // required for virtualization
        _listView.selectionType = SelectionType.Single;

        _listView.selectionChanged += OnSelectionChanged;
    }

    private void OnSelectionChanged(IEnumerable<object> selection)
    {
        foreach (ItemData item in selection)
            Debug.Log($"Selected: {item.Name}");
    }

    public void RefreshList()
    {
        _listView.RefreshItems();  // call after data changes
    }
}
```

---

## 6. Custom Controls

Create reusable UI components by extending VisualElement.

```csharp
// Custom control with UXML attribute support
[UxmlElement]
public partial class HealthBar : VisualElement
{
    [UxmlAttribute]
    public float MaxHealth { get; set; } = 100f;

    [UxmlAttribute]
    public float CurrentHealth { get; set; } = 100f;

    private VisualElement _fill;
    private Label _label;

    public HealthBar()
    {
        // Build internal structure
        var container = new VisualElement();
        container.AddToClassList("health-container");

        _fill = new VisualElement();
        _fill.AddToClassList("health-fill");
        container.Add(_fill);

        _label = new Label();
        _label.AddToClassList("health-label");
        container.Add(_label);

        Add(container);

        RegisterCallback<AttachToPanelEvent>(OnAttach);
    }

    private void OnAttach(AttachToPanelEvent evt) => Refresh();

    public void SetHealth(float current)
    {
        CurrentHealth = Mathf.Clamp(current, 0, MaxHealth);
        Refresh();
    }

    private void Refresh()
    {
        float pct = MaxHealth > 0 ? CurrentHealth / MaxHealth * 100f : 0f;
        _fill.style.width = new Length(pct, LengthUnit.Percent);
        _label.text = $"{CurrentHealth:F0}/{MaxHealth:F0}";
    }
}
```

Use in UXML after the custom control is defined:
```xml
<HealthBar max-health="200" current-health="150" />
```

---

## 7. Transitions and Animations

USS supports transitions for smooth property changes:

```css
.panel {
    translate: -100% 0;
    opacity: 0;
    transition: translate 0.3s ease-out, opacity 0.3s ease-out;
}
.panel.visible {
    translate: 0 0;
    opacity: 1;
}
```

```csharp
// Trigger transition by toggling class
panel.AddToClassList("visible");    // slides in
panel.RemoveToClassList("visible"); // slides out
```

For complex animations, use `schedule.Execute` or `VisualElement.experimental.animation`:

```csharp
// Delayed execution
element.schedule.Execute(() => element.AddToClassList("visible"))
    .StartingIn(500);  // 500ms delay

// Value animation
element.experimental.animation
    .Start(0f, 1f, 300, (e, val) => e.style.opacity = val)
    .Ease(Easing.OutCubic);
```

---

## 8. Performance Tips

- **Cache Q() results** - string lookups are not free; query once in OnEnable
- **Use ListView for lists > 20 items** - it virtualizes, ScrollView does not
- **Minimize style recalculations** - batch class changes, avoid toggling styles per frame
- **Use USS transitions** - they run on the UI thread efficiently vs manual animation
- **Avoid VisualElement allocation in Update** - create elements once, show/hide with `display: none`
- **Set `pickingMode = PickingMode.Ignore`** on decorative elements to skip hit testing
