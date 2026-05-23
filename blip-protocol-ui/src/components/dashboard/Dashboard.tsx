import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SECTIONS, type Section, type SectionField } from "./sectionRegistry";
import { useOverride, clearOverride, clearAllOverrides, listAllOverrides } from "@/hooks/useOverride";
import { useEditMode, setEditMode } from "./Editable";
import { CardGeneratorPanel } from "./CardGeneratorPanel";
import { useGeneratedCards } from "@/hooks/useGeneratedCards";
import { AssetLibraryTab } from "./AssetLibrary";

const ACCENT = "#ff7a3d";
const PAGES = [
  { id: "home" as const, label: "Home", path: "/" },
  { id: "merchant" as const, label: "Merchant", path: "/merchant" },
  { id: "user" as const, label: "User", path: "/user" },
];

type Tab = "home" | "merchant" | "user" | "cards" | "library" | "assets" | "generator";

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("home");
  const editMode = useEditMode();
  const overrideCount = listAllOverrides().length;
  const { cards } = useGeneratedCards();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur overflow-hidden mb-12">
      <div className="px-4 sm:px-5 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
          <span className="text-[10px] font-bold tracking-[0.22em] text-white/75">SITE DASHBOARD · LIVE</span>
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
            onClick={() => { if (confirm("Reset ALL overrides on this device?")) clearAllOverrides(); }}
            className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md text-white/70 hover:text-white border border-white/10 hover:bg-white/5"
          >Reset all</button>
        </div>
      </div>

      <div className="flex border-b border-white/10 overflow-x-auto">
        {([
          { id: "home", label: "Home" },
          { id: "merchant", label: "Merchant" },
          { id: "user", label: "User" },
          { id: "cards", label: "Card variants" },
          { id: "library", label: `Generated${cards.length ? ` · ${cards.length}` : ""}` },
          { id: "assets", label: "Asset library" },
          { id: "generator", label: "Card generator" },
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
          >{t.label}</button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {(tab === "home" || tab === "merchant" || tab === "user") && <PageEditor page={tab} />}
        {tab === "cards" && <CardVariantsTab />}
        {tab === "library" && <CardLibraryTab />}
        {tab === "assets" && <AssetLibraryTab />}
        {tab === "generator" && <GeneratorTab />}
      </div>
    </div>
  );
}

function PageEditor({ page }: { page: "home" | "merchant" | "user" }) {
  const sections = SECTIONS.filter((s) => s.page === page);
  const pageMeta = PAGES.find((p) => p.id === page)!;
  const [refreshKey, setRefreshKey] = useState(0);
  const [savedFlash, setSavedFlash] = useState(false);

  // Auto-refresh the iframe whenever ANY override changes
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const bump = () => {
      setSavedFlash(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setRefreshKey((k) => k + 1);
        setSavedFlash(false);
      }, 600);
    };
    window.addEventListener("blip:override-changed", bump);
    return () => {
      window.removeEventListener("blip:override-changed", bump);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-bold tracking-[0.18em] text-white/55">
            {sections.length} EDITABLE SECTION{sections.length === 1 ? "" : "S"} ON <span className="text-white/80">{pageMeta.path}</span>
          </span>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="text-[10px] font-semibold text-white/55 hover:text-white px-1.5 py-0.5 rounded border border-white/10"
            title="Refresh preview"
          >↻ Refresh preview</button>
          <span
            className="text-[10px] font-bold tracking-[0.15em] px-1.5 py-0.5 rounded transition-opacity"
            style={{ background: "rgba(110,224,197,0.18)", color: "#6ee0c5", opacity: savedFlash ? 1 : 0 }}
          >✓ SAVED · APPLYING</span>
        </div>
        <a href={pageMeta.path} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-white/70 hover:text-white">
          Open {pageMeta.path} in new tab ↗
        </a>
      </div>
      <div className="text-[10.5px] text-white/45 mb-3">
        Edits save automatically and apply live. Fields only appear here if the
        page renders them via <code className="text-white/65">EditableText</code> — text on the page that's still hard-coded won't show up; tell me which one and I'll wire it.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black" style={{ minHeight: 560 }}>
          <iframe
            key={refreshKey}
            src={pageMeta.path}
            title={`${pageMeta.label} preview`}
            className="absolute inset-0 w-full h-full"
            style={{ background: "white" }}
          />
        </div>

        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {sections.map((s) => <SectionCard key={s.id} section={s} />)}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] overflow-hidden">
      <button className="w-full flex items-center justify-between px-3.5 py-2.5 text-left" onClick={() => setOpen(!open)}>
        <div>
          <div className="text-[11.5px] font-bold text-white">{section.label}</div>
          <div className="text-[9.5px] text-white/45 mt-0.5">{section.id}</div>
        </div>
        <span className="text-white/40 text-xs">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="px-3.5 pb-3.5 space-y-2.5 border-t border-white/5 pt-2.5">
          {section.fields.map((f) => <FieldEditor key={f.id} field={f} />)}
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
  const overridden = value !== field.default;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-semibold text-white/65">{field.label}</label>
        {overridden && <button className="text-[9px] font-semibold text-white/45 hover:text-white" onClick={() => clearOverride(`text:${field.id}`)}>Reset</button>}
      </div>
      {field.multiline ? (
        <textarea value={value} rows={2} onChange={(e) => setValue(e.target.value)}
          className="w-full px-2 py-1.5 rounded-md bg-black/40 border border-white/10 text-[11.5px] text-white/90 focus:outline-none focus:border-white/30" style={{ resize: "vertical" }} />
      ) : (
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
          className="w-full px-2 py-1.5 rounded-md bg-black/40 border border-white/10 text-[11.5px] text-white/90 focus:outline-none focus:border-white/30" />
      )}
    </div>
  );
}

