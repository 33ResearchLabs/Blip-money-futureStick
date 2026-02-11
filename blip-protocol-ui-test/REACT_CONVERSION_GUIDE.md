# React Conversion Guide

## Overview

The vanilla JavaScript `<script>` block has been successfully converted into proper React components with hooks and refs. All functionality remains the same, but now follows React best practices.

## What Was Created

### 1. **Hero3D Component** (`src/components/Hero3D.tsx`)
A fully React-ified Three.js component that creates the 3D phone mockup with particles.

**Features:**
- Uses `useRef` for Three.js scene, camera, renderer, and objects
- Uses `useEffect` for initialization and cleanup
- Proper event listener management
- Automatic cleanup on unmount (prevents memory leaks)
- Mouse parallax effect on 3D phone
- Animated particle system

**Usage:**
```tsx
import Hero3D from "@/components/Hero3D";

// Use it anywhere in your JSX
<div className="w-full h-[600px]">
  <Hero3D />
</div>
```

### 2. **ScrollReveal Component** (`src/components/ScrollReveal.tsx`)
A reusable component for scroll-triggered animations using Intersection Observer.

**Features:**
- Uses `useRef` to track DOM elements
- Uses `useEffect` for Intersection Observer setup and cleanup
- Supports custom delay timing
- Adds `.scroll-fade-in` and `.is-visible` classes automatically

**Usage:**
```tsx
import ScrollReveal from "@/components/ScrollReveal";

// Wrap any content you want to reveal on scroll
<ScrollReveal delay={0.2} className="my-4">
  <h2>This will fade in when scrolled into view</h2>
  <p>With a 200ms delay</p>
</ScrollReveal>

<ScrollReveal delay={0.5}>
  <div className="card">Another element with 500ms delay</div>
</ScrollReveal>
```

### 3. **useScrollActive Hook** (`src/hooks/useScrollActive.ts`)
A custom hook that adds/removes the `scroll-active` class on the body based on scroll position.

**Features:**
- Uses `useEffect` for scroll listener setup and cleanup
- Automatically removes the class on cleanup
- Configurable hero section ID

**Usage:**
```tsx
import useScrollActive from "@/hooks/useScrollActive";

const MyComponent = () => {
  // Add this line in your main component
  useScrollActive("hero"); // "hero" is the ID of your hero section

  return (
    <div>
      <section id="hero">...</section>
      {/* Rest of your content */}
    </div>
  );
};
```

## Updated Files

### Index.tsx
The main Index component now:
1. Imports the new React components and hooks
2. Uses the `useScrollActive` hook instead of vanilla event listeners
3. Removed the entire `<script>` block

**Added imports:**
```tsx
import useScrollActive from "@/hooks/useScrollActive";
import ScrollReveal from "@/components/ScrollReveal";
```

**In the Index component:**
```tsx
const Index = () => {
  // Initialize scroll active hook
  useScrollActive("hero");

  // ... rest of your component
};
```

## How to Use the ScrollReveal Component

You can now wrap any section or element that needs scroll animation:

### Example 1: Basic Usage
```tsx
<ScrollReveal>
  <div className="feature-card">
    <h3>Feature Title</h3>
    <p>Feature description</p>
  </div>
</ScrollReveal>
```

### Example 2: With Delay
```tsx
<ScrollReveal delay={0.3}>
  <div>This appears 300ms after entering viewport</div>
</ScrollReveal>
```

### Example 3: Multiple Elements with Staggered Delays
```tsx
<div className="features-grid">
  <ScrollReveal delay={0}>
    <FeatureCard title="Fast" />
  </ScrollReveal>

  <ScrollReveal delay={0.2}>
    <FeatureCard title="Secure" />
  </ScrollReveal>

  <ScrollReveal delay={0.4}>
    <FeatureCard title="Reliable" />
  </ScrollReveal>
</div>
```

## How to Use the Hero3D Component

The Three.js 3D phone mockup is now a standalone component:

### Basic Usage
```tsx
import Hero3D from "@/components/Hero3D";

const MyPage = () => (
  <div className="hero-section">
    <div className="hero-3d-container" style={{ width: '100%', height: '600px' }}>
      <Hero3D />
    </div>
  </div>
);
```

### Important Notes:
- The container must have defined dimensions (width and height)
- The component will automatically resize on window resize
- All Three.js resources are properly cleaned up on unmount
- Mouse parallax effect is built-in

## CSS Classes

The following CSS classes are already defined in `index.css`:

- `.scroll-fade-in` - Initial hidden state for scroll animations
- `.is-visible` - Applied when element enters viewport
- `.scroll-active` - Applied to body when scrolled past hero section

## Benefits of This Conversion

1. **React Best Practices**
   - No direct DOM manipulation
   - Proper lifecycle management with useEffect
   - Proper ref usage for Three.js objects

2. **Memory Management**
   - Automatic cleanup of event listeners
   - Three.js resource disposal on unmount
   - No memory leaks

3. **Reusability**
   - Components can be used anywhere
   - Easy to configure with props
   - Type-safe with TypeScript

4. **Maintainability**
   - Separated concerns
   - Clear component boundaries
   - Easier to test and debug

## TypeScript Support

All components are fully typed with TypeScript:
- Hero3D: Uses Three.js types
- ScrollReveal: Has typed props interface
- useScrollActive: Accepts optional heroSectionId parameter

## Next Steps

You can now:
1. Use `<ScrollReveal>` to wrap any content that needs scroll animations
2. Import and use `<Hero3D />` anywhere you need the 3D phone visualization
3. The scroll active hook is already integrated in your Index component

## Example: Adding ScrollReveal to Existing Sections

If you want to add scroll reveal animations to your existing sections, simply wrap them:

```tsx
// Before
<section className="features">
  <div className="feature">Feature 1</div>
  <div className="feature">Feature 2</div>
</section>

// After
<section className="features">
  <ScrollReveal delay={0}>
    <div className="feature">Feature 1</div>
  </ScrollReveal>

  <ScrollReveal delay={0.2}>
    <div className="feature">Feature 2</div>
  </ScrollReveal>
</section>
```

## Troubleshooting

### Three.js not rendering?
- Make sure the container has defined width/height
- Check that `three` is installed: `npm install three @types/three`

### Scroll animations not working?
- Verify the CSS classes are in `index.css`
- Check that elements have `.scroll-fade-in` applied
- Ensure Intersection Observer is supported (all modern browsers)

### Scroll active class not applying?
- Confirm your hero section has `id="hero"`
- Or pass the correct ID to `useScrollActive("your-hero-id")`
