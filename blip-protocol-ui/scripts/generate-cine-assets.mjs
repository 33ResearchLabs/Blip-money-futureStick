#!/usr/bin/env node
/**
 * Cinematic overlay assets for the /preview/dark-fintech slideshow.
 * Different aesthetic than generate-illustrations.mjs — these are
 * pure-black "product reveal" style textures (caustics, flares, props)
 * meant to composite on top of the live phone UI for an Apple/Tiffany
 * commercial feel.
 *
 * Usage:
 *   node scripts/generate-cine-assets.mjs           # skip existing
 *   node scripts/generate-cine-assets.mjs --force   # regenerate all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "illustrations", "cine");

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

// Style: PURE BLACK BG, photoreal, premium product photography lighting.
// Designed to be composited onto a black surface with mix-blend-mode: screen
// (textures) or as floating "hero objects" beside the phone.
const STYLE_TEXTURE = `
Style: Photoreal high-end product photography. Pure black background (#000), absolutely no surrounding color cast or vignette tint other than what is described. No text, no logos, no UI. Captured as if shot on a Phase One with a macro prime, shallow depth of field, soft falloff into pitch black. Premium, restrained, Apple/Tiffany commercial aesthetic. 16:9 frame, 4K, centered subject, generous black space for compositing.`;

const STYLE_OBJECT = `
Style: Photoreal hero object on pitch black void (#000). Single subject, centered, dramatic single-source key light, soft falloff, subtle specular highlights, faint catch-light. Like an Apple keynote product reveal shot. No text, no logos, no environment, no surface or shadow plane — object appears to float. 1:1 square, 4K, premium commercial.`;

const SCENES = [
  // ── Light textures (composite with mix-blend-mode: screen) ───────────────
  {
    file: "cine-caustic-warm.png",
    prompt: `Soft underwater-style light caustics in warm amber and pale gold drifting across a pure black void. Organic flowing veins of light, like sunlight refracted through a glass of whisky. No water visible, no environment — just the light pattern itself floating in black space. ${STYLE_TEXTURE}`,
  },
  {
    file: "cine-caustic-cool.png",
    prompt: `Subtle cool-white and pale platinum light caustics drifting across a pure black void. Delicate web-like refraction lines, restrained, mostly black with luminous veins of light only at the center third. ${STYLE_TEXTURE}`,
  },
  {
    file: "cine-flare-anamorphic.png",
    prompt: `Single horizontal anamorphic lens flare streak, soft warm-white core fading to deep orange at the edges, on pure black. Like the signature anamorphic flare from a Panavision lens hit by a key light. One streak only, centered horizontally across the frame, ~70% of the width, with a soft round bokeh ball at the bright point. ${STYLE_TEXTURE}`,
  },
  {
    file: "cine-light-rays.png",
    prompt: `Soft volumetric god-rays angling down from upper-left into deep black space, very subtle, dust motes catching the light. Warm white rays only, no source visible. Mostly black frame, the light occupies maybe 30% of the area. Cathedral / cinematic key-light feel. ${STYLE_TEXTURE}`,
  },
  {
    file: "cine-particles.png",
    prompt: `Floating ambient dust motes and tiny luminous particles suspended in pitch black, varying soft focus, warm-white catch-lights. Like microscopic gold dust caught in a single beam of studio light. Scattered across the frame with negative space. ${STYLE_TEXTURE}`,
  },
  {
    file: "cine-glow-orb.png",
    prompt: `A single soft warm-orange luminous orb of light floating in the lower third of a pitch black frame, soft falloff radiating outward, no hard edge. Like the glow of a hidden ember. Mostly black, the orb is the only feature. ${STYLE_TEXTURE}`,
  },

  // ── Hero objects (per-stage floating props) ──────────────────────────────
  {
    file: "cine-coin-usdt.png",
    prompt: `A single premium polished metallic coin, the size of a poker chip, edge-lit with a soft warm-orange specular highlight, suspended in a pitch black void. The coin face shows a clean abstract dollar-sign-like glyph in deep relief (no readable text). Brushed chrome body, slight oxidized warm tint. Dramatic single key light from upper-left, soft falloff. ${STYLE_OBJECT}`,
  },
  {
    file: "cine-vault-ring.png",
    prompt: `A single polished metallic ring (like a thick brushed-steel bracelet hoop or a vault dial outer ring) floating in pitch black void, dramatically side-lit so one half catches a warm specular highlight and the other recedes into shadow. Premium minimal, like a sculptural object on display. Brushed finish, slight warm tone. ${STYLE_OBJECT}`,
  },
  {
    file: "cine-wax-seal.png",
    prompt: `A single deep warm-orange wax seal disc with an embossed abstract checkmark glyph in its center, soft texture on the wax, lit with one dramatic key light from above. Floating in pitch black void as if held mid-air. No envelope, no ribbon. ${STYLE_OBJECT}`,
  },
  {
    file: "cine-globe-wire.png",
    prompt: `A delicate wireframe globe made of fine luminous warm-white meridian lines on a pitch black void, slightly tilted on its axis, soft inner glow at the core. Premium minimal, like a holographic schematic. No continents drawn — just the longitude/latitude wireframe. ${STYLE_OBJECT}`,
  },
];

const FORCE = process.argv.includes("--force");

async function generate(scene) {
  const outPath = path.join(OUT_DIR, scene.file);
  if (!FORCE && fs.existsSync(outPath)) {
    console.log(`  skip (exists): ${scene.file}`);
    return { skipped: true };
  }
  const body = { contents: [{ parts: [{ text: scene.prompt }] }] };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const inline = (parts.find((p) => p.inlineData || p.inline_data) || {});
  const data = (inline.inlineData || inline.inline_data)?.data;
  if (!data) throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 300)}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(data, "base64"));
  return { written: true };
}

console.log(`Generating ${SCENES.length} cine assets → ${path.relative(ROOT, OUT_DIR)}/`);
let written = 0, skipped = 0, failed = 0;
for (const scene of SCENES) {
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
