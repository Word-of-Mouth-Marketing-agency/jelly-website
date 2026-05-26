---
name: Jelly
description: Egyptian socks brand — socks that make you smile
colors:
  jelly-yellow: "#FBE902"
  jelly-yellow-deep: "#F8E600"
  sticker-gold: "#67600F"
  brand-blue: "#0066EE"
  brand-cyan: "#00FFFF"
  on-surface: "#1E1C10"
  surface: "#FFFFFF"
  surface-container: "#F4F4F4"
  surface-container-high: "#EEE8D5"
  outline: "#7C785F"
  outline-variant: "#CCC7AB"
  on-surface-variant: "#4A4732"
  footer-black: "#000000"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "56px"
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
  headline-md:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
  body-lg:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label-lg:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
    letterSpacing: "0.05em"
  label-sm:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  base: "8px"
  gutter: "24px"
  margin-mobile: "20px"
  margin-desktop: "64px"
  section-gap: "80px"
components:
  button-primary:
    backgroundColor: "{colors.jelly-yellow}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.jelly-yellow-deep}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  product-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "16px"
  price-badge:
    backgroundColor: "{colors.brand-cyan}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  category-chip-active:
    backgroundColor: "{colors.jelly-yellow}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
  category-chip-inactive:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
---

# Design System: Jelly

## 1. Overview

**Creative North Star: "The Sunny Morning Walk"**

Jelly is for people who dress with intention — who choose socks the way they choose their mood. The visual system should feel like putting on a favourite pair: light, optimistic, and unhurried. Not frenetic. Not a bazaar. A morning walk where you notice the colour of everything and smile at the small things.

This means the interface earns its warmth through restraint as much as colour. Yellow is present, but it does not shout from every corner. The sticker-border aesthetic — a hand-pressed, slightly rough gold border on every card and button — gives the whole surface a physical, tactile quality, as if each product was personally curated and stuck to the page. It is the system's most distinctive signature.

The design actively rejects three failure modes: the generic Shopify template (zero personality, any product, any country), corporate minimalism (cold, joyless, Apple-adjacent seriousness), and pattern overload (every surface decorated until the products are invisible). Instead: confident colour used one section at a time, products as the stars, breathing room between big moments.

**Key Characteristics:**
- Single typeface (Plus Jakarta Sans) across all roles, varied entirely through scale and weight
- Sticker-border: 2px solid #67600F on every product card and primary button — the physical signature
- Bold, rounded shapes (cards: 16px radius, buttons: full pill) — never sharp, never corporate
- Three-colour trio (yellow, blue, cyan) used deliberately per section, never competing on the same surface
- Flat surfaces by default; shadow only as an interaction response
- Full bilingual equality: Arabic (RTL) and English (LTR) with equal design weight

## 2. Colors: The Sunny Trio

Each of the three brand colours earns its place by section, not by hierarchy. No single colour is "the accent." All three are confident; none competes with the products.

