<!-- Part of the android-kotlin AbsolutelySkilled skill. Load this file when
     working with complex Room queries, type converters, relations, testing,
     or full-text search. -->

# Room Advanced

## Type converters

Room only supports primitive types and strings natively. Use `@TypeConverter`
for complex types.

```kotlin
class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? = value?.let { Date(it) }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? = date?.time

    @TypeConverter
    fun fromStringList(value: String?): List<String> =
        value?.split(",")?.map { it.trim() } ?: emptyList()

    @TypeConverter
    fun stringListToString(list: List<String>): String = list.joinToString(",")
}

@Database(entities = [Task::class], version = 1)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
}
```

> For complex objects, prefer storing as JSON with a Gson/Moshi converter. For
> lists of IDs, consider a junction table instead of serialized strings.

## Relations

### One-to-many

```kotlin
@Entity
data class User(
    @PrimaryKey val userId: Long,
    val name: String,
)

@Entity(
    foreignKeys = [ForeignKey(
        entity = User::class,
        parentColumns = ["userId"],
        childColumns = ["ownerUserId"],
        onDelete = ForeignKey.CASCADE,
    )]
)
data class Playlist(
    @PrimaryKey val playlistId: Long,
    val ownerUserId: Long,
    val name: String,
)

data class UserWithPlaylists(
    @Embedded val user: User,
    @Relation(parentColumn = "userId", entityColumn = "ownerUserId")
    val playlists: List<Playlist>,
)

@Dao
interface UserDao {
    @Transaction
    @Query("SELECT * FROM User WHERE userId = :id")
    fun getUserWithPlaylists(id: Long): Flow<UserWithPlaylists>
}
```

> Always annotate relation queries with `@Transaction` to ensure data consistency
> across the multiple queries Room executes internally.

### Many-to-many

```kotlin
@Entity(primaryKeys = ["playlistId", "songId"])
data class PlaylistSongCrossRef(
    val playlistId: Long,
    val songId: Long,
)

data class PlaylistWithSongs(
    @Embedded val playlist: Playlist,
    @Relation(
        parentColumn = "playlistId",
        entityColumn = "songId",
        associateBy = Junction(PlaylistSongCrossRef::class),
    )
    val songs: List<Song>,
)
```

## Complex queries

### Dynamic queries with RawQuery

```kotlin
@Dao
interface SearchDao {
    @RawQuery(observedEntities = [Task::class])
    fun search(query: SupportSQLiteQuery): Flow<List<Task>>
}

// Usage
val query = SimpleSQLiteQuery(
    "SELECT * FROM tasks WHERE title LIKE ? ORDER BY createdAt DESC",
    arrayOf("%$searchTerm%"),
)
searchDao.search(query)
```

### Full-text search (FTS4)

```kotlin
@Fts4(contentEntity = Task::class)
@Entity(tableName = "tasks_fts")
data class TaskFts(
    val title: String,
    val description: String,
)

@Dao
interface TaskDao {
    @Query("""
        SELECT tasks.* FROM tasks
        JOIN tasks_fts ON tasks.rowid = tasks_fts.rowid
        WHERE tasks_fts MATCH :query
    """)
    fun search(query: String): Flow<List<Task>>
}
```

> FTS queries use the MATCH operator, not LIKE. Search terms support prefix
> matching with `*` (e.g. `"prod*"`) and boolean operators (`AND`, `OR`, `NOT`).

## Migrations

### Auto-migration (Room 2.4+)

For simple schema changes (add column, add table), Room can generate migrations
automatically.

```kotlin
@Database(
    entities = [Task::class],
    version = 2,
    autoMigrations = [AutoMigration(from = 1, to = 2)],
)
abstract class AppDatabase : RoomDatabase()
```

For renames or deletes, provide a spec:

```kotlin
@RenameColumn(tableName = "tasks", fromColumnName = "done", toColumnName = "isCompleted")
class Migration1To2 : AutoMigrationSpec

@Database(
    entities = [Task::class],
    version = 2,
    autoMigrations = [AutoMigration(from = 1, to = 2, spec = Migration1To2::class)],
)
abstract class AppDatabase : RoomDatabase()
```

### Manual migration

```kotlin
val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(db: SupportSQLiteDatabase) {
        // Create new table with new schema
        db.execSQL("""
            CREATE TABLE tasks_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                title TEXT NOT NULL,
                isCompleted INTEGER NOT NULL DEFAULT 0,
                priority INTEGER NOT NULL DEFAULT 0
            )
        """)
        // Copy data
        db.execSQL("""
            INSERT INTO tasks_new (id, title, isCompleted)
            SELECT id, title, isCompleted FROM tasks
        """)
        // Swap
        db.execSQL("DROP TABLE tasks")
        db.execSQL("ALTER TABLE tasks_new RENAME TO tasks")
    }
}
```

## Testing Room

```kotlin
@RunWith(AndroidJUnit4::class)
class TaskDaoTest {
    private lateinit var db: AppDatabase
    private lateinit var taskDao: TaskDao

    @Before
    fun setup() {
        db = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AppDatabase::class.java,
        ).allowMainThreadQueries().build()
        taskDao = db.taskDao()
    }

    @After
    fun teardown() {
        db.close()
    }

    @Test
    fun insertAndRead() = runTest {
        val task = Task(title = "Test task")
        taskDao.insert(task)

        val tasks = taskDao.getAll().first()
        assertThat(tasks).hasSize(1)
        assertThat(tasks[0].title).isEqualTo("Test task")
    }
}
```

> Use `inMemoryDatabaseBuilder` for tests - it's fast and doesn't persist.
> Use `allowMainThreadQueries()` only in tests, never in production.

## Performance tips

- Use `@ColumnInfo(index = true)` on columns used in WHERE or JOIN clauses
- Avoid `SELECT *` in queries returning many rows - select only needed columns
- Use `PagingSource` from Paging 3 for large datasets instead of `Flow<List<T>>`
- Enable WAL mode (default since Room 2.0) for concurrent read/write performance
- Use `@Upsert` (Room 2.5+) instead of `@Insert(onConflict = REPLACE)` to avoid
  unnecessary deletes and re-inserts
