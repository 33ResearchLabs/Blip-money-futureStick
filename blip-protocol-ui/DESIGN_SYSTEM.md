# Blip Money Design System

**Overall Aesthetic**: Minimal white-on-black with Apple-inspired premium feel

## Core Principles

1. **Purposeful, Not Decorative** - Every visual element must reinforce the section's message
2. **Restraint** - Less is more; subtle over loud
3. **High Polish** - Premium execution with smooth 60fps animations
4. **Abstract > Literal** - Prefer abstract visualizations over literal product screenshots

---

## Color Palette

```css
/* Backgrounds */
--bg-primary: #000000;           /* Pure black */

/* Text */
--text-primary: #ffffff;         /* Pure white */
--text-secondary: rgba(255, 255, 255, 0.40);
--text-tertiary: rgba(255, 255, 255, 0.20-0.30);

/* Subtle Accents */
--accent-orange: #ff6b35;        /* Use VERY sparingly - only for micro-interactions */
--glow-subtle: rgba(255, 255, 255, 0.02-0.08);
--border-subtle: rgba(255, 255, 255, 0.05-0.10);

/* Background Elements */
--bg-card: rgba(255, 255, 255, 0.02-0.03);
--bg-hover: rgba(255, 255, 255, 0.05-0.08);
--screenshot-opacity: 0.03-0.08;  /* For background product images */
```

---

## Typography

- **Headings**: `font-bold`, tracking `-0.04em`, line-height `0.95-1.1`
- **Body**: `font-light`, white with 40-60% opacity
- **Labels**: `text-[10-11px]`, `uppercase`, tracking `0.2-0.3em`, white/30%
- **Sizes**: Use clamp for responsive scaling: `clamp(48px, 10vw, 120px)`

---

## Animation Guidelines

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);  /* Apple-like ease */
```

### Durations
- **Micro-interactions**: 200-400ms
- **Entrance animations**: 800ms-1.2s
- **Scroll-triggered**: 1-1.5s
- **Continuous loops**: 3-6s (very slow)
- **Hover transitions**: 300-500ms

### Movement Distances
- Small shifts: 10-20px
- Medium movements: 30-50px
- Large parallax: 80-150px

### Animation Patterns
- Fade in + subtle Y movement (y: 20-40)
- Stagger delays: 0.1-0.2s between items
- Respect `prefers-reduced-motion`

---

## Visual Elements

### 1. Abstract Visualizations
**When to use**: Background layers, reinforcing tech/speed/network concepts

**Examples**:
- Network nodes with connecting lines (canvas-based)
- Flowing horizontal lines with parallax
- Particle systems suggesting decentralization
- Subtle gradient blurs for depth

**Execution**:
```tsx
<NetworkVisualization nodeCount={50} speed={0.25} />
<GlobeVisualization />
```

**Opacity**: 0.02-0.06 for background elements

---

### 2. Micro-Icons
**When to use**: Visual accents next to stats, features, or list items

**Sizes**: 14-20px
**Variants**: pulse, spin, bounce, glow, static
**Execution**:
```tsx
<MicroIcon icon={Clock} variant="pulse" size={14} delay={0.2} />
```

---

### 3. Product Screenshots (Use Sparingly)
**When to use**: Only when reinforcing specific functionality

**Execution**:
- Very low opacity: 3-8%
- `mixBlendMode: "screen"`
- Position strategically (corners, subtle overlays)
- Never center stage - always background accent

**Interactive variant** (Hero section):
- Mouse-tracking reveal effect using `maskImage`
- Base opacity 8%, reveals to 90% around cursor
- Creates "flashlight" exploration effect

---

### 4. Cards & Containers

```css
background: rgba(255, 255, 255, 0.02);
border: 1px solid rgba(255, 255, 255, 0.05);
border-radius: 16-24px;
padding: 32-64px;
```

**Hover effects**:
- Glow from top: `bg-white opacity-[0.06] blur-[60px]`
- Text transitions: `text-white/30 → text-white/60`

---

### 5. Buttons

**Primary CTA**:
```tsx
<button className="
  px-8 py-3.5
  rounded-full
  bg-white text-black
  text-sm font-semibold
  hover:bg-white/90
