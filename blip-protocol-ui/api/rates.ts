// Vercel Edge function — server-side P2P rate fetcher.
// Replaces the corsproxy.io client-side hack which started returning 403.
//
// GET /api/rates?source=binance|bybit|okx|kucoin|htx&side=BUY|SELL
// Returns { quotes: Quote[] }

export const config = { runtime: "edge" };

type Side = "BUY" | "SELL";
type Source = "binance" | "bybit" | "okx" | "kucoin" | "htx";

type Quote = {
  source: string;
  sourceUrl: string;
  price: number;
  minINR: number;
  maxINR: number;
  availableUSDT: number;
  merchant: string;
  completionRate: number | null;
  orders: number | null;
  payments: string[];
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const jsonHeaders = {
  "content-type": "application/json",
  accept: "application/json, text/plain, */*",
  "user-agent": UA,
  "accept-language": "en-US,en;q=0.9",
};

async function fetchBinance(side: Side): Promise<Quote[]> {
  const res = await fetch(
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        asset: "USDT",
        fiat: "INR",
        tradeType: side,
        page: 1,
        rows: 10,
        publisherType: null,
        payTypes: [],
      }),
    },
  );
  const json: any = await res.json();
  const rows: any[] = json?.data ?? [];
  return rows.map(
    (r): Quote => ({
      source: "Binance P2P",
      sourceUrl:
        "https://p2p.binance.com/en/trade/all-payments/USDT?fiat=INR",
      price: parseFloat(r.adv.price),
      minINR: parseFloat(r.adv.minSingleTransAmount),
      maxINR: parseFloat(
        r.adv.dynamicMaxSingleTransAmount ?? r.adv.maxSingleTransAmount,
      ),
      availableUSDT: parseFloat(r.adv.tradableQuantity),
      merchant: r.advertiser.nickName,
      completionRate: r.advertiser.monthFinishRate ?? null,
      orders: r.advertiser.monthOrderCount ?? null,
      payments: (r.adv.tradeMethods ?? []).map(
        (m: any) => m.tradeMethodName || m.identifier,
      ),
    }),
  );
}

async function fetchBybit(side: Side): Promise<Quote[]> {
  const res = await fetch("https://api2.bybit.com/fiat/otc/item/online", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      userId: "",
      tokenId: "USDT",
      currencyId: "INR",
      payment: [],
      side: side === "BUY" ? "1" : "0",
      size: "10",
      page: "1",
      amount: "",
      authMaker: false,
      canTrade: false,
    }),
  });
  const json: any = await res.json();
  const rows: any[] = json?.result?.items ?? [];
  return rows.map(
    (r): Quote => ({
      source: "Bybit P2P",
      sourceUrl:
        "https://www.bybit.com/fiat/trade/otc/?actionType=0&token=USDT&fiat=INR",
      price: parseFloat(r.price),
      minINR: parseFloat(r.minAmount),
      maxINR: parseFloat(r.maxAmount),
      availableUSDT: parseFloat(r.lastQuantity ?? r.quantity),
      merchant: r.nickName,
      completionRate:
        r.recentExecuteRate != null ? r.recentExecuteRate / 100 : null,
      orders: r.recentOrderNum ?? null,
      payments: (r.payments ?? []).map((p: any) =>
        typeof p === "string" ? p : p.paymentType,
      ),
    }),
  );
}

async function fetchOkx(side: Side): Promise<Quote[]> {
  const okxSide = side === "BUY" ? "sell" : "buy";
  const url = `https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=INR&baseCurrency=USDT&side=${okxSide}&paymentMethod=all&userType=all&receivingAds=false&showTrade=false&showFollow=false&showAlreadyTraded=false&isAbleFilter=false`;
  const res = await fetch(url, { headers: jsonHeaders });
  const json: any = await res.json();
  const rows: any[] = json?.data?.[okxSide] ?? json?.data ?? [];
  return (Array.isArray(rows) ? rows : []).slice(0, 10).map(
    (r): Quote => ({
      source: "OKX P2P",
      sourceUrl: "https://www.okx.com/p2p-markets/inr/buy-usdt",
      price: parseFloat(r.price),
      minINR: parseFloat(r.quoteMinAmountPerOrder ?? r.minAmount ?? 0),
      maxINR: parseFloat(r.quoteMaxAmountPerOrder ?? r.maxAmount ?? 0),
      availableUSDT: parseFloat(r.availableAmount ?? r.quantity ?? 0),
      merchant: r.nickName ?? r.merchantName ?? "OKX Merchant",
      completionRate:
        r.completedRate != null ? parseFloat(r.completedRate) : null,
      orders: r.completedOrderQuantity ?? null,
      payments: (r.paymentMethods ?? []).map((p: any) => p.name ?? p),
    }),
  );
}