function ImageField({ field }: { field: Extract<SectionField, { kind: "image" }> }) {
  const [url, setUrl] = useOverride<string>(`image:${field.id}`, field.default);
  const { cards } = useGeneratedCards();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overridden = url !== field.default;

  const upload = async (file: File) => {
    setUploading(true); setError(null);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("id", field.id);
      const res = await fetch("/__dev_upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "upload failed");
      setUrl(data.path);
    } catch (e) { setError((e as Error).message); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-semibold text-white/65">{field.label}</label>
        {overridden && <button className="text-[9px] font-semibold text-white/45 hover:text-white" onClick={() => clearOverride(`image:${field.id}`)}>Reset</button>}
      </div>
      <div className="flex gap-2.5 items-start">
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-black/40 border border-white/10">
          <img src={url} alt={field.label} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="/illustrations/your-image.png"
            className="w-full px-2 py-1.5 rounded-md bg-black/40 border border-white/10 text-[10.5px] text-white/90 font-mono mb-2" />
          <label className="block">
            <input type="file" accept="image/*" disabled={uploading}
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              className="block w-full text-[10px] text-white/80 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-white file:text-black" />
          </label>
          {uploading && <div className="text-[10px] text-white/55 mt-1">Uploading…</div>}
          {error && <div className="text-[10px] text-[#ff5d8f] mt-1">{error}</div>}
          {cards.length > 0 && (
            <div className="mt-2">
              <div className="text-[9px] font-semibold tracking-[0.15em] text-white/45 mb-1">FROM LIBRARY</div>
              <div className="flex gap-1.5 flex-wrap">
                {cards.slice(0, 6).map((c) => (
                  <button key={c.filename} onClick={() => setUrl(c.path)} className="w-9 h-9 rounded overflow-hidden bg-black/40 border border-white/10 hover:border-white/40" title={c.filename}>
                    <img src={c.path} alt={c.filename} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VariantField({ field }: { field: Extract<SectionField, { kind: "variant" }> }) {
  const [value, setValue] = useOverride<string>(field.id, field.default);
  return (
    <div>
      <label className="text-[10px] font-semibold text-white/65 block mb-1">{field.label}</label>
      <select value={value} onChange={(e) => setValue(e.target.value)}
        className="w-full px-2 py-1.5 rounded-md bg-black/40 border border-white/10 text-[11.5px] text-white/90">
        {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function CardVariantsTab() {
  const variantField = SECTIONS.find((s) => s.id === "home.merchant-section")?.fields.find((f) => f.kind === "variant") as Extract<SectionField, { kind: "variant" }> | undefined;
  const [variant, setVariant] = useOverride<string>(variantField?.id ?? "blip:merchant-cards-variant", variantField?.default ?? "mixed");
  return (
    <div>
      <p className="text-[11.5px] text-white/65 mb-4 leading-relaxed">
        Pick which card set renders inside the homepage <em>"Merchants provide liquidity"</em> section.
        Applies live to <Link to="/" className="underline text-white">/</Link>.
      </p>
      <div className="flex flex-wrap gap-2">
        {variantField?.options.map((o) => {
          const active = o.value === variant;
          return (
            <button key={o.value} onClick={() => setVariant(o.value)}
              className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-tight transition-all"
              style={{ background: active ? "#fff" : "rgba(255,255,255,0.06)", color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)", border: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.1)"}` }}>
              {active ? "✓ " : ""}{o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardLibraryTab() {
  const { cards, remove, clear } = useGeneratedCards();
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-6 text-center">
        <p className="text-[12.5px] text-white/65 mb-3">No generated cards yet.</p>
        <button onClick={() => window.open("/card-creator", "blip-card-creator", "width=1240,height=900,resizable=yes")}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-white text-black text-[12px] font-semibold">
          Open card creator ↗
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="text-[10.5px] font-bold tracking-[0.18em] text-white/55">{cards.length} CARD{cards.length === 1 ? "" : "S"}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => window.open("/card-creator", "blip-card-creator", "width=1240,height=900,resizable=yes")}
            className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md bg-white text-black">Open creator ↗</button>
          <button onClick={() => { if (confirm("Clear library? (Files on disk are NOT deleted.)")) clear(); }}
            className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md text-white/70 hover:text-white border border-white/10">Clear library</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.filename} className="rounded-xl border border-white/10 bg-white/[0.025] overflow-hidden">
            <div className="aspect-square bg-black/40">
              <img src={c.path} alt={c.filename} className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5">
              <div className="text-[10.5px] font-bold text-white truncate" title={c.filename}>{c.filename}</div>
              <div className="text-[9.5px] text-white/45 mt-0.5">{(c.bytes / 1024).toFixed(1)} KB · {new Date(c.createdAt).toLocaleTimeString()}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <button onClick={() => navigator.clipboard.writeText(c.path.split("?")[0])}
                  className="flex-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white/85">Copy path</button>
                <button onClick={() => remove(c.filename)} title="Remove from library (file stays on disk)"
                  className="text-[10px] font-semibold px-2 py-1 rounded-md text-white/55 hover:text-[#ff5d8f]">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneratorTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <span className="text-[11.5px] text-white/65">
          Generate via Gemini. Saved to <code className="text-white/85">public/illustrations/</code> + added to your library.
        </span>
        <button
          onClick={() => window.open("/card-creator", "blip-card-creator", "width=1240,height=900,resizable=yes")}
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-white text-black text-[11.5px] font-semibold"
        >Open in new window ↗</button>
      </div>
      <CardGeneratorPanel />
    </div>
  );
}
