import { useEffect, useState } from "react";

/* Live USDT rates against major fiats. Pulled from CoinGecko's public
   /simple/price endpoint — no API key required. We poll every 60s so we
   stay well within their free-tier rate limits. */

export type LiveRates = {
  USDT: Partial<Record<"aed" | "inr" | "usd" | "php" | "ngn" | "sgd", number>>;
};

const ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=aed,inr,usd,php,ngn,sgd";

const FALLBACK: LiveRates = {
  USDT: { aed: 3.67, inr: 95.0, usd: 1.0, php: 58.4, ngn: 1620, sgd: 1.34 },
};

export function useLiveRates(intervalMs: number = 60_000): {
  rates: LiveRates;
  loading: boolean;
  error: string | null;
} {
  const [rates, setRates] = useState<LiveRates>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const fetchOnce = async () => {
      try {
        const r = await fetch(ENDPOINT, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = (await r.json()) as { tether?: LiveRates["USDT"] };
        if (!alive) return;
        if (j.tether) {
          setRates({ USDT: { ...FALLBACK.USDT, ...j.tether } });
          setError(null);
        }
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "unknown");
        // keep last successful rates / fallback
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchOnce();
    const id = window.setInterval(fetchOnce, intervalMs);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return { rates, loading, error };
}
