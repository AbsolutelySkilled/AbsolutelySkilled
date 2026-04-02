<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     choosing a UI style direction, or when the user asks what aesthetic to use. -->

# UI Style Catalog

25 production-ready UI styles with decision guidance. For each: what it looks like, key techniques, when to use it, and when to skip it.

## Quick-Pick Table

| Building...             | Start with                          | Alternative          |
|-------------------------|-------------------------------------|----------------------|
| SaaS / B2B              | Glassmorphism + Flat                | Minimalism           |
| E-commerce              | Vibrant & Block-based               | Motion-Driven        |
| E-commerce Luxury       | Liquid Glass                        | Glassmorphism        |
| Fintech / Crypto        | Dark Mode OLED + Glassmorphism      | Cyberpunk UI         |
| Healthcare              | Neumorphism + Accessible            | Soft UI              |
| Educational             | Claymorphism + Micro-interactions   | Vibrant & Block      |
| Creative Agency         | Brutalism + Motion-Driven           | Retro-Futurism       |
| Portfolio               | Motion-Driven + Minimalism          | Brutalism            |
| Gaming                  | 3D & Hyperrealism + Retro-Futurism  | Cyberpunk UI         |
| AI / Chatbot            | AI-Native UI + Minimalism           | Zero Interface       |
| Dashboard (Finance)     | Dark Mode OLED                      | Minimalism           |
| Dashboard (Analytics)   | Data-Dense + Minimalism             | Dark Mode OLED       |
| Social Media            | Vibrant & Block-based + Motion      | Aurora UI            |
| Productivity            | Flat Design + Micro-interactions    | Minimalism           |
| Restaurant / Food       | Vibrant & Block + Motion            | Claymorphism         |
| Travel / Tourism        | Aurora UI + Motion                  | Vibrant & Block      |
| Real Estate             | Glassmorphism + Minimalism          | Motion-Driven        |
| Music / Podcast         | Dark Mode OLED                      | Vibrant & Block      |
| Government / Legal      | Accessible & Ethical + Minimalism   | Trust & Authority    |
| Non-profit              | Accessible & Ethical + Organic Biophilic | Storytelling-Driven |
| Wellness / Spa          | Soft UI + Neumorphism               | Organic Biophilic    |

---

## 1. Minimalism

Clean, functional, maximum whitespace. Let the content breathe.

**Key effects:** Subtle shadows, minimal color (1-2 accents), generous padding (24-48px), system fonts or a single sans-serif family. High line-height (1.6-1.8).
**CSS signature:** `max-width: 720px; margin: 0 auto; padding: 2rem;`
**Best for:** Dashboards, documentation, enterprise apps, developer tools.
**Avoid when:** Marketing pages need visual punch or emotional impact.

## 2. Glassmorphism

Frosted glass panels with transparency and layered depth.

**Key effects:** `backdrop-filter: blur(16px)`, semi-transparent backgrounds `rgba(255,255,255,0.15)`, thin borders `rgba(255,255,255,0.1)`, stacked translucent layers.
**CSS signature:** `background: rgba(255,255,255,0.1); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.18);`
**Best for:** SaaS, real estate, modern dashboards, overlay panels.
**Avoid when:** Content-heavy text pages, accessibility-critical contexts (contrast issues), older browser targets.

## 3. Brutalism

Raw, intentional ugliness as aesthetic. Anti-design on purpose.

**Key effects:** Thick borders (2-4px solid black), harsh offset shadows, monospace fonts, high-contrast colors, zero border-radius, system-default cursor, visible grid lines.
**CSS signature:** `border: 3px solid #000; box-shadow: 6px 6px 0 #000; font-family: monospace;`
**Best for:** Creative agencies, portfolios, art galleries, experimental sites.
**Avoid when:** Healthcare, finance, government - anywhere trust and comfort matter.

## 4. Neumorphism

Soft embossed/debossed surfaces that feel tactile.

**Key effects:** Dual `box-shadow` (light from top-left, dark from bottom-right), soft background matching surrounding color, no harsh borders, inset shadows for pressed states.
**CSS signature:** `box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff; background: #e0e0e0;`
**Best for:** Healthcare, wellness, calculator UIs, simple control panels.
**Avoid when:** Dense data interfaces, accessibility audits (low contrast fails WCAG AA).

