# Subtle Effects Library

A collection of minimal, classy animation effects inspired by top Web3 and AI startups.

## 🎨 Design Philosophy

- **Subtle & Minimal**: Effects enhance, not distract
- **Performance-first**: GPU-accelerated with smooth 60fps animations
- **Accessibility**: All effects are tasteful and don't interfere with usability

## 📦 Available Effects

### 1. **TextShimmer**
*Inspired by: Modern AI brand websites*

A subtle shimmer effect that passes over text periodically.

```tsx
import { TextShimmer } from "@/components/effects/SubtleEffects";

<TextShimmer className="text-2xl">
  Amazing Feature
</TextShimmer>
```

**Use cases**: Hero headlines, feature callouts, premium badges

---

### 2. **MagneticHover**
*Inspired by: Cursor AI, Linear*

Creates a magnetic effect where elements subtly follow the cursor.

```tsx
import { MagneticHover } from "@/components/effects/SubtleEffects";

<MagneticHover strength={0.3}>
  <button>Click me</button>
</MagneticHover>
```

**Props**:
- `strength` (default: 0.3): How much the element follows cursor (0-1)

**Use cases**: CTA buttons, interactive cards, navigation items

---

### 3. **HoverTooltip**
*Inspired by: Perplexity AI*

Displays helpful context on hover with smooth animations.

```tsx
import { HoverTooltip } from "@/components/effects/SubtleEffects";

<HoverTooltip content="This explains the feature" delay={0.3}>
  <span>Hover me</span>
</HoverTooltip>
```

**Props**:
- `content`: Tooltip text
- `delay` (default: 0.3): Delay before showing (seconds)

**Use cases**: Feature explanations, card previews, help hints

---

### 4. **GradientText**
*Inspired by: Modern AI brand designs*

Creates smooth gradient text with optional animation.

```tsx
import { GradientText } from "@/components/effects/SubtleEffects";

<GradientText animated>
  Beautiful Gradient
</GradientText>
```

**Props**:
- `animated` (default: false): Animates gradient shift

**Use cases**: Hero headlines, key phrases, brand text

---

### 5. **GlowCard**
*Inspired by: Hedera, Web3 platforms*

Adds a subtle glow effect on hover.

```tsx
import { GlowCard } from "@/components/effects/SubtleEffects";

<GlowCard glowColor="rgba(0, 255, 148, 0.15)" hoverScale={1.02}>
  <div>Card content</div>
</GlowCard>
```

**Props**:
- `glowColor`: RGBA color for glow effect
- `hoverScale` (default: 1.02): Scale on hover

**Use cases**: Feature cards, pricing cards, showcase items

---

### 6. **MicroBounce**
*Inspired by: Hedera easter eggs*

Subtle bounce effect on hover and tap.

```tsx
import { MicroBounce } from "@/components/effects/SubtleEffects";

<MicroBounce>
  <button>Bouncy Button</button>
</MicroBounce>
```

**Use cases**: Buttons, interactive icons, clickable cards

---

### 7. **KineticText**
*Inspired by: Variable typography trend 2026*

Text that changes weight and spacing on hover.

```tsx
import { KineticText } from "@/components/effects/SubtleEffects";

<KineticText>
  Interactive Text
</KineticText>
```

**Use cases**: Headlines, navigation items, interactive labels

---

### 8. **ProgressiveReveal**
*Inspired by: Perplexity's step-by-step UI*

Content reveals with blur and fade effect.

```tsx
import { ProgressiveReveal } from "@/components/effects/SubtleEffects";

<ProgressiveReveal delay={0.2}>
  <div>Content appears smoothly</div>
</ProgressiveReveal>
```

**Props**:
- `delay` (default: 0): Stagger delay for multiple reveals

**Use cases**: Loading states, step indicators, sequential content

---

### 9. **CursorFollower**
*Inspired by: Linear, Cursor AI*

Subtle spotlight effect that follows cursor movement.

```tsx
import { CursorFollower } from "@/components/effects/SubtleEffects";

<CursorFollower>
  <div className="card">Interactive area</div>
</CursorFollower>
```

