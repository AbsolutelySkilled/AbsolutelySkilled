<!-- Part of the ios-swift AbsolutelySkilled skill. Load this file when
     profiling or optimizing iOS app performance, memory, rendering, or launch time. -->

# Performance Tuning

## Instruments Workflows

### Time Profiler

Use to find CPU bottlenecks - functions consuming the most time.

1. Profile on a real device (Product -> Profile or Cmd+I)
2. Select the Time Profiler template
3. Record while reproducing the slow behavior
4. Sort by "Self Weight" to find hotspots
5. Uncheck "Separate by Thread" to see overall impact
6. Check "Invert Call Tree" to see leaf functions first
7. Double-click to jump to source code

**Common findings:**
- JSON decoding on the main thread
- Image resizing/decoding synchronously
- Complex view layout calculations
- String processing in tight loops

### Allocations

Use to find memory issues - objects that grow without bound.

1. Select the Allocations template
2. Record while exercising the suspected flow
3. Use "Mark Generation" between navigation actions
4. Growth between generations reveals leaks or unbounded caches
5. Filter by your app's class names to focus on your code

**Look for:**
- Generations that only grow (never shrink) - memory leak
- Large image allocations not released after dismissal
- Retained view controllers after navigation back

### Leaks

Use alongside Allocations to find retain cycles.

1. Select the Leaks template
2. Exercise the app (push/pop screens, open/close features)
3. Leaks instrument will flag leaked objects
4. Inspect the retain cycle in the cycle graph

**Common retain cycles:**
- Closure capturing `self` strongly
- Delegate not declared as `weak`
- `Timer` retaining its target
- `NotificationCenter` observers with strong references

### Core Animation (Rendering)

Use to find rendering performance issues (dropped frames, hitches).

1. Select the Core Animation template (or use "Animation Hitches" in newer Xcode)
2. Look for frames exceeding 16.67ms (60fps) or 8.33ms (120fps on ProMotion)
3. Enable "Color Blended Layers" - red areas indicate alpha blending overhead
4. Enable "Color Offscreen-Rendered" - yellow areas indicate expensive offscreen passes

**Common fixes:**
- Set `layer.shouldRasterize = true` for complex static views (with correct `rasterizationScale`)
- Avoid `clipsToBounds` + `cornerRadius` on frequently redrawn views (use a mask layer instead)
- Pre-decode images to the display size with `UIGraphicsImageRenderer`
- Use opaque backgrounds where possible to reduce blending

---

## Memory Optimization

### Image handling

Images are the largest memory consumers in most iOS apps.

```swift
// Bad: loads full-resolution image into memory
let image = UIImage(named: "hero")

// Good: downsample to display size
func downsample(imageAt url: URL, to pointSize: CGSize, scale: CGFloat) -> UIImage? {
    let maxDimensionInPixels = max(pointSize.width, pointSize.height) * scale
    let options: [CFString: Any] = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceShouldCacheImmediately: true,
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceThumbnailMaxPixelSize: maxDimensionInPixels
    ]

    guard let imageSource = CGImageSourceCreateWithURL(url as CFURL, nil),
          let cgImage = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, options as CFDictionary)
    else { return nil }

    return UIImage(cgImage: cgImage)
}
```

### Memory budget guidelines

| Device | Safe memory ceiling |
|---|---|
| 2GB RAM (iPhone SE 3) | ~600MB |
| 4GB RAM (iPhone 14) | ~1.2GB |
| 6GB RAM (iPhone 15 Pro) | ~2GB |

Exceeding these thresholds risks `jetsam` termination (system kills your app). Monitor with `os_proc_available_memory()`.

### Autorelease pool optimization

```swift
// When creating many temporary objects in a loop
for imageURL in urls {
    autoreleasepool {
        let image = processImage(at: imageURL)
        saveProcessedImage(image)
    }
}
```

---

## Launch Time Optimization

Target: < 400ms for warm launch. Apple considers > 2 seconds unacceptable.

### Measurement

```swift
// In your app delegate or @main struct
// Xcode shows pre-main time in the environment variable
// DYLD_PRINT_STATISTICS = 1
```

Use the App Launch template in Instruments for detailed breakdown.

### Pre-main optimizations

- Reduce embedded frameworks (each framework adds ~10-30ms)
- Remove unused code and frameworks
- Avoid `+load` and `+initialize` methods in Objective-C code
- Minimize static initializers

### Post-main optimizations

- Defer non-essential work past first frame render
- Load Core Data store asynchronously
- Defer analytics SDK initialization
- Use lazy initialization for heavy objects
- Prefetch critical data but don't block the main thread

```swift
@main
struct MyApp: App {
    init() {
        // Only essential setup here
        configureAppearance()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .task {
                    // Deferred initialization
                    await initializeAnalytics()
                    await prefetchUserData()
                }
        }
    }
}
```

---

## SwiftUI Performance

### Reducing view re-evaluations

```swift
// Use @Observable for fine-grained updates (iOS 17+)
@Observable
class ViewModel {
    var title = ""
    var items: [Item] = []
    var isLoading = false
}

// Only views reading `title` re-evaluate when title changes
// Views reading `items` are unaffected
```

### Lazy containers

```swift
// Always use Lazy variants for large collections
ScrollView {
    LazyVStack(spacing: 8) {
        ForEach(items) { item in
            ItemRow(item: item)
        }
    }
}
```

### Identifying views correctly

```swift
// Bad: using index as id causes full re-render on changes
ForEach(Array(items.enumerated()), id: \.offset) { ... }

// Good: use stable identifier
ForEach(items) { item in  // Item conforms to Identifiable
    ItemRow(item: item)
}
```

### Avoiding unnecessary work

```swift
// Cache formatted values
struct ItemRow: View {
    let item: Item

    // Computed once per evaluation, not per render
    private var formattedPrice: String {
        item.price.formatted(.currency(code: "USD"))
    }

    var body: some View {
        Text(formattedPrice)
    }
}
```

---

## Energy Efficiency

Battery drain causes negative App Store reviews. Profile with the Energy Log instrument.

### Best practices

- Use `BGTaskScheduler` for background work, not continuous background execution
- Batch network requests instead of many small calls
- Stop location updates when not needed (`locationManager.stopUpdatingLocation()`)
- Use significant location changes (`startMonitoringSignificantLocationChanges()`) when precise tracking is unnecessary
- Reduce GPS accuracy when high precision is not required
- Stop timers when views disappear
- Use `URLSession` background transfers for large downloads
- Avoid polling - use push notifications or server-sent events

### Networking efficiency

```swift
// Batch requests with TaskGroup
func fetchAllData() async throws -> (users: [User], posts: [Post]) {
    async let users = fetchUsers()
    async let posts = fetchPosts()
    return try await (users, posts)
}

// Use URLCache effectively
let config = URLSessionConfiguration.default
config.urlCache = URLCache(
    memoryCapacity: 20 * 1024 * 1024,   // 20 MB memory
    diskCapacity: 100 * 1024 * 1024      // 100 MB disk
)
config.requestCachePolicy = .returnCacheDataElseLoad
```
