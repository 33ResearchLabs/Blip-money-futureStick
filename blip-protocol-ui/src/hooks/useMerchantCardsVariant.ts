import { useEffect, useState } from "react";

export type MerchantCardsVariant =
  | "apple"
  | "clear"
  | "kinetic"
  | "live-rows"
  | "editorial"
  | "mixed"
  | "painted"
  | "card-hero"
  | "app-style"
  | "local-rows";

export const MERCHANT_CARDS_VARIANTS: { value: MerchantCardsVariant; label: string }[] = [
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
];

const KEY = "blip:merchant-cards-variant";
const EVENT = "blip:merchant-cards-variant-changed";
const DEFAULT: MerchantCardsVariant = "mixed";

function readStored(): MerchantCardsVariant {
  if (typeof window === "undefined") return DEFAULT;
  const v = window.localStorage.getItem(KEY);
  if (!v) return DEFAULT;
  if (MERCHANT_CARDS_VARIANTS.some((o) => o.value === v)) return v as MerchantCardsVariant;
  return DEFAULT;
}

export function useMerchantCardsVariant() {
  const [variant, setVariantState] = useState<MerchantCardsVariant>(readStored);

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<MerchantCardsVariant>).detail;
      if (detail) setVariantState(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) setVariantState(e.newValue as MerchantCardsVariant);
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setVariant = (next: MerchantCardsVariant) => {
    window.localStorage.setItem(KEY, next);
    window.dispatchEvent(new CustomEvent<MerchantCardsVariant>(EVENT, { detail: next }));
    setVariantState(next);
  };

  return { variant, setVariant };
}
