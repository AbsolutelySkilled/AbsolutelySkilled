<!-- Part of the pixel-art-sprites AbsolutelySkilled skill. Load this file when
     working with pixel art color palettes, palette selection, or palette constraints. -->

# Palette Recipes

Pre-built palette structures for common game genres and hardware emulation.
Each recipe defines the color roles and hex values ready for import into
Aseprite, Piskel, or any tool that accepts .hex/.gpl palettes.

---

## Palette design principles

### Hue shifting

Never shade by adding black or white. Shift hue as you change value:
- Shadows: shift hue toward blue/purple (cool)
- Highlights: shift hue toward yellow/orange (warm)

This creates vibrant, lively colors. Pure value scaling produces dead, muddy tones.

### Ramp construction

A single-hue ramp has 3-5 entries:

```
Step 1 (darkest shadow):  low value, high saturation, cool hue shift
Step 2 (shadow):          medium-low value, medium saturation
Step 3 (base):            medium value, medium saturation, true hue
Step 4 (highlight):       medium-high value, lower saturation, warm hue shift
Step 5 (bright):          high value, low saturation, warm hue shift
```

Reduce saturation as you approach white - pure saturated highlights look neon and unnatural.

---

## Fantasy RPG palette (16 colors)

Best for: medieval fantasy, dungeon crawlers, adventure games.

```
Outline:        #1a1a2e
Skin shadow:    #8b5e3c
Skin base:      #d4a574
Skin highlight: #f2d8b8
Hair dark:      #3d2b1f
Hair light:     #6b4c36
Green shadow:   #2d5a27
Green base:     #4a8c3f
Green light:    #7bc96a
Blue shadow:    #2a3f6e
Blue base:      #4a7ec9
Brown shadow:   #4a3728
Brown base:     #7a6045
Gray:           #8e8e9a
White:          #e8e4df
Gold accent:    #d4a017
```

Use the green ramp for foliage, the brown ramp for wood/leather, blue for water/sky/magic.

---

## Sci-fi palette (16 colors)

Best for: space games, cyberpunk, futuristic UI elements.

```
Void:           #0a0a1a
Dark panel:     #1c1c3a
Panel base:     #2e2e5c
Panel light:    #4a4a8c
Glow shadow:    #1a4a4a
Glow base:      #2ae6c8
Glow bright:    #7affef
Alert red:      #e63946
Alert dim:      #8c2430
Warm metal:     #9a8866
Cool metal:     #6a7a8e
Metal highlight:#b8c8d8
Skin shadow:    #6a4e3a
Skin base:      #c49a6c
White:          #e0e8f0
Orange accent:  #ff8c42
```

Emphasize high contrast between dark backgrounds and neon glows. Keep metal desaturated.

---

## Horror/dark palette (12 colors)

Best for: horror, gothic, dark atmosphere games.

```
Deep black:     #0d0d12
Dark purple:    #1f1428
Blood shadow:   #4a1a1a
Blood base:     #8c2e2e
Rust:           #6a4430
Skin pale:      #c8b098
Skin sickly:    #a89878
Gray cold:      #4a4e58
Gray light:     #7a7e88
Bone:           #d8d0c0
Eye glow:       #c8e038
Fog:            #b8b8c8
```

Restrict the palette to muted, desaturated tones. The single bright accent (eye glow) draws focus.

---

## Game Boy (4 shades)

Emulates the original Game Boy's 4-shade green LCD.

```
Darkest:        #0f380f
Dark:           #306230
Light:          #8bac0f
Lightest:       #9bbc0f
```

All sprites, backgrounds, and UI must work within these 4 values. Forces extreme clarity in silhouette design.

---

## NES-style palette (25 colors, selected from the NES 54-color master)

The NES hardware could display 25 colors simultaneously (4 palettes of 4 colors + shared background). This selection covers most game needs:

```
Background:     #0f0f0f  (shared black)

Palette 0 (character):
  #7c1f22  #d45040  #f8a060  #fce8c0

Palette 1 (environment):
  #1a3a1a  #30782e  #68b840  #b8f878

Palette 2 (sky/water):
  #0c2060  #2060c0  #4898f8  #a8d8f8

Palette 3 (UI/accent):
  #601080  #a040c0  #e078f0  #f8f8f8
```

Each palette group must include a shadow, midtone, highlight, and bright value.

---

## PICO-8 fixed palette (16 colors)

The PICO-8 fantasy console uses a fixed 16-color palette. Many pixel artists use it as a constraint even outside PICO-8.

```
 0: #000000  black         8: #ff004d  red
 1: #1d2b53  dark blue     9: #ffa300  orange
 2: #7e2553  dark purple  10: #ffec27  yellow
 3: #008751  dark green   11: #00e436  green
 4: #ab5236  brown        12: #29adff  blue
 5: #5f574f  dark gray    13: #83769c  lavender
 6: #c2c3c7  light gray   14: #ff77a8  pink
 7: #fff1e8  white        15: #ffccaa  peach
```

The PICO-8 palette is well-balanced for general purpose pixel art. Use it as-is for jam games or as a starting template.

---

## Building custom palettes

### Method 1: Ramp-first

1. Decide how many distinct hues you need (usually 3-5)
2. For each hue, build a 3-4 step ramp with hue shifting
3. Add one outline color (near-black, slightly tinted)
4. Add one near-white highlight
5. Total: (hues x ramp_steps) + 2

### Method 2: Reference-first

1. Find a screenshot or photo with the mood you want
2. Sample 4-6 dominant colors
3. Build ramps around each sampled color
4. Adjust for contrast - ensure darkest and lightest values are far enough apart

### Method 3: Tool-assisted

- **Lospec Palette List** (lospec.com/palette-list) - browse thousands of curated palettes
- **Aseprite palette editor** - built-in ramp generation with hue shift
- **Color Ramp Generator** (pixelparmesan.com/color-ramp-generator) - web tool for hue-shifted ramps

---

## Palette file formats

| Format | Extension | Used by |
|---|---|---|
| GIMP Palette | .gpl | GIMP, Aseprite, LibreSprite |
| Hex text | .hex | Lospec, web tools |
| Adobe Color Table | .act | Photoshop |
| PAL (RIFF) | .pal | Pro Motion, older tools |
| PNG swatch | .png | Universal - 1px per color in a row |

Export as .gpl for maximum compatibility. Most pixel art tools can import .gpl or .hex directly.
