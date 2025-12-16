# Translation Implementation Guide for Blip Money

## ✅ Already Completed
1. **Navbar** - Fully translated (EN/AR)
2. **HowItWorks Page** - Fully translated (EN/AR)
3. **i18n.ts** - Extended with Index page translations

## 📝 How to Implement Translations in Index.tsx

The `Index.tsx` file is very large (2361 lines). Here's how to add translations:

### Step 1: Import useTranslation at the top of Index.tsx

```typescript
import { useTranslation } from "react-i18next";
```

### Step 2: Add the hook in components

For each component that needs translation, add:

```typescript
const { t } = useTranslation();
```

### Step 3: Replace Hardcoded Text

#### Example 1: USAGE_SCENES Array (lines 58-131)

**Before:**
```typescript
const USAGE_SCENES = [
  {
    id: "cafe",
    title: "Cafés",
    subtitle: "TAP TO PAY",
    headline: "Tap to pay for coffee with crypto.",
    description: "You scan a QR, pay in USDT from your wallet...",
    statLabel: "Typical settlement",
    statValue: "< 10s",
    // ...
  },
  // ...
];
```

**After:**
```typescript
const { t } = useTranslation(); // Add at component level

const USAGE_SCENES = [
  {
    id: "cafe",
    title: t("cafes"),
    subtitle: t("tapToPay"),
    headline: t("tapToPayCoffee"),
    description: t("tapToPayDesc"),
    statLabel: t("typicalSettlement"),
    statValue: "< 10s",
    // ...
  },
  {
    id: "restaurant",
    title: t("restaurants"),
    subtitle: t("tableSettlement"),
    headline: t("splitTheBill"),
    description: t("splitBillDesc"),
    statLabel: t("partySize"),
    statValue: "2–20 guests",
    // ...
  },
  // Continue for all scenes...
];
```

#### Example 2: RealWorldUsageSection (lines 513-567)

**Before:**
```typescript
<SectionLabel
  text="Real World Usage"
  className={"items-center justify-center"}
/>
<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 sm:mb-10 mint-gradient-text tracking-tight text-center">
  Use crypto the same way
  <br />
  you use money.
</h2>
```

**After:**
```typescript
<SectionLabel
  text={t("realWorldUsage")}
  className={"items-center justify-center"}
/>
<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 sm:mb-10 mint-gradient-text tracking-tight text-center">
  {t("useCryptoSameWay")}
  <br />
  {t("youUseMoney")}
</h2>
```

#### Example 3: LiveUsagePanel Component (lines 317-511)

**Before:**
```typescript
<p className="text-[10px] font-mono tracking-[0.26em] uppercase text-[#00FF94] mb-2">
  EXAMPLE ROUTE
</p>
```

**After:**
```typescript
<p className="text-[10px] font-mono tracking-[0.26em] uppercase text-[#00FF94] mb-2">
  {t("exampleRoute")}
</p>
```

**Before:**
```typescript
<p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-gray-300 text-center">
  Your Wallet
</p>
```

**After:**
```typescript
<p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-gray-300 text-center">
  {t("yourWallet")}
</p>
```

#### Example 4: EarlyAdopterBanner (lines 611-754)

**Before:**
```typescript
<span className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-300">
  EARLY ADOPTER PROGRAM
</span>
```

**After:**
```typescript
<span className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-300">
  {t("earlyAdopterProgram")}
</span>
```

**Before:**
```typescript
<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">
  Claim your <span className="text-[#00FF94]">$100 early drop</span>{" "}
  when you join Blip.
</h2>
```

**After:**
```typescript
<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">
  {t("claimYour100")} <span className="text-[#00FF94]">{t("earlyDrop")}</span>{" "}
  {t("whenYouJoin")}
</h2>
```

## 🔑 All Available Translation Keys for Index Page

Use these keys with `t("keyName")`:

### Usage Scenes
- `cafes`, `tapToPay`, `tapToPayCoffee`, `tapToPayDesc`, `typicalSettlement`
- `restaurants`, `tableSettlement`, `splitTheBill`, `splitBillDesc`, `partySize`
- `hotels`, `instantBooking`, `bookStays`, `bookStaysDesc`, `depositHold`
- `retail`, `posIntegration`, `swipeTapScan`, `retailDesc`, `integration`
- `friends`, `p2pTransfer`, `payBackFriends`, `payFriendsDesc`, `fees`
- `transport`, `rideSettlement`, `settleRides`, `transportDesc`, `idealFor`, `travel`

### Diagram Labels
- `yourWallet`, `blipProtocol`, `blipPeopleBank`, `realWorldPayout`
- `payFromWallet`, `onChainRouting`, `merchantReceiver`
- `exampleRoute`, `illustrativeRoute`, `protocolAnimation`
- `payInDigitalValue`

### Early Adopter
- `earlyAdopterProgram`, `claimYour100`, `earlyDrop`, `whenYouJoin`
- `earlyDropDesc`, `newWalletRegistration`, `firstSuccessfulTransfer`
- `dropUnlocked`, `earlyDropBalance`, `reservedForYou`
- `inBlipTokens`, `perUserLimited`

## 📋 Quick Start Example

Here's a minimal example to get you started. Add this to the top of your Index component:

```typescript
const Index = () => {
  const { t } = useTranslation();

  // Now you can use t() anywhere in this component
  // Example: {t("cafes")} instead of "Cafés"

  return (
    // ... your JSX
  );
};
```

## ⚠️ Important Notes

1. **USAGE_SCENES array**: Since this is used as data, you need to move it inside a component or use `useTranslation()` hook where it's defined
2. **Dynamic values**: Keep values like "< 10s", "$100", "2–20 guests" as is (don't translate)
3. **Icons**: No translation needed for icon components
4. **CSS classes**: No translation needed

## 🎯 Priority Order

If you want to translate gradually, do it in this order:
1. ✅ Navbar (already done)
2. ✅ HowItWorks page (already done)
3. RealWorldUsageSection component
4. EarlyAdopterBanner component
5. Other sections as needed

## 🔄 Testing

After implementing translations:
1. Run `npm run dev`
2. Click language switcher (EN/العربية)
3. Verify text changes across all sections

---

**Need help?** All translation keys are already in `src/i18n.ts` - just use them with `t("keyName")`!