## 5. Claymorphism

3D clay-like elements with playful depth and soft color.

**Key effects:** Large border-radius (16-24px), colored inner shadows, soft pastel drop shadows, pastel palette, slight CSS rotation on cards for organic feel.
**CSS signature:** `border-radius: 20px; background: #f5e6ff; box-shadow: inset 0 -4px 6px rgba(0,0,0,0.08), 8px 8px 20px rgba(0,0,0,0.1);`
**Best for:** Educational platforms, kids apps, playful brands, onboarding flows.
**Avoid when:** Professional/enterprise contexts, fintech, legal.

## 6. Aurora UI

Gradient mesh backgrounds with flowing, shifting color.

**Key effects:** Layered `radial-gradient` blobs, animated color shifts via `@keyframes`, blur overlays, glass panels floating over aurora backgrounds.
**CSS signature:** `background: radial-gradient(ellipse at 20% 50%, #7f5af0, transparent 50%), radial-gradient(ellipse at 80% 50%, #2cb67d, transparent 50%);`
**Best for:** Travel, creative landing pages, modern SaaS marketing, event pages.
**Avoid when:** Data-dense interfaces, text-heavy documentation.

## 7. Dark Mode OLED

True dark with vibrant accents. Energy-efficient on OLED screens.

**Key effects:** `#000000` or near-black (`#0a0a0a`) backgrounds, high-contrast white/light text, neon accent colors, subtle colored glows on interactive elements.
**CSS signature:** `background: #000; color: #e0e0e0; --accent: #00f0ff;`
**Best for:** Music, video, fintech, dashboards, developer tools, crypto platforms.
**Avoid when:** Bright/friendly consumer apps, brands targeting older demographics.

## 8. Retro-Futurism

80s sci-fi meets modern UI. Neon grids and synthwave palettes.

**Key effects:** Neon glow via `text-shadow` and `box-shadow` with color, scanline overlays (repeating-linear-gradient), perspective grid backgrounds, monospace/display fonts, CRT curvature via `border-radius`.
**CSS signature:** `text-shadow: 0 0 10px #ff00ff, 0 0 40px #ff00ff; background: linear-gradient(transparent 50%, rgba(0,0,0,0.05) 50%);`
**Best for:** Gaming, creative projects, tech art, music events.
**Avoid when:** Corporate, healthcare, government, accessibility-first.

## 9. Liquid Glass

Ultra-premium transparency with multi-layer refraction effects.

**Key effects:** Multi-layer `backdrop-filter` (blur + saturate + brightness), gradient borders via `border-image` or pseudo-elements, color-shifting backgrounds, depth through transparency stacking.
**CSS signature:** `backdrop-filter: blur(20px) saturate(180%); background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));`
**Best for:** Luxury brands, premium products, high-end real estate, automotive.
**Avoid when:** Performance-constrained devices, accessibility-critical, content-first pages.

## 10. Flat Design

No shadows, no gradients, pure color and shape.

**Key effects:** Solid fills, clear typography hierarchy, icon-driven communication, bold primary colors, zero elevation, sharp edges or consistent small radius.
**CSS signature:** `box-shadow: none; border-radius: 4px; background: #2563eb; color: #fff;`
**Best for:** Productivity tools, design systems, documentation, internal tools.
**Avoid when:** Depth and visual hierarchy are critical, premium/luxury branding.

## 11. Vibrant & Block-based

Bold color blocks with clear section boundaries and strong contrast.

**Key effects:** Full-width colored sections, alternating block backgrounds, large typography (48-72px headlines), animated section transitions, strong color contrast between adjacent blocks.
**CSS signature:** `background: #ff6b35; padding: 4rem 2rem; color: #fff; font-size: 3rem;`
**Best for:** E-commerce, social media, restaurants, marketing pages, event sites.
**Avoid when:** Enterprise/clinical UIs, data-heavy dashboards.

## 12. Motion-Driven

Animation as the core UX feature, not decoration.

