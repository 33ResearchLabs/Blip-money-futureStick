import { useEffect, useRef, useState } from "react";

/* Live P2P USDT rate, sourced from our /api/rates edge function (DB-backed,
   Supabase-populated, with a live-scrape fallback).

   NOTE: we intentionally use /api/rates (fast, DB-first) rather than
   /api/p2p-rates, which currently 504s in production because it live-calls
   p2prate.live across 4 venues and exceeds the function timeout.

   We query the best BUY ad (lowest ask) and best SELL ad (highest bid) for
   one reference venue (Binance, the most liquid), then expose:
     buy  = best price to BUY USDT
     sell = best price to SELL USDT
     spread = (sell - buy) / buy */

export type Fiat = "INR" | "AED" | "PHP" | "THB" | "USD";

type RatesQuote = { source: string; price: number; merchant?: string };
type RatesResponse = {
  quotes: RatesQuote[];
  source?: string;
  observed_at?: number | null;
};

export type P2PRate = {
  buy: number | null;
  sell: number | null;
  buyVenue: string | null;
  sellVenue: string | null;
  spreadPct: number | null;
  observedAt: number | null;
  loading: boolean;
  error: string | null;
  isLive: boolean;
};

// Shown on first paint / when the API is unreachable, so the card never
// renders empty (good for SEO + perceived performance).
const FALLBACK: Record<Fiat, { buy: number; sell: number }> = {
  INR: { buy: 99.5, sell: 102.5 },
  AED: { buy: 3.66, sell: 3.69 },
  PHP: { buy: 56.2, sell: 58.0 },
  THB: { buy: 35.2, sell: 35.8 },
  USD: { buy: 0.999, sell: 1.002 },
};

/* Plausible USDT price band per fiat. The backend's live-scrape fallback is
   currently hardcoded to fiat:"INR" (see api/rates.ts fetchBinance), so a
   request for AED/PHP/THB can come back with INR prices (~101). This guard
   rejects out-of-band values and keeps the static fallback until the backend
   is fixed — at which point real in-band rates light up automatically. */
const BAND: Record<Fiat, [number, number]> = {
  INR: [50, 200],
  AED: [2, 6],
  PHP: [30, 90],
  THB: [25, 50],
  USD: [0.8, 1.2],
};

const SOURCE = "binance"; // most liquid reference venue
const REFRESH_MS = 60_000;

function bestQuote(quotes: RatesQuote[], side: "BUY" | "SELL"): RatesQuote | null {
  const valid = quotes.filter(
    (q) => typeof q?.price === "number" && q.price > 0,
  );
  if (valid.length === 0) return null;
  // BUY → cheapest ask; SELL → highest bid. (Endpoint already orders these,
  // but reduce defensively in case ordering changes.)
  return side === "BUY"
    ? valid.reduce((a, b) => (b.price < a.price ? b : a))
    : valid.reduce((a, b) => (b.price > a.price ? b : a));
}

async function fetchSide(
  fiat: Fiat,
  side: "BUY" | "SELL",
  signal: AbortSignal,
): Promise<RatesQuote | null> {
  const res = await fetch(
    `/api/rates?source=${SOURCE}&side=${side}&fiat=${fiat}&crypto=USDT`,
    { signal, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`http-${res.status}`);
  const data = (await res.json()) as RatesResponse;
  return bestQuote(data.quotes ?? [], side);
}

function venueLabel(q: RatesQuote | null): string | null {
  if (!q) return null;
  return q.source.replace(/\s*P2P\s*$/i, "").trim();
}

export function useP2PRate(fiat: Fiat = "INR"): P2PRate {
  const fb = FALLBACK[fiat] ?? FALLBACK.INR;
  const [state, setState] = useState<P2PRate>({
    buy: fb.buy,
    sell: fb.sell,
    buyVenue: null,
    sellVenue: null,
    spreadPct: ((fb.sell - fb.buy) / fb.buy) * 100,
    observedAt: null,
    loading: true,
    error: null,
    isLive: false,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    const [lo, hi] = BAND[fiat] ?? BAND.INR;
    const inBand = (p: number) => p >= lo && p <= hi;

    const fetchOnce = async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const [buyQ, sellQ] = await Promise.all([
          fetchSide(fiat, "BUY", ctrl.signal),
          fetchSide(fiat, "SELL", ctrl.signal),
        ]);
        if (!alive) return;

        const buy = buyQ && inBand(buyQ.price) ? buyQ.price : null;
        const sell = sellQ && inBand(sellQ.price) ? sellQ.price : null;

        if (buy == null && sell == null) {
          // Nothing usable (e.g. out-of-band AED bug) — keep last/fallback.
          setState((s) => ({ ...s, loading: false, error: "no-valid-quotes" }));
          return;
        }

        setState((prev) => ({
          buy: buy ?? prev.buy,
          sell: sell ?? prev.sell,
          buyVenue: venueLabel(buyQ),
          sellVenue: venueLabel(sellQ),
          spreadPct:
            buy != null && sell != null ? ((sell - buy) / buy) * 100 : null,
          observedAt: Date.now(),
          loading: false,
          error: null,
          isLive: buy != null,
        }));
      } catch (err) {
        if (!alive || (err as { name?: string })?.name === "AbortError") return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        }));
      }
    };

    fetchOnce();
    const id = window.setInterval(fetchOnce, REFRESH_MS);
    return () => {
      alive = false;
      abortRef.current?.abort();
      window.clearInterval(id);
    };
  }, [fiat]);

  return state;
}
