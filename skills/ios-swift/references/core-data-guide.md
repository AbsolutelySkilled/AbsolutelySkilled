<!-- Part of the ios-swift AbsolutelySkilled skill. Load this file when
     working with Core Data models, fetch requests, migrations, or CloudKit sync. -->

# Core Data Guide

## Stack Architecture

```
NSPersistentContainer
  |
  +-- NSPersistentStoreCoordinator
  |     |
  |     +-- NSPersistentStore (SQLite, In-Memory, etc.)
  |
  +-- viewContext (NSManagedObjectContext - main queue)
  |
  +-- newBackgroundContext() (NSManagedObjectContext - private queue)
```

### Standard setup

```swift
class PersistenceController {
    static let shared = PersistenceController()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "DataModel")

        if inMemory {
            container.persistentStoreDescriptions.first?.url = URL(fileURLWithPath: "/dev/null")
        }

        container.loadPersistentStores { description, error in
            if let error {
                fatalError("Core Data store failed to load: \(error.localizedDescription)")
            }
        }

        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }
}
```

---

## Model Design

### Entity attributes

| Swift type | Core Data type | Notes |
|---|---|---|
| `String` | String | |
| `Int16/32/64` | Integer 16/32/64 | Use Int64 for most cases |
| `Double` | Double | |
| `Bool` | Boolean | |
| `Date` | Date | |
| `Data` | Binary Data | Enable "Allows External Storage" for > 100KB |
| `UUID` | UUID | Good for unique identifiers |
| `URL` | URI | Stored as string internally |

### Relationships

- **To-one**: Optional by default; set delete rule appropriately
- **To-many**: Returns `NSSet`; use generated accessors or `NSOrderedSet`
- **Always set inverse relationships** - Core Data uses them for graph consistency

### Delete rules

| Rule | Behavior |
|---|---|
| Nullify | Set inverse to nil (default, safest) |
| Cascade | Delete related objects (parent deletes children) |
| Deny | Prevent deletion if relationships exist |
| No Action | Do nothing (can leave orphans - avoid) |

---

## Fetch Requests

### Basic fetch

```swift
let request = NSFetchRequest<Item>(entityName: "Item")
request.predicate = NSPredicate(format: "isCompleted == %@", NSNumber(value: false))
request.sortDescriptors = [NSSortDescriptor(keyPath: \Item.createdAt, ascending: false)]
request.fetchLimit = 50

let items = try context.fetch(request)
```

### Common predicates

```swift
// String matching
NSPredicate(format: "name CONTAINS[cd] %@", searchText)

// Date range
NSPredicate(format: "createdAt >= %@ AND createdAt <= %@", startDate as CVarArg, endDate as CVarArg)

// Relationship
NSPredicate(format: "category.name == %@", "Books")

// In set
NSPredicate(format: "status IN %@", ["active", "pending"])

// Compound
NSCompoundPredicate(andPredicateWithSubpredicates: [predicate1, predicate2])
```

### Performance optimization

- Use `fetchBatchSize` (typically 20-50) to reduce memory for large result sets
- Use `propertiesToFetch` to load only needed attributes (partial faulting)
- Use `NSAsynchronousFetchRequest` for fetches that might take > 100ms
- Use `NSFetchedResultsController` for table/collection view data sources
- Avoid fetching in loops - batch operations instead

```swift
request.fetchBatchSize = 20
request.propertiesToFetch = ["name", "createdAt"]
request.returnsObjectsAsFaults = true  // default, loads data on access
```

### @FetchRequest in SwiftUI

```swift
struct ItemListView: View {
    @FetchRequest(
        sortDescriptors: [SortDescriptor(\.createdAt, order: .reverse)],
        predicate: NSPredicate(format: "isCompleted == false"),
        animation: .default
    )
    private var items: FetchedResults<Item>

    var body: some View {
        List(items) { item in
            Text(item.name ?? "Untitled")
        }
    }
}
```

---

## Background Operations

### Writing on a background context

```swift
func importItems(_ data: [ItemData]) {
    let context = PersistenceController.shared.container.newBackgroundContext()
    context.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy

    context.perform {
        for itemData in data {
            let item = Item(context: context)
            item.name = itemData.name
            item.createdAt = Date()
        }

        do {
            try context.save()
        } catch {
            context.rollback()
            print("Background save failed: \(error)")
        }
    }
}
```

### Batch operations (iOS 13+)

For large imports/updates, use batch operations that bypass the object graph:

```swift
// Batch insert
let batchInsert = NSBatchInsertRequest(entityName: "Item",
    managedObjectHandler: { object in
        guard let item = object as? Item else { return true }
        // configure item from your data source
        return false  // return true when done
    })
batchInsert.resultType = .objectIDs
let result = try context.execute(batchInsert) as? NSBatchInsertResult

// Merge changes into viewContext
if let objectIDs = result?.result as? [NSManagedObjectID] {
    NSManagedObjectContext.mergeChanges(
        fromRemoteContextSave: [NSInsertedObjectsKey: objectIDs],
        into: [container.viewContext]
    )
}

// Batch delete
let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "Item")
fetchRequest.predicate = NSPredicate(format: "isArchived == true")
let batchDelete = NSBatchDeleteRequest(fetchRequest: fetchRequest)
batchDelete.resultType = .resultTypeObjectIDs
try context.execute(batchDelete)
```

---

## Thread Safety Rules

1. **Never pass `NSManagedObject` across threads** - use `objectID` and re-fetch
2. **Always use `perform {}` or `performAndWait {}`** for context operations
3. **`viewContext` is main-queue only** - access only from the main thread
4. **Background contexts are private-queue** - only access inside `perform {}`
5. **Set `automaticallyMergesChangesFromParent = true`** on `viewContext` to see background saves

```swift
// Safe: pass objectID across threads
let objectID = item.objectID

context.perform {
    let item = context.object(with: objectID) as! Item
    item.name = "Updated"
    try? context.save()
}
```

---

## Migrations

### Lightweight migration (automatic)

Core Data handles these automatically when you add the migration options:

```swift
let description = NSPersistentStoreDescription()
description.shouldMigrateStoreAutomatically = true
description.shouldInferMappingModelAutomatically = true
```

Supported lightweight changes:
- Add/remove attributes (with default values for non-optional new attributes)
- Add/remove entities
- Rename entities/attributes (set renaming identifier in model editor)
- Change relationship cardinality
- Add/remove relationships

### Custom migration

For changes that exceed lightweight migration (transforming data, splitting entities):

1. Create a new model version in Xcode (Editor -> Add Model Version)
2. Create an `NSMappingModel` with custom `NSEntityMigrationPolicy` subclasses
3. Implement `createDestinationInstances(forSource:in:manager:)` for data transformation

---

## CloudKit Sync (NSPersistentCloudKitContainer)

```swift
let container = NSPersistentCloudKitContainer(name: "DataModel")

let description = container.persistentStoreDescriptions.first!
description.cloudKitContainerOptions = NSPersistentCloudKitContainerOptions(
    containerIdentifier: "iCloud.com.yourapp.container"
)

container.loadPersistentStores { _, error in
    if let error { fatalError("CloudKit store failed: \(error)") }
}

container.viewContext.automaticallyMergesChangesFromParent = true
container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
```

Key considerations:
- All attributes must be optional (CloudKit requirement)
- Unique constraints are not supported with CloudKit
- Relationships must have inverses
- Monitor sync status with `NSPersistentCloudKitContainer.eventChangedNotification`
- Test with real iCloud accounts on devices, not Simulator
