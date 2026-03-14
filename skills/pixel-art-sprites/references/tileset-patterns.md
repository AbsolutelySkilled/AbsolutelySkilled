<!-- Part of the pixel-art-sprites AbsolutelySkilled skill. Load this file when
     working with tilesets, tile maps, auto-tiling, or terrain transitions. -->

# Tileset Patterns

Tileset design patterns, auto-tile bitmask systems, and organization strategies
for 2D tile-based games.

---

## Tile sizes

| Size | Pros | Cons | Best for |
|---|---|---|---|
| 8x8 | Tiny file size, retro feel | Very limited detail | NES-style, minimalist games |
| 16x16 | Industry standard, good balance | Characters need 16x24+ for readability | Most 2D games, RPGs, platformers |
| 32x32 | High detail, readable characters | Larger files, more drawing time | Detailed RPGs, strategy games |
| 48x48 | Rich detail | Approaches non-pixel territory | High-res pixel art games |

Choose one size for the entire project. Mixing tile sizes creates alignment headaches.

---

## Tileset organization

### Standard tileset layout

Organize tiles by function, not by visual similarity:

```
Row 0:  Ground variants (grass1, grass2, grass3, dirt1, dirt2, stone1...)
Row 1:  Ground edges - grass-to-dirt transitions
Row 2:  Water tiles (still, animated frame 1-3, shore edges)
Row 3:  Walls (top, middle, bottom, left-cap, right-cap, corners)
Row 4:  Decorations (flowers, rocks, signs, chests, barrels)
Row 5:  Interactive (doors, levers, breakable walls)
Row 6:  Special / UI (shadow overlay, highlight, selection indicator)
```

### Tile ID conventions

Assign predictable IDs so the game engine can reference tiles by number:

```
0:    Empty / transparent
1-10: Ground base tiles
11-26: Ground edge transitions (16 auto-tile variants)
27-30: Water base (animated, 3 frames + still)
31-46: Water edge transitions
47-60: Wall pieces
61+:  Decorations and special
```

---

## Auto-tiling systems

Auto-tiling automatically selects the correct tile variant based on
neighboring tiles. This is what makes terrain transitions seamless.

### 4-bit (simple) auto-tiling

Check 4 cardinal neighbors (up, right, down, left). Each can be same-type
(1) or different-type (0). This gives 2^4 = 16 possible combinations.

**Bitmask values:**

```
       UP = 1
LEFT = 8   RIGHT = 2
      DOWN = 4
```

| Bitmask | Neighbors present | Tile type |
|---|---|---|
| 0 | None | Isolated (single tile) |
| 1 | Up | Bottom edge |
| 2 | Right | Left edge |
| 3 | Up + Right | Bottom-left corner |
| 4 | Down | Top edge |
| 5 | Up + Down | Vertical corridor |
| 6 | Right + Down | Top-left corner |
| 7 | Up + Right + Down | Left edge (open left) |
| 8 | Left | Right edge |
| 9 | Up + Left | Bottom-right corner |
| 10 | Right + Left | Horizontal corridor |
| 11 | Up + Right + Left | Bottom edge (open bottom) |
| 12 | Down + Left | Top-right corner |
| 13 | Up + Down + Left | Right edge (open right) |
| 14 | Right + Down + Left | Top edge (open top) |
| 15 | All | Center / interior |

This system handles most games well. Diagonal transitions will show
visible corners where two terrains meet at a diagonal.

### 8-bit (full) auto-tiling - Wang tiles / blob tileset

Check all 8 neighbors (4 cardinal + 4 diagonal). This gives 2^8 = 256
combinations, but many are redundant. After eliminating cases where a
diagonal only matters if both adjacent cardinals are present, you get
**47 unique tiles**.

**When to use 8-bit:**
- Terrain transitions need smooth diagonal corners
- The game has large open areas where diagonal seams are visible
- You need professional-quality terrain blending

**When 4-bit is enough:**
- Small maps or dungeon rooms
- Tile transitions are covered by decorative objects
- Development time is limited

### 47-tile breakdown

The 47 tiles cover these categories:

```
Interior tiles:     1  (all neighbors same)
Edge tiles:         4  (one side exposed)
Outer corners:      4  (two adjacent sides exposed)
Inner corners:      4  (diagonal exposed, both adjacent cardinals same)
Three-side exposed: 4  (only one side has same-type neighbor)
Peninsulas:         4  (narrow 1-tile protrusions)
Combined cases:    26  (various inner + outer corner combos)
```

### Drawing the 47-tile set efficiently

Do not draw 47 tiles from scratch. Use this workflow:

