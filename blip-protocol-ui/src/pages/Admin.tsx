import { useState } from "react";
import { Link } from "react-router-dom";
import { Dashboard } from "@/components/dashboard/Dashboard";

const ADMIN_PASSWORD = "kalikalipassmanali2099";
const AUTH_KEY = "blip:admin-auth";

function AdminGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean>(() => typeof window !== "undefined" && window.localStorage.getItem(AUTH_KEY) === "1");
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  if (ok) return <>{children}</>;
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (val === ADMIN_PASSWORD) { window.localStorage.setItem(AUTH_KEY, "1"); setOk(true); }
          else { setErr(true); setVal(""); }
        }}
        className="w-full max-w-[360px] rounded-2xl border border-white/10 bg-white/[0.025] p-6"
      >
        <div className="text-[11px] font-bold tracking-[0.24em] text-white/55 mb-1">BLIP · ADMIN</div>
        <div className="text-[18px] font-bold tracking-tight mb-4">Enter password</div>
        <input
          type="password"
          autoFocus
          value={val}
          onChange={(e) => { setVal(e.target.value); setErr(false); }}
          className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13px] text-white focus:outline-none focus:border-white/40"
          placeholder="Password"
        />
        {err && <div className="text-[11px] text-[#ff5d8f] mt-2">Incorrect password</div>}
        <button type="submit" className="mt-3 w-full h-10 rounded-full bg-white text-black text-[12.5px] font-semibold">Unlock</button>
      </form>
    </main>
  );
}

export default function Admin() {
  return (
    <AdminGate>
      <AdminInner />
    </AdminGate>
  );
}

function AdminInner() {
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
