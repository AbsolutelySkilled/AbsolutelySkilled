<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with images, avatars, galleries, carousels, video, or media elements. -->

# Images and Media

## Avatars
- Sizes: 24px (inline), 32px (list), 40px (card), 48px (profile), 64px (large), 96-128px (hero)
- Always circular; fallback: initials on color background (color from name hash)
- Status dot: 8-12px, bottom-right, border matching bg; Group stack: -8px overlap, "+N" pill

```css
.avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; flex-shrink: 0; font-weight: 600; text-transform: uppercase; color: #fff; background-color: #6366f1; }
.avatar--24  { width: 24px;  height: 24px;  font-size: 10px; }
.avatar--32  { width: 32px;  height: 32px;  font-size: 12px; }
.avatar--40  { width: 40px;  height: 40px;  font-size: 14px; }
.avatar--48  { width: 48px;  height: 48px;  font-size: 16px; }
.avatar--64  { width: 64px;  height: 64px;  font-size: 20px; }
.avatar--96  { width: 96px;  height: 96px;  font-size: 28px; }
.avatar--128 { width: 128px; height: 128px; font-size: 36px; }
.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

.avatar-wrapper { position: relative; display: inline-flex; }
.avatar-status { position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #fff; background-color: #22c55e; }
.avatar-status--away    { background-color: #f59e0b; }
.avatar-status--offline { background-color: #9ca3af; }
.avatar-status--busy    { background-color: #ef4444; }

.avatar-group { display: inline-flex; align-items: center; }
.avatar-group .avatar-wrapper { margin-left: -8px; }
.avatar-group .avatar-wrapper:first-child { margin-left: 0; }
.avatar-group .avatar-wrapper:nth-child(1) { z-index: 4; }
.avatar-group .avatar-wrapper:nth-child(2) { z-index: 3; }
.avatar-group .avatar-wrapper:nth-child(3) { z-index: 2; }
.avatar-group__overflow { display: inline-flex; align-items: center; justify-content: center; margin-left: -8px; width: 32px; height: 32px; border-radius: 50%; background-color: #e5e7eb; color: #374151; font-size: 11px; font-weight: 600; border: 2px solid #fff; }
```

## Responsive Images
- Always: `max-width: 100%; height: auto; display: block`
- Use `aspect-ratio` CSS to prevent layout shift; `srcset` for resolution switching; `<picture>` for art direction
- `loading="lazy"` for below-fold; `loading="eager" fetchpriority="high"` for hero

```css
img { max-width: 100%; height: auto; display: block; }

.img-container { position: relative; width: 100%; overflow: hidden; border-radius: 8px; }
.img-container img { width: 100%; height: 100%; object-fit: cover; }
```

## Image Aspect Ratios
- 16:9 - video, hero banners; 4:3 - products, blog thumbnails; 1:1 - avatars, galleries; 3:2 - landscape

```css
.ratio-16-9 { aspect-ratio: 16 / 9; }
.ratio-4-3  { aspect-ratio: 4 / 3; }
.ratio-1-1  { aspect-ratio: 1 / 1; }
.ratio-3-2  { aspect-ratio: 3 / 2; }

/* Padding-bottom fallback (older browsers) */
.ratio-16-9-legacy { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
.ratio-16-9-legacy > * { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
```

## Image Placeholders / Loading

```css
/* Blur-up technique */
.blur-up { filter: blur(20px); transition: filter 400ms ease; }
.blur-up.is-loaded { filter: blur(0); }

/* Dominant color placeholder - set background-color inline from extracted color */
.img-placeholder { background-color: #e5e7eb; position: relative; }

/* Skeleton pulse */
@keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.img-skeleton { background-color: #e5e7eb; border-radius: 4px; animation: skeleton-pulse 1.5s ease-in-out infinite; }
```

## Image Galleries

```css
/* Equal grid gallery */
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.gallery-grid__item { aspect-ratio: 1 / 1; overflow: hidden; border-radius: 4px; cursor: pointer; }
.gallery-grid__item img { width: 100%; height: 100%; object-fit: cover; transition: transform 300ms ease; }
.gallery-grid__item:hover img { transform: scale(1.05); }

/* Masonry gallery (CSS columns) */
.gallery-masonry { columns: 3 200px; column-gap: 8px; }
.gallery-masonry__item { break-inside: avoid; margin-bottom: 8px; border-radius: 4px; overflow: hidden; }
.gallery-masonry__item img { width: 100%; height: auto; display: block; }

/* Lightbox */
.lightbox { position: fixed; inset: 0; z-index: 1000; background-color: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; }
.lightbox__img { max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px; }
.lightbox__close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; line-height: 1; }
.lightbox__prev, .lightbox__next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 24px; padding: 12px 16px; cursor: pointer; border-radius: 4px; transition: background 200ms; }
.lightbox__prev { left: 16px; }
.lightbox__next { right: 16px; }
.lightbox__prev:hover, .lightbox__next:hover { background: rgba(255,255,255,0.3); }
```

