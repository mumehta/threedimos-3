---
name: Three Dimos
description: Interactive web studio — design, code, and motion under one roof.
colors:
  primary-violet: "#7c5cff"
  secondary-cyan: "#22d3ee"
  tertiary-magenta: "#ff4d9d"
  void-black: "#07070c"
  void-surface: "#0b0b13"
  chalk-white: "#f3f2f8"
  light-ground: "#f3f2f0"
  deep-ink: "#0c0c14"
  live-green: "#37e39b"
typography:
  display:
    fontFamily: '"Schibsted Grotesk", system-ui, sans-serif'
    fontSize: "clamp(3.5rem, 11.5vw, 10.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: '"Schibsted Grotesk", system-ui, sans-serif'
    fontSize: "clamp(2.125rem, 5.2vw, 4rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"Schibsted Grotesk", system-ui, sans-serif'
    fontSize: "clamp(1.4375rem, 2.4vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  body:
    fontFamily: '"Hanken Grotesk", system-ui, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: '"Space Mono", ui-monospace, monospace'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  pill: "999px"
  card: "16px"
  btn: "11px"
  nav-link: "9px"
  icon: "12px"
spacing:
  gutter: "clamp(20px, 5vw, 64px)"
  section: "clamp(72px, 11vw, 160px)"
  card-pad: "clamp(26px, 3vw, 40px)"
  gap-sm: "14px"
  gap-xs: "10px"
components:
  button-primary:
    backgroundColor: "{colors.primary-violet}"
    textColor: "{colors.void-black}"
    rounded: "{rounded.btn}"
    padding: "0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.secondary-cyan}"
    textColor: "{colors.void-black}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-white}"
    rounded: "{rounded.btn}"
    padding: "0 26px"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.void-surface}"
    textColor: "{colors.chalk-white}"
  tag:
    backgroundColor: "{colors.void-black}"
    textColor: "{colors.chalk-white}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
---

# Design System: Three Dimos

## 1. Overview

**Creative North Star: "The Live Performance"**

Three Dimos is a web studio whose landing page is also its portfolio, its pitch deck, and its product demo. The design system reflects that double function: every surface must earn its existence by demonstrating what the studio sells — design that is intentional, code that is precise, motion that is alive. The system is dark-first, cinematic, and built around three accent beams (violet, cyan, magenta) that project from a near-black void. Contrast is structural, not decorative. Density is controlled; every section breathes on its own terms.

Typography is the primary performer. Schibsted Grotesk pushes the display weight to 800 at sizes that dwarf a typical heading — the hero title runs to 10.5rem, a deliberate choice that makes the page shout its own tagline. The monospace label font (Space Mono) appears only at small scales as a counter-voice: sparse, technical, anchoring. Body copy (Hanken Grotesk) sits back and lets the headings lead. The three-font stack is a cast of three, not a font system applied uniformly.

Motion is structural. The WebGL background (reef or orb), the scroll-reveal stagger, the kinetic marquee variant — each is an argument, not flair. The `--motion` variable governs all animation intensity including the Three.js scene, so the experience degrades gracefully to zero without content loss. Nothing is gated behind a class-triggered transition; elements start visible and transitions enhance.

**This system explicitly rejects** the "generic Awwwards fodder" lane: over-animated dark-mode agencies whose technical impressiveness works on other designers but alienates the small business owners who are the actual clients. Impressive to designers, trustworthy to founders — that is the standard.

**Key Characteristics:**
- Dark void backgrounds with tonal surface lift (no heavy shadows)
- Three-color gradient accent that appears as brand signature, not decoration
- Ultra-compressed display headings (line-height 0.9) at extreme scales
- Monospace labels as counter-voice — sparse, minimal, never dominant
- Fluid motion intensity via `--motion` variable; reduced motion is a zero cost, not a workaround
- Glass panels (backdrop-filter blur) used structurally in nav and availability badge — never as card decoration

## 2. Colors: The Void and the Signal

