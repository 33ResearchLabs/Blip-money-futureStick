import { TrendingUp } from "lucide-react";
import { NeonRing } from "./NeonRing";

const PeopleBank = () => (
  <section
    id="peoplebank"
    className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-[#020202]"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center order-2 lg:order-1">
        <div
          className="relative w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] flex items-center justify-center [transform:rotateX(60deg)_rotateZ(-20deg)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <NeonRing size="100%" color="#2BFF88" duration={20} />
          <NeonRing size="70%" color="#FFD43B" duration={15} reverse />
          <NeonRing size="40%" color="#2BFF88" duration={10} />

          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-[#2BFF88] rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="absolute w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-[0_0_30px_#2BFF88]" />

          <div className="absolute inset-0 flex items-center justify-center [transform:rotateX(-60deg)]">
            <div className="flex flex-col items-center gap-1 animate-float">
              <div className="text-[#2BFF88] font-mono text-[10px] sm:text-xs">
                +12.4% APY
              </div>
              <div className="w-[1px] h-8 sm:h-10 bg-gradient-to-t from-[#2BFF88] to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-[#2BFF88]/20 bg-[#2BFF88]/5 mb-4 sm:mb-6">
          <TrendingUp className="w-3 h-3 sm:w-[14px] sm:h-[14px] text-[#2BFF88]" />
          <span className="text-[10px] sm:text-xs font-bold text-[#2BFF88] uppercase tracking-wider">
            Earn While You Sleep
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
          PeopleBank Liquidity
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 font-light">
          Be the bank. Deposit USDC/USDT into liquidity pools to facilitate
          instant transfers and earn yield from transaction volume.
        </p>

        <div className="space-y-3 sm:space-y-4">
          {[
            {
              label: "Total Value Locked",
              val: "$142.5M",
              color: "text-white",
            },
            { label: "24h Volume", val: "$2.1B", color: "text-white" },
            { label: "Current APY", val: "12.4%", color: "text-[#2BFF88]" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-gray-400 text-sm sm:text-base">
                {stat.label}
              </span>
              <span
                className={`text-lg sm:text-xl font-mono font-bold ${stat.color}`}
              >
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
