import { useEffect, useState } from "react";
import { useGeneratedCards } from "@/hooks/useGeneratedCards";

type Asset = { filename: string; path: string; bytes: number; mtime?: number; source: "generated" | "disk" };

export function useAssetLibrary() {
  const { cards } = useGeneratedCards();
  const [disk, setDisk] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/__dev_list_illustrations");
      const data = await res.json();
      if (data.ok) setDisk(data.files.map((f: any) => ({ ...f, source: "disk" as const })));
    } catch {
      // ignore — dev endpoint not available
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Merge: generated entries take priority by filename match
  const byName = new Map<string, Asset>();
  for (const d of disk) byName.set(d.filename, d);
  for (const c of cards) {
    const f = c.filename;
    byName.set(f, { filename: f, path: c.path, bytes: c.bytes, mtime: c.createdAt, source: "generated" });
  }
  const all = Array.from(byName.values()).sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
  const generated = all.filter((a) => a.source === "generated");
  const onDisk = all.filter((a) => a.source === "disk");
  return { all, generated, onDisk, loading, refresh };
}

export function AssetLibraryTab({ onPick }: { onPick?: (path: string) => void }) {
  const { all, generated, onDisk, loading, refresh } = useAssetLibrary();
  const [filter, setFilter] = useState<"all" | "generated" | "disk">("all");
  const [q, setQ] = useState("");
  const list = (filter === "generated" ? generated : filter === "disk" ? onDisk : all).filter((a) =>
    !q || a.filename.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10.5px] font-bold tracking-[0.18em] text-white/55">
            {all.length} ASSET{all.length === 1 ? "" : "S"} · {generated.length} GENERATED · {onDisk.length} ON DISK
          </span>
          <button onClick={refresh} className="text-[10px] font-semibold text-white/55 hover:text-white px-1.5 py-0.5 rounded border border-white/10">↻</button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…"
            className="px-2 py-1 rounded-md bg-black/40 border border-white/10 text-[11.5px] text-white/85 w-40" />
          {(["all", "generated", "disk"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-[10.5px] font-semibold px-2 py-1 rounded-md transition-all"
              style={{ background: filter === f ? "#fff" : "rgba(255,255,255,0.06)", color: filter === f ? "#0a0a0a" : "rgba(255,255,255,0.7)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      {loading && <div className="text-[11px] text-white/45 mb-2">Loading…</div>}
      {list.length === 0 ? (
        <div className="text-[12px] text-white/45 text-center py-8 border border-dashed border-white/10 rounded-xl">
          No assets match.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[700px] overflow-y-auto">
          {list.map((a) => (
            <div key={a.path} className="rounded-lg border border-white/10 bg-white/[0.025] overflow-hidden">
              <button
                onClick={() => onPick?.(a.path.split("?")[0])}
                className="aspect-square w-full bg-black/40 block relative group"
                title={onPick ? `Use ${a.filename}` : a.filename}
              >
                <img src={a.path} alt={a.filename} className="w-full h-full object-cover" />
                {a.source === "generated" && (
                  <span className="absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded bg-[#ff7a3d] text-black">NEW</span>
                )}
              </button>
              <div className="p-1.5">
                <div className="text-[9.5px] font-semibold text-white/85 truncate" title={a.filename}>{a.filename}</div>
                <div className="flex items-center gap-1 mt-1">
                  <button onClick={() => navigator.clipboard.writeText(a.path.split("?")[0])}
                    className="flex-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/15 text-white/85">Copy</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
