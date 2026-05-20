#!/usr/bin/env node
/**
 * Regenerate the <!-- pSEO:start --> ... <!-- pSEO:end --> block inside
 * public/sitemap.xml from the same data the runtime generator uses.
 *
 * Must stay in sync with src/data/pseoGenerator.ts (CRYPTOS, FIATS,
 * INTENTS) and the HANDCRAFTED_SLUGS skip-list.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP = resolve(__dirname, "..", "public", "sitemap.xml");

const CRYPTOS = ["usdt", "usdc", "btc", "eth", "sol", "bnb", "matic", "dai"];
const FIATS = ["inr", "aed", "php", "thb"];
const INTENT_SLUGS = [
  (c, f) => `${c}-to-${f}-without-kyc`,
  (c, f) => `${c}-to-${f}-p2p`,
  (c, f) => `${c}-to-${f}-instant`,
  (c, f) => `cheapest-way-to-convert-${c}-to-${f}`,
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
];

const handSet = new Set(HANDCRAFTED);
const all = new Set(HANDCRAFTED);

for (const c of CRYPTOS) {
  for (const f of FIATS) {
    for (const make of INTENT_SLUGS) {
      const slug = make(c, f);
      if (!handSet.has(slug)) all.add(slug);
    }
  }
}

const slugs = [...all].sort();
console.log(`Generating ${slugs.length} pSEO sitemap entries.`);

function entry(slug) {
  return `  <url>
    <loc>https://www.blip.money/${slug}</loc>
    <lastmod>2026-05-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
}

const START = "<!-- pSEO:start -->";
const END = "<!-- pSEO:end -->";

let xml = readFileSync(SITEMAP, "utf8");
const block = `${START}\n${slugs.map(entry).join("\n")}\n  ${END}`;

if (xml.includes(START) && xml.includes(END)) {
  xml = xml.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
} else {
  xml = xml.replace("</urlset>", `  ${block}\n</urlset>`);
}

writeFileSync(SITEMAP, xml);
console.log("sitemap.xml updated.");
