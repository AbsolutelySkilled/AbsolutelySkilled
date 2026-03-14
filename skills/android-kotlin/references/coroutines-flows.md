<!-- Part of the android-kotlin AbsolutelySkilled skill. Load this file when
     working with Kotlin coroutines, Flow operators, structured concurrency,
     error handling, or testing coroutines. -->

# Coroutines and Flows

## Coroutine scopes in Android

| Scope | Lifecycle | Use for |
|---|---|---|
| `viewModelScope` | ViewModel (survives config changes) | Data loading, business logic |
| `lifecycleScope` | Activity/Fragment lifecycle | UI-specific one-shot work |
| `rememberCoroutineScope()` | Composition lifetime | Event handlers in Compose |
| `GlobalScope` | Application lifetime | Almost never - use a custom Application-scoped scope |

```kotlin
// ViewModel - preferred for most Android work
class MyViewModel : ViewModel() {
    init {
        viewModelScope.launch {
            // Automatically cancelled when ViewModel is cleared
        }
    }
}

// Compose event handler
@Composable
fun MyScreen() {
    val scope = rememberCoroutineScope()
    Button(onClick = {
        scope.launch { /* handle event */ }
    }) { Text("Click") }
}
```

## Dispatchers

| Dispatcher | Thread | Use for |
|---|---|---|
| `Dispatchers.Main` | Main/UI thread | UI updates, light work (default in viewModelScope) |
| `Dispatchers.IO` | Shared IO pool | Network, database, file I/O |
| `Dispatchers.Default` | CPU pool | Heavy computation, sorting, parsing |
| `Dispatchers.Main.immediate` | Main thread, no re-dispatch | When already on main and want to avoid queue hop |

```kotlin
viewModelScope.launch {
    // On Main by default
    _uiState.update { it.copy(isLoading = true) }

    val result = withContext(Dispatchers.IO) {
        repository.fetchData()  // blocking I/O
    }

    // Back on Main
    _uiState.update { it.copy(data = result, isLoading = false) }
}
```

## Flow types

### Cold flows

Regular `Flow` is cold - it starts producing values only when collected.

```kotlin
fun getUsers(): Flow<List<User>> = flow {
    val users = api.fetchUsers()
    emit(users)
}

// Or from Room (already cold)
@Query("SELECT * FROM users")
fun getAll(): Flow<List<User>>
```

### Hot flows (StateFlow and SharedFlow)

```kotlin
// StateFlow - always has a value, replays latest to new collectors
private val _uiState = MutableStateFlow(UiState())
val uiState: StateFlow<UiState> = _uiState.asStateFlow()

// SharedFlow - no initial value, configurable replay
private val _events = MutableSharedFlow<UiEvent>()
val events: SharedFlow<UiEvent> = _events.asSharedFlow()
```

### Converting cold to hot

```kotlin
val uiState: StateFlow<UiState> = repository.getItems()
    .map { items -> UiState(items = items) }
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = UiState(),
    )
```

> Use `SharingStarted.WhileSubscribed(5000)` (5 second timeout) to keep the
> upstream alive during configuration changes but stop it when truly not needed.

## Flow operators

### Common transformations

```kotlin
repository.getProducts()
    .map { products -> products.filter { it.inStock } }   // transform
    .distinctUntilChanged()                                 // skip duplicates
    .debounce(300)                                          // for search input
    .catch { emit(emptyList()) }                            // handle errors
    .onEach { analytics.logProductsLoaded(it.size) }       // side effect
    .flowOn(Dispatchers.Default)                            // change upstream dispatcher
    .collect { products -> /* use result */ }
```

### Combining flows

```kotlin
// Combine latest values from multiple flows
val uiState: StateFlow<SearchUiState> = combine(
    searchQuery,
    repository.getProducts(),
    selectedCategory,
) { query, products, category ->
    val filtered = products
        .filter { it.category == category }
        .filter { it.name.contains(query, ignoreCase = true) }
    SearchUiState(results = filtered)
}.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), SearchUiState())

// Zip - pairs elements one-to-one
flowA.zip(flowB) { a, b -> Pair(a, b) }

// FlatMapLatest - cancel previous inner flow when new value arrives
searchQuery.flatMapLatest { query ->
    repository.search(query)
}
```

## Structured concurrency patterns

### Parallel decomposition

```kotlin
viewModelScope.launch {
    // Run two operations in parallel
    coroutineScope {
        val user = async { userRepository.getUser(id) }
        val orders = async { orderRepository.getOrders(id) }
        _uiState.update {
            it.copy(user = user.await(), orders = orders.await())
        }
    }
}
```

### SupervisorScope

Use when you want sibling coroutines to be independent (one failure doesn't
cancel others).

```kotlin
viewModelScope.launch {
    supervisorScope {
        launch { syncUsers() }      // failure here won't cancel syncOrders
        launch { syncOrders() }     // failure here won't cancel syncUsers
    }
}
```

## Error handling

### In coroutines

```kotlin
viewModelScope.launch {
    try {
        val data = withContext(Dispatchers.IO) { api.fetchData() }
        _uiState.update { it.copy(data = data) }
    } catch (e: IOException) {
        _uiState.update { it.copy(error = "Network error: ${e.message}") }
    } catch (e: HttpException) {
        _uiState.update { it.copy(error = "Server error: ${e.code()}") }
    }
}
```

### In flows

```kotlin
repository.getItems()
    .catch { e ->
        // Catch upstream errors, emit fallback
        emit(emptyList())
        _errors.emit("Failed to load: ${e.message}")
    }
    .collect { items -> /* use items */ }
```

> `catch` only catches upstream errors. If the `collect` block throws, it
> propagates to the coroutine's exception handler.

### CoroutineExceptionHandler

```kotlin
private val handler = CoroutineExceptionHandler { _, exception ->
    _uiState.update { it.copy(error = exception.message) }
}

viewModelScope.launch(handler) {
    riskyOperation()
}
```

## Testing coroutines

### Setup

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class MyViewModelTest {
    private val testDispatcher = UnconfinedTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun teardown() {
        Dispatchers.resetMain()
    }
}
```

### Testing StateFlow

```kotlin
@Test
fun `loads products on init`() = runTest {
    val fakeRepo = FakeProductRepository(listOf(Product("1", "Widget")))
    val viewModel = ProductsViewModel(fakeRepo)

    val state = viewModel.uiState.first { it is ProductsUiState.Success }
    assertThat((state as ProductsUiState.Success).products).hasSize(1)
}
```

### Turbine for Flow testing

```kotlin
// Add: testImplementation("app.cash.turbine:turbine:1.1.0")
@Test
fun `emits loading then success`() = runTest {
    viewModel.uiState.test {
        assertThat(awaitItem()).isEqualTo(ProductsUiState.Loading)
        assertThat(awaitItem()).isInstanceOf(ProductsUiState.Success::class.java)
        cancelAndConsumeRemainingEvents()
    }
}
```

> Use `UnconfinedTestDispatcher` for tests where you want eager execution.
> Use `StandardTestDispatcher` when you need to control virtual time with
> `advanceTimeBy()` or `advanceUntilIdle()`.
