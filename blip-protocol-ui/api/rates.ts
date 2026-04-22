// Vercel Edge function — server-side P2P rate fetcher.
// Reads from Supabase (populated by blip-rates-crawler on VPS):
//   - rates_feed (per-ad detail) for direct-crawled exchanges
//   - p2p_army_latest (per-payment-method aggregate) for the rest
// Falls back to live exchange scraping only when the DB has no recent data.
//
// GET /api/rates?source=<exchange>&side=BUY|SELL[&fiat=INR&crypto=USDT]
// Returns { quotes: Quote[], source: "db" | "live", observed_at, age_seconds }

export const config = { runtime: "edge" };

type Side = "BUY" | "SELL";
type Source =
  | "binance"
  | "bybit"
  | "okx"
  | "kucoin"
  | "htx"
  | "bitget"
  | "mexc"
  | "gate"
  | "bingx";
type Strategy = "direct" | "p2p_army";

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

// Live fetchers only exist for the direct-crawled exchanges (fallback path
// when the DB is empty/stale). p2p.army-covered exchanges have no live path.
const fetchers: Partial<Record<Source, (side: Side) => Promise<Quote[]>>> = {
  binance: fetchBinance,
  bybit: fetchBybit,
  okx: fetchOkx,
  kucoin: fetchKucoin,
  htx: fetchHtx,
};

const SOURCE_META: Record<
  Source,
  { display: string; url: string; strategy: Strategy }
