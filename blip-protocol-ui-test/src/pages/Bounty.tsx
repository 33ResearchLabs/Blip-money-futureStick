import React, { useState } from "react";

const ALLOCATION = [
  { label: "Content Creation", value: "25%" },
  { label: "Video Creation", value: "25%" },
  { label: "Social Media", value: "15%" },
  { label: "Developer Tools", value: "15%" },
  { label: "Community Mods", value: "10%" },
  { label: "Research", value: "10%" },
];

const RULES = [
  "No plagiarism or stolen assets.",
  "Synthetic engagement is monitored.",
  "Proof of work must be verifiable.",
];

const TRACKS = [
  {
    pill: "Creators",
    title: "Media Tracks",
    desc: "Professional editorial and video production.",
    items: [
      { label: "Research Article", points: "+1,200" },
      { label: "Educational Video", points: "+1,500" },
      { label: "Technical Mirror", points: "+2,500" },
    ],
  },
  {
    pill: "Evangelists",
    title: "Growth Tracks",
    desc: "Amplification and network governance.",
    items: [
      { label: "Alpha Thread", points: "+400" },
      { label: "Infographic Pack", points: "+800" },
      { label: "Regional Leader", points: "+5,000" },
    ],
  },
  {
    pill: "Builders",
    title: "Technical Tracks",
    desc: "Infrastructure and settlement tools.",
    items: [
      { label: "SDK Integration", points: "+4,000" },
      { label: "Payment Bridge", points: "+12,000" },
      { label: "Ecosystem Tool", points: "+20,000" },
    ],
  },
];

const PillLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-3 py-1 rounded-full border border-black/10 dark:border-[#222] text-[10px] font-bold text-black/50 dark:text-[#888] uppercase tracking-[0.1em] mb-4 bg-black/[0.02] dark:bg-white/[0.02]">
    {children}
  </span>
);

const NeonPill = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-[#00ff9c]/5 text-[#00ff9c] border border-[#00ff9c]/15 text-[10px] px-2 py-0.5 rounded font-semibold">
    {children}
  </span>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black/[0.03] dark:bg-[rgba(26,26,26,0.5)] border border-black/10 dark:border-[#222] rounded-xl p-4 flex items-center justify-between hover:bg-black/[0.05] dark:hover:bg-[rgba(35,35,35,0.6)] transition-colors">
    {children}
  </div>
);

const BountyCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/70 dark:bg-[rgba(17,17,17,0.7)] border border-black/10 dark:border-[#222] rounded-3xl p-8 backdrop-blur-[12px] relative overflow-hidden hover:border-black/20 dark:hover:border-[#333] hover:-translate-y-0.5 transition-all group ${className}`}
  >
    {/* Shimmer sweep */}
    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.03)_50%,transparent_55%)] animate-[sweep_8s_infinite_linear] pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

