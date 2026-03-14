<!-- Part of the android-kotlin AbsolutelySkilled skill. Load this file when
     working with Jetpack Compose state management, recomposition, theming, or
     custom layouts. -->

# Compose Patterns

## State management patterns

### State hoisting

Move state up to the caller so composables remain stateless and reusable.

```kotlin
// Stateless composable - receives state and events
@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier,
        placeholder = { Text("Search...") },
    )
}

// Stateful wrapper - owns the state
@Composable
fun SearchBarStateful() {
    var query by remember { mutableStateOf("") }
    SearchBar(query = query, onQueryChange = { query = it })
}
```

### UiState pattern

Model screen state as a single sealed interface or data class.

```kotlin
sealed interface ProductsUiState {
    data object Loading : ProductsUiState
    data class Success(val products: List<Product>) : ProductsUiState
    data class Error(val message: String) : ProductsUiState
}

@HiltViewModel
class ProductsViewModel @Inject constructor(
    private val repository: ProductRepository,
) : ViewModel() {
    val uiState: StateFlow<ProductsUiState> = repository.getProducts()
        .map<List<Product>, ProductsUiState> { ProductsUiState.Success(it) }
        .catch { emit(ProductsUiState.Error(it.message ?: "Unknown error")) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ProductsUiState.Loading)
}

@Composable
fun ProductsScreen(viewModel: ProductsViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is ProductsUiState.Loading -> CircularProgressIndicator()
        is ProductsUiState.Success -> ProductList(state.products)
        is ProductsUiState.Error -> ErrorMessage(state.message)
    }
}
```

### Derived state

Use `derivedStateOf` when one state value is computed from another to avoid
unnecessary recompositions.

```kotlin
val items = remember { mutableStateListOf<Item>() }
val sortedItems by remember { derivedStateOf { items.sortedBy { it.name } } }
```

## Recomposition optimization

### Stability

Compose skips recomposition for composables whose parameters have not changed.
For this to work, parameters must be **stable** (immutable data classes, primitives,
or annotated with `@Stable`/`@Immutable`).

```kotlin
@Immutable
data class Product(
    val id: String,
    val name: String,
    val price: Double,
)
```

Lists are unstable by default. Wrap in an immutable holder:

```kotlin
@Immutable
data class ProductList(val items: List<Product>)
```

### Key for LazyColumn

Always provide a `key` in `LazyColumn`/`LazyRow` to preserve state across reorderings.

```kotlin
LazyColumn {
    items(products, key = { it.id }) { product ->
        ProductCard(product)
    }
}
```

## Material 3 theming

### Dynamic color

```kotlin
@Composable
fun AppTheme(content: @Composable () -> Unit) {
    val colorScheme = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val context = LocalContext.current
        if (isSystemInDarkTheme()) dynamicDarkColorScheme(context)
        else dynamicLightColorScheme(context)
    } else {
        if (isSystemInDarkTheme()) darkColorScheme() else lightColorScheme()
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content,
    )
}
```

### Custom color scheme

```kotlin
private val LightColors = lightColorScheme(
    primary = Color(0xFF6750A4),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEADDFF),
    secondary = Color(0xFF625B71),
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
)
```

## Side effects

| Effect | Use when |
|---|---|
| `LaunchedEffect(key)` | Run a suspend function when key changes (API calls, animations) |
| `DisposableEffect(key)` | Set up and tear down non-suspend resources (listeners, callbacks) |
| `SideEffect` | Publish compose state to non-compose code on every successful recomposition |
| `rememberCoroutineScope()` | Need a scope tied to composition for event handlers (not composition itself) |
| `snapshotFlow { }` | Convert compose State reads into a Flow for use in coroutines |

```kotlin
// Launch a one-time effect when the screen appears
LaunchedEffect(Unit) {
    viewModel.loadData()
}

// Clean up a listener
DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, event -> /* handle */ }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
}
```

## Custom layouts

Use `Layout` composable for custom measurement and placement.

```kotlin
@Composable
fun FlowRow(
    modifier: Modifier = Modifier,
    spacing: Dp = 8.dp,
    content: @Composable () -> Unit,
) {
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        val placeables = measurables.map { it.measure(constraints) }
        var x = 0
        var y = 0
        var rowHeight = 0

        layout(constraints.maxWidth, constraints.maxHeight) {
            placeables.forEach { placeable ->
                if (x + placeable.width > constraints.maxWidth) {
                    x = 0
                    y += rowHeight + spacing.roundToPx()
                    rowHeight = 0
                }
                placeable.placeRelative(x, y)
                x += placeable.width + spacing.roundToPx()
                rowHeight = maxOf(rowHeight, placeable.height)
            }
        }
    }
}
```

> Prefer `FlowRow` and `FlowColumn` from `androidx.compose.foundation.layout`
> (available in Compose Foundation 1.4+) over custom implementations.
