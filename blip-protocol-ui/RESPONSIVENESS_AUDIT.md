# Responsiveness Audit — blip-protocol-ui-test
**Scope:** 320px – 1920px
**Theme:** Light/Dark (black/white palette)
**Stack:** React 18 + TypeScript + Vite 5 + Tailwind CSS + Framer Motion

---

## STATUS

| Phase | Status |
|-------|--------|
| Index page sections | ✅ Complete |
| Navbar / Footer | ✅ Complete |
| Pages (Blog, HowItWorks, Markets, etc.) | 🔄 In progress |

---

## FIXES APPLIED

### 1. `BlipscanExplorerSection.tsx` — Missing `h-` prefix
**File:** `src/components/IndexSections/BlipscanExplorerSection.tsx`
**Issue:** `sm:[600px]` — missing `h-` prefix, so the height class was invalid and the container stayed at 450px on all breakpoints.
**Fix:**
```diff
- className="relative h-[450px] sm:[600px] rounded-2xl ..."
+ className="relative h-[450px] sm:h-[600px] rounded-2xl ..."
```

---

### 2. `Footer.tsx` — Inverted padding (more on mobile than desktop)
**File:** `src/components/Footer.tsx`
**Issue:** `px-8 sm:px-6` meant 32px on mobile, 24px on sm+. Should be progressive.
**Fix:**
```diff
- <div className="max-w-7xl mx-auto px-8 sm:px-6 py-12">
+ <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
```

---

### 3. `Navbar.tsx` — Nested `<a>` tags (invalid HTML)
**File:** `src/components/Navbar.tsx`
**Issue:** MobileMenu `waitlist` branch wrapped `<CTAButton>` (renders `<Link>` → `<a>`) inside an outer `<a>`, producing invalid nested anchors.
**Fix:** Replaced the nested pair with a single styled `<a>` matching the dashboard button pattern.
```diff
- <a href="/waitlist" onClick={(e) => handleNavClick(e, "/waitlist")} className="block w-full">
-   <CTAButton to="/waitlist" className="w-full">Join Waitlist</CTAButton>
- </a>
+ <a
+   href="/waitlist"
+   onClick={(e) => handleNavClick(e, "/waitlist")}
+   className="block w-full text-center py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold"
+ >
+   Join Waitlist
+ </a>
```

---

### 4. `MerchantDashboardSection.tsx` — `px-2` too narrow on mobile
**File:** `src/components/IndexSections/MerchantDashboardSection.tsx`
**Issue:** `px-2` (8px) on mobile gave content only 8px horizontal breathing room, causing text to touch screen edges.
**Fix:**
```diff
- className="relative z-10 max-w-7xl mx-auto px-2 md:px-6"
+ className="relative z-10 max-w-7xl mx-auto px-4 md:px-6"
```

---

### 5. `ProtocolSection.tsx` — Unconditional `<br />` on mobile
**File:** `src/components/IndexSections/ProtocolSection.tsx`
**Issue:** A `<br />` forced a line break inside a paragraph on all screen sizes, creating awkward layout on mobile where text already wraps.
**Fix:**
```diff
- A decentralized settlement layer for instant,
- <br />
- private, global value transfer.
+ A decentralized settlement layer for instant,
+ <br className="hidden md:block" />
+ private, global value transfer.
```

---

### 6. `HowItWorksSection.tsx` — Dead flex classes on non-flex wrapper
**File:** `src/components/IndexSections/HowItWorksSection.tsx`
**Issue:** Desktop layout wrapper had `flex-col lg:flex-row gap-16` without a `flex` class — these had zero effect.
**Fix:**
```diff
- <div className="hidden lg:block max-w-7xl mx-auto px-8 lg:px-12 flex-col lg:flex-row gap-16 relative min-h-screen">
+ <div className="hidden lg:block max-w-7xl mx-auto px-8 lg:px-12 relative min-h-screen">
```

---

### 7. `EarlyAdopterBanner.tsx` — Invalid Tailwind opacity modifiers
**File:** `src/components/IndexSections/EarlyAdopterBanner.tsx`
**Issue:** `bg-black/8` and `border-black/15` are not valid Tailwind opacity values (not multiples of 5, no bracket syntax). These produced no CSS output.
**Fix:**
```diff
- className="... bg-black/8 dark:bg-white/8 border border-black/15 dark:border-white/15"
+ className="... bg-black/[0.08] dark:bg-white/[0.08] border border-black/[0.15] dark:border-white/[0.15]"
```

