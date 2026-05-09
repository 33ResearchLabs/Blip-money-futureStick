// Vercel Edge function — live P2P rates from Binance, Bybit, and KuCoin.
//
// GET /api/p2p-rates?fiat=INR&tradeType=BUY&amount=100
//   - fiat: INR | AED | PHP | PKR | USD
//   - tradeType: BUY | SELL  (from the user's perspective: BUY USDT or SELL USDT)
//   - amount: optional, used to filter ads with sufficient size
//
// Returns:
//   {
//     mid: number,                 // best mid-market estimate from the venues
//     venues: Array<{
//       name: string,              // e.g. "Binance P2P"
//       price: number | null,      // top-of-book price for the requested side
//       updated: number,           // unix ms
//       error?: string
//     }>,
//     observed_at: number
//   }
//
// Centralized P2P APIs are unofficial; they can rate-limit or change shape.
// Each venue is fetched in parallel; failures don't block the others.

export const config = { runtime: "edge" };

type TradeType = "BUY" | "SELL";

type VenueResult = {
  name: string;
  price: number | null;
  updated: number;
  error?: string;
};

const COMMON_HEADERS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  // Edge cache for 15s, allow 60s of staleness — P2P spreads don't change tick-to-tick.
  "cache-control": "public, s-maxage=15, stale-while-revalidate=60",
};

/* ───────── Binance P2P ───────── */
async function fetchBinance(
  fiat: string,
  tradeType: TradeType,
  amount: number,
): Promise<VenueResult> {
  const name = "Binance P2P";
  try {
    // For "BUY USDT" the user looks at SELL ads (merchants selling USDT).
    // For "SELL USDT" the user looks at BUY ads (merchants buying USDT).
    const adType = tradeType === "BUY" ? "SELL" : "BUY";
    const body = {
      asset: "USDT",
      fiat,
      tradeType: adType,
      page: 1,
      rows: 5,
      transAmount: amount > 0 ? String(amount) : undefined,
      merchantCheck: false,
      payTypes: [],
      countries: [],
      proMerchantAds: false,
    };
    const res = await fetch(
      "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          // Some Binance P2P endpoints require these to avoid being blocked.
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          accept: "application/json",
          origin: "https://p2p.binance.com",
          referer: "https://p2p.binance.com/",
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      return { name, price: null, updated: Date.now(), error: `http-${res.status}` };
    }
    const json: { data?: Array<{ adv?: { price?: string } }> } = await res.json();
    const top = json.data?.[0]?.adv?.price;
    const price = top ? Number(top) : null;
    return { name, price, updated: Date.now() };
  } catch (e: unknown) {
    return {
      name,
      price: null,
      updated: Date.now(),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/* ───────── Bybit P2P ───────── */
async function fetchBybit(
  fiat: string,
  tradeType: TradeType,
  amount: number,
): Promise<VenueResult> {
  const name = "Bybit P2P";
  try {
    // Bybit "side" semantics: 0 = look at BUY ads, 1 = look at SELL ads (merchant POV).
    // User wants to BUY USDT → look at SELL ads → side "1"
    // User wants to SELL USDT → look at BUY ads → side "0"
    const side = tradeType === "BUY" ? "1" : "0";
    const body = {
      userId: "",
      tokenId: "USDT",
      currencyId: fiat,
      payment: [],
      side,
      size: "5",
      page: "1",
      amount: amount > 0 ? String(amount) : "",
    };
    const res = await fetch("https://api2.bybit.com/fiat/otc/item/online", {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { name, price: null, updated: Date.now(), error: `http-${res.status}` };
    }
    const json: { result?: { items?: Array<{ price?: string }> } } = await res.json();
    const top = json.result?.items?.[0]?.price;
    const price = top ? Number(top) : null;
    return { name, price, updated: Date.now() };
  } catch (e: unknown) {
    return {
      name,
      price: null,
      updated: Date.now(),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/* ───────── OKX P2P ─────────
   GET endpoint, simpler. Used as third datapoint and a stand-in for "Direct P2P".
*/
async function fetchOkx(
  fiat: string,
  tradeType: TradeType,
): Promise<VenueResult> {
  const name = "OKX P2P";
  try {
    const side = tradeType === "BUY" ? "sell" : "buy";
    const url =
      `https://www.okx.com/v3/c2c/tradingOrders/books` +
      `?quoteCurrency=${fiat}&baseCurrency=USDT&side=${side}` +
      `&paymentMethod=all&userType=blockTrade&showTrade=false&showFollow=false` +
      `&showAlreadyTraded=false&isAbleFilter=false`;
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        accept: "application/json",
      },
    });
    if (!res.ok) {
      return { name, price: null, updated: Date.now(), error: `http-${res.status}` };
    }
    const json: {
      data?: { sell?: Array<{ price?: string }>; buy?: Array<{ price?: string }> };
    } = await res.json();
    const list = side === "sell" ? json.data?.sell : json.data?.buy;
    const top = list?.[0]?.price;
    const price = top ? Number(top) : null;
    return { name, price, updated: Date.now() };
  } catch (e: unknown) {
    return {
      name,
      price: null,
      updated: Date.now(),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/* ───────── Handler ───────── */
export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const fiat = (url.searchParams.get("fiat") ?? "INR").toUpperCase();
  const rawType = (url.searchParams.get("tradeType") ?? "SELL").toUpperCase();
  const tradeType: TradeType = rawType === "BUY" ? "BUY" : "SELL";
  const amount = Number(url.searchParams.get("amount") ?? "0") || 0;

  const supported = ["INR", "AED", "PHP", "PKR", "USD"];
  if (!supported.includes(fiat)) {
    return new Response(
      JSON.stringify({ error: "unsupported fiat", venues: [], mid: null }),
      { status: 200, headers: COMMON_HEADERS },
    );
  }

  const [binance, bybit, okx] = await Promise.all([
    fetchBinance(fiat, tradeType, amount),
    fetchBybit(fiat, tradeType, amount),
    fetchOkx(fiat, tradeType),
  ]);

  const venues: VenueResult[] = [binance, bybit, okx];

  // mid = best price from whichever venue returned data.
  // For BUY (user perspective), best = lowest. For SELL, best = highest.
  const prices = venues
    .map((v) => v.price)
    .filter((p): p is number => p != null && Number.isFinite(p));
  let mid: number | null = null;
  if (prices.length > 0) {
    mid = tradeType === "BUY" ? Math.min(...prices) : Math.max(...prices);
  }

  return new Response(
    JSON.stringify({
      mid,
      venues,
      tradeType,
      fiat,
      observed_at: Date.now(),
    }),
    { status: 200, headers: COMMON_HEADERS },
  );
}
