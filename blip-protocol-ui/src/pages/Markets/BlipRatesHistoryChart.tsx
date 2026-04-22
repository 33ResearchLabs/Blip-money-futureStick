import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Bar = {
  t: number;
  best_buy: number | null;
  best_sell: number | null;
  exchanges_seen: number;
};

export default function BlipRatesHistoryChart({
  fiat = "INR",
  crypto = "USDT",
}: {
  fiat?: string;
  crypto?: string;
}) {
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/history?fiat=${fiat}&crypto=${crypto}`);
        const j = await res.json();
        if (cancelled) return;
        setBars((j.bars as Bar[]) ?? []);
      } catch (e: unknown) {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : String(e));
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fiat, crypto]);

  if (err) return null;
  if (!bars || bars.length < 2) return null;

  const formatted = bars.map((b) => ({
    ...b,
    ts: new Date(b.t).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }));

  return (
    <div
      className="rounded-2xl px-4 py-3 mb-4"
      style={{
        background: "#fff",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          {fiat}/{crypto} · last hour · 5-min bars
        </div>
        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          {bars.length} pts · {bars[bars.length - 1].exchanges_seen} exchanges
        </div>
      </div>
      <div style={{ width: "100%", height: 120 }}>
        <ResponsiveContainer>
          <LineChart
            data={formatted}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="ts"
              tick={{ fontSize: 9, fill: "var(--text-muted)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={["dataMin - 0.3", "dataMax + 0.3"]}
              tick={{ fontSize: 9, fill: "var(--text-muted)" }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid var(--border-default)",
              }}
              formatter={(v) =>
                typeof v === "number" ? `₹${v.toFixed(2)}` : "—"
              }
            />
            <Line
              type="monotone"
              dataKey="best_buy"
              name="Best ask"
              stroke="#ef4444"
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="best_sell"
              name="Best bid"
              stroke="#10b981"
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