The palette is theatrical. A near-black void background with three precise accent beams cut through it. The accents hit like spotlights; the neutrals recede like darkness between them.

### Primary
- **Primary Violet** (`#7c5cff`): The dominant accent. Used for the brand gradient's opening stop, button primary backgrounds, glow shadows, the `::selection` highlight, and the first gradient text in the hero. The hue carries the brand's technical-creative identity. oklch equivalent: `oklch(53% 0.26 272)`.

### Secondary
- **Signal Cyan** (`#22d3ee`): The gradient's midpoint, the brightest of the three. Used for the logo's top face, hover glow shadows on primary buttons, the `--a2` position in all gradient expressions. Its high luminosity means it carries the gradient's perceived brightness peak. oklch equivalent: `oklch(80% 0.15 197)`.

### Tertiary
- **Charged Magenta** (`#ff4d9d`): The gradient's close. Warmer, pinker, more energetic than the other two. Used for the cube logo's right face and as the gradient's terminal stop. Provides warmth against the cold of cyan and violet. oklch equivalent: `oklch(61% 0.23 355)`.

### Neutral
- **Void Black** (`#07070c`): The base background. Near-black with a faint violet tinge that keeps it from being pure neutral — it reads as inhabited, not empty.
- **Void Surface** (`#0b0b13`): Cards, alternate section backgrounds, `--bg-2`. Provides tonal separation with a 4-point lightness step from Void Black.
- **Chalk White** (`#f3f2f8`): The primary text color. Near-white with the same faint cool-violet tint as the backgrounds — it feels like it belongs in the same world rather than being pasted on top.
- **Dim Text** (`rgba(243,242,248, 0.64)`): Secondary body text and supporting copy. Not a separate color — opacity of Chalk White.
- **Faint Text** (`rgba(243,242,248, 0.40)`): Tertiary labels, meta text, placeholder content.
- **Light Ground** (`#f3f2f0`): The light-theme body background — a faint warm neutral, not cream.
- **Deep Ink** (`#0c0c14`): The light-theme foreground — near-black with slight cool tint.
- **Live Green** (`#37e39b`): Reserved exclusively for the live-booking pulse indicator. Never used elsewhere; its rarity makes it read as a real status signal.

**The Three-Beam Rule.** The brand gradient (`linear-gradient(110deg, #7c5cff, #22d3ee 52%, #ff4d9d)`) is the brand's single most recognizable mark. It appears on the logotype, hero title lines, the primary button, section taglines, and the footer brand word. It is not decoration; it is the Three Dimos visual identity. Permitted contexts: logo, hero title selective lines, button backgrounds, short tagline text in service cards, the footer wordmark. Prohibited: body paragraphs, card backgrounds, nav items, section backgrounds, or any surface where it becomes wallpaper.

**The One Status Color Rule.** Live Green (`#37e39b`) is used exclusively as a status signal (booking availability). Never repurpose it as a general accent or decorative element. Its scarcity is its meaning.

## 3. Typography: The Three Performers

**Display Font:** Schibsted Grotesk (with system-ui, sans-serif fallback)
**Body Font:** Hanken Grotesk (with system-ui, sans-serif fallback)
**Label/Mono Font:** Space Mono (with ui-monospace, monospace fallback)

**Character:** Schibsted at 800 weight is blunt, muscular, and takes up space deliberately — it demands the heading be important enough to justify the size. Hanken is warmer and more readable at small sizes, providing the humanist counterweight that keeps body copy from feeling cold. Space Mono provides technical authority in labels without overusing the "developer aesthetic" crutch; it appears only at 12px maximum.

