// Catalogs every editable section + field across the 3 main pages.
// The dashboard reads this to render its editor.

export type SectionField =
  | { kind: "text"; id: string; label: string; default: string; multiline?: boolean }
  | { kind: "image"; id: string; label: string; default: string }
  | { kind: "variant"; id: string; label: string; options: { value: string; label: string }[]; default: string };

export type Section = {
  id: string;
  label: string;
  page: "home" | "merchant" | "user";
  anchor: string; // URL hash to scroll to (best-effort)
  fields: SectionField[];
};

export const SECTIONS: Section[] = [
  // ─────────────────── HOME ───────────────────
  {
    id: "home.hero",
    page: "home",
    label: "Hero",
    anchor: "/#hero",
    fields: [
      { kind: "text", id: "home.hero.eyebrow", label: "Eyebrow", default: "The Settlement Protocol" },
      { kind: "text", id: "home.hero.title.line1", label: "Headline · line 1", default: "Borderless finance." },
      { kind: "text", id: "home.hero.title.line2", label: "Headline · line 2", default: "Settled on-chain." },
      { kind: "text", id: "home.hero.sub", label: "Subtitle", default: "Best rates, guaranteed. Private by design. Settled on-chain.", multiline: true },
      { kind: "image", id: "home.hero.bg", label: "Hero background image", default: "/hero-bg.jpg" },
    ],
  },
  {
    id: "home.merchant-section",
    page: "home",
    label: "Powered by Merchants",
    anchor: "/#merchants",
    fields: [
      { kind: "text", id: "home.merchant.eyebrow", label: "Eyebrow", default: "Powered by Merchants" },
      { kind: "text", id: "home.merchant.title.pre", label: "Title · pre", default: "Merchants provide liquidity. " },
      { kind: "text", id: "home.merchant.title.accent", label: "Title · accent", default: "Earn on every order." },
      { kind: "text", id: "home.merchant.sub", label: "Subtitle", default: "Verified merchants bid live, set their own spread, and capture profit on every settlement — paid out instantly, on-chain.", multiline: true },
      {
        kind: "variant",
        id: "blip:merchant-cards-variant",
        label: "Cards variant",
        options: [
          { value: "mixed", label: "Mixed · animated + scene" },
          { value: "apple", label: "Apple-style · product cards" },
          { value: "clear", label: "Smart app · clear hero" },
          { value: "kinetic", label: "Dashboard · dark kinetic" },
          { value: "live-rows", label: "Dashboard · live rows" },
          { value: "editorial", label: "Editorial · live-data" },
          { value: "painted", label: "Painted · Gemini scenes" },
          { value: "card-hero", label: "Card hero · 3 painted" },
          { value: "app-style", label: "Merchant · app-style" },
          { value: "local-rows", label: "Local · dashboard merchant" },
        ],
        default: "mixed",
      },
    ],
  },

  // ─────────────────── MERCHANT ───────────────────
  {
    id: "merchant.hero",
    page: "merchant",
    label: "Merchant hero",
    anchor: "/merchant",
    fields: [
      { kind: "text", id: "merchant.hero.eyebrow", label: "Eyebrow", default: "Merchant-First Protocol" },
      { kind: "text", id: "merchant.hero.title.pre", label: "Title · pre", default: "You set the margin. " },
      { kind: "text", id: "merchant.hero.title.accent", label: "Title · accent", default: "You win the order." },
      { kind: "text", id: "merchant.hero.sub", label: "Subtitle", default: "Orders route to you through Blip Market — paid on-chain, no banks, no chargebacks. Earn on every settlement.", multiline: true },
    ],
  },

  // ─────────────────── USER ───────────────────
  {
    id: "user.hero",
    page: "user",
    label: "User hero",
    anchor: "/user",
    fields: [
      { kind: "text", id: "user.hero.title.line1", label: "Headline · line 1", default: "Send crypto." },
      { kind: "text", id: "user.hero.title.line2", label: "Headline · line 2", default: "Get fiat instantly." },
      { kind: "text", id: "user.hero.sub", label: "Subtitle", default: "Convert USDT, USDC, or SOL to AED, INR, and more — settled on-chain, landed in your bank.", multiline: true },
    ],
  },
  {
    id: "user.app-preview",
    page: "user",
    label: "App preview (One app, everything you need)",
    anchor: "/user#app-preview",
    fields: [
      { kind: "text", id: "user.app.eyebrow", label: "Eyebrow", default: "The app" },
      { kind: "text", id: "user.app.title.pre", label: "Title · pre", default: "One app. " },
      { kind: "text", id: "user.app.title.accent", label: "Title · accent", default: "Everything you need." },
      { kind: "text", id: "user.app.sub", label: "Subtitle", default: "Swap, settle, and track — all in a simple, fast interface.", multiline: true },
      { kind: "image", id: "user.app.screenshot", label: "Phone screenshot", default: "/app-home.png" },
    ],
  },
  {
    id: "user.cta",
    page: "user",
    label: "Ready to try Blip CTA",
    anchor: "/user#cta",
    fields: [
      { kind: "text", id: "user.cta.title.pre", label: "Title · pre", default: "Ready to try " },
      { kind: "text", id: "user.cta.title.accent", label: "Title · accent", default: "Blip?" },
      { kind: "text", id: "user.cta.sub", label: "Subtitle", default: "Join the waitlist. Early users get priority access and bonus rewards.", multiline: true },
    ],
  },
];
