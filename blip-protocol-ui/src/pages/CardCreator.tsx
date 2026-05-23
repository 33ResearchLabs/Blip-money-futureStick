import { CardGeneratorPanel } from "@/components/dashboard/CardGeneratorPanel";
import { useGeneratedCards } from "@/hooks/useGeneratedCards";

export default function CardCreator() {
  const { cards, remove } = useGeneratedCards();
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a3d] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.22em] text-white/75">CARD CREATOR · GEMINI</span>
          </div>
          <a href="/admin" target="_blank" rel="noreferrer" className="text-[11.5px] text-white/65 hover:text-white">Open admin ↗</a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
          {/* Generator */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h1 className="font-display text-white mb-1" style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)", fontWeight: 600, letterSpacing: "-0.025em" }}>
              Create a card
            </h1>
            <p className="text-[12.5px] text-white/55 mb-4">
              Pick a preset or write your own prompt. The image is saved to{" "}
              <code className="text-white/80">public/illustrations/</code> and added to your library — usable everywhere in the admin.
            </p>
            <CardGeneratorPanel />
          </section>

          {/* Library */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11.5px] font-bold tracking-[0.22em] text-white/65">YOUR LIBRARY · {cards.length}</h2>
            </div>
            {cards.length === 0 ? (
              <div className="text-[12.5px] text-white/45 text-center py-12 border border-dashed border-white/10 rounded-xl">
                Generated cards will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[640px] overflow-y-auto pr-1">
                {cards.map((c) => (
                  <div key={c.filename} className="rounded-xl border border-white/10 bg-white/[0.025] overflow-hidden">
                    <div className="aspect-square bg-black/40">
                      <img src={c.path} alt={c.filename} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-white truncate" title={c.filename}>{c.filename}</div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <button onClick={() => navigator.clipboard.writeText(c.path.split("?")[0])}
                          className="flex-1 text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/15 text-white/85">Copy</button>
                        <button onClick={() => remove(c.filename)}
                          className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded text-white/55 hover:text-[#ff5d8f]">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