### Hierarchy
- **Display** (800 weight, `clamp(3.5rem, 11.5vw, 10.5rem)`, line-height 0.9, letter-spacing -0.045em): Hero title only. Three lines: "Design." "Code." "Motion." The extreme size and tight line-height create a stacked block that reads as a logo-level statement.
- **Headline** (700 weight, `clamp(2.125rem, 5.2vw, 4rem)`, line-height 0.98, letter-spacing -0.03em): Section headings and the CTA card heading. The scale ratio from Display to Headline is ≥1.6 — intentionally large to maintain hierarchy.
- **Title** (700 weight, `clamp(1.4375rem, 2.4vw, 1.875rem)`, line-height 0.98, letter-spacing -0.03em): Card headings, pillar headings. Same display font and tracking as Headline; scale is the differentiator.
- **Body** (400 weight, 17px, line-height 1.55): All prose. Hanken Grotesk's humanist forms stay legible at this size. Dim opacity (`rgba(243,242,248, 0.64)`) used for supporting body text.
- **Label** (400 weight, 12px, letter-spacing 0.14em, uppercase): Section eyebrows, card numbers, meta text, pill tags. Space Mono exclusively. Maximum 12px; never used for body copy.

### Named Rules
**The Compression Rule.** Display and Headline headings run at `line-height: 0.98` or tighter — below body leading. This is structural: tight heads create mass, body text breathes, the contrast in density creates vertical rhythm. Never relax display headings to `line-height: 1.2`; that softens the page's intention.

**The Mono Ceiling Rule.** Space Mono is capped at 12px and used only for labels, metadata, eyebrows, and pill tags. Never use it for body copy, card descriptions, or anything longer than 6 words. The contrast between the mono's technical voice and Hanken's warmth is the point; diluting it dilutes the system.

## 4. Elevation: Tonal and Glowing

This system does not use traditional box shadows for depth. Elevation is expressed through three mechanisms: **tonal surface lift**, **radial gradient spotlights**, and **accent glow halos** on interactive states.

**Tonal surface lift**: Sections alternate between `#07070c` (base) and `#0b0b13` (surface), a 4-point lightness step that provides section separation without any border or shadow. Cards sit on this surface using a `linear-gradient(180deg, rgba(255,255,255,0.035), transparent)` face — they appear to emerge from the surface rather than float above it.

**Radial gradient spotlights**: The hero, CTA card, and hero variants use large `radial-gradient` expressions to direct attention. These are not shadows; they are light coming from a specific direction. The CTA card uses `radial-gradient(120% 140% at 50% -20%, ...)` to place a violet wash above the heading. This is structural — it answers "where should I look?"

**Accent glow halos**: Interactive states (button hover, card hover) create glow effects using `box-shadow: 0 Npx Npx -Npx color-mix(in oklab, accent 70%, transparent)`. At rest, buttons have a subtle violet glow; on hover, the glow shifts to cyan and travels further from the element. This communicates state through light, not through stroke or underline.

### Shadow Vocabulary
- **Button Rest Glow** (`0 8px 30px -8px color-mix(in oklab, #7c5cff 70%, transparent)`): Ambient, always-visible halo under primary buttons. Establishes the button as a primary action before any interaction.
- **Button Hover Glow** (`0 18px 50px -10px color-mix(in oklab, #22d3ee 75%, transparent)`): Expanded cyan glow on hover. The shift from violet to cyan signals activation without any text change.
- **CTA Card Ambient** (radial gradient `color-mix(in oklab, #22d3ee 22%, transparent)`): A diffuse, blurred radial applied to the bottom of the CTA card via `filter: blur(30px)`. Creates a floor-level glow that makes the card feel like it's placed on a lit surface.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Glows appear only in response to interaction (hover, active) or as structural light sources (hero spotlight, CTA ambient). Never apply a box-shadow to a card or container as a "depth" affordance; use tonal surface lift instead.

## 5. Components

### Buttons

The character is fluid and magnetic — buttons feel like they're pulled toward the cursor, not switched between states. The transform + glow combination is the signature.

