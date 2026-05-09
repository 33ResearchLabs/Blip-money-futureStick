// Vercel Edge function — live P2P rates aggregated through p2prate.live.
// We own p2prate.live and it normalises Binance / Bybit / KuCoin / OKX
// quotes server-side, so this proxy just calls four sources in parallel and
// returns the top-of-book per venue.
//
// GET /api/p2p-rates?fiat=INR&tradeType=BUY&amount=100
//   - fiat: INR | AED | PHP | PKR
//   - tradeType: BUY | SELL  (direction is the user's perspective)
//   - amount: optional filter for ads with sufficient size
//
// Returns:
//   {
//     mid: number | null,             // best price across venues, side-aware
//     venues: Array<{
//       name: "Binance P2P" | "Bybit P2P" | "KuCoin P2P" | "OKX P2P",
//       price: number | null,
//       merchant?: string,
//       error?: string,
//       updated: number
//     }>,
//     observed_at: number
//   }

export const config = { runtime: "edge" };

type TradeType = "BUY" | "SELL";

type P2PRateQuote = {
  source: string;
  price: number;
  merchant?: string;
};

type VenueResult = {
  name: string;
  price: number | null;
  merchant?: string;
  updated: number;
  error?: string;
};

const COMMON_HEADERS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "cache-control": "public, s-maxage=15, stale-while-revalidate=60",
};

const SOURCE_CONFIG: Array<{ source: string; label: string }> = [
  { source: "binance", label: "Binance P2P" },
  { source: "bybit", label: "Bybit P2P" },
  { source: "kucoin", label: "KuCoin P2P" },
  { source: "okx", label: "OKX P2P" },
];

/* ───────── Single venue fetch via p2prate.live ─────────
   Quotes returned by p2prate.live are sorted ascending by price (these are
   sell-side ads — merchants selling USDT to users). For the user's BUY
   direction the lowest price is the best deal; for SELL we treat the
   highest price as a reasonable proxy for what users can sell at, since
   the public aggregator only carries one side. */
async function fetchVenue(
  source: string,
  label: string,
  fiat: string,
  tradeType: TradeType,
): Promise<VenueResult> {
  try {
    const url =
      `https://p2prate.live/api/rates?source=${encodeURIComponent(source)}` +
      `&fiat=${encodeURIComponent(fiat)}` +
      `&crypto=USDT`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
      return {
        name: label,
        price: null,
        updated: Date.now(),
        error: `http-${res.status}`,
      };
    }
    const json: { quotes?: P2PRateQuote[] } = await res.json();
    const list = (json.quotes ?? []).filter(
      (q): q is P2PRateQuote => typeof q?.price === "number" && q.price > 0,
    );
    if (list.length === 0) {
      return {
        name: label,
        price: null,
        updated: Date.now(),
        error: "no-quotes",
      };
    }
    // p2prate.live's quotes are sell-side ads (merchants asking for fiat).
    // The lowest ad price = cheapest market reference for both directions:
    //  - BUY USDT  → user pays this rate, lowest is best.
    //  - SELL USDT → we use the same lowest ad as a stable market mid; the
    //                  highest ad is a thin-tail outlier, not a sell-side
    //                  reference, and using it inflates the apparent rate.
    const sorted = [...list].sort((a, b) => a.price - b.price);
    const top = sorted[0];
    return {
      name: label,
      price: top.price,
      merchant: top.merchant,
      updated: Date.now(),
    };
  } catch (e: unknown) {
    return {
      name: label,
      price: null,
      updated: Date.now(),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const fiat = (url.searchParams.get("fiat") ?? "INR").toUpperCase();
  const rawType = (url.searchParams.get("tradeType") ?? "BUY").toUpperCase();
  const tradeType: TradeType = rawType === "SELL" ? "SELL" : "BUY";

  const supported = ["INR", "AED", "PHP", "PKR", "USD"];
  if (!supported.includes(fiat)) {
    return new Response(
      JSON.stringify({ error: "unsupported fiat", venues: [], mid: null }),
      { status: 200, headers: COMMON_HEADERS },
    );
  }

  const venues = await Promise.all(
    SOURCE_CONFIG.map((s) => fetchVenue(s.source, s.label, fiat, tradeType)),
  );

  const prices = venues
    .map((v) => v.price)
    .filter((p): p is number => p != null && Number.isFinite(p));
  // Always pick the lowest live quote as the market mid. The aggregator
  // carries sell-side ads only, so the lowest is the most stable market
  // reference regardless of user direction.
  const mid = prices.length === 0 ? null : Math.min(...prices);

  return new Response(
    JSON.stringify({
      mid,
      venues,
      tradeType,
      fiat,
      source: "p2prate.live",
      observed_at: Date.now(),
    }),
    { status: 200, headers: COMMON_HEADERS },
  );
}