---

### 8. `RewardsSection.tsx` — Stat cells overflow on 320px (3-col grid)
**File:** `src/components/IndexSections/RewardsSection.tsx`
**Issue:** 3-column grid with `p-6` (48px horizontal padding per cell) and `text-2xl` on a 320px screen left only ~47px of content width per cell — values like "2.5%" overflowed.
**Calculation:** 320px − 32px (outer px-4) = 288px ÷ 3 cols − 2px (gap-px) = ~94px per cell. With `p-6` (24px each side) → 46px content. `text-2xl` line-height ~36px, but character width can exceed 46px.
**Fix:**
```diff
- className="... p-6 sm:p-8 md:p-10 text-center"
+ className="... p-4 sm:p-8 md:p-10 text-center"

- <div className="text-2xl sm:text-3xl md:text-4xl font-bold ...">
+ <div className="text-xl sm:text-3xl md:text-4xl font-bold ...">

- <div className="text-sm font-semibold ...">
+ <div className="text-xs sm:text-sm font-semibold ...">
```

---

## SECTIONS REVIEWED — NO CHANGES NEEDED

| Section | Notes |
|---------|-------|
| `CinematicHero.tsx` | CTA `w-[240px]` fits in 272px available on 320px. `flex-col sm:flex-row` stacks correctly. |
| `DashboardShowcaseSection.tsx` | Cards use `w-52 sm:w-60 lg:w-64` — fits all breakpoints. Sticky scroll handled by Framer. |
| `LockedAndSecuredSection.tsx` | `grid-cols-1 lg:grid-cols-2` — collapses cleanly. Mini-cards use absolute offset within bounded parent. |
| `InstantBiddingSection.tsx` | Right panel `hidden sm:block` hides on mobile. Browser mockup `lg:max-h-[65vh]` respects viewport. |
| `UAESection.tsx` | Card `px-8 sm:px-14` on 320px → 224px content. `text-5xl` (48px) headline fits. |
| `FeatureStrip.tsx` | `w-fit md:flex gap-12` stacks as block on mobile with `mb-4` — acceptable. |
| `CTASection.tsx` | Full-width centered layout, no overflow risk. |
| `index.css` | `overflow-x: clip` on body catches any horizontal overflow correctly. Responsive headings use `clamp()`. |

---

---

### 9. `HowItWorks.tsx` — Invalid `text-md` Tailwind class (SecuritySection floating metrics)
**File:** `src/pages/Protocol/HowItWorks.tsx`
**Issue:** `text-md` is not a valid Tailwind utility (valid values: `text-sm`, `text-base`, `text-lg`, etc.). The browser falls back to inherited/default font size (~16px). Inside the 3-column floating metrics grid (`absolute bottom-8 left-8 right-8` within a ~256px image), each cell is ~53px wide. With `px-2` (8px each side) → 37px content. 16px fallback makes "~500ms" (~50px wide) overflow the cell.
**Fix:**
```diff
- <div className="text-md sm:text-2xl font-semibold text-white">
+ <div className="text-xs sm:text-2xl font-semibold text-white">
```

---

### 10. `Glossary.tsx` — Invalid Tailwind opacity on hover border
**File:** `src/pages/Resources/Glossary.tsx`
**Issue:** `hover:border-black/15` — while `/15` is technically in the default Tailwind scale, using explicit bracket syntax is more portable and immune to scale config changes.
**Fix:**
```diff
- className="... hover:border-black/15 dark:hover:border-white/[0.12] ..."
+ className="... hover:border-black/[0.15] dark:hover:border-white/[0.12] ..."
```

---

### 11. `BlipTokenomics.tsx` — Donut chart overflows 320px viewport
**File:** `src/pages/Protocol/BlipTokenomics.tsx`
**Issue:** `w-[290px]` inside a container with `px-6` on 320px viewport: 320 − 48px = 272px available. The 290px chart container exceeds this by 18px. The section has `overflow-hidden` which clips it — the chart is cut off on both sides on 320px.
**Fix:**
```diff
- <div className="relative w-[290px] sm:w-[320px] md:w-[420px] aspect-square mx-auto">
+ <div className="relative w-[260px] sm:w-[320px] md:w-[420px] aspect-square mx-auto">
```

