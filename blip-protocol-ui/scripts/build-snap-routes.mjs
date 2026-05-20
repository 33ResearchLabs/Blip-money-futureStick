#!/usr/bin/env node
/**
 * Build the react-snap `include` array in package.json from the pSEO
 * corridor list + a static set of critical non-pSEO routes.
 *
 * react-snap reads its config from package.json. There's no way to point
 * it at a file, so we mutate package.json before build.
 *
 * Stays in sync with src/data/pseoGenerator.ts (CRYPTOS, FIATS, INTENT_SLUGS)
 * and the HANDCRAFTED list. Mirror any change here.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(__dirname, "..", "package.json");

const CRYPTOS = ["usdt", "usdc", "btc", "eth", "sol", "bnb", "matic", "dai"];
const FIATS = ["inr", "aed", "php", "thb"];
const INTENT_SLUGS = [
  (c, f) => `${c}-to-${f}-without-kyc`,
  (c, f) => `${c}-to-${f}-p2p`,
  (c, f) => `${c}-to-${f}-instant`,
  (c, f) => `cheapest-way-to-convert-${c}-to-${f}`,
  (c, f) => `${c}-to-${f}-no-fees`,
  (c, f) => `best-${c}-to-${f}-rate`,
  (c, f) => `fastest-${c}-to-${f}`,
];

const HANDCRAFTED = [
  "usdt-to-inr-without-kyc",
  "usdt-to-inr-p2p",
  "sell-usdt-india-instant",
  "usdt-to-inr-via-upi",
  "usdt-to-aed-without-kyc",
  "usdt-to-inr-1-minute-settlement",
  "binance-p2p-alternative-india",
  "wazirx-p2p-alternative",
  "cheapest-way-to-convert-usdt-to-inr",
  "usdt-to-inr-no-fees",
  "instant-usdt-to-bank-transfer-india",
  "crypto-to-upi-instant",
  "usdc-to-inr-without-kyc",
  "btc-to-inr-without-kyc",
  "sol-to-inr-without-kyc",
  "is-usdt-to-inr-legal-in-india",
  "usdt-premium-india-today",
  "uae-to-india-remittance-crypto",
  "usdt-to-php-gcash-instant",
  "accept-stablecoin-payments-uae-business",
  "crypto-arbitrage-india-explained",
  "blip-vs-binance-p2p",
  "blip-vs-wazirx",
];

// Critical non-pSEO routes that also need prerendering for SEO/CTR.
// Skip ones with heavy interactivity that don't add SEO value when rendered.
const CRITICAL_STATIC = [
  "/",
  "/rates",
  "/how-it-works",
  "/merchant",
  "/user",
  "/about",
  "/faq",
  "/compare",
  "/use-cases",
  "/whitepaper",
  "/blog",
  "/research",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/legal",
  "/changelog",
  "/glossary",
  // Markets hubs (high commercial intent)
  "/btc-to-inr",
  "/btc-to-aed",
  "/eth-to-inr",
  "/eth-to-aed",
  "/sol-to-inr",
  "/sol-to-aed",
  "/crypto-to-inr",
  "/crypto-to-aed",
  "/sell-usdt-dubai",
  "/buy-usdt-dubai",
  "/crypto-otc-dubai",
  "/crypto-payments-uae",
  "/crypto-remittance-uae",
  "/crypto-tax-uae",
  "/crypto-escrow-uae",
  "/crypto-salary-uae",
  "/best-crypto-exchange-uae",
  "/bitcoin-price-uae",
  "/crypto-to-bank-uae",
  "/usdt-vs-usdc",
  "/accept-crypto-business",
];

const pseoSlugs = new Set(HANDCRAFTED);
for (const c of CRYPTOS) {
  for (const f of FIATS) {
    for (const make of INTENT_SLUGS) {
      pseoSlugs.add(make(c, f));
    }
  }
}

const pseoRoutes = [...pseoSlugs].map((s) => `/${s}`);
const include = [...new Set([...CRITICAL_STATIC, ...pseoRoutes])].sort();

console.log(`react-snap include list: ${include.length} routes`);

const pkg = JSON.parse(readFileSync(PKG, "utf8"));
pkg.reactSnap = pkg.reactSnap || {};
pkg.reactSnap.include = include;
writeFileSync(PKG, JSON.stringify(pkg, null, 2) + "\n");
console.log("package.json reactSnap.include updated.");