**Key effects:** Scroll-triggered reveals (`IntersectionObserver`), parallax layers, staggered entrance animations, page transitions, hover micro-animations, kinetic typography.
**CSS signature:** `@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`
**Best for:** Portfolios, creative agencies, landing pages, product launches.
**Avoid when:** Data-heavy apps, accessibility-first (respect `prefers-reduced-motion`).

## 13. Soft UI Evolution

Refined neumorphism with better contrast and usability.

**Key effects:** Subtle inner/outer shadows, muted backgrounds (not pure white/gray), gentle gradients, floating elements with light elevation, improved contrast ratios over classic neumorphism.
**CSS signature:** `box-shadow: 4px 4px 10px #d0d0d0, -4px -4px 10px #ffffff; border: 1px solid rgba(0,0,0,0.06);`
**Best for:** Productivity apps, remote work tools, wellness, settings panels.
**Avoid when:** Bold/expressive needs, high-density data interfaces.

## 14. 3D & Hyperrealism

Three-dimensional rendered elements creating immersive depth.

**Key effects:** CSS 3D transforms with `perspective`, realistic multi-layer shadows, depth via `translateZ`, Three.js or Spline integration for hero sections, parallax on mouse move.
**CSS signature:** `perspective: 1000px; transform: rotateY(5deg) rotateX(2deg); transform-style: preserve-3d;`
**Best for:** Gaming, product showcases, immersive experiences, automotive.
**Avoid when:** Content-first pages, mobile performance constraints, screen readers.

## 15. Organic Biophilic

Nature-inspired shapes, colors, and textures.

**Key effects:** Blob shapes via complex `border-radius` (e.g., `30% 70% 70% 30% / 30% 30% 70% 70%`), earth tones (greens, browns, warm beige), leaf/plant SVG patterns, flowing curves, natural texture overlays.
**CSS signature:** `border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; background: #2d5016;`
**Best for:** Wellness, non-profit, agriculture, eco brands, organic food.
**Avoid when:** Tech/corporate, fintech, anything requiring sharp precision.

## 16. Swiss Modernism 2.0

Strict grid, rational typography, mathematical precision.

**Key effects:** Rigid grid alignment (12-column with consistent gutter), Helvetica/Grotesk/Inter fonts, limited color (2-3 max), strong horizontal rules, uppercase labels with wide letter-spacing, generous negative space.
**CSS signature:** `font-family: 'Helvetica Neue', sans-serif; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #000;`
**Best for:** Design systems, documentation, typography-forward sites, editorial.
**Avoid when:** Playful/casual brands, children's products, consumer apps.

## 17. Cyberpunk UI

Neon-drenched dark interfaces with HUD aesthetics.

**Key effects:** Neon borders with glow, glitch effects via `clip-path` animation, terminal/monospace fonts, HUD-style overlays with corner brackets, matrix/rain backgrounds, `text-shadow` neon glow.
**CSS signature:** `border: 1px solid #0ff; box-shadow: 0 0 10px #0ff, inset 0 0 10px rgba(0,255,255,0.1); color: #0ff;`
**Best for:** Crypto/web3, gaming, tech art, hackathon projects.
**Avoid when:** Mainstream consumer products, healthcare, government, accessibility.

## 18. AI-Native UI

Conversational, minimal chrome, context-aware surfaces.

**Key effects:** Streaming text animations (`@keyframes typing`), typing indicators, floating response cards, minimal/hidden navigation, contextual UI that appears on demand, progressive disclosure.
**CSS signature:** `max-width: 640px; margin: 0 auto; animation: fadeIn 0.3s ease;` with response bubbles.
**Best for:** Chatbots, AI tools, search interfaces, command palettes.
**Avoid when:** Complex multi-page apps, dense dashboards, e-commerce.

## 19. Kinetic Typography

Text as the primary visual element, animated and expressive.

**Key effects:** Large display text (80-120px+), CSS animations on individual characters (`span` wrapping), scroll-driven text transformations, variable font `font-weight` animation, text masking with video/images.
**CSS signature:** `font-size: clamp(3rem, 10vw, 8rem); font-variation-settings: 'wght' var(--scroll-weight);`
**Best for:** Portfolios, agencies, artistic landing pages, brand statements.
**Avoid when:** Content reading, documentation, data interfaces.

