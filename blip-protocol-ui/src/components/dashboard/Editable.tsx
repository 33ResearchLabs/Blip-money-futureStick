import { useEffect, useState } from "react";
import { useOverride, clearOverride } from "@/hooks/useOverride";

export function EditableText({
  id, default: defaultValue, as = "span", className, style, multiline = false,
}: {
  id: string; default: string; as?: keyof JSX.IntrinsicElements;
  className?: string; style?: React.CSSProperties; multiline?: boolean;
}) {
  const [value, setValue] = useOverride<string>(`text:${id}`, defaultValue);
  const editMode = useEditMode();
  const [editing, setEditing] = useState(false);
  const Tag = as as any;
  if (!editMode) return <Tag className={className} style={style}>{value}</Tag>;
  if (editing) {
    return (
      <textarea
        className={className}
        style={{ ...style, background: "rgba(255,122,61,0.08)", outline: "2px solid #ff7a3d", borderRadius: 4, resize: "vertical", minWidth: 240 }}
        autoFocus defaultValue={value} rows={multiline ? 3 : 1}
        onBlur={(e) => {
          const next = e.currentTarget.value;
          if (next !== defaultValue) setValue(next); else clearOverride(`text:${id}`);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (!multiline && e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
          if (e.key === "Escape") setEditing(false);
        }}
      />
    );
  }
  return (
    <Tag
      className={className}
      style={{
        ...style,
        outline: value !== defaultValue ? "1.5px dashed #ff7a3d" : "1.5px dashed rgba(255,122,61,0.25)",
        outlineOffset: 2, borderRadius: 2, cursor: "text",
      }}
      onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }}
      title={`text:${id} · click to edit`}
    >{value}</Tag>
  );
}

export function EditableImage({
  id, default: defaultUrl, alt, className, style, onError,
}: {
  id: string; default: string; alt: string;
  className?: string; style?: React.CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}) {
  const [url, setUrl] = useOverride<string>(`image:${id}`, defaultUrl);
  const editMode = useEditMode();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("id", id);
      const res = await fetch("/__dev_upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      setUrl(data.path);
      setOpen(false);
    } catch (e) {
      setError((e as Error).message);
    } finally { setUploading(false); }
  };

  return (
    <div className="relative inline-block w-full h-full">
      <img
        src={url} alt={alt} className={className}
        style={{
          ...style,
          outline: editMode ? (url !== defaultUrl ? "2px solid #ff7a3d" : "1.5px dashed rgba(255,122,61,0.3)") : undefined,
          outlineOffset: 2,
          cursor: editMode ? "pointer" : undefined,
        }}
        onClick={editMode ? () => setOpen(true) : undefined}
        onError={onError}
        title={editMode ? `image:${id} · click to replace` : undefined}
      />
      {editMode && open && (
        <div className="absolute z-50 top-2 left-2 bg-black/95 text-white rounded-xl p-3 backdrop-blur"
          style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", minWidth: 240 }}>
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[10px] font-bold tracking-[0.18em] text-white/70">IMAGE: {id}</span>
            <button className="text-white/60 hover:text-white text-xs" onClick={() => setOpen(false)}>✕</button>
          </div>
          <label className="block">
            <span className="text-[11px] text-white/70 block mb-1.5">Upload new image</span>
            <input type="file" accept="image/*" disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="block w-full text-[11px] text-white/85 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-white file:text-black" />
          </label>
          {error && <div className="text-[11px] text-[#ff5d8f] mt-2">{error}</div>}
          {uploading && <div className="text-[11px] text-white/60 mt-2">Uploading…</div>}
          <div className="flex items-center gap-2 mt-3">
            <button className="flex-1 text-[11px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/15"
              onClick={() => { clearOverride(`image:${id}`); setOpen(false); }}>
              Revert to default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function useEditMode(): boolean {
  const [on, setOn] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("blip:edit-mode") === "1");
  useEffect(() => {
    const onChange = () => setOn(window.localStorage.getItem("blip:edit-mode") === "1");
    window.addEventListener("storage", onChange);
    window.addEventListener("blip:edit-mode-changed", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("blip:edit-mode-changed", onChange);
    };
  }, []);
  return on;
}

export function setEditMode(on: boolean) {
  if (on) window.localStorage.setItem("blip:edit-mode", "1");
  else window.localStorage.removeItem("blip:edit-mode");
  window.dispatchEvent(new CustomEvent("blip:edit-mode-changed"));
}
