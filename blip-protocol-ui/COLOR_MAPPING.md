# Color Theme Mapping for CryptoToUae Component

## Replace these Tailwind classes:

### Background Colors
- `bg-zinc-900` → `bg-[var(--bg-secondary)]` or `bg-[#0A0A0A]`
- `bg-zinc-800` → `bg-[var(--bg-tertiary)]` or `bg-[#111111]`
- `bg-[#050505]` → `bg-[var(--bg-secondary)]`
- `bg-[#030303]` → `bg-black`
- `bg-orange-600` → `bg-white`
- `bg-orange-500` → `bg-[var(--accent-secondary)]`

### Text Colors
- `text-zinc-100` → `text-white`
- `text-zinc-200` → `text-white`
- `text-zinc-300` → `text-[var(--text-primary)]` or `text-white`
- `text-zinc-400` → `text-[var(--text-secondary)]` or `text-[#A0A0A0]`
- `text-zinc-500` → `text-[var(--text-secondary)]` or `text-[#A0A0A0]`
- `text-zinc-600` → `text-[var(--text-tertiary)]` or `text-[#666666]`
- `text-zinc-700` → `text-[var(--text-muted)]` or `text-[#444444]`
- `text-orange-500` → `text-white`
- `text-orange-600` → `text-white`

### Border Colors
- `border-zinc-800` → `border-[var(--border-subtle)]` or `border-white/5`
- `border-zinc-900` → `border-[var(--border-subtle)]`
- `border-orange-500` → `border-white`
- `border-white/5` → `border-[var(--border-subtle)]`
- `border-white/10` → `border-[var(--border-default)]`

### Glass Panels
Replace `.glass-panel` with:
```jsx
className="card-glass" // from global CSS
// or
className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl"
```

### Button Styles
- `bg-white text-black` → `btn-primary` (from global CSS)
- `bg-orange-600` → `btn-primary`
- `border border-zinc-800` → `btn-secondary`

### Accent Colors
- Orange accents (#FF6B35) are acceptable as they match the theme
- But prefer white for primary actions