**Use cases**: Interactive sections, feature showcases, product demos

---

### 10. **ScrollRevealBlur**
*Inspired by: Modern scroll animations*

Content reveals with blur as user scrolls.

```tsx
import { ScrollRevealBlur } from "@/components/effects/SubtleEffects";

<ScrollRevealBlur threshold={0.1}>
  <div>Scroll to reveal</div>
</ScrollRevealBlur>
```

**Props**:
- `threshold` (default: 0.1): How much scroll before reveal

**Use cases**: Feature sections, testimonials, content blocks

---

### 11. **BorderGlow**
*Inspired by: Web3 card designs*

Animated glowing border effect on hover.

```tsx
import { BorderGlow } from "@/components/effects/SubtleEffects";

<BorderGlow glowColor="#00FF94">
  <div className="p-6">Premium content</div>
</BorderGlow>
```

**Props**:
- `glowColor`: Hex color for glow

**Use cases**: Premium cards, featured content, special offers

---

## 🎯 Real-World Examples

### Example 1: Enhanced CTA Button

```tsx
import { MicroBounce, MagneticHover } from "@/components/effects/SubtleEffects";

<MagneticHover strength={0.2}>
  <MicroBounce>
    <button className="px-6 py-3 bg-black text-white rounded-full">
      Get Started
    </button>
  </MicroBounce>
</MagneticHover>
```

### Example 2: Feature Card with Tooltip

```tsx
import { GlowCard, HoverTooltip } from "@/components/effects/SubtleEffects";

<HoverTooltip content="Lightning-fast transactions">
  <GlowCard glowColor="rgba(59,130,246,0.15)">
    <div className="p-6">
      <h3>Instant Settlements</h3>
      <p>Under 10 seconds</p>
    </div>
  </GlowCard>
</HoverTooltip>
```

### Example 3: Hero Headline

```tsx
import { GradientText, KineticText } from "@/components/effects/SubtleEffects";

<h1 className="text-6xl">
  <KineticText>The future of</KineticText>{" "}
  <GradientText animated>payments</GradientText>
</h1>
```

---

## 🎨 Applied Effects in DashboardShowcaseSection

The following effects have been applied to `DashboardShowcaseSection.tsx`:

1. **HoverTooltip**: All floating cards now show helpful context on hover
2. **CursorFollower**: Cards have subtle spotlight effect following cursor
3. **Enhanced Glow**: Card glows intensify smoothly on hover
4. **GradientText**: "anywhere" in headline has animated gradient
5. **KineticText**: Main headline text responds to hover
6. **MicroBounce**: CTA button has subtle bounce effect
7. **Improved Shadows**: Cards cast more dramatic shadows on hover

---

## 💡 Best Practices

1. **Don't Overuse**: Apply 1-2 effects per element maximum
2. **Consider Context**: Match effect intensity to brand personality
3. **Test Performance**: Monitor FPS on lower-end devices
4. **Accessibility**: Ensure effects don't interfere with screen readers
5. **Subtle is Better**: Users should feel delight, not distraction

---

## 🚀 Performance Tips

- All effects use `transform` and `opacity` for GPU acceleration
- `willChange` hints added where beneficial
- Animations use optimized easing functions
- No layout thrashing or reflows

---

## 📊 Inspiration Sources

Effects inspired by research on top 20 Web3 & AI startups:

- **Perplexity AI**: Hover snippets, progressive reveals
- **Hedera**: Subtle easter eggs, micro-interactions
- **Runway AI**: Real-time interaction feedback
- **Cursor AI**: Magnetic effects, smooth transitions
- **Linear**: Minimal, refined animations
- **Cosmos**: Typography excellence
- **Modern AI brands**: Gradient text, kinetic type

---

## 🔮 Future Enhancements

Potential additions for v2:

- [ ] Sound effects integration
- [ ] Haptic feedback for mobile
- [ ] Particle effects system
- [ ] Advanced cursor trails
- [ ] Morphing shapes
- [ ] Scroll-triggered parallax