### Primary
- **Jelly Yellow** (#FBE902): The signature brand surface. Used on primary CTAs, product card Add-to-Cart buttons, and the scrolling marquee banner. If one screen has only one brand colour, it is this.
- **Sticker Gold** (#67600F): The border colour used exclusively as the sticker-border pattern — 2px solid on every product card and primary button. Not a text colour. Not a background. A border colour only. Gives yellow and white surfaces a hand-pressed, hand-crafted edge.
- **Yellow Deep** (#F8E600): A slightly darker hover state for yellow buttons. Appears only on `:hover` and `:active` transitions. Never used at rest.

### Secondary
- **Brand Blue** (#0066EE): Reserved for surfaces that need authority — the announcement bar, the blue crossing-marquee band, strong structural backgrounds. Never used decoratively. Its saturation is earned by rarity.
- **Brand Cyan** (#00FFFF): The price badge colour. Appears exclusively as the background of price chips inside product cards. It reads as a highlight — a small, electric surprise. Its rarity is the point.

### Neutral
- **On-surface** (#1E1C10): Primary text colour. A warm almost-black with a yellow undertone. Never pure `#000000` for text.
- **On-surface-variant** (#4A4732): Secondary text, nav links at rest, meta copy, helper text.
- **Surface** (#FFFFFF): Main page background. Pure white.
- **Surface-container** (#F4F4F4): Card image container backgrounds, search input backgrounds.
- **Surface-container-high** (#EEE8D5): Category page header bands, section backgrounds that need gentle separation from white.
- **Outline** (#7C785F): Input borders, dividers, subtle structural lines.
- **Outline-variant** (#CCC7AB): Inactive chip borders, very light separators.
- **Footer Black** (#000000): Footer background only. The only pure-black surface on the site.

**The Trio Rule.** Yellow, blue, and cyan never appear on the same surface simultaneously. Each section uses the colour that serves it. The header marquee is blue. The product marquee is yellow. Price badges are cyan. Section by section — never competing.

**The Sticker-Border Rule.** The brown-gold sticker border (2px solid #67600F) applies to every product card and every primary button, without exception. It is the single most distinctive mark of the Jelly system. Never reduce it to 1px, never change its colour, never apply it to secondary or ghost elements.

**The Cyan Exception.** Cyan (#00FFFF) appears only as a price badge background. Never as a button background, section background, or decorative element. One job.

## 3. Typography

**Primary Font:** Plus Jakarta Sans (Google Fonts, system-ui and sans-serif as fallbacks)

Jelly uses one typeface across every role. Hierarchy is created entirely through size and weight variation, not font switching. The display headline at 800/48px and the price label at 700/12px are the same family — the jump between them is a confident leap, not a collision.

**Character:** A wide-range variable-weight humanist sans used from whisper (12px/700) to shout (48px/800). The range makes every step feel deliberate. Nothing in the middle is neutral.

### Hierarchy
- **Display** (weight 800, 48px, -0.02em tracking, 56px line-height): Hero headlines only. The page's loudest voice. Used in the hero section and major section introductions.
- **Headline Large** (weight 700, 32px, 40px line-height): Section headings — New Arrivals, Men's Collection, Best Sellers. One per major section.
- **Headline Medium** (weight 700, 24px, 32px line-height): Category page titles, product names on detail pages, admin section headings.
- **Body Large** (weight 400, 18px, 28px line-height): Hero supporting copy, featured card descriptions. Max 65ch line length.
- **Body** (weight 400, 16px, 24px line-height): General body text, footer copy, form descriptions. Max 70ch line length.
- **Label Large** (weight 600, 14px, 0.05em tracking, 20px line-height): Buttons, navigation links, form labels, category filter chips. The interactive layer's voice.
- **Label Small** (weight 700, 12px, 16px line-height): Price badges, product tags, small pill labels. Always on a coloured background (cyan or surface-container-high).

**The Single Voice Rule.** Plus Jakarta Sans only. No secondary typeface for headings, no monospace for code, no serif for "premium" product copy. Hierarchy lives in scale and weight. If you are reaching for a second typeface, the scale is not working hard enough.

## 4. Elevation

Jelly is flat by default. Surfaces are clean and non-layered at rest. The sticker-border provides all the structural definition needed without shadow. Elevation enters only as a live response to interaction or scroll state.

### Shadow Vocabulary
- **None (at rest):** Product cards, buttons, section containers. No resting shadow on any bordered element.
- **Hover lift** (`box-shadow: 0 4px 16px rgba(0,0,0,0.10)`): Product cards on `:hover`. A gentle ambient lift. Duration: 200ms ease-out.
- **Sticky shadow** (`box-shadow: 0 4px 20px rgba(0,0,0,0.10)`): The header once the page scrolls past 20px. Signals that the header floats above the content.

**The Sticker-Flat Rule.** The sticker border does the definition work at rest. Never add a resting shadow to elements that already carry a sticker border. Shadows are for motion response only.

## 5. Components

### Buttons

High contrast, rounded, tactile. Every primary button carries the sticker-border — it should feel like pressing a physical label.

- **Shape:** Fully rounded pill (border-radius: 9999px)
- **Primary:** Jelly Yellow background (#FBE902), warm-black text (#1E1C10), 2px solid #67600F sticker border, 16px/32px padding, Label Large (14px/600/0.05em)
- **Hover:** Scale to 1.05, background shifts to Yellow Deep (#F8E600). `transition: all 150ms ease-out`
- **Active:** Scale to 0.95. Snaps back. Physical button press feel.
- **Disabled:** opacity 0.5, cursor not-allowed. No hover state. Sticker border remains.
- **Ghost (Secondary):** White background (#FFFFFF), same sticker border, same pill shape, on-surface text (#1E1C10). Used alongside a primary button for secondary CTAs (hero: "Shop Now" + "Explore Collection").

### Chips (Category Filters)

Used in category pages and search to filter by category or attribute.

- **Active:** Jelly Yellow background (#FBE902), on-surface text (#1E1C10), 2px border in primary (#686000). Pill shape. Label Large.
- **Inactive:** White background (#FFFFFF), on-surface-variant text (#4A4732), 2px border in outline-variant (#CCC7AB). Hover: border shifts to primary.
- **Transition:** border-color 150ms ease-out.

### Cards (Product Cards)

The signature surface. Every product card shares the same anatomy.

- **Shape:** Gently rounded (16px radius, `rounded-2xl`)
- **Background:** White (#FFFFFF)
- **Border:** Sticker-border (2px solid #67600F) — mandatory on all product cards, no exceptions
- **Padding:** 16px all sides
- **Image container:** 1:1 aspect ratio, surface-container background (#F4F4F4), 12px radius, overflow hidden. Image scales to 105% on card hover (`transition-transform duration-300`).
- **Product name:** Headline Medium or Label Large, truncated to one line, hover: shifts to primary colour
- **Price badge:** Cyan background (#00FFFF), warm-black text (#1E1C10), pill shape (9999px), bold Label Small. Positioned below the product name.
- **Add to Cart button:** Full-width primary button flush to the card bottom.
- **Wishlist heart:** Absolute-positioned top-right of the image container. 36–40px tap target, white background circle with sticker border, overlaid on the image.
- **Hover state:** `box-shadow: 0 4px 16px rgba(0,0,0,0.10)`, `transition: all 200ms`. No layout shift.
- **Out-of-stock overlay:** White/70 overlay across the image with "Out of stock" pill label.

### Inputs / Fields

- **Search (header):** Pill shape (9999px radius), surface-container background (#F4F4F4), 2px border in outline (#7C785F), padding 8px/24px, Label Large. Width: 192px at md, 256px at lg. Focus: ring-2 in primary (#686000). No box shadow.
- **Newsletter (footer):** White background, on-surface text, pill shape, 2px border in brand-blue (#0066EE). Paired with a brand-blue pill button.
- **Form fields (checkout, profile, auth):** 8px radius, 1px border outline-variant at rest. Focus: 2px ring in primary-container (#FBE902). Error: border-error (#BA1A1A), role="alert" message below field. Disabled: opacity 0.5.

### Navigation (Header)

- **Outer shell:** White background, sticky top-0, z-50. At rest: 1px border-bottom in on-surface (#1E1C10). On scroll (>20px): shadow-lg appears, border-bottom removed.
- **Announcement bar:** Brand Blue (#0066EE) full-width band above the nav. White text, Label Large. Always visible. Single-purpose: promotional message.
- **Nav links:** Label Large (14px/600/0.05em). On-surface-variant at rest (#4A4732). Hover: primary (#686000). `transition: color 200ms`.
- **Active nav link:** 4px bottom border in primary (#686000). Exact route match only.
- **Action icons (search, account, heart, bag):** Lucide icons, 20–24px, strokeWidth 2.25. On-surface-variant at rest. Hover: scale-105, `transition: transform 200ms`.
- **Cart badge:** 16px circle, Jelly Yellow background (#FBE902), on-primary-container text (#706800). Absolute position: -top-1 -right-1. Font: 10px bold.

### Footer

The only black (#000000) surface on the site. White text with opacity reductions for hierarchy.

- Full-width black background, 80px vertical padding, 64px horizontal margin (20px on mobile).
- 4-column grid at md, single column on mobile. 24px gutter.
- Logo: white version (140px wide desktop, 110px mobile).
- Column headings: full-opacity white, bold. Links: 80% opacity, hover transitions to Yellow Fixed (#F8E600).
- Bottom bar: 1px white/20 border-top, copyright at 60% opacity, legal links at 60% opacity.
- Social icons: 24px, inline SVG (no icon font dependency), hover: primary-fixed (#F8E600).

### Marquee Banner (Signature Component)

The yellow scrolling banner is the most kinetic element on the page. It separates content sections as a momentum marker.

- Full-width Jelly Yellow (#FBE902) band. 1px solid black border top and bottom.
- 16px vertical padding at desktop, 12px on mobile.
- Text: `clamp(20px, 3vw, 44px)` desktop, `clamp(18px, 5.5vw, 30px)` mobile. Weight 400. Colour #000000.
- Scroll icons: `clamp(34px, 4.5vw, 76px)`. Colour #000000.
- Animation: 24s linear infinite reverse. `will-change: transform`.
- **Crossing Marquee variant:** Two overlapping bands rotated ±3deg. Yellow band: standard. Blue band (#0066EE): white text, same font-size scale.

## 6. Do's and Don'ts

### Do:
- **Do** apply the sticker-border (2px solid #67600F) to every product card and every primary button. It is the system's physical handshake — remove it and the brand disappears.
- **Do** use Plus Jakarta Sans exclusively across every text role. Hierarchy lives in scale and weight only.
- **Do** give the interface breathing room between bold colour moments. Yellow section, then white section. The rhythm of the morning walk.
- **Do** make primary buttons scale to 1.05 on hover and snap to 0.95 on active. The sticker-press feel is intentional and load-bearing for the brand personality.
- **Do** use brand-cyan (#00FFFF) for price badges inside product cards — and only there. One job, maximum impact.
- **Do** maintain equal Arabic and English quality: same layout care, same weight of text, same component fidelity in both directions.
- **Do** use the footer's black (#000000) only for the footer. Everywhere else uses white or surface tokens.
- **Do** target WCAG AA contrast for all text. On-surface (#1E1C10) on white passes comfortably; verify brand-blue and yellow combinations explicitly.

### Don't:
- **Don't** build a generic product layout that could belong to any Shopify store. If a competitor could copy the layout and swap the logo, it has failed. Every screen should be unmistakably Jelly.
- **Don't** use cold whitespace as a design choice. Corporate minimalism — Apple-style, Muji-style, joyless emptiness — is the opposite of Jelly's warmth. Whitespace breathes; it does not chill.
- **Don't** cover surfaces in patterns or textures. Loud pattern overload makes the socks invisible. The products are the decoration.
- **Don't** strip the sticker border off buttons or cards to "clean them up." The border is not decoration. It is the brand's tactile signature.
- **Don't** use cyan (#00FFFF) for anything except price badges. Not buttons, not section backgrounds, not decorative highlights. Its power comes from appearing once per card.
- **Don't** apply resting shadows to cards or buttons. The sticker border handles definition at rest. Shadows exist only as interaction feedback.
- **Don't** introduce a second typeface. Not a serif for "premium" product copy, not a monospace for code, not a display font for campaign moments. The single-voice doctrine is load-bearing.
- **Don't** use `#000000` for body text or `#FFFFFF` for body text on dark surfaces. Use on-surface (#1E1C10) and on-surface-variant (#4A4732) — the warm-undertone versions throughout.
- **Don't** place yellow, blue, and cyan on the same surface at the same time. They are trio members on a stage, never a crowd.