> = {
  binance: {
    display: "Binance P2P",
    url: "https://p2p.binance.com/en/trade/all-payments/USDT?fiat=INR",
    strategy: "direct",
  },
  bybit: {
    display: "Bybit P2P",
    url: "https://www.bybit.com/fiat/trade/otc/?actionType=0&token=USDT&fiat=INR",
    strategy: "direct",
  },
  okx: {
    display: "OKX P2P",
    url: "https://www.okx.com/p2p-markets/inr/buy-usdt",
    strategy: "direct",
  },
  // htx direct-crawled but the GCP VM's IP is blocked (403), so rely on p2p.army.
  htx: {
    display: "HTX P2P",
    url: "https://www.htx.com/en-us/fiat-crypto/trade/buy-usdt_inr/",
    strategy: "p2p_army",
  },
  kucoin: {
    display: "KuCoin P2P",
    url: "https://www.kucoin.com/otc/buy/USDT-INR",
    strategy: "p2p_army",
  },
  bitget: {
    display: "Bitget P2P",
    url: "https://www.bitget.com/p2p-trade",
    strategy: "p2p_army",
  },
  mexc: {
    display: "MEXC P2P",
    url: "https://p2p.mexc.com/",
    strategy: "p2p_army",
  },
  gate: {
    display: "Gate P2P",
    url: "https://www.gate.com/c2c",
    strategy: "p2p_army",
  },
  bingx: {
    display: "BingX P2P",
    url: "https://bingx.com/en/c2c/",
    strategy: "p2p_army",
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

type P2pArmyRow = {
  exchange: string;
  fiat: string;
  crypto: string;
  payment_method: string;
  buy_price: string | number | null;
  sell_price: string | number | null;
  buy_ads_count: number | null;
  sell_ads_count: number | null;
  activity_24h: number | null;
  observed_at: string;
};

function supabaseCreds(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function fetchFromDbDirect(
  source: Source,
  side: Side,
  fiat: string,
  crypto: string,
  creds: { url: string; key: string },
): Promise<{ quotes: Quote[]; observedAt: number | null; dbStatus: string }> {
  const meta = SOURCE_META[source];
  const restUrl =
    `${creds.url}/rest/v1/rates_feed` +
    `?select=*` +
    `&exchange=eq.${source}` +
    `&side=eq.${side}` +
    `&fiat=eq.${encodeURIComponent(fiat)}` +
    `&crypto=eq.${encodeURIComponent(crypto)}` +
    `&order=price.${side === "BUY" ? "asc" : "desc"}` +
    `&limit=100`;

  const res = await fetch(restUrl, {
    headers: {
      apikey: creds.key,
      authorization: `Bearer ${creds.key}`,
      accept: "application/json",
    },
  });
  if (!res.ok) {
    return { quotes: [], observedAt: null, dbStatus: `http-${res.status}` };
  }
  const rows: RatesFeedRow[] = await res.json();
  if (!rows.length) {
    return { quotes: [], observedAt: null, dbStatus: "empty" };
  }

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
  return { quotes, observedAt: newest, dbStatus: "ok" };
}

// Serve p2p.army-aggregated data (per-payment-method granularity, no individual
// merchants). We synthesize one Quote per payment method with the top-of-book
// price for that method, so the frontend's ranking UI Just Works.
async function fetchFromDbP2pArmy(
  source: Source,
  side: Side,
  fiat: string,
  crypto: string,
  creds: { url: string; key: string },
): Promise<{ quotes: Quote[]; observedAt: number | null; dbStatus: string }> {
  const meta = SOURCE_META[source];
  const priceCol = side === "BUY" ? "buy_price" : "sell_price";
  const restUrl =
    `${creds.url}/rest/v1/p2p_army_latest` +
    `?select=*` +
    `&exchange=eq.${source}` +
    `&fiat=eq.${encodeURIComponent(fiat)}` +
    `&crypto=eq.${encodeURIComponent(crypto)}` +
    `&price_type=eq.TOP1` +
    `&${priceCol}=not.is.null` +
    `&order=${priceCol}.${side === "BUY" ? "asc" : "desc"}` +
    `&limit=50`;

  const res = await fetch(restUrl, {
    headers: {
      apikey: creds.key,
      authorization: `Bearer ${creds.key}`,
      accept: "application/json",
    },
  });
  if (!res.ok) {
    return { quotes: [], observedAt: null, dbStatus: `http-${res.status}` };
  }
  const rows: P2pArmyRow[] = await res.json();
  if (!rows.length) {
    return { quotes: [], observedAt: null, dbStatus: "empty" };
  }

  const quotes: Quote[] = rows
    .map((r): Quote | null => {
      const price = side === "BUY" ? r.buy_price : r.sell_price;
      const adsCount = side === "BUY" ? r.buy_ads_count : r.sell_ads_count;
      if (price == null) return null;
      return {
        source: meta.display,
        sourceUrl: meta.url,
        price: Number(price),
        minINR: 0,
        maxINR: 0,
        availableUSDT: 0,
        merchant: `via ${r.payment_method}`,
        completionRate: null,
        orders: adsCount,
        payments: [r.payment_method],
      };
    })
    .filter((q): q is Quote => q !== null);

  const newest = Math.max(
    ...rows.map((r) => new Date(r.observed_at).getTime()),
  );
  return { quotes, observedAt: newest, dbStatus: "ok" };
}

// p2p.army snapshots are refreshed daily (vs direct crawler's 60s), so the
// stale window has to be much wider for these exchanges.
const STALE_THRESHOLD_P2PARMY_MS = 48 * 60 * 60 * 1000;

async function fetchFromDb(
  source: Source,
  side: Side,
  fiat: string,
  crypto: string,
): Promise<{ quotes: Quote[]; observedAt: number | null; dbStatus: string }> {
  const creds = supabaseCreds();
  if (!creds) {
    return {
      quotes: [],
      observedAt: null,
      dbStatus: "missing-env",
    };
  }
  const strategy = SOURCE_META[source].strategy;
  if (strategy === "direct") {
    return fetchFromDbDirect(source, side, fiat, crypto, creds);
  }
  return fetchFromDbP2pArmy(source, side, fiat, crypto, creds);
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

  if (!source || !(source in SOURCE_META)) {
    return new Response(JSON.stringify({ error: "unknown source" }), {
      status: 400,
      headers: commonHeaders,
    });
  }

  const strategy = SOURCE_META[source].strategy;
  const staleMs =
    strategy === "direct" ? STALE_THRESHOLD_MS : STALE_THRESHOLD_P2PARMY_MS;

  // Try DB first. Fall back to live scrape only for direct-crawled exchanges.
  let dbStatus = "uninit";
  try {
    const r = await fetchFromDb(source, side, fiat, crypto);
    dbStatus = r.dbStatus;
    const fresh =
      r.observedAt != null && Date.now() - r.observedAt < staleMs;
    if (r.quotes.length > 0 && fresh) {
      return new Response(
        JSON.stringify({
          quotes: r.quotes,
          source: "db",
          strategy,
          observed_at: r.observedAt,
          age_seconds: Math.floor((Date.now() - (r.observedAt ?? 0)) / 1000),
        }),
        { status: 200, headers: commonHeaders },
      );
    }
    if (r.observedAt != null && !fresh) dbStatus = "stale";
  } catch (e) {
    dbStatus = `throw:${e instanceof Error ? e.message : String(e)}`;
  }

  // Fallback: live exchange scrape — only available for direct-crawled exchanges.
  if (strategy === "direct" && source in fetchers) {
    try {
      const quotes = await fetchers[source as keyof typeof fetchers](side);
      return new Response(
        JSON.stringify({
          quotes,
          source: "live",
          strategy,
          db_status: dbStatus,
          observed_at: Date.now(),
        }),
        { status: 200, headers: commonHeaders },
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return new Response(
        JSON.stringify({ error: msg, db_status: dbStatus, quotes: [] }),
        { status: 200, headers: commonHeaders },
      );
    }
  }

  // p2p.army-only source with empty/stale DB: return empty with diagnostic.
  return new Response(
    JSON.stringify({
      quotes: [],
      source: "db",
      strategy,
      db_status: dbStatus,
      observed_at: null,
    }),
    { status: 200, headers: commonHeaders },
  );
}