">
  Get Started
</button>
```

**Secondary/Ghost**:
```tsx
<button className="
  px-6 py-2
  rounded-full
  border border-white/10
  text-white
  relative overflow-hidden
">
  {/* Hover fill: scale-x-0 → scale-x-100 */}
  <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
  <span className="relative z-10">Read Whitepaper</span>
</button>
```

---

## Interactive Patterns

### Mouse Reveal Effect (Hero)
```tsx
const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

// Track mouse percentage position
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };
  // ... attach listener
}, []);

// Apply reveal mask
<div style={{
  opacity: 0.08,
  maskImage: `radial-gradient(
    circle 600px at ${mousePosition.x}% ${mousePosition.y}%,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.08) 100%
  )`
}}>
  <img src="dashboard.png" style={{ mixBlendMode: "screen" }} />
</div>
```

### Pulse + Ripple (Feature Dots)
```tsx
<div className="relative">
  {/* Expanding ripple */}
  <motion.div
    className="absolute w-4 h-4 rounded-full bg-white/20"
    animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
  />
  {/* Pulsing center */}
  <motion.div
    className="w-2 h-2 rounded-full bg-white/60"
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
  />
</div>
```

### Parallax Scroll Effects
```tsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start end", "end start"]
});
const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

<motion.div style={{ y }}>
  {/* Content moves with scroll */}
</motion.div>
```

---

## Layout Patterns

### Section Structure
```tsx
<section className="relative py-20 md:py-40 bg-black overflow-hidden">
  {/* Background layer */}
  <div className="absolute inset-0">
    <AbstractVisualization />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-6">
    {/* Label */}
    <span className="text-[11px] uppercase tracking-[0.3em] text-white/30">
      The Protocol
    </span>

    {/* Heading */}
    <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-white">
      Blip Protocol
    </h2>

    {/* Body */}
    <p className="text-lg md:text-xl text-white/40 leading-relaxed">
      Description text
    </p>
  </div>
</section>
```

### Grid Layouts
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map((item, i) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
    >
      {/* Card content */}
    </motion.div>
  ))}
</div>
```

---

## Performance Standards

- **Lighthouse Score**: >90
- **Frame Rate**: 60fps for all animations
- **Bundle Size**: Keep visualizations lightweight (prefer SVG/Canvas over heavy libraries)
- **Lazy Loading**: Load complex visualizations only when visible

---

## Accessibility

- Use semantic HTML (`<section>`, `<main>`, `<article>`)
- Respect `prefers-reduced-motion` media query
- Maintain WCAG contrast ratios (white text on black = AAA)
- Provide `alt=""` for decorative images
- Ensure keyboard navigation works for interactive elements

---

## Key Dependencies

```json
{
  "framer-motion": "scroll animations, entrance effects, parallax",
  "lucide-react": "micro-icons",
  "react-router-dom": "navigation"
}
```

---

## Don'ts

❌ No loud colors (avoid bright greens, blues, purples)
❌ No busy patterns or textures
❌ No random stock imagery
❌ No emojis in production UI
❌ No heavy drop shadows
❌ No borders thicker than 1px
❌ No animations faster than 200ms
❌ No decorative elements without purpose

---

## Inspiration Sources

- **Apple.com** - Restraint, purposeful animation, premium feel
- **Linear.app** - Clean interface, subtle interactions
- **Stripe.com** - Technical visualizations, abstract backgrounds
- **trumprx.gov** - Minimal white-on-black aesthetic

---

**Summary**: This design system prioritizes clarity, performance, and purposeful design. Every element serves the message. Subtle beats loud. Quality over quantity.