## 20. Bento Box Grid

Unequal grid cells arranged like a bento box - mixed sizes for visual interest.

**Key effects:** CSS Grid with `span 2` cells, mixed card sizes, feature highlights in large cells, compact info in small cells, consistent gap spacing, rounded corners on all cells.
**CSS signature:** `display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;` with children using `grid-column: span 2;`
**Best for:** Feature showcases, dashboards, portfolio grids, app homepages (Apple-style).
**Avoid when:** Uniform content lists, text-heavy pages, sequential reading.

## 21. Zero Interface

Invisible UI - content fills the viewport, controls hide until needed.

**Key effects:** Minimal visible controls, gesture-based interaction, content fills viewport, controls appear on hover/tap/scroll, `opacity` transitions, full-bleed media.
**CSS signature:** `nav { opacity: 0; transition: opacity 0.3s; } nav:hover, nav:focus-within { opacity: 1; }`
**Best for:** Reading apps, media consumption, meditation, galleries, kiosk displays.
**Avoid when:** Complex workflows, first-time users, accessibility requirements.

## 22. Accessible & Ethical

WCAG AAA as a design principle, not an afterthought.

**Key effects:** High contrast (7:1+ ratio), large touch targets (48px minimum), clear focus indicators (3px outline offset), simple layouts, no motion by default (`prefers-reduced-motion: reduce`), semantic HTML structure.
**CSS signature:** `*:focus-visible { outline: 3px solid #005fcc; outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`
**Best for:** Government, healthcare, education, public services. Layer other styles on top.
**Avoid when:** Never avoid this - it is a foundation, not a style choice.

## 23. Storytelling-Driven

Narrative scroll experience with cinematic pacing.

**Key effects:** Full-page sections, `scroll-snap-type: y mandatory`, progressive content reveal on scroll, parallax imagery, cinematic transitions between chapters, large hero images with text overlay.
**CSS signature:** `scroll-snap-type: y mandatory; section { height: 100vh; scroll-snap-align: start; }`
**Best for:** Non-profit campaigns, brand stories, case studies, annual reports, portfolios.
**Avoid when:** Utility-focused apps, dashboards, frequently-revisited pages.

## 24. Trust & Authority

Institutional credibility through conservative, professional design.

**Key effects:** Navy/slate/charcoal palette, serif headlines (Georgia, Playfair Display), testimonial blocks, trust badges and certifications, conservative grid layout, professional photography, ample white space.
**CSS signature:** `font-family: 'Playfair Display', serif; color: #1a2744; border-left: 4px solid #1a2744;`
**Best for:** Legal, insurance, banking, B2B enterprise, consulting firms.
**Avoid when:** Creative/youth brands, startups wanting to look disruptive.

## 25. Parallax Storytelling

Depth through scroll-speed differences creating layered visual narrative.

**Key effects:** `background-attachment: fixed` or JS-driven scroll speed multipliers, layered elements moving at different rates, scroll-triggered animations, full-bleed imagery between content sections.
**CSS signature:** `background-attachment: fixed; background-size: cover;` or `transform: translateY(calc(var(--scroll) * 0.5));`
**Best for:** Brand pages, product launches, immersive landing pages, travel sites.
**Avoid when:** Mobile (performance hit from `background-attachment: fixed`), accessibility-first, content that needs to be scannable.

---

## Combining Styles

Most production UIs blend 2-3 styles. Rules for combining:

1. **Pick a base** - Choose the structural style (Minimalism, Flat, Swiss Modernism, Bento Box)
2. **Add a surface treatment** - Layer a visual style on top (Glassmorphism, Neumorphism, Dark Mode)
3. **Season with interaction** - Add motion, micro-interactions, or scroll effects sparingly
4. **Always include Accessible & Ethical** as a foundation layer regardless of other choices

Common safe combos: Minimalism + Glassmorphism, Dark Mode + Bento Box, Flat + Motion-Driven, Swiss Modernism + Trust & Authority, Aurora UI + Glassmorphism.

Risky combos to avoid: Brutalism + Trust & Authority, Cyberpunk + Healthcare, Neumorphism + Data-Dense, 3D + Mobile-first, Zero Interface + First-time Users.