export default function Bounty() {
  const [wallet, setWallet] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen bg-[#FAF8F5] dark:bg-black text-black dark:text-white selection:bg-black/20 dark:selection:bg-white/20 overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes sweep {
          0% { transform: translate(-30%, -30%) rotate(0deg); }
          100% { transform: translate(30%, 30%) rotate(0deg); }
        }
      `}</style>

      {/* Ambient spotlight */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.02)_0%,transparent_70%)] pointer-events-none z-0 block dark:hidden" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none z-0 hidden dark:block" />

      {/* Navigation */}
      {/* <nav className="relative z-10 max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-3.5 h-3.5 bg-black rounded-sm rotate-45" />
          </div>
          <span className="text-lg font-bold tracking-tighter">Blip</span>
        </div>
        <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-[#555]">
          <a href="#" className="hover:text-white transition-colors">Ecosystem</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <a href="#" className="text-white border-b border-white/20 pb-1">Bounty</a>
        </div>
      </nav> */}

      {/* Hero */}
      <header className="relative z-10 max-w-5xl mx-auto px-8 pt-24 pb-32 text-center">
        <PillLabel>Open Contribution</PillLabel>
        <h1 className="text-6xl md:text-[100px] font-bold tracking-[-0.05em] leading-[1.05] bg-gradient-to-b from-black via-black to-black/50 dark:from-white/100 dark:via-white/100 dark:to-[#888] bg-clip-text text-transparent mb-8">
          Contribute. Create.
          <br />
          Earn BLIP.
        </h1>
        <p className="text-lg md:text-xl text-black/50 dark:text-[#777] mb-12 max-w-2xl mx-auto leading-relaxed">
          Support the growth of the decentralized payment infrastructure.
          Complete verified tasks, accumulate points, and redeem for BLIP at
          TGE.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-black border border-black/10 font-semibold py-3.5 px-7 rounded-full transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]">
            Join Bounty Program
          </button>
          <button className="bg-black text-white border border-black font-semibold py-3.5 px-7 rounded-full transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-gray-900 hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] active:scale-[0.98]">
            Submit Contribution
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pb-40 space-y-32">
        {/* Allocation & Rules */}
        <section className="grid lg:grid-cols-3 gap-6">
          <BountyCard className="lg:col-span-2">
            <PillLabel>Allocation</PillLabel>
            <h3 className="text-3xl font-bold mb-8">Ecosystem Distribution</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {ALLOCATION.map((item) => (
                <ListItem key={item.label}>
                  <span className="text-sm">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </ListItem>
              ))}
            </div>
            <p className="text-[10px] text-black/30 dark:text-[#444] mt-6 font-bold uppercase tracking-widest">
              Global pool: 1-2% total supply
            </p>
          </BountyCard>

          <BountyCard>
            <PillLabel>Safety</PillLabel>
            <h3 className="text-2xl font-bold mb-6">Anti-Spam</h3>
            <div className="space-y-5">
              {RULES.map((rule, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mt-2 shrink-0" />
                  <p className="text-sm text-black/50 dark:text-[#777]">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </BountyCard>
        </section>

        {/* Tracks */}
        <section>
          <div className="text-center mb-16">
            <PillLabel>Opportunities</PillLabel>
            <h2
              style={{
                textAlign: "center",
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                marginBottom: 20,
              }}
              className="text-4xl font-bold tracking-tight"
            >
              Select your expertise.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {TRACKS.map((track) => (
              <BountyCard key={track.title}>
                <PillLabel>{track.pill}</PillLabel>
                <h3 className="text-2xl font-bold mb-2">{track.title}</h3>
                <p className="text-sm text-black/40 dark:text-[#666] mb-8">
                  {track.desc}
                </p>
                <div className="space-y-3">
                  {track.items.map((item) => (
                    <ListItem key={item.label}>
                      <span className="text-sm">{item.label}</span>
                      <NeonPill>{item.points}</NeonPill>
                    </ListItem>
                  ))}
                </div>
              </BountyCard>
            ))}
          </div>
        </section>

        {/* Rewards Display */}
        <section className="grid lg:grid-cols-2 gap-16 items-center py-20">
          <div>
            <PillLabel>Treasury</PillLabel>
            <h2 className="text-5xl font-bold mb-6 tracking-tight">
              Earn while you scale.
            </h2>
            <p className="text-black/50 dark:text-[#777] text-lg leading-relaxed mb-10">
              Points are settled on-chain every 24 hours. Your dashboard
              provides real-time visibility into your contribution weight within
              the global bounty pool.
            </p>
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-black dark:text-white group"
            >
              Reward Documentation{" "}
              <span className="inline-block group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </a>
          </div>

          <BountyCard>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9c] shadow-[0_0_8px_rgba(0,255,156,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555]">
                  Network Status: Live
                </span>
              </div>
            </div>

            <div className="bg-black/[0.03] dark:bg-[#080808] border border-black/10 dark:border-[#181818] rounded-2xl p-6">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className="text-[10px] text-black/30 dark:text-[#444] font-bold uppercase tracking-widest block mb-2">
                    Estimated Balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tighter">
                      4,820.00
                    </span>
                    <span className="text-black/30 dark:text-[#444] font-bold text-sm uppercase">
                      BLIP
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10">
                  <div className="w-4 h-4 bg-black/20 dark:bg-white/20 rounded-sm rotate-45" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-t border-black/5 dark:border-white/5">
                  <span className="text-xs text-black/40 dark:text-[#666]">
                    Dev: Settlement SDK
                  </span>
                  <span className="text-[#00ff9c] text-xs font-bold font-mono">
                    +4,000.00
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-black/5 dark:border-white/5">
                  <span className="text-xs text-black/40 dark:text-[#666]">
                    Social: Ecosystem Thread
                  </span>
                  <span className="text-[#00ff9c] text-xs font-bold font-mono">
                    +820.00
                  </span>
                </div>
              </div>
            </div>
          </BountyCard>
        </section>

        {/* Submission Form */}
        <section id="submit" className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Submit Contribution</h2>
          <p className="text-black/40 dark:text-[#666] mb-12">
            Submit your work for verification by the Blip Foundation.
          </p>
          <BountyCard className="text-left">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase text-black/30 dark:text-[#444] tracking-widest ml-1">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="bg-black/[0.03] dark:bg-[rgba(26,26,26,0.5)] border border-black/10 dark:border-[#222] text-black dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-black/30 dark:focus:border-[#555] focus:bg-black/[0.05] dark:focus:bg-[rgba(40,40,40,0.5)] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase text-black/30 dark:text-[#444] tracking-widest ml-1">
                    Resource Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="bg-black/[0.03] dark:bg-[rgba(26,26,26,0.5)] border border-black/10 dark:border-[#222] text-black dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-black/30 dark:focus:border-[#555] focus:bg-black/[0.05] dark:focus:bg-[rgba(40,40,40,0.5)] transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-black/30 dark:text-[#444] tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of impact..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-black/[0.03] dark:bg-[rgba(26,26,26,0.5)] border border-black/10 dark:border-[#222] text-black dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-black/30 dark:focus:border-[#555] focus:bg-black/[0.05] dark:focus:bg-[rgba(40,40,40,0.5)] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-black border border-black/10 font-semibold py-3.5 px-7 rounded-full mt-4 transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]"
              >
                Submit Work
              </button>
            </form>
          </BountyCard>
        </section>
      </main>

      {/* Footer */}
      {/* <footer className="relative z-10 border-t border-white/5 pt-24 pb-12 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm rotate-45" />
                </div>
                <span className="text-lg font-bold tracking-tighter">Blip</span>
              </div>
              <p className="text-[#444] text-sm leading-relaxed">
                Decentralized settlement layer for global peer-to-peer and
                merchant payments.
              </p>
            </div>
            <div className="flex gap-24">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase text-white tracking-widest">
                  Protocol
                </span>
                <a
                  href="#"
                  className="text-sm text-[#444] hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-sm text-[#444] hover:text-white transition-colors"
                >
                  Discord
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase text-white tracking-widest">
                  Build
                </span>
                <a
                  href="#"
                  className="text-sm text-[#444] hover:text-white transition-colors"
                >
                  Ecosystem
                </a>
                <a
                  href="#"
                  className="text-sm text-[#444] hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 text-[10px] font-bold text-[#222] uppercase tracking-[0.3em] gap-4">
            <span>&copy; 2024 Blip Foundation</span>
            <span>Privacy &bull; Terms of Participation</span>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
