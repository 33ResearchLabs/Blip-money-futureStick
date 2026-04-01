import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "next-themes";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEED_TEMPLATES = [
  { type: "send", msg: "Sent $AMOUNT USDT → Delivered in $TIMEs", color: "#3ddc84" },
  { type: "lp", msg: "LP earned $$EARN from spread on $CORRIDOR", color: "#ff6b35" },
  { type: "merchant", msg: "Merchant settled $AMOUNT instantly", color: "#6366f1" },
  { type: "points", msg: "+$POINTS points awarded to $USER", color: "#f59e0b" },
  { type: "send", msg: "$AMOUNT USDT settled on-chain in $TIMEs", color: "#3ddc84" },
  { type: "lp", msg: "LP deployed $$DEPLOY into $CORRIDOR route", color: "#ff6b35" },
  { type: "merchant", msg: "Merchant earned $$EARN on $CORRIDOR trade", color: "#6366f1" },
];

const CORRIDORS = ["UAE→India", "UAE→Philippines", "UAE→Pakistan", "UAE→Nigeria", "UAE→Egypt"];
const USERS = ["0x7a...4f2", "0x3b...c81", "0x9d...a27", "0xf1...e93", "0x2c...d56"];

function generateFeedItem() {
  const template = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
  const corridor = CORRIDORS[Math.floor(Math.random() * CORRIDORS.length)];
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  let msg = template.msg
    .replace("$AMOUNT", String(Math.floor(Math.random() * 4000 + 200)))
    .replace("$TIME", String(Math.floor(Math.random() * 35 + 20)))
    .replace("$EARN", (Math.random() * 20 + 2).toFixed(2))
    .replace("$CORRIDOR", corridor)
    .replace("$POINTS", String(Math.floor(Math.random() * 50 + 5)))
    .replace("$USER", user)
    .replace("$DEPLOY", String(Math.floor(Math.random() * 5000 + 500)));
  return { msg, color: template.color, type: template.type, id: Date.now() + Math.random() };
}

const LiveNetworkFeed = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const [feed, setFeed] = useState<Array<{ msg: string; color: string; type: string; id: number }>>([]);
  const [totalPoints, setTotalPoints] = useState(148420);

  useEffect(() => {
    if (!isInView) return;
    // Seed initial items
    const initial = Array.from({ length: 6 }, () => generateFeedItem());
    setFeed(initial);

    const id = setInterval(() => {
      const item = generateFeedItem();
      setFeed((prev) => [item, ...prev].slice(0, 8));
      if (item.type === "points") {
        setTotalPoints((v) => v + Math.floor(Math.random() * 50 + 5));
      }
    }, 2000);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: isDark ? "#000" : "#1d1d1f", padding: "120px 24px" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ fontSize: 12, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 24 }}
          >
            Live network
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="heading-h2"
            style={{ color: "#ffffff", marginBottom: 16 }}
          >
            The network is live.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}
          >
            Real settlements. Real earnings. Real points. Early participants are being rewarded.
          </motion.p>
        </div>

        {/* Terminal feed */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="rounded-2xl overflow-hidden max-w-2xl mx-auto"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
              <span className="font-mono text-[10px] text-white/30">blip.network — live feed</span>
            </div>
          </div>

          {/* Feed items */}
          <div className="px-5 py-4 space-y-1" style={{ minHeight: 320 }}>
            <AnimatePresence mode="popLayout">
              {feed.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10, height: 0 }}
                  animate={{ opacity: i === 0 ? 1 : 0.5 - i * 0.05, x: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 py-1.5 font-mono"
                >
                  <span style={{ color: item.color, fontSize: 10 }}>●</span>
                  <span style={{ fontSize: 12, color: `rgba(255,255,255,${0.6 - i * 0.06})`, letterSpacing: "-0.01em" }}>
                    {item.msg}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Points counter + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full mb-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-xs text-white/30">Points distributed:</span>
            <motion.span
              key={totalPoints}
              initial={{ y: -3, opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-mono text-sm font-bold text-[#f59e0b]"
            >
              {totalPoints.toLocaleString()}
            </motion.span>
          </div>

          <div>
            <motion.a
              href="/waitlist"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
              style={{ background: "#ffffff", color: "#1d1d1f" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Start earning points
              <span>→</span>
            </motion.a>
          </div>

          <p className="mt-4 text-xs text-white/20">
            Early participants are being rewarded. Join early access.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(LiveNetworkFeed);