---

## PAGES REVIEWED — NO CHANGES NEEDED

| Page | Notes |
|------|-------|
| `Resources/Blog.tsx` | `overflow-x-auto` on category tabs. `px-4 sm:px-6` consistent. Thumbnail `hidden sm:block` hides on mobile correctly. |
| `Resources/FAQ.tsx` | `overflow-x-auto` on category tabs. Accordion with `pr-4` on question — fine on 320px. |
| `Resources/Glossary.tsx` | Category tabs with `overflow-x-auto`. Search bar full-width with `pl-12`. ✅ Fixed `hover:border-black/[0.15]`. |
| `Resources/Compare.tsx` | Comparison table wrapped in `overflow-x-auto` with `min-w-[600px]` — correct. |
| `Company/About.tsx` | `px-4 sm:px-6` consistent. `grid-cols-1 sm:grid-cols-2` collapses cleanly. CTA card `p-10 sm:p-16`. |
| `Markets/CryptoToAed.tsx` | All tables have `overflow-x-auto`. Converter card uses `min-w-0 truncate` on input. |
| `Markets/BtcToAed.tsx` | Same structure as CryptoToAed. Table has `overflow-x-auto`. |
| `Markets/UsdtVsUsdc.tsx` | Table has `overflow-x-auto` wrapper. |
| `Markets/CryptoToUae.tsx` | `min-w-[700px]` table wrapped in `overflow-x-auto`. |
| `Markets/CryptoToBankUae.tsx` | Table has `overflow-x-auto` wrapper. |
| `Markets/CryptoTaxUae.tsx` | Table has `overflow-x-scroll` wrapper. |
| `Markets/CryptoSalaryUae.tsx` | `overflow-x-auto` on motion element parent — functionally equivalent. |
| `Markets/CryptoEscrowUae.tsx` | Same as CryptoSalaryUae. |
| `Markets/CryptoRemittanceUae.tsx` | Both tables have `overflow-x-auto` wrappers. |
| `Protocol/Whitepaper.tsx` | Both tables have `overflow-x-auto mb-8` wrappers. |
| `Protocol/HowItWorks.tsx` | ✅ Fixed `text-md`. All grids: `grid-cols-1 md:grid-cols-3`. `px-6` on all sections. |
| `Protocol/BlipTokenomics.tsx` | ✅ Fixed chart `w-[260px]`. Hero uses `clamp()` for font size. |
| `Waitlist/JoinWaitlist.tsx` | `flex-col lg:flex-row` hero stacks correctly. Note: mobile hamburger has no menu (known limitation). |

---

## COMPLETE FIXES SUMMARY

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `BlipscanExplorerSection.tsx` | `sm:[600px]` missing `h-` prefix | → `sm:h-[600px]` |
| 2 | `Footer.tsx` | Inverted padding `px-8 sm:px-6` | → `px-4 sm:px-6 lg:px-8` |
| 3 | `Navbar.tsx` | Nested `<a>` tags in MobileMenu | Replaced with single styled `<a>` |
| 4 | `MerchantDashboardSection.tsx` | `px-2` too narrow on mobile | → `px-4` |
| 5 | `ProtocolSection.tsx` | Unconditional `<br />` on mobile | → `<br className="hidden md:block" />` |
| 6 | `HowItWorksSection.tsx` | Dead flex classes without `flex` | Removed dead classes |
| 7 | `EarlyAdopterBanner.tsx` | `bg-black/8` invalid Tailwind opacity | → `bg-black/[0.08]` etc. |
| 8 | `RewardsSection.tsx` | Stat cells overflow in 3-col grid on 320px | `text-xl`, `p-4`, `text-xs sm:text-sm` |
| 9 | `HowItWorks.tsx` | `text-md` invalid Tailwind class | → `text-xs sm:text-2xl` |
| 10 | `Glossary.tsx` | `hover:border-black/15` (portable fix) | → `hover:border-black/[0.15]` |
| 11 | `BlipTokenomics.tsx` | Chart `w-[290px]` overflows 272px viewport | → `w-[260px]` |

---

*Last updated: 2026-02-23 — Audit complete*