- **Shape:** Gently curved (11px radius), 52px height, 26px horizontal padding. The radius is `calc(16px × 0.7)` — derived from the card radius, not arbitrary.
- **Primary:** Brand gradient background, near-black text (`#07070c`). The gradient runs at 160% width, enabling the animated `background-position` shift on hover. Violet rest glow transitions to cyan hover glow.
- **Hover / Focus:** `translateY(-2px)` lift + glow transition to cyan. Hover triggers a slow `gradShift` keyframe animation cycling the gradient's background-position. Focus-visible: 2px `#7c5cff` outline, 3px offset.
- **Ghost:** `rgba(255,255,255,0.035)` background, `rgba(255,255,255,0.16)` border, `backdrop-filter: blur(8px)`. Transparent but present — it occupies the same visual weight as a card surface. Hover: background lifts to `rgba(255,255,255,0.06)`, border lightens.
- **Active state:** `translateY(1px) scale(0.99)` on both variants — physically satisfying press feedback.

### Tags / Chips

- **Style:** Space Mono, 11.5px, `letter-spacing: 0.04em`, `rgba(243,242,248,0.64)` text. `rgba(255,255,255,0.035)` background, `rgba(255,255,255,0.10)` border. Pill radius (999px), 5px/11px padding. Used in service cards for technology labels.
- **Character:** Purely informational — no hover state. They are labels, not actions. Adding interactivity to tags where none exists breaks the visual hierarchy.

### Cards / Containers

- **Service Cards:** `linear-gradient(180deg, rgba(255,255,255,0.035), transparent)` face on a `#07070c` background. `rgba(255,255,255,0.10)` border. Card border lightens to `rgba(255,255,255,0.16)` on hover; card lifts `translateY(-4px)`. A radial gradient cursor tracker (mouse position → `--mx` custom property) creates a spotlight on the card face under the cursor on hover — the most distinctive micro-interaction in the system.
- **Work Cards:** Similar structure but square-cornered thumbnail aspect ratio (16/10). The hover state rotates the link-arrow indicator 45 degrees and fills it with the brand gradient. Cards track hover with a `sheen` overlay — a diffuse cyan radial at the top-left of the thumbnail.
- **Corner Style:** 16px radius on all cards and containers. Never less than 9px; never more than 22px on body components. The hero radius slider goes to 28px but this is a design-variant tool, not a production target.
- **Internal Padding:** `clamp(26px, 3vw, 40px)` — fluid, never below 26px on mobile.

### Navigation

- **Style:** Fixed, full-width, transparent at top. Scrolled state: `color-mix(in oklab, #07070c 72%, transparent)` background with `backdrop-filter: blur(18px) saturate(140%)` and a bottom border `rgba(255,255,255,0.10)`. The transition from transparent to frosted glass is the nav's most important state change.
- **Links:** 14.5px Hanken Grotesk, 500 weight, `rgba(243,242,248,0.64)` at rest. Hover: full chalk white + `rgba(255,255,255,0.035)` background, 9px radius. No underline; no border. Background-tint is the hover signal.
- **CTA in nav:** Same primary button but compressed to 40px height, 18px padding, 14px text. The size reduction places it visually inside the nav without commanding the same weight as the hero CTA.
- **Mobile:** Nav links collapse at 880px — only the logo and primary CTA remain. No burger menu in the current build.

### Eyebrow Label (Signature Component)

The eyebrow is a branded system element, not a generic section kicker. Structure: Space Mono, 12px, uppercase, 0.22em letter-spacing, `rgba(243,242,248,0.40)` color, with a 22px × 1px horizontal rule rendered via `::before` — the rule is filled with the brand gradient. The visual effect is: brand-gradient dash → label text.

The eyebrow is used selectively: on sections where the label provides genuine context that the heading alone doesn't carry. It should never appear on every section as generic scaffolding. When a section heading is self-explanatory ("Three disciplines. One studio."), the eyebrow adds nothing — omit it.

### Isometric Cube Logo (Signature Component)

