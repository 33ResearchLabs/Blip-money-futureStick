import { useState } from "react";
import { useGeneratedCards } from "@/hooks/useGeneratedCards";

// Card-type presets — match the visual archetypes actually used across /, /merchant, /user.
// Each preset preloads the prompt body + suggested filename prefix + recommended size hint.
// Theme defaults: warm Claude orange #cc785c, cream backdrops, no green, no readable text.
type Preset = { label: string; group: string; filenamePrefix: string; size: string; text: string };

const PRESETS: Preset[] = [
  // ── Hero illustrations (waitlist hero, /user hero, /merchant hero) ──
  { label: "Hero · waitlist portrait", group: "Hero", filenamePrefix: "waitlist-hero", size: "1:1 portrait, 1024px",
    text: "A premium editorial portrait of a single friendly confident person centered in the frame, 3/4 body, looking slightly off-camera at golden hour. They hold a glowing phone close to their chest; a soft warm arc of light lifts from the phone into the air above their shoulder, where a single luminous circular token gently hovers (no readable text). Warm cream backdrop with a soft Claude-orange (#cc785c) wash, cinematic rim-light. Visible friendly face with eyes and a soft smile. Painterly editorial flat illustration in the lineage of Uber/Apple/Stripe landing art, premium and uncrowded. No banks, no logos, no readable text." },
  { label: "Hero · merchant", group: "Hero", filenamePrefix: "merchant-hero", size: "1:1 square, 1024px",
    text: "A small-business owner standing proud in front of a warm-lit storefront window at dusk, friendly smile, holding a tablet showing a soft glowing graph. One floating Claude-orange (#cc785c) coin near the tablet. Cream + warm-orange palette. Painterly editorial flat illustration, eyes + smile visible, generous breathing room, no readable text." },
  { label: "Hero · user / sender", group: "Hero", filenamePrefix: "user-hero", size: "1:1 square, 1024px",
    text: "A friendly remittance-sender character (warm-toned skin, casual hoodie) on a sunlit rooftop, holding a phone with a soft golden arc lifting from the screen across a hazy distant skyline at dawn. Cream sky, one ambient coin floating to the side. Painterly editorial flat, eyes + smile visible, no readable text." },

  // ── Merchant carousel painted (MerchantCarouselPainted) ──
  { label: "Merchant card · zero-fees", group: "Merchant card", filenamePrefix: "zero-fees-card", size: "1:1 square, 1024px",
    text: "A celebratory storefront scene: a smiling shopkeeper behind a wooden counter holds up a circular paper '0%' tag like a sun. Soft mint accent on the tag, warm cream walls, one floating coin near the tag. Friendly face, calm midday light, no readable text other than the 0% symbol drawn graphically." },
  { label: "Merchant card · pay-anyone", group: "Merchant card", filenamePrefix: "pay-anyone-card", size: "1:1 square, 1024px",
    text: "A warm aerial scene of a person on a sunlit rooftop tapping a phone, a soft golden arc of light arcing from the phone across a hazy global skyline of distant cities at dawn. Sky + coral accent. One floating coin glints mid-arc. Dawn warmth, calm motion, no banks visible, no readable text." },
  { label: "Merchant card · earn / trade", group: "Merchant card", filenamePrefix: "earn-trade-card", size: "1:1 square, 1024px",
    text: "A friendly liquidity-provider character at a glass dashboard, soft gold coins gently rising from the screen like bubbles in warm light, a single line chart climbing in the background. Cream and gold palette, calm posture, one focal stack of three coins floating mid-air. No readable text." },

  // ── Feature / use-case cards (UseCasesSection, WhyBlipForUsers, MerchantBenefitsGrid) ──
  { label: "Feature card · icon-only", group: "Feature card", filenamePrefix: "feature-icon", size: "1:1 square, 1024px",
    text: "A minimal flat editorial illustration of a single iconic object (e.g. coin, shield, lock, lightning) centered on a soft cream gradient background. Apple App Store / Stripe product-icon style. Generous breathing room, one Claude-orange (#cc785c) accent, no people, no readable text, no banks." },
  { label: "Feature card · scene with character", group: "Feature card", filenamePrefix: "feature-scene", size: "16:10 landscape, 1280px",
    text: "Wide painterly editorial scene in the style of Uber/Apple landing-page art. One friendly character with a visible smile interacting with a single focal product element. Warm cream backdrop, one Claude-orange (#cc785c) accent, soft cinematic light, generous breathing room. No readable text, no logos, no banks." },

  // ── Dashboard widget / app UI mockups (HeroDashboardVisual, MerchantHeroDashboard) ──
  { label: "Dashboard widget", group: "App / dashboard UI", filenamePrefix: "dashboard-widget", size: "1:1 square, 1024px",
    text: "A polished photorealistic 3D-render of a single clean white floating dashboard widget card with soft rounded corners, tilted slightly in 3D on a clean soft-grey gradient backdrop. Inside the widget: a pulsing warm Claude-orange (#cc785c) dot, label 'BLIP · LIVE', small avatar circle with initials 'AW', bold name 'Alex Wei', monospace number '$250.00'. App Store hero shot quality." },
  { label: "Apple Wallet pass", group: "App / dashboard UI", filenamePrefix: "wallet-pass", size: "1:1 square, 1024px",
    text: "A photorealistic 3D-render of a single Apple-Wallet-style pass card tilted in 3D, dark background with warm Claude-orange (#cc785c) accent strip, 'BLIP · WALLET' header, big italic-serif '0%', barcode strip at the bottom, soft drop shadow." },
  { label: "Phone mockup · app screen", group: "App / dashboard UI", filenamePrefix: "app-phone", size: "1:1 square, 1024px",
    text: "Photorealistic 3D-render of a modern smartphone tilted in 3/4 view, screen showing a clean fintech UI with warm Claude-orange (#cc785c) accent, mono numbers, italic serif headline, soft cream surrounding. App Store hero shot quality." },

  // ── Character portraits (10 archetypes per CHARACTERS.md) ──
  { label: "Character · male portrait", group: "Character", filenamePrefix: "char-m", size: "1:1 square, 1024px",
    text: "A friendly male cartoon character portrait, 3/4 body, centered with 10-15% breathing room, on a soft warm cream gradient background. Visible smile and eyes. Flat editorial style in the lineage of Uber/Apple landing art. One Claude-orange (#cc785c) accent on clothing. No readable text or logos." },
  { label: "Character · female portrait", group: "Character", filenamePrefix: "char-f", size: "1:1 square, 1024px",
    text: "A friendly female cartoon character portrait, 3/4 body, centered with 10-15% breathing room, on a soft warm cream gradient background. Visible smile and eyes. Flat editorial style in the lineage of Uber/Apple landing art. One Claude-orange (#cc785c) accent on clothing. No readable text or logos." },

  // ── Editorial wide scenes (hero-vibe, full-bleed banners) ──
  { label: "Editorial · wide cover scene", group: "Editorial scene", filenamePrefix: "hero-vibe", size: "16:10 landscape, 1280px",
    text: "Wide editorial cover scene: three friends from different cities walking toward a shared warm horizon, soft golden arcs of light connecting each of their phones into the center of the frame, hopeful warm-cream sky. One small floating coin per arc. Painterly editorial flat illustration. Premium, calm, no banks, no readable text." },
];

