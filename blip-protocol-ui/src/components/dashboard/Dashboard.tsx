import { useState } from "react";
import { Link } from "react-router-dom";
import { SECTIONS, type Section, type SectionField } from "./sectionRegistry";
import { useOverride, clearOverride, clearAllOverrides, listAllOverrides } from "@/hooks/useOverride";
import { useEditMode, setEditMode } from "./Editable";

const ACCENT = "#ff7a3d";

export function Dashboard() {
  const [tab, setTab] = useState<"home" | "merchant" | "user" | "cards" | "library">("home");
  const editMode = useEditMode();
  const overrideCount = listAllOverrides().length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur overflow-hidden mb-12">
      {/* Header */}
      <div className="px-4 sm:px-5 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
          <span className="text-[10px] font-bold tracking-[0.22em] text-white/75">
            SITE DASHBOARD · LIVE
          </span>
          {overrideCount > 0 && (
            <span className="text-[9.5px] font-bold tracking-[0.15em] px-1.5 py-0.5 rounded" style={{ background: `${ACCENT}22`, color: ACCENT }}>
              {overrideCount} OVERRIDE{overrideCount === 1 ? "" : "S"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-2 text-[11px] font-semibold text-white/70 cursor-pointer">
            <input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />
            Edit-in-place
          </label>
          <button
            onClick={() => {
              if (confirm("Reset ALL overrides on this device?")) clearAllOverrides();
            }}
            className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md text-white/70 hover:text-white border border-white/10 hover:bg-white/5"
          >
            Reset all
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        {([
          { id: "home", label: "Home" },
          { id: "merchant", label: "Merchant" },
          { id: "user", label: "User" },
          { id: "cards", label: "Card variants" },
          { id: "library", label: "Card generator" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-[11.5px] font-semibold tracking-tight whitespace-nowrap transition-colors"
            style={{
              color: tab === t.id ? "#fff" : "rgba(255,255,255,0.55)",
              borderBottom: tab === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
              background: tab === t.id ? "rgba(255,255,255,0.04)" : "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {(tab === "home" || tab === "merchant" || tab === "user") && (
          <PageEditor page={tab} />
        )}
        {tab === "cards" && <CardVariantsTab />}
        {tab === "library" && <CardGeneratorTab />}
      </div>
    </div>
  );
}

function PageEditor({ page }: { page: "home" | "merchant" | "user" }) {
  const sections = SECTIONS.filter((s) => s.page === page);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <span className="text-[10.5px] font-bold tracking-[0.18em] text-white/55">
          {sections.length} EDITABLE SECTION{sections.length === 1 ? "" : "S"}
        </span>
        <a
          href={page === "home" ? "/" : `/${page}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-semibold text-white/70 hover:text-white"
        >
          Open /{page === "home" ? "" : page} in new tab ↗
        </a>
      </div>
      {sections.map((s) => (
        <SectionCard key={s.id} section={s} />
      ))}
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <div>
          <div className="text-[11.5px] font-bold text-white">{section.label}</div>
          <div className="text-[10px] text-white/45 mt-0.5">{section.id}</div>
        </div>
        <span className="text-white/40 text-xs">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          {section.fields.map((f) => (
            <FieldEditor key={f.id} field={f} />
          ))}
        </div>
      )}
    </div>
  );
}

function FieldEditor({ field }: { field: SectionField }) {
  if (field.kind === "text") return <TextField field={field} />;
  if (field.kind === "image") return <ImageField field={field} />;
  return <VariantField field={field} />;
}

function TextField({ field }: { field: Extract<SectionField, { kind: "text" }> }) {
  const [value, setValue] = useOverride<string>(`text:${field.id}`, field.default);
  const isOverridden = value !== field.default;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10.5px] font-semibold text-white/65">{field.label}</label>
        {isOverridden && (
          <button
            className="text-[9.5px] font-semibold text-white/45 hover:text-white"
            onClick={() => clearOverride(`text:${field.id}`)}
          >
            Reset
          </button>
        )}
      </div>
      {field.multiline ? (
        <textarea
          value={value}
          rows={2}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[12px] text-white/90 focus:outline-none focus:border-white/30"
          style={{ resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[12px] text-white/90 focus:outline-none focus:border-white/30"
        />
      )}
    </div>
  );
}

function ImageField({ field }: { field: Extract<SectionField, { kind: "image" }> }) {
  const [url, setUrl] = useOverride<string>(`image:${field.id}`, field.default);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOverridden = url !== field.default;

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("id", field.id);
      const res = await fetch("/__dev_upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "upload failed");
      setUrl(data.path);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10.5px] font-semibold text-white/65">{field.label}</label>
        {isOverridden && (
          <button
            className="text-[9.5px] font-semibold text-white/45 hover:text-white"
            onClick={() => clearOverride(`image:${field.id}`)}
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex gap-3 items-start">
        <div
          className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-black/40 border border-white/10"
        >
          <img src={url} alt={field.label} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/illustrations/your-image.png"
            className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[11px] text-white/90 font-mono focus:outline-none focus:border-white/30 mb-2"
          />
          <label className="block">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              className="block w-full text-[10.5px] text-white/80 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-white file:text-black"
            />
          </label>
          {uploading && <div className="text-[10.5px] text-white/55 mt-1.5">Uploading…</div>}
          {error && <div className="text-[10.5px] text-[#ff5d8f] mt-1.5">{error}</div>}
        </div>
      </div>
    </div>
  );
}

function VariantField({ field }: { field: Extract<SectionField, { kind: "variant" }> }) {
  const [value, setValue] = useOverride<string>(field.id, field.default);
  return (
    <div>
      <label className="text-[10.5px] font-semibold text-white/65 block mb-1">{field.label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[12px] text-white/90 focus:outline-none focus:border-white/30"
      >
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CardVariantsTab() {
  const variantField = SECTIONS.find((s) => s.id === "home.merchant-section")?.fields.find(
    (f) => f.kind === "variant",
  ) as Extract<SectionField, { kind: "variant" }> | undefined;
  const [variant, setVariant] = useOverride<string>(
    variantField?.id ?? "blip:merchant-cards-variant",
    variantField?.default ?? "mixed",
  );
  return (
    <div>
      <p className="text-[11.5px] text-white/65 mb-4 leading-relaxed">
        Pick which card set renders inside the homepage <em>"Merchants provide liquidity"</em> section.
        Selection persists and applies live to <Link to="/" className="underline text-white">/</Link>.
      </p>
      <div className="flex flex-wrap gap-2">
        {variantField?.options.map((o) => {
          const active = o.value === variant;
          return (
            <button
              key={o.value}
              onClick={() => setVariant(o.value)}
              className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-tight transition-all"
              style={{
                background: active ? "#fff" : "rgba(255,255,255,0.06)",
                color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)",
                border: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {active ? "✓ " : ""}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardGeneratorTab() {
  const [filename, setFilename] = useState("custom-card");
  const [prompt, setPrompt] = useState(
    "A polished photorealistic 3D-render of a single clean white floating dashboard widget card with soft rounded corners, tilted slightly in 3D space on a clean soft-grey gradient backdrop. Inside the widget: a pulsing warm-orange dot, the label 'BLIP · LIVE', a small avatar circle with initials 'AW', the bold name 'Alex Wei', and on the line beneath the monospace number '$250.00'. 1:1 square, App Store hero shot quality.",
  );
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ path: string; filename: string; bytes: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/__dev_generate_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, filename }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult({ path: data.path, filename: data.filename, bytes: data.bytes });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[11.5px] text-white/65 leading-relaxed mb-2">
        Generate a new card image via Gemini and save it to{" "}
        <code className="text-white/80">public/illustrations/</code>. Then paste the path
        into any image field above to use it.
      </p>
      <div>
        <label className="text-[10.5px] font-semibold text-white/65 block mb-1">Filename (no extension)</label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[12px] text-white/90 font-mono"
        />
      </div>
      <div>
        <label className="text-[10.5px] font-semibold text-white/65 block mb-1">Prompt</label>
        <textarea
          value={prompt}
          rows={8}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10 text-[11.5px] text-white/90 focus:outline-none focus:border-white/30"
          style={{ resize: "vertical" }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Dashboard widget", text: "A polished photorealistic 3D-render of a single clean white floating dashboard widget card with soft rounded corners, tilted slightly in 3D space on a clean soft-grey gradient backdrop. Inside the widget: a pulsing warm-orange dot, label 'BLIP · LIVE', small avatar circle with initials 'AW', bold name 'Alex Wei', and beneath in monospace '$250.00'. 1:1 square." },
          { label: "Apple Wallet pass", text: "A photorealistic 3D-render of a single Apple-Wallet-style pass card tilted in 3D, dark background with warm-orange accent strip, 'BLIP · WALLET' header, big italic-serif '0%', barcode strip at the bottom, soft drop shadow. 1:1 square." },
          { label: "Phone mockup", text: "Photorealistic 3D-render of a modern smartphone tilted in 3/4 view, screen showing a clean fintech UI with warm-orange #cc785c accent, mono numbers, italic serif headline. 1:1 square, App Store hero shot quality." },
          { label: "Editorial scene", text: "Wide painterly editorial illustration in the style of Uber/Apple landing-page art. A single character from 3/4 BACK (no face) interacting with the scene. Warm cinematic light, generous depth. 16:10 aspect, no readable text." },
        ].map((p) => (
          <button
            key={p.label}
            onClick={() => setPrompt(p.text)}
            className="text-[10.5px] font-semibold px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={run}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-white text-black text-[12.5px] font-semibold tracking-tight disabled:opacity-50"
        >
          {busy ? "Generating…" : "Generate via Gemini"}
        </button>
        {error && <span className="text-[11px] text-[#ff5d8f]">{error}</span>}
      </div>
      {result && (
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3 flex items-start gap-3">
          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-black/40 border border-white/10">
            <img src={result.path} alt={result.filename} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-bold text-white">{result.filename}</div>
            <div className="text-[10.5px] text-white/55 mt-0.5">{(result.bytes / 1024).toFixed(1)} KB</div>
            <code className="text-[10.5px] text-white/70 break-all block mt-1">{result.path.split("?")[0]}</code>
            <button
              onClick={() => navigator.clipboard.writeText(result.path.split("?")[0])}
              className="text-[10.5px] font-semibold mt-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white/85"
            >
              Copy path
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
