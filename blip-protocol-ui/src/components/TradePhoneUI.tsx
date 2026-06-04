import { memo } from "react";

/* ═══════════════════════════════════════════════════════════
   TradePhoneUI — iPhone mockup · P2P Trade USDT screen
   ═══════════════════════════════════════════════════════════ */

const TradePhoneUI = () => {
  return (
    <div className="relative w-full flex items-center justify-center pt-4 pb-2">
      {/* Phone frame */}
      <div
        className="relative mx-auto w-[232px] max-w-full aspect-[232/470] "
        
      >
        <img
          className="absolute inset-0  w-full rounded-[38px] object-cover"
          src="/screenshots/tradephoneUi.png"
          alt="P2P Trade USDT screen"
        />
      </div>

      {/* Glow under phone */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-8 rounded-full blur-2xl"
        style={{ background: "rgba(255,107,53,0.2)" }}
      />
    </div>
  );
};

export default memo(TradePhoneUI);