const GROUPS = Array.from(new Set(PRESETS.map((p) => p.group)));

export function CardGeneratorPanel({ onGenerated }: { onGenerated?: () => void } = {}) {
  const [group, setGroup] = useState<string>(PRESETS[0].group);
  const [presetIdx, setPresetIdx] = useState<number>(0);
  const groupPresets = PRESETS.filter((p) => p.group === group);
  const current = groupPresets[presetIdx] ?? groupPresets[0];
  const [filename, setFilename] = useState<string>(current.filenamePrefix);
  const [prompt, setPrompt] = useState<string>(current.text);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ path: string; filename: string; bytes: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { add } = useGeneratedCards();

  const applyPreset = (p: Preset) => {
    setPrompt(p.text);
    setFilename(p.filenamePrefix);
  };

  const run = async () => {
    setBusy(true); setError(null); setResult(null);
    try {
      const res = await fetch("/__dev_generate_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, filename }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const card = { path: data.path, filename: data.filename, bytes: data.bytes, prompt, createdAt: Date.now() };
      setResult(card);
      add(card);
      onGenerated?.();
    } catch (e) {
      setError((e as Error).message);
    } finally { setBusy(false); }
  };

  const isDev = import.meta.env.DEV;

  return (
    <div className="space-y-3">
      {!isDev && (
        <div className="rounded-md border border-[#ff7a3d]/30 bg-[#ff7a3d]/[0.08] px-3 py-2 text-[11px] text-white/85">
          <span className="font-bold">Dev-only.</span> Card generation runs through the local Vite dev server. To create new cards, pull this repo, run <code className="text-white">npm run dev</code> in <code className="text-white">blip-protocol-ui/</code>, open <code className="text-white">localhost:8082/admin</code>, generate, then commit the new PNG and push.
        </div>
      )}
      <div>
        <label className="text-[10.5px] font-semibold text-white/65 block mb-1">Card type</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {GROUPS.map((g) => (
            <button type="button" key={g} onClick={() => { setGroup(g); setPresetIdx(0); const p = PRESETS.find((x) => x.group === g)!; applyPreset(p); }}
              className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                group === g ? "bg-white text-black" : "bg-white/5 hover:bg-white/10 text-white/70"
              }`}>{g}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {groupPresets.map((p, i) => (
            <button type="button" key={p.label} onClick={() => { setPresetIdx(i); applyPreset(p); }}
              className={`text-[10.5px] font-semibold px-2 py-1 rounded-md ${
                p === current ? "bg-[#ff7a3d]/20 text-white border border-[#ff7a3d]/40" : "bg-white/5 hover:bg-white/10 text-white/70"
              }`}>{p.label}</button>
          ))}
        </div>
        <div className="text-[10px] text-white/45 mt-1.5">Suggested size: {current.size}</div>
      </div>
      <div>
        <label className="text-[10.5px] font-semibold text-white/65 block mb-1">Filename (no extension)</label>
        <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[12px] text-white/90 font-mono" />
      </div>
      <div>
        <label className="text-[10.5px] font-semibold text-white/65 block mb-1">Prompt</label>
        <textarea value={prompt} rows={8} onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[11.5px] text-white/90 focus:outline-none focus:border-white/30"
          style={{ resize: "vertical" }} />
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button onClick={run} disabled={busy}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-white text-black text-[12.5px] font-semibold tracking-tight disabled:opacity-50">
          {busy ? "Generating…" : "Generate via Gemini"}
        </button>
        {error && <span className="text-[11px] text-[#ff5d8f]">{error}</span>}
      </div>
      {result && (
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3 flex items-start gap-3">
          <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-black/40 border border-white/10">
            <img src={result.path} alt={result.filename} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-bold text-white">{result.filename}</div>
            <div className="text-[10.5px] text-white/55 mt-0.5">{(result.bytes / 1024).toFixed(1)} KB · added to library</div>
            <code className="text-[10.5px] text-white/70 break-all block mt-1">{result.path.split("?")[0]}</code>
            <button onClick={() => navigator.clipboard.writeText(result.path.split("?")[0])}
              className="text-[10.5px] font-semibold mt-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white/85">
              Copy path
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