Three colored polygon faces rendered as SVG: top face (Signal Cyan), left face (Primary Violet), right face (Charged Magenta). The three faces are the Three Dimensions brand mark made literal. On hover, the three faces separate — each translates outward along its own axis (`translateY(-3px)` for top, `translate(-2.5px, 1.4px)` for left, `translate(2.5px, 1.4px)` for right). At rest: a `cubeBob` keyframe rotates the whole group gently. The entire logo is mouse-tracked: cursor position applies a subtle 3D tilt.

Never rebuild the logo with different geometry. The isometric cube is the brand mark — it is not a decorative icon.

## 6. Do's and Don'ts

### Do:
- **Do** let the brand gradient (`linear-gradient(110deg, #7c5cff, #22d3ee 52%, #ff4d9d)`) carry the brand's visual identity — on the logo, hero title, CTA buttons, and short service taglines. These are the permitted contexts; they are how the brand is recognized.
- **Do** use tonal surface lift (alternating `#07070c` / `#0b0b13`) for section separation. Borders and shadows are not needed when the surface itself shifts.
- **Do** run display headings at `line-height: 0.9`–`0.98` and `letter-spacing: -0.03em` to -0.045em. The compression is the brand's typographic voice; relaxing it makes the page feel like a template.
- **Do** use Space Mono exclusively for labels, eyebrows, and meta at ≤12px. Its contrast with Hanken body text is intentional; dilute it and the voice disappears.
- **Do** use `backdrop-filter: blur(8px–18px)` on the navigation and floating status elements only. These are structural uses — the nav needs separation, the status badge needs float. Glass on content cards is not permitted.
- **Do** express button hover via the violet-to-cyan glow shift combined with `translateY(-2px)`. This is the system's signature interaction pattern.
- **Do** wire up the `--motion` variable (`0` to `1.4`) to control animation intensity. Every timed animation should scale its duration or disable entirely at `--motion: 0`. The `prefers-reduced-motion` media query should enforce this independently.
- **Do** keep body text at full `--fg` (`#f3f2f8`) for primary copy; use `--fg-dim` (`rgba(243,242,248,0.64)`) only for supporting and secondary text. Contrast must meet 4.5:1 against the background.
- **Do** give cards the cursor-tracking radial spotlight (`--mx` custom property + `radial-gradient` pseudo-element) for hover depth. It is the most distinctive micro-interaction in the system.

### Don't:
- **Don't** build like generic Awwwards fodder — over-animated dark-mode studios whose technical impressiveness impresses other designers but alienates small business owners. Three Dimos is building trust with founders, not with design-award judges.
- **Don't** apply the brand gradient to body paragraphs, card backgrounds, section backgrounds, or nav items. When the gradient becomes wallpaper, it loses its signal value. The Three-Beam Rule is the boundary.
- **Don't** use `backdrop-filter` glass on content cards or section containers. Glassmorphism as a decorative default is prohibited; it is permitted only on the nav and floating status elements where it carries structural meaning (separation, float).
- **Don't** use Live Green (`#37e39b`) for anything other than the booking availability status indicator. Its scarcity is its meaning.
- **Don't** add eyebrow labels above every section heading. An eyebrow on a self-explanatory section heading is AI grammar, not voice. Omit the eyebrow when the heading stands alone.
- **Don't** relax the compressed heading metrics (`line-height: 0.98` or tighter for headings, `letter-spacing: -0.03em` or tighter). The density is the system's typographic identity.
- **Don't** use Space Mono at sizes above 12px or for text longer than 6 words. It is a label voice, not a body voice.
- **Don't** use any shadow that reads as a standard box-shadow on a card at rest. Cards are flat; depth comes from tonal surface lift and the radial face gradient. Shadows appear only in the glow vocabulary (buttons, CTA ambient).
- **Don't** add numbered `01 / 02 / 03` labels above general section headings as structural scaffolding. They are permitted only where a sequence genuinely matters (the four Process steps, the three Pillars' internal `n / 03` counter) — not as a template for every new section.
- **Don't** introduce a fourth font family. The three-font stack (Schibsted Grotesk, Hanken Grotesk, Space Mono) is a cast — adding a fourth breaks the character balance.
