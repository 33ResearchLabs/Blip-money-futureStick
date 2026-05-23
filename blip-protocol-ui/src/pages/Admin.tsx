import { Link } from "react-router-dom";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Admin() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{ background: "rgba(10,10,10,0.85)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-black text-[12px]">
              B
            </div>
            <div className="leading-tight">
              <div className="text-[12.5px] font-bold tracking-tight text-white">Blip Admin</div>
              <div className="text-[9px] font-bold tracking-[0.22em] text-white/45">SITE · CONTENT · CARDS</div>
            </div>
          </div>
          <nav className="flex items-center gap-3 flex-wrap">
            <a href="/" target="_blank" rel="noreferrer" className="text-[11.5px] font-semibold text-white/70 hover:text-white">Home ↗</a>
            <a href="/merchant" target="_blank" rel="noreferrer" className="text-[11.5px] font-semibold text-white/70 hover:text-white">Merchant ↗</a>
            <a href="/user" target="_blank" rel="noreferrer" className="text-[11.5px] font-semibold text-white/70 hover:text-white">User ↗</a>
            <button
              onClick={() => window.open("/card-creator", "blip-card-creator", "width=1240,height=900,resizable=yes")}
              className="text-[11.5px] font-semibold px-3 py-1 rounded-full bg-white text-black"
            >
              Card creator ↗
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
        <Dashboard />
        <p className="text-center text-[10.5px] text-white/35 mt-6">
          Looking for the old card preview gallery? <Link to="/card-preview" className="underline text-white/60">/card-preview</Link>
        </p>
      </div>
    </main>
  );
}
