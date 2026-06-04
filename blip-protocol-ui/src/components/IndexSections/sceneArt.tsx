/* Premium editorial scenes per claude_web_theme.md.
   White band, single Claude Orange accent, phone-mockup centerpiece
   with rich in-app UI + ambient illustrated accents.            */
import { motion } from "framer-motion";

const INK = "#0a0a0a";
const PAPER = "#ffffff";
const ACCENT = "#cc785c";
const HIGHLIGHT = "#ffb38a";

const EASE = [0.16, 1, 0.3, 1] as const;

export function IllustrationCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative rounded-3xl overflow-hidden w-full max-w-[540px] mx-auto"
      style={{
        background: PAPER,
        boxShadow:
          "0 60px 140px -30px rgba(80,40,20,0.35), 0 28px 70px -28px rgba(0,0,0,0.22)",
        aspectRatio: "1 / 1",
      }}
    >
      <div className="absolute inset-0">{children}</div>
    </motion.div>
  );
}

/* ─── Reusable phone-frame component inside SVG ─── */
type PhoneProps = { x: number; y: number; w?: number; rotate?: number; children: React.ReactNode };
function PhoneFrame({ x, y, w = 150, rotate = 0, children }: PhoneProps) {
  const h = w * 2.05;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {/* drop shadow */}
      <rect
        x={-w / 2 + 4}
        y={-h / 2 + 8}
        width={w}
        height={h}
        rx="22"
        fill={INK}
        opacity="0.12"
        filter="url(#soft-shadow)"
      />
      {/* outer frame */}
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx="22"
        fill={INK}
      />
      {/* inner screen */}
      <rect
        x={-w / 2 + 4}
        y={-h / 2 + 4}
        width={w - 8}
        height={h - 8}
        rx="18"
        fill={PAPER}
      />
      {/* dynamic island */}
      <rect
        x={-18}
        y={-h / 2 + 9}
        width="36"
        height="9"
        rx="4.5"
        fill={INK}
      />
      {/* screen content */}
      {children}
    </g>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 1 — Pay anywhere instantly
   Phone showing send-flow + arc trail + plane + received toast
   ═══════════════════════════════════════════════ */
export function PaperPlaneGlobeScene() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <linearGradient id="orange-fade-1" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
          <stop offset="50%" stopColor={ACCENT} stopOpacity="1" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={PAPER} />

      {/* Soft orange shape behind phone */}
      <motion.ellipse
        cx="260"
        cy="220"
        rx="150"
        ry="120"
        fill={HIGHLIGHT}
        opacity="0.18"
        initial={{ scale: 0.92 }}
        animate={{ scale: [0.92, 1, 0.92] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "260px 220px" }}
      />

      {/* Globe arc lines — sit behind */}
      <g opacity="0.7">
        <path d="M 40 110 Q 200 30 360 110" fill="none" stroke={INK} strokeWidth="1.2" opacity="0.18" strokeDasharray="2 3" />
        <path d="M 30 160 Q 200 70 370 160" fill="none" stroke={INK} strokeWidth="1.2" opacity="0.12" strokeDasharray="2 3" />
      </g>

      {/* Animated path-draw trail */}
      <motion.path
        d="M 40 110 Q 200 30 360 110"
        fill="none"
        stroke="url(#orange-fade-1)"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE }}
      />

      {/* Pulse origin pin (NY) */}
      <g>
        <motion.circle
          cx="40"
          cy="110"
          r="5"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1.4"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 2.5, 3], opacity: [0, 0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: "40px 110px" }}
        />
        <circle cx="40" cy="110" r="4" fill={ACCENT} />
        <circle cx="40" cy="110" r="1.4" fill={PAPER} />
      </g>

      {/* Phone — centerpiece, slight tilt */}
      <PhoneFrame x="220" y="220" w="160" rotate={-4}>
        {/* header */}
        <text x="-66" y="-150" fontSize="8" fontWeight="700" fill={INK} opacity="0.4" fontFamily="ui-monospace, monospace" letterSpacing="1.5">
          BLIP · SEND
        </text>
        <circle cx="58" cy="-152" r="3" fill={ACCENT} />

        {/* Recipient avatar + name */}
        <g transform="translate(-60 -120)">
          <circle r="14" fill={ACCENT} />
          <text y="4" fontSize="13" fontWeight="800" fill={PAPER} fontFamily="ui-serif, Georgia, serif" textAnchor="middle">
            P
          </text>
        </g>
        <text x="-40" y="-122" fontSize="9" fontWeight="700" fill={INK} fontFamily="ui-monospace, monospace">
          PRIYA · MUMBAI
        </text>
        <text x="-40" y="-110" fontSize="7" fill={INK} opacity="0.45" fontFamily="ui-monospace, monospace">
          recipient verified
        </text>

        {/* Big amount */}
        <text
          x="0"
          y="-58"
          textAnchor="middle"
          fontSize="38"
          fontWeight="800"
          fill={INK}
          letterSpacing="-1"
          fontFamily="ui-serif, Georgia, serif"
        >
          $2,400
        </text>
        <text
          x="0"
          y="-40"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={ACCENT}
          letterSpacing="2"
          fontFamily="ui-monospace, monospace"
        >
          SENDING NOW
        </text>

        {/* Progress bar */}
        <rect x="-66" y="-20" width="132" height="4" rx="2" fill={INK} opacity="0.08" />
        <motion.rect
          x="-66"
          y="-20"
          height="4"
          rx="2"
          fill={ACCENT}
          initial={{ width: 0 }}
          whileInView={{ width: 110 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, delay: 0.5, ease: EASE }}
        />
        <text x="-66" y="0" fontSize="7" fontWeight="700" fill={INK} opacity="0.5" fontFamily="ui-monospace, monospace">
          NEW YORK
        </text>
        <text x="0" y="0" textAnchor="middle" fontSize="7" fontWeight="700" fill={ACCENT} fontFamily="ui-monospace, monospace">
          ROUTING · 12s
        </text>
        <text x="66" y="0" textAnchor="end" fontSize="7" fontWeight="700" fill={INK} opacity="0.5" fontFamily="ui-monospace, monospace">
          MUMBAI
        </text>

        {/* Mini rate card */}
        <rect x="-66" y="20" width="132" height="56" rx="8" fill={INK} opacity="0.04" />
        <text x="-58" y="36" fontSize="7" fill={INK} opacity="0.45" fontFamily="ui-monospace, monospace">RATE</text>
        <text x="58" y="36" textAnchor="end" fontSize="8.5" fontWeight="800" fill={INK} fontFamily="ui-monospace, monospace">₹83.42</text>
        <text x="-58" y="52" fontSize="7" fill={INK} opacity="0.45" fontFamily="ui-monospace, monospace">SHE GETS</text>
        <text x="58" y="52" textAnchor="end" fontSize="8.5" fontWeight="800" fill={INK} fontFamily="ui-monospace, monospace">₹2,00,160</text>
        <line x1="-58" y1="58" x2="58" y2="58" stroke={INK} opacity="0.08" strokeWidth="0.6" />
        <text x="-58" y="70" fontSize="7" fill={ACCENT} fontWeight="700" fontFamily="ui-monospace, monospace">VS BANK</text>
        <text x="58" y="70" textAnchor="end" fontSize="8.5" fontWeight="800" fill={ACCENT} fontFamily="ui-monospace, monospace">+$32.40</text>

        {/* CTA pill */}
        <rect x="-66" y="92" width="132" height="22" rx="11" fill={INK} />
        <text x="0" y="107" textAnchor="middle" fontSize="9" fontWeight="800" fill={PAPER} letterSpacing="1" fontFamily="ui-monospace, monospace">
          CONFIRM SEND →
        </text>
      </PhoneFrame>

      {/* Floating paper plane — drifts across */}
      <motion.g
        animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <g transform="translate(140 100) rotate(22)">
          <path d="M -22 0 L 24 -13 L 24 13 Z" fill={INK} />
          <path d="M 24 -13 L 6 0 L 24 13 Z" fill={ACCENT} />
          <line x1="-22" y1="0" x2="6" y2="0" stroke={PAPER} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </motion.g>

      {/* Floating "Received" toast — illustrated flat card, top-left */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
      >
        <g transform="translate(70 280) rotate(-6)">
          <rect x="-54" y="-26" width="108" height="52" rx="10" fill={PAPER} stroke={INK} strokeWidth="1.4" />
          <circle cx="-36" cy="-6" r="10" fill={ACCENT} />
          <text x="-36" y="-2" textAnchor="middle" fontSize="11" fontWeight="800" fill={PAPER} fontFamily="ui-serif, Georgia, serif">P</text>
          <text x="-20" y="-9" fontSize="7" fontWeight="700" fill={INK} opacity="0.5" fontFamily="ui-monospace, monospace">RECEIVED · NOW</text>
          <text x="-20" y="6" fontSize="11" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia, serif">₹2,00,160</text>
          <text x="-20" y="17" fontSize="6.5" fill={INK} opacity="0.45" fontFamily="ui-monospace, monospace">from Sahil · settled in 42s</text>
          {/* pulse dot */}
          <motion.circle
            cx="42"
            cy="-12"
            r="2.4"
            fill={ACCENT}
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </g>
      </motion.g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 2 — Best market rates
   Phone showing competing-merchant rate board + BEST tag + chart
   ═══════════════════════════════════════════════ */
export function PriceTagScene() {
  const OFFERS = [
    { name: "Leila M.", rate: "83.42", win: true },
    { name: "Lee S.", rate: "83.38", win: false },
    { name: "Omar P.", rate: "83.31", win: false },
    { name: "Bank wire", rate: "82.10", win: false, muted: true },
  ];
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="soft-shadow-2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <rect width="400" height="400" fill={PAPER} />

      {/* Ambient orange blob behind phone */}
      <motion.path
        d="M 80 320 Q 120 200 220 230 Q 320 260 320 340 Z"
        fill={HIGHLIGHT}
        opacity="0.22"
        animate={{ x: [0, -4, 0], y: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sparkles */}
      {[
        { x: 60, y: 90 },
        { x: 340, y: 110 },
        { x: 70, y: 220 },
        { x: 350, y: 270 },
      ].map((s, i) => (
        <motion.path
          key={i}
          d={`M ${s.x} ${s.y - 7} L ${s.x + 1.6} ${s.y - 1.6} L ${s.x + 7} ${s.y} L ${s.x + 1.6} ${s.y + 1.6} L ${s.x} ${s.y + 7} L ${s.x - 1.6} ${s.y + 1.6} L ${s.x - 7} ${s.y} L ${s.x - 1.6} ${s.y - 1.6} Z`}
          fill={ACCENT}
          animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.45 }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        />
      ))}

      {/* Phone — centered, slight right tilt */}
      <PhoneFrame x="200" y="210" w="170" rotate={4}>
        {/* header */}
        <text x="-70" y="-155" fontSize="8" fontWeight="700" fill={INK} opacity="0.4" fontFamily="ui-monospace, monospace" letterSpacing="1.5">
          BLIP · MARKET
        </text>
        <g transform="translate(56 -155)">
          <motion.circle
            r="2.6"
            fill={ACCENT}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </g>
        <text x="70" y="-152" textAnchor="end" fontSize="6.5" fill={INK} opacity="0.5" fontFamily="ui-monospace, monospace">LIVE</text>

        {/* big rate */}
        <text x="0" y="-115" textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} opacity="0.4" letterSpacing="2" fontFamily="ui-monospace, monospace">
          USD → INR
        </text>
        <text x="0" y="-82" textAnchor="middle" fontSize="34" fontWeight="800" fill={INK} letterSpacing="-1" fontFamily="ui-serif, Georgia, serif">
          ₹83.42
        </text>
        <text x="0" y="-65" textAnchor="middle" fontSize="8" fontWeight="700" fill={ACCENT} fontFamily="ui-monospace, monospace">
          +0.18% vs bank
        </text>

        {/* Mini chart */}
        <g transform="translate(0 -36)">
          <motion.path
            d="M -70 12 L -50 8 L -30 11 L -10 4 L 10 6 L 30 -2 L 50 0 L 70 -6"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE }}
          />
          <motion.path
            d="M -70 12 L -50 8 L -30 11 L -10 4 L 10 6 L 30 -2 L 50 0 L 70 -6 L 70 18 L -70 18 Z"
            fill={ACCENT}
            opacity="0.12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.12 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
          />
        </g>

        {/* Offers list */}
        <g transform="translate(0 0)">
          {OFFERS.map((o, i) => {
            const y = i * 17;
            const fillBg = o.win ? ACCENT : INK;
            const op = o.win ? 1 : o.muted ? 0.35 : 0.78;
            return (
              <motion.g
                key={o.name}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
              >
                <rect
                  x="-72"
                  y={y - 7}
                  width="144"
                  height="14"
                  rx="3"
                  fill={fillBg}
                  opacity={o.win ? 0.12 : 0.04}
                />
                <circle cx="-66" cy={y} r="2" fill={fillBg} opacity={op} />
                <text x="-58" y={y + 3} fontSize="7" fontWeight="700" fill={INK} opacity={op} fontFamily="ui-monospace, monospace">
                  {o.name.toUpperCase()}
                </text>
                {o.win && (
                  <g transform={`translate(8 ${y + 3})`}>
                    <rect x="0" y="-6" width="22" height="9" rx="2" fill={ACCENT} />
                    <text x="11" y="1" textAnchor="middle" fontSize="6.5" fontWeight="800" fill={PAPER} fontFamily="ui-monospace, monospace">BEST</text>
                  </g>
                )}
                <text x="66" y={y + 3} textAnchor="end" fontSize="7.5" fontWeight="800" fill={INK} opacity={op} fontFamily="ui-monospace, monospace">
                  ₹{o.rate}
                </text>
              </motion.g>
            );
          })}
        </g>

        {/* CTA */}
        <rect x="-70" y="92" width="140" height="22" rx="11" fill={INK} />
        <text x="0" y="107" textAnchor="middle" fontSize="9" fontWeight="800" fill={PAPER} letterSpacing="1" fontFamily="ui-monospace, monospace">
          ACCEPT BEST RATE →
        </text>
      </PhoneFrame>

      {/* BEST tag — illustrated, swings on a string from top */}
      <motion.g
        animate={{ rotate: [-3, 4, -3] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "320px 70px" }}
      >
        <line x1="320" y1="0" x2="320" y2="70" stroke={INK} strokeWidth="1" opacity="0.35" />
        <g transform="translate(320 100)">
          <path d="M -30 -20 L 28 -20 L 36 0 L 28 20 L -30 20 Z" fill={ACCENT} />
          <circle cx="-22" cy="0" r="3.5" fill={PAPER} stroke={INK} strokeWidth="1.4" />
          <text x="6" y="-2" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia, serif">
            BEST
          </text>
          <text x="6" y="11" textAnchor="middle" fontSize="7" fontWeight="700" fill={INK} opacity="0.6" fontFamily="ui-monospace, monospace">
            +0.18%
          </text>
        </g>
      </motion.g>

      {/* Floating "saved $32" pill — bottom right */}
      <motion.g
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
      >
        <g transform="translate(330 330) rotate(5)">
          <rect x="-46" y="-16" width="92" height="32" rx="16" fill={INK} />
          <circle cx="-30" cy="0" r="8" fill={ACCENT} />
          <text x="-30" y="3.5" textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia, serif">$</text>
          <text x="-16" y="-3" fontSize="7" fontWeight="700" fill={PAPER} opacity="0.55" fontFamily="ui-monospace, monospace">YOU SAVED</text>
          <text x="-16" y="9" fontSize="10" fontWeight="800" fill={ACCENT} fontFamily="ui-monospace, monospace">+$32.40</text>
        </g>
      </motion.g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 3 — Earn up to 10%
   Phone showing earnings dashboard + sparkline + orbiting coin + 10% stamp
   ═══════════════════════════════════════════════ */
