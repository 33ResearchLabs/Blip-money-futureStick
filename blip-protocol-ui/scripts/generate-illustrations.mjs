#!/usr/bin/env node
/**
 * Generates editorial illustrations into public/illustrations/ via Gemini.
 * Spec: claude_web_theme.md §9 (locked 2026-05-23).
 *
 * Usage:
 *   node scripts/generate-illustrations.mjs              # skip existing
 *   node scripts/generate-illustrations.mjs --force      # regenerate all
 *   node scripts/generate-illustrations.mjs --only foo   # only filenames matching "foo"
 *
 * Requires GEMINI_API_KEY in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "illustrations");

// Load .env.local
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// ─────────────────────────────────────────────────────────────────────────────
// STYLE — appended to every prompt. Locked spec.
// ─────────────────────────────────────────────────────────────────────────────
const STYLE = `

Style: 16:10 painterly editorial flat illustration in the lineage of Uber, Apple, and Stripe landing-page art. Warm cinematic light, soft gradient sky, layered foreground/midground/background depth. One or two dominant colors per scene plus supporting tones — never a rainbow. Characters have visible friendly faces with eyes and a soft smile (never faceless silhouettes). Generous 10-15% breathing room around the focal element. One central focal element plus one ambient detail. No neon glow, no photoreal textures, no readable text or logos. Composition feels calm, confident, premium.`;

// ─────────────────────────────────────────────────────────────────────────────
// SCENES — filename → prompt. Each maps to a file consumed in CardPreview.tsx.
// ─────────────────────────────────────────────────────────────────────────────
const SCENES = [
  // ── Card heroes (CardHeroGrid) ────────────────────────────────────────────
  {
    file: "pay-anyone-card.png",
    prompt: `A warm aerial scene of a person on a sunlit rooftop tapping a phone, a soft golden arc of light arcing from the phone across a hazy global skyline of distant cities at dawn. Sky and coral accent. One floating coin glints mid-arc. Dawn warmth, calm motion, no banks visible.`,
  },
  {
    file: "rate-neon-card.png",
    prompt: `A close, premium scene on a deep ink-black background of three glowing price tags suspended in the air, the middle one slightly larger and lit in soft mint, the outer two dimmer. A confident character in shadow profile studies them. Subtle gold rim-light, restrained palette of ink + mint, one small spark above the winning tag.`,
  },
  {
    file: "earn-trade-card.png",
    prompt: `A friendly liquidity-provider character at a glass dashboard, soft gold coins gently rising from the screen like bubbles in warm light, a single line chart climbing in the background. Cream and gold palette, calm posture, one focal stack of three coins floating mid-air.`,
  },

  // ── Merchant carousel painted (MerchantCarouselPainted) ───────────────────
  {
    file: "zero-fees-card.png",
    prompt: `A celebratory storefront scene: a smiling shopkeeper behind a wooden counter holds up a circular paper "0%" tag like a sun. Soft mint accent on the tag, warm cream walls, one floating coin near the tag. Friendly face, calm midday light, no readable text other than the 0% symbol drawn graphically.`,
  },
  {
    file: "first-transfers-card.png",
    prompt: `A sender at a window in a Dubai high-rise at golden hour, a soft golden thread of light arcing from their phone across the sky toward a distant Mumbai rooftop with a waiting receiver. Three small luminous coin-glyphs travel along the thread. Warm gold + sky palette, calm, hopeful.`,
  },
  {
    file: "bring-friend-card.png",
    prompt: `Two friends walking together on a sunlit street, both smiling, a soft coral $20 paper note gently floating between them like a shared kite-string. One small sparkle above each friend's head. Cream sidewalk, coral accent, warm late-afternoon light, framed wide with breathing room.`,
  },
  {
    file: "boost-trades-card.png",
    prompt: `A confident trader character at a clean glass desk, a soft sky-blue upward arrow rising behind them with five tiny ascending markers. One floating coin near the arrowhead. Cool sky-blue + ink palette, calm focused posture, soft window light from the left.`,
  },

  // ── Become-merchant family ────────────────────────────────────────────────
  {
    file: "become-merchant.png",
    prompt: `A small-business owner standing proud in front of a warm-lit storefront window at dusk, a friendly smile, holding a tablet showing a soft glowing graph. One floating Claude-orange coin near the tablet, cream + warm-orange palette, three subtle steps suggested as faint chalk marks on the pavement (1, 2, 3 — drawn as small dots, not numerals).`,
  },
  {
    file: "become-merchant-dark.png",
    prompt: `Same merchant character as the warm version but at night under a single warm overhead lamp, deep ink-black background, the storefront window glows from within in warm Claude-orange. The merchant smiles, tablet in hand, one floating gold coin near the screen. Calm, cinematic, premium.`,
  },
  {
    file: "become-merchant-card.png",
    prompt: `A tighter portrait of a friendly merchant behind their counter, mid-frame, a small "Apply" paper tag pinned to a cork-board behind them. Warm cream walls, single Claude-orange accent on the apron stripe. One floating coin to the right of the merchant. Soft window light, eyes + smile clearly visible.`,
  },

  // ── Hero characters (used elsewhere on the site) ──────────────────────────
  {
    file: "hero-char-1.png",
    prompt: `A friendly remittance-sender character (warm-toned skin, casual hoodie) holding a phone with a soft golden arc lifting from the screen. Cream gradient sky, one ambient coin floating to the side. Calm, premium, eyes + smile visible. No background banks.`,
  },
  {
    file: "hero-char-2.png",
    prompt: `A friendly merchant-archetype character in a casual apron behind a sunlit counter, smiling, one Claude-orange coin floating near the shoulder. Warm cream walls, soft midday light, eyes + smile visible.`,
  },
  {
    file: "hero-char-3.png",
    prompt: `A friendly trader-archetype character at a glass workstation, soft sky-blue dashboard glowing in front of them, one floating coin near the screen. Cool palette, calm posture, eyes + smile visible.`,
  },
  {
    file: "hero-char-4.png",
    prompt: `A friendly traveler-archetype character with a small carry-on, standing on a sunlit airport balcony at golden hour, one floating gold coin to the side, distant skyline soft and warm. Eyes + smile visible.`,
  },
  {
    file: "hero-vibe.png",
    prompt: `Wide editorial cover scene: three friends from different cities walking toward a shared warm horizon, soft golden arcs of light connecting each of their phones into the center of the frame, hopeful warm-cream sky. One small floating coin per arc. Premium, calm, no banks, no readable text.`,
  },
  // ── Waitlist hero ─────────────────────────────────────────────────────────
  {
    file: "waitlist-hero.png",
    prompt: `A premium editorial hero scene for joining a waitlist: a calm confident character standing at a quiet vantage point at golden hour, looking out at a soft horizon where a row of warm-lit windows in distant towers form a queue of light. A single luminous numbered token (drawn as a small circular glyph, not readable text) floats gently in front of the character at chest height. Warm cream and Claude-orange palette with a soft ink silhouette of the skyline. One ambient sparkle. Hopeful, anticipatory, never crowded. Visible friendly face, eyes and a soft smile.`,
  },
  {
    file: "app-unlocked-wallet.png",
    prompt: `A clean editorial scene of an open wallet floating mid-frame on a soft cream surface, a single Claude-orange coin descending into it with a faint arc, a tiny padlock unlocked beside the wallet. Warm light from above, restrained palette, no readable text, generous breathing room.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// characterPair helper — emits {archetype}-m.png and {archetype}-f.png.
// Currently unused; kept available for future character library generation.
// ─────────────────────────────────────────────────────────────────────────────
export function characterPair(archetype, body, bg) {
  const SHARED = `1:1 square, 3/4 body, centered with 10-15% breathing room, visible friendly face with eyes and a soft smile, no readable text or logos, painterly editorial flat illustration in the Uber/Apple/Stripe landing-art lineage, one accent color, calm premium mood.`;
  return [
    { file: `${archetype}-m.png`, prompt: `A male ${body}. Background: ${bg}. ${SHARED}` },
    { file: `${archetype}-f.png`, prompt: `A female ${body}. Background: ${bg}. ${SHARED}` },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────────────────────────────────────
const FORCE = process.argv.includes("--force");
const onlyIdx = process.argv.indexOf("--only");
const ONLY = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;

async function generate(scene) {
  const outPath = path.join(OUT_DIR, scene.file);
  if (!FORCE && fs.existsSync(outPath)) {
    console.log(`  skip (exists): ${scene.file}`);
    return { skipped: true };
  }
  const fullPrompt = scene.prompt + STYLE;
  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }],
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 400)}`);
  }
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData || p.inline_data);
  const inline = imagePart?.inlineData || imagePart?.inline_data;
  if (!inline?.data) {
    throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 400)}`);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(inline.data, "base64"));
  return { written: true };
}

const scenes = ONLY ? SCENES.filter((s) => s.file.includes(ONLY)) : SCENES;
console.log(`Generating ${scenes.length} scenes → ${path.relative(ROOT, OUT_DIR)}/`);
console.log(`Model: ${MODEL} | force: ${FORCE} | only: ${ONLY || "(all)"}\n`);

let written = 0, skipped = 0, failed = 0;
for (const scene of scenes) {
  process.stdout.write(`  • ${scene.file} ... `);
  try {
    const r = await generate(scene);
    if (r.skipped) { skipped++; continue; }
    written++;
    console.log("ok");
  } catch (err) {
    failed++;
    console.log(`FAIL — ${err.message}`);
  }
}

console.log(`\nDone. written=${written} skipped=${skipped} failed=${failed}`);
