import { useState } from "react";
import { useGeneratedCards } from "@/hooks/useGeneratedCards";

const PRESETS = [
  { label: "Dashboard widget", text: "A polished photorealistic 3D-render of a single clean white floating dashboard widget card with soft rounded corners, tilted slightly in 3D space on a clean soft-grey gradient backdrop. Inside the widget: a pulsing warm-orange dot, label 'BLIP · LIVE', small avatar circle with initials 'AW', bold name 'Alex Wei', monospace number '$250.00'. 1:1 square, App Store hero shot quality." },
  { label: "Apple Wallet pass", text: "A photorealistic 3D-render of a single Apple-Wallet-style pass card tilted in 3D, dark background with warm-orange accent strip, 'BLIP · WALLET' header, big italic-serif '0%', barcode strip at the bottom, soft drop shadow. 1:1 square." },
  { label: "Phone mockup", text: "Photorealistic 3D-render of a modern smartphone tilted in 3/4 view, screen showing a clean fintech UI with warm-orange #cc785c accent, mono numbers, italic serif headline. 1:1 square, App Store hero shot quality." },
  { label: "Editorial scene", text: "Wide painterly editorial illustration in the style of Uber/Apple landing-page art. A single character from 3/4 BACK (no face) interacting with the scene. Warm cinematic light, generous depth. 16:10 aspect, no readable text." },
  { label: "Icon · single object", text: "A minimal flat 3D-style illustration of a single object centered on a soft pastel gradient background. Apple App Store / Stripe product icon style. 1:1 square, generous breathing room, no people, no characters." },
  { label: "Character portrait", text: "A friendly cartoon character portrait, 3/4 body, on a soft warm gradient background. Flat editorial style in the style of Uber/Apple landing art. 1:1 square, visible smile, gentle painterly shading." },
];

export function CardGeneratorPanel({ onGenerated }: { onGenerated?: () => void } = {}) {
  const [filename, setFilename] = useState("custom-card");
  const [prompt, setPrompt] = useState(PRESETS[0].text);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ path: string; filename: string; bytes: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { add } = useGeneratedCards();

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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => setPrompt(p.text)}
            className="text-[10.5px] font-semibold px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70">
            {p.label}
          </button>
        ))}
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