export function CashStackScene() {
  const TRADES = [
    { id: "TX-8421", pair: "USD/INR", earn: "+$84" },
    { id: "TX-8420", pair: "EUR/PHP", earn: "+$57" },
    { id: "TX-8419", pair: "USD/NGN", earn: "+$190" },
  ];
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="soft-shadow-3" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <linearGradient id="spark-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.45" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={PAPER} />

      {/* Soft glow shape behind phone */}
      <motion.ellipse
        cx="200"
        cy="220"
        rx="170"
        ry="130"
        fill={HIGHLIGHT}
        opacity="0.2"
        animate={{ scale: [0.95, 1.02, 0.95] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 220px" }}
      />

      {/* Phone — centered, very slight tilt */}
      <PhoneFrame x="200" y="210" w="170" rotate={-3}>
        {/* header */}
        <text x="-70" y="-155" fontSize="8" fontWeight="700" fill={INK} opacity="0.4" fontFamily="ui-monospace, monospace" letterSpacing="1.5">
          BLIP · EARNINGS
        </text>
        <text x="70" y="-152" textAnchor="end" fontSize="6.5" fill={INK} opacity="0.5" fontFamily="ui-monospace, monospace">TODAY</text>

        {/* Big number */}
        <text x="0" y="-100" textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} opacity="0.4" letterSpacing="2" fontFamily="ui-monospace, monospace">
          TOTAL EARNED
        </text>
        <motion.text
          x="0"
          y="-60"
          textAnchor="middle"
          fontSize="42"
          fontWeight="800"
          fill={INK}
          letterSpacing="-1.2"
          fontFamily="ui-serif, Georgia, serif"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: -60 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          $331.50
        </motion.text>
        <text x="0" y="-44" textAnchor="middle" fontSize="8" fontWeight="700" fill={ACCENT} fontFamily="ui-monospace, monospace">
          +12.4% vs yesterday
        </text>

        {/* Sparkline */}
        <g transform="translate(0 -14)">
          <motion.path
            d="M -70 18 L -50 12 L -30 14 L -10 6 L 10 8 L 30 -2 L 50 2 L 70 -10 L 70 24 L -70 24 Z"
            fill="url(#spark-grad)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.path
            d="M -70 18 L -50 12 L -30 14 L -10 6 L 10 8 L 30 -2 L 50 2 L 70 -10"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <motion.circle
            cx="70"
            cy="-10"
            r="3"
            fill={ACCENT}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.6 }}
          />
        </g>

        {/* Trade list */}
        <g transform="translate(0 24)">
          {TRADES.map((t, i) => {
            const y = i * 17;
            return (
              <motion.g
                key={t.id}
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.12 }}
              >
                <text x="-70" y={y + 3} fontSize="7" fontWeight="700" fill={INK} opacity="0.35" fontFamily="ui-monospace, monospace">
                  {t.id}
                </text>
                <text x="-30" y={y + 3} fontSize="7" fontWeight="700" fill={INK} opacity="0.75" fontFamily="ui-monospace, monospace">
                  {t.pair}
                </text>
                <text x="70" y={y + 3} textAnchor="end" fontSize="8" fontWeight="800" fill={ACCENT} fontFamily="ui-monospace, monospace">
                  {t.earn}
                </text>
                <line x1="-70" y1={y + 10} x2="70" y2={y + 10} stroke={INK} opacity="0.06" strokeWidth="0.5" />
              </motion.g>
            );
          })}
        </g>

        {/* CTA */}
        <rect x="-70" y="92" width="140" height="22" rx="11" fill={INK} />
        <text x="0" y="107" textAnchor="middle" fontSize="9" fontWeight="800" fill={PAPER} letterSpacing="1" fontFamily="ui-monospace, monospace">
          WITHDRAW · 0 FEES
        </text>
      </PhoneFrame>

      {/* "UP TO 10%" stamp badge — top-right, slight rotation */}
      <motion.g
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: -12 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        style={{ transformOrigin: "330px 80px" }}
      >
        <g transform="translate(330 80)">
          <circle r="42" fill={INK} />
          <circle r="36" fill="none" stroke={ACCENT} strokeWidth="1.4" strokeDasharray="2 3" />
          <text y="-6" textAnchor="middle" fontSize="8" fontWeight="700" fill={PAPER} opacity="0.6" letterSpacing="2" fontFamily="ui-monospace, monospace">
            UP TO
          </text>
          <text y="14" textAnchor="middle" fontSize="22" fontWeight="800" fill={ACCENT} fontFamily="ui-serif, Georgia, serif">
            10%
          </text>
          <text y="28" textAnchor="middle" fontSize="6" fontWeight="700" fill={PAPER} opacity="0.55" letterSpacing="1.5" fontFamily="ui-monospace, monospace">
            PER TRADE
          </text>
        </g>
      </motion.g>

      {/* Orbiting coin — bottom-left */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "75px 320px" }}
      >
        <g transform="translate(75 320)">
          <circle r="18" fill={ACCENT} stroke={INK} strokeWidth="2" />
          <circle r="12" fill="none" stroke={INK} strokeWidth="1" opacity="0.4" />
          <text y="5" textAnchor="middle" fontSize="16" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia, serif">
            $
          </text>
        </g>
      </motion.g>

      {/* Mini coin — drifts above big coin */}
      <motion.circle
        cx="100"
        cy="280"
        r="6"
        fill={ACCENT}
        stroke={INK}
        strokeWidth="1.4"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Withdraw chip — bottom right */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <g transform="translate(330 330) rotate(4)">
          <rect x="-46" y="-13" width="92" height="26" rx="13" fill={INK} />
          <circle cx="-32" cy="0" r="2.5" fill={ACCENT} />
          <text x="-24" y="3" fontSize="8" fontWeight="700" fill={PAPER} letterSpacing="1" fontFamily="ui-monospace, monospace">
            ON-CHAIN 24/7
          </text>
        </g>
      </motion.g>
    </svg>
  );
}