async function fetchKucoin(side: Side): Promise<Quote[]> {
  const kuSide = side === "BUY" ? "SELL" : "BUY";
  const url = `https://www.kucoin.com/_api/otc/ad/list?currency=INR&legal=INR&lang=en_US&status=PUTUP&side=${kuSide}&page=1&pageSize=10&token=USDT`;
  const res = await fetch(url, {
    headers: {
      ...jsonHeaders,
      referer: "https://www.kucoin.com/otc/buy/USDT-INR",
    },
  });
  const json: any = await res.json();
  const rows: any[] = json?.items ?? json?.data?.items ?? [];
  return rows.slice(0, 10).map(
    (r): Quote => ({
      source: "KuCoin P2P",
      sourceUrl: "https://www.kucoin.com/otc/buy/USDT-INR",
      price: parseFloat(r.floatPrice ?? r.price),
      minINR: parseFloat(r.limitMinQuote ?? r.minQuote ?? 0),
      maxINR: parseFloat(r.limitMaxQuote ?? r.maxQuote ?? 0),
      availableUSDT: parseFloat(r.currencyQuantity ?? r.quantity ?? 0),
      merchant: r.userName ?? r.nickName ?? "KuCoin Merchant",
      completionRate:
        r.completedRate != null ? parseFloat(r.completedRate) / 100 : null,
      orders: r.completedCount ?? null,
      payments: (r.premiumPayMethodList ?? r.payMethodList ?? []).map(
        (p: any) => p.payMethod ?? p.name ?? p,
      ),
    }),
  );
}

async function fetchHtx(side: Side): Promise<Quote[]> {
  const htxType = side === "BUY" ? "sell" : "buy";
  const url = `https://www.htx.com/-/x/otc/v1/data/trade-market?coinId=2&currency=102&tradeType=${htxType}&currPage=1&payMethod=0&acceptOrder=0&country=37&blockType=general&online=1&range=0&amount=`;
  const res = await fetch(url, {
    headers: {
      ...jsonHeaders,
      referer: "https://www.htx.com/en-us/fiat-crypto/trade/buy-usdt_inr/",
    },
  });
  const json: any = await res.json();
  const rows: any[] = json?.data ?? [];
  return rows.slice(0, 10).map(
    (r): Quote => ({
      source: "HTX P2P",
      sourceUrl:
        "https://www.htx.com/en-us/fiat-crypto/trade/buy-usdt_inr/",
      price: parseFloat(r.price),
      minINR: parseFloat(r.minTradeLimit ?? 0),
      maxINR: parseFloat(r.maxTradeLimit ?? 0),
      availableUSDT: parseFloat(r.tradeCount ?? 0),
      merchant: r.userName ?? "HTX Merchant",
      completionRate:
        r.orderCompleteRate != null
          ? parseFloat(r.orderCompleteRate) / 100
          : null,
      orders: r.tradeMonthTimes ?? null,
      payments: (r.payMethods ?? []).map((p: any) => p.name ?? p),
    }),
  );
}

const fetchers: Record<Source, (side: Side) => Promise<Quote[]>> = {
  binance: fetchBinance,
  bybit: fetchBybit,
  okx: fetchOkx,
  kucoin: fetchKucoin,
  htx: fetchHtx,
};

const SOURCE_META: Record<Source, { display: string; url: string }> = {
  binance: {
    display: "Binance P2P",
    url: "https://p2p.binance.com/en/trade/all-payments/USDT?fiat=INR",
  },
  bybit: {
    display: "Bybit P2P",
    url: "https://www.bybit.com/fiat/trade/otc/?actionType=0&token=USDT&fiat=INR",
  },
  okx: {
    display: "OKX P2P",
    url: "https://www.okx.com/p2p-markets/inr/buy-usdt",
  },
  kucoin: {
    display: "KuCoin P2P",
    url: "https://www.kucoin.com/otc/buy/USDT-INR",
  },
  htx: {
    display: "HTX P2P",
    url: "https://www.htx.com/en-us/fiat-crypto/trade/buy-usdt_inr/",
  },
};