## Carousels
- Use `scroll-snap` for native smooth behavior; show partial next item (~40px peek)
- Auto-play: NO for content carousels; OK for testimonials/backgrounds
- Swipe support is free with scroll-snap; `aria-roledescription="carousel"` per slide

```css
.carousel { position: relative; overflow: hidden; }
.carousel__track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  gap: 16px;
  padding: 0 16px;
  scrollbar-width: none;
}
.carousel__track::-webkit-scrollbar { display: none; }
.carousel__slide { flex: 0 0 calc(100% - 40px); scroll-snap-align: start; border-radius: 8px; overflow: hidden; }

/* Dots */
.carousel__dots { display: flex; justify-content: center; gap: 6px; margin-top: 12px; }
.carousel__dot { width: 8px; height: 8px; border-radius: 50%; background-color: #d1d5db; border: none; padding: 0; cursor: pointer; transition: background-color 200ms, width 200ms; }
.carousel__dot.is-active { background-color: #6366f1; width: 24px; border-radius: 4px; }

/* Arrows */
.carousel__arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; background: rgba(255,255,255,0.9); border: 1px solid #e5e7eb; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.12); transition: background 200ms; }
.carousel__arrow:hover { background: #fff; }
.carousel__arrow--prev { left: 8px; }
.carousel__arrow--next { right: 8px; }
```

## Video
- `aspect-ratio: 16/9` container; poster image before play; lazy load: show `<img>` poster, swap to `<video>` on click

```css
.video-container { position: relative; aspect-ratio: 16 / 9; width: 100%; overflow: hidden; border-radius: 8px; background-color: #000; }
.video-container video, .video-container iframe { width: 100%; height: 100%; object-fit: cover; display: block; }

.video-play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; background-color: rgba(0,0,0,0.25); transition: background-color 200ms; }
.video-play-overlay:hover { background-color: rgba(0,0,0,0.4); }
.video-play-btn { width: 64px; height: 64px; border-radius: 50%; background-color: rgba(255,255,255,0.9); display: flex; align-items: center; justify-content: center; transition: transform 200ms, background-color 200ms; }
.video-play-overlay:hover .video-play-btn { transform: scale(1.1); background-color: #fff; }
.video-play-btn::after { content: ''; display: block; width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-left: 20px solid #1f2937; margin-left: 4px; }
```

## Icons as Images
- SVG inline for scalable, colorable icons (`currentColor`); icon sprite for many icons
- Size to match text: 16px with 14px text, 20px with 16px text, 24px with 20px text
- Decorative: `aria-hidden="true"`; meaningful: `role="img"` + `aria-label`

```css
.icon { display: inline-block; flex-shrink: 0; vertical-align: middle; fill: currentColor; }
.icon--16 { width: 16px; height: 16px; }
.icon--20 { width: 20px; height: 20px; }
.icon--24 { width: 24px; height: 24px; }
```

## Background Images / Hero

```css
.hero { position: relative; width: 100%; aspect-ratio: 16 / 5; overflow: hidden; display: flex; align-items: flex-end; }
.hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; z-index: 0; }
.hero__overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.75) 100%); z-index: 1; }
.hero__content { position: relative; z-index: 2; padding: 24px 32px; color: #fff; }
```

## Image Optimization
- Format: AVIF > WebP > JPEG (photos); SVG > PNG (graphics)
- Max sizes: hero ~200KB, thumbnails 20-50KB, avatars 5-10KB
- Always set `width` + `height` to prevent CLS; use CDN with auto-format/resize (Cloudinary, imgix)

## Common Image Mistakes
- No `alt` text (or meaningless alt like "image")
- Missing `width`/`height` attributes causing layout shift
- Loading all images eagerly (lazy load below-fold)
- Using PNG for photos (use JPEG/WebP)
- Carousels that auto-play content users need to read
- Tiny avatars without fallback (broken image icon shown)
- Background images without sufficient text contrast overlay
