export const CinematicCard = ({
  title,
  subtitle,
  icon: Icon,
  delay,
  active,
}) => (
  <div
    className={`
      relative group h-80 overflow-hidden rounded-2xl bg-[#080808] border transition-all duration-500 flex flex-col justify-between p-8
      ${
        active
          ? "border-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.15)]"
          : "border-white/5 hover:border-[#00FF94] hover:shadow-[0_0_30px_rgba(0,255,148,0.15)]"
      }
    `}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background Glow */}
    <div
      className={`absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${
        active ? "opacity-100" : "group-hover:opacity-100"
      }`}
    />

    {/* Top Row: Icon and Badge */}
    <div className="relative z-10 flex justify-between items-start">
      <div
        className={`
        w-12 h-12 rounded-xl bg-[#111] border flex items-center justify-center transition-all duration-300
        ${
          active
            ? "text-[#00FF94] border-[#00FF94] shadow-[0_0_15px_rgba(0,255,148,0.3)]"
            : "text-white border-white/10 group-hover:text-[#00FF94] group-hover:border-[#00FF94] group-hover:shadow-[0_0_15px_rgba(0,255,148,0.3)]"
        }
      `}
      >
        <Icon size={20} />
      </div>

      <div
        className={`
        px-3 py-1 rounded bg-[#00FF94]/10 border border-[#00FF94]/30 text-[#00FF94] text-[10px] font-mono font-bold tracking-widest uppercase transition-opacity duration-300
        ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
      >
        Settlement: 40ms
      </div>
    </div>

    {/* Bottom Row: Content */}
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
        {title}
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <div
          className={`h-[1px] w-6 transition-colors duration-300 ${
            active ? "bg-[#00FF94]" : "bg-gray-600 group-hover:bg-[#00FF94]"
          }`}
        />
        <span
          className={`text-xs font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${
            active
              ? "text-[#00FF94]"
              : "text-gray-500 group-hover:text-[#00FF94]"
          }`}
        >
          {subtitle}
        </span>
      </div>

      <p className="text-sm text-gray-500 font-light leading-relaxed">
        You pay in digital value.
        <br />
        They receive instantly.
      </p>
    </div>
  </div>
);