1. **Draw 5 base tiles:** full interior, top edge, right edge, inner corner (top-right), outer corner (top-right)
2. **Rotate/mirror** to get the 4 directional variants of each
3. **Composite** the corner and edge tiles to generate combination tiles
4. **Hand-adjust** any composited tiles that look wrong at the seams

Many tile editors (Tilesetter, Auto Tile Gen) automate step 2-3.

---

## Terrain transitions

### Two-terrain transition

When grass meets dirt, you need transition tiles. The grass tile is the
"primary" (it draws on top), dirt is the "secondary" (it fills gaps).

**Approach:**
1. Draw the dirt tile as a complete seamless tile
2. Draw the grass tile, also seamless
3. Create transition tiles where grass partially covers dirt
4. The transition edge should be organic (not a straight line)

### Multi-terrain transitions

When 3+ terrains meet (grass, dirt, water), complexity explodes. Strategies:

1. **Layered approach** - Assign a draw priority to each terrain. Higher priority
   terrains draw their edges on top of lower ones. Only need transition tiles
   between adjacent priority levels.

2. **Corner-based approach** - Each tile has 4 corners. Each corner can be any
   terrain type. Generate tiles for all corner combinations. This scales
   to n^4 tiles for n terrain types (expensive but complete).

3. **Practical compromise** - Define which terrains can be adjacent (grass-dirt
   yes, grass-lava no). Only create transitions for valid pairs.

---

## Animated tiles

Some tiles need animation: water, lava, torches, grass waving.

### Implementation strategies

**Strategy 1: Separate animated tileset**

Export animated tiles as additional columns in the tileset. The engine
swaps tile IDs on a timer.

```
Tile 27: water-frame-0
Tile 28: water-frame-1
Tile 29: water-frame-2
```

Engine cycles: 27 -> 28 -> 29 -> 27 (at 200ms intervals).

**Strategy 2: Shader-based**

For simple animations (color cycling, palette shifting), use a shader
that rotates palette indices. No extra tiles needed. Works well for
water shimmer and lava glow.

**Strategy 3: Overlay sprites**

Place animated sprites on top of static tiles. Good for torches, sparkles,
smoke. Keeps the tileset simple and animation contained in the sprite system.

### Animated tile timing

| Tile type | Frames | ms/frame | Notes |
|---|---|---|---|
| Water (calm) | 3-4 | 250-400ms | Slow, rhythmic |
| Water (rapids) | 3-4 | 100-150ms | Faster cycling |
| Lava | 3-4 | 200-300ms | Irregular timing adds realism |
| Torch flame | 3-4 | 120-180ms | Randomize per-torch for variety |
| Grass sway | 2-3 | 300-500ms | Very subtle, easy to overdo |
| Waterfall | 2-3 | 80-120ms | Fast, continuous |

---

## Tileset export checklist

- [ ] All tiles are exactly the same size (no off-by-one errors)
- [ ] No gaps or padding between tiles (or consistent 1px padding if engine requires)
- [ ] Background color is transparent or documented chroma key
- [ ] Tile IDs are documented in a map or spreadsheet
- [ ] Seamless tiles tested in a 3x3+ grid
- [ ] Transition tiles tested with all valid neighbor combinations
- [ ] Animated tiles have consistent frame count and timing
- [ ] Exported at 1x scale (engine handles scaling with nearest-neighbor)
- [ ] File format is PNG (lossless - never JPEG for pixel art)

---

## Tool-specific tileset setup

### Godot (TileMap + TileSet)

1. Import tileset PNG with texture filter set to Nearest
2. Create a TileSet resource, set tile size to match your grid
3. Use the auto-tile feature: paint terrain types onto the tileset
4. Godot 4 supports the 47-tile blob format natively

### Unity (Tilemap)

1. Import PNG: Sprite Mode = Multiple, Filter = Point, Compression = None
2. Slice using Sprite Editor at tile size
3. Create a Tile Palette, drag sliced sprites in
4. For auto-tiling, use Rule Tiles (Unity 2D Tilemap Extras package)

### Tiled (map editor)

1. Import tileset PNG, set tile dimensions
2. Define terrain types using the Terrain Editor
3. Export as JSON or TMX for engine import
4. Tiled supports Wang tile sets for 8-bit auto-tiling

---

## Common tileset mistakes

| Mistake | Result | Fix |
|---|---|---|
| Tiles not truly seamless | Visible grid lines in the map | Test every tile in a 5x5 repeated grid |
| Inconsistent lighting direction | Some tiles lit from left, others from right | Establish light direction before drawing any tile |
| Too much detail in repeating tiles | Obvious pattern repetition in large areas | Create 3-4 variants and randomize placement |
| Forgetting collision data | Pretty tiles but broken gameplay | Define collision shapes alongside visual tiles |
| JPEG export | Compression artifacts destroy pixel art | Always export as PNG (lossless) |