// Stale threshold: if newest ad is older than this, treat DB as empty and
// fall back to live scraping. Crawler runs every 60s, so 5 min = 5 missed polls.
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

type RatesFeedRow = {
  exchange: string;
  fiat: string;
  crypto: string;
  side: string;
  price: string | number;
  min_fiat: string | number | null;
  max_fiat: string | number | null;
  available_crypto: string | number | null;
  payment_methods: string[] | null;
  observed_at: string;
  merchant_nickname: string | null;
  merchant_completion_rate: string | number | null;
  merchant_monthly_orders: number | null;
};

async function fetchFromDb(
  source: Source,
  side: Side,
  fiat: string,
  crypto: string,
): Promise<{ quotes: Quote[]; observedAt: number | null }> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return { quotes: [], observedAt: null };

  const meta = SOURCE_META[source];
  const restUrl =
    `${url}/rest/v1/rates_feed` +
    `?select=*` +
    `&exchange=eq.${source}` +
    `&side=eq.${side}` +
    `&fiat=eq.${encodeURIComponent(fiat)}` +
    `&crypto=eq.${encodeURIComponent(crypto)}` +
    `&order=price.${side === "BUY" ? "asc" : "desc"}` +
    `&limit=100`;

  const res = await fetch(restUrl, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      accept: "application/json",
    },
  });
  if (!res.ok) return { quotes: [], observedAt: null };
  const rows: RatesFeedRow[] = await res.json();
  if (!rows.length) return { quotes: [], observedAt: null };

  const quotes: Quote[] = rows.map((r) => ({
    source: meta.display,
    sourceUrl: meta.url,
    price: Number(r.price),
    minINR: r.min_fiat != null ? Number(r.min_fiat) : 0,
    maxINR: r.max_fiat != null ? Number(r.max_fiat) : 0,
    availableUSDT: r.available_crypto != null ? Number(r.available_crypto) : 0,
    merchant: r.merchant_nickname ?? "—",
    completionRate:
      r.merchant_completion_rate != null
        ? Number(r.merchant_completion_rate)
        : null,
    orders: r.merchant_monthly_orders,
    payments: r.payment_methods ?? [],
  }));

  const newest = Math.max(
    ...rows.map((r) => new Date(r.observed_at).getTime()),
  );
  return { quotes, observedAt: newest };
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const source = url.searchParams.get("source") as Source | null;
  const sideParam = (url.searchParams.get("side") ?? "BUY").toUpperCase();
  const side: Side = sideParam === "SELL" ? "SELL" : "BUY";
  const fiat = (url.searchParams.get("fiat") ?? "INR").toUpperCase();
  const crypto = (url.searchParams.get("crypto") ?? "USDT").toUpperCase();

  const commonHeaders = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "cache-control": "public, s-maxage=20, stale-while-revalidate=60",
  };

  if (!source || !(source in fetchers)) {
    return new Response(JSON.stringify({ error: "unknown source" }), {
      status: 400,
      headers: commonHeaders,
    });
  }

  // Try DB first. Fall back to live scrape if empty or stale.
  try {
    const { quotes, observedAt } = await fetchFromDb(
      source,
      side,
      fiat,
      crypto,
    );
    const fresh =
      observedAt != null && Date.now() - observedAt < STALE_THRESHOLD_MS;
    if (quotes.length > 0 && fresh) {
      return new Response(
        JSON.stringify({
          quotes,
          source: "db",
          observed_at: observedAt,
          age_seconds: Math.floor((Date.now() - observedAt) / 1000),
        }),
        { status: 200, headers: commonHeaders },
      );
    }
  } catch {
    // fall through to live scrape
  }

  // Fallback: live exchange scrape (original behavior).
  try {
    const quotes = await fetchers[source](side);
    return new Response(
      JSON.stringify({ quotes, source: "live", observed_at: Date.now() }),
      { status: 200, headers: commonHeaders },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg, quotes: [] }), {
      status: 200, // soft-fail so other sources still show
      headers: commonHeaders,
    });
  }
}
