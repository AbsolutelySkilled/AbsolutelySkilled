<!-- Part of the ios-swift AbsolutelySkilled skill. Load this file when
     working with SwiftUI views, navigation, state management, or animations. -->

# SwiftUI Patterns

## Navigation (iOS 16+)

### NavigationStack

`NavigationStack` replaces `NavigationView` and supports value-based, programmatic navigation.

```swift
@State private var path = NavigationPath()

NavigationStack(path: $path) {
    List(items) { item in
        NavigationLink(value: item) {
            Text(item.name)
        }
    }
    .navigationDestination(for: Item.self) { item in
        ItemDetailView(item: item)
    }
}

// Programmatic navigation
path.append(someItem)     // push
path.removeLast()         // pop
path = NavigationPath()   // pop to root
```

### TabView

```swift
TabView {
    Tab("Home", systemImage: "house") {
        HomeView()
    }
    Tab("Settings", systemImage: "gear") {
        SettingsView()
    }
}
```

### Sheet and fullScreenCover

```swift
@State private var showSheet = false

Button("Show") { showSheet = true }
    .sheet(isPresented: $showSheet) {
        DetailView()
    }

// For item-based presentation
.sheet(item: $selectedItem) { item in
    DetailView(item: item)
}
```

---

## State Management

### Property wrapper decision tree

| Wrapper | Ownership | Use when |
|---|---|---|
| `@State` | View owns it | Simple local value types (strings, booleans, enums) |
| `@Binding` | Parent owns it | Child view needs read/write access to parent's state |
| `@StateObject` | View creates it | View creates and owns a reference-type model |
| `@ObservedObject` | Parent passes it | View receives but does not own a reference-type model |
| `@EnvironmentObject` | Ancestor injects it | Shared model needed by many views in the hierarchy |
| `@Environment` | System provides it | System values: color scheme, locale, dismiss action |
| `@Observable` (macro) | Any | iOS 17+: replaces ObservableObject with fine-grained tracking |

### @Observable (iOS 17+)

```swift
@Observable
class UserModel {
    var name: String = ""
    var email: String = ""
    var avatarURL: URL?
}

struct ProfileView: View {
    @State var model = UserModel()  // Note: @State, not @StateObject

    var body: some View {
        VStack {
            Text(model.name)    // Only re-renders when name changes
            Text(model.email)   // Only re-renders when email changes
        }
    }
}
```

The `@Observable` macro tracks property access per-view, so changing `email` does not re-evaluate views that only read `name`. This is a major performance improvement over `ObservableObject` which notifies all subscribers on any property change.

### @StateObject vs @ObservedObject

```swift
// Parent creates the model - use @StateObject
struct ParentView: View {
    @StateObject private var viewModel = ItemViewModel()
    var body: some View {
        ChildView(viewModel: viewModel)
    }
}

// Child receives the model - use @ObservedObject
struct ChildView: View {
    @ObservedObject var viewModel: ItemViewModel
    var body: some View {
        Text(viewModel.title)
    }
}
```

Critical rule: `@StateObject` persists across view re-evaluations. `@ObservedObject` does not - if the parent view's body re-evaluates, a new instance is created. Using `@ObservedObject` where `@StateObject` is needed causes state loss.

---

## Custom Modifiers

```swift
struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.regularMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .shadow(radius: 2)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}

// Usage
Text("Hello").cardStyle()
```

### Conditional modifiers (avoid the naive approach)

```swift
// Bad: changes view identity, destroys state
if condition {
    text.bold()
} else {
    text
}

// Good: preserves view identity
text.bold(condition)  // For built-in modifiers that accept a boolean

// For custom conditional styling
text.opacity(condition ? 1.0 : 0.5)
```

---

## Animations

### Implicit animations

```swift
@State private var isExpanded = false

VStack {
    RoundedRectangle(cornerRadius: 12)
        .frame(height: isExpanded ? 300 : 100)
        .animation(.spring(duration: 0.4), value: isExpanded)
}
```

### Explicit animations

```swift
withAnimation(.easeInOut(duration: 0.3)) {
    isExpanded.toggle()
}
```

### Transitions

```swift
if showDetail {
    DetailView()
        .transition(.move(edge: .bottom).combined(with: .opacity))
}
```

### Phase animator (iOS 17+)

```swift
PhaseAnimator([false, true]) { phase in
    Image(systemName: "heart.fill")
        .scaleEffect(phase ? 1.2 : 1.0)
        .foregroundStyle(phase ? .red : .pink)
}
```

---

## Accessibility in SwiftUI

```swift
// Labels
Image(systemName: "heart.fill")
    .accessibilityLabel("Favorite")

// Actions
Button("Delete") { delete() }
    .accessibilityHint("Removes the item permanently")

// Grouping
HStack {
    Image(systemName: "star.fill")
    Text("4.5 out of 5 stars")
}
.accessibilityElement(children: .combine)

// Custom actions
Text(item.title)
    .accessibilityAction(named: "Delete") { delete(item) }
    .accessibilityAction(named: "Share") { share(item) }

// Traits
Text("Breaking News")
    .accessibilityAddTraits(.isHeader)

// Reduced motion
@Environment(\.accessibilityReduceMotion) var reduceMotion

withAnimation(reduceMotion ? .none : .spring()) {
    isExpanded.toggle()
}
```

---

## Common SwiftUI pitfalls

| Pitfall | Fix |
|---|---|
| View not updating | Verify correct property wrapper; `@ObservedObject` does not persist on re-evaluation |
| Sheet not dismissing | Use `@Environment(\.dismiss) var dismiss` then call `dismiss()` |
| List performance | Use `List` (built-in lazy) or `LazyVStack` in `ScrollView` for 100+ items |
| Dark mode broken | Use semantic colors (`.primary`, `.secondary`) and asset catalog colors |
| Keyboard not dismissing | Add `.scrollDismissesKeyboard(.interactively)` or use `FocusState` |
| Preview crashes | Provide mock data; never hit real network or Core Data in previews |
