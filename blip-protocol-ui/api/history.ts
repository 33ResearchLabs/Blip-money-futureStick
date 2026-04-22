// Vercel Edge function — P2P rate history bars.
// Reads from Supabase view rate_history_5m_best (populated from the ads
// time-series). Returns 5-min bars for the last hour by default.
//
// GET /api/history?fiat=INR&crypto=USDT
// Returns { bars: [{ t, best_buy, best_sell, exchanges_seen }], observed_at }

export const config = { runtime: "edge" };

type Bar = {
  t: number; // unix ms
  best_buy: number | null;
  best_sell: number | null;
  exchanges_seen: number;
};

type Row = {
  bucket: string;
  fiat: string;
  crypto: string;
  best_buy: string | number | null;
  best_sell: string | number | null;
  exchanges_seen: number;
};

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const fiat = (url.searchParams.get("fiat") ?? "INR").toUpperCase();
  const crypto = (url.searchParams.get("crypto") ?? "USDT").toUpperCase();

  const supaUrl =
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supaKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  const commonHeaders = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
  };

  if (!supaUrl || !supaKey) {
    return new Response(
      JSON.stringify({ error: "db not configured", bars: [] }),
      { status: 200, headers: commonHeaders },
    );
  }

  const restUrl =
    `${supaUrl}/rest/v1/rate_history_5m_best` +
    `?fiat=eq.${encodeURIComponent(fiat)}` +
    `&crypto=eq.${encodeURIComponent(crypto)}` +
    `&order=bucket.asc` +
    `&limit=200`;

  try {
    const res = await fetch(restUrl, {
      headers: {
        apikey: supaKey,
        authorization: `Bearer ${supaKey}`,
        accept: "application/json",
      },
    });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `http-${res.status}`, bars: [] }),
        { status: 200, headers: commonHeaders },
      );
    }
    const rows: Row[] = await res.json();
    const bars: Bar[] = rows.map((r) => ({
      t: new Date(r.bucket).getTime(),
      best_buy: r.best_buy != null ? Number(r.best_buy) : null,
      best_sell: r.best_sell != null ? Number(r.best_sell) : null,
      exchanges_seen: r.exchanges_seen,
    }));
    return new Response(
      JSON.stringify({ bars, observed_at: Date.now() }),
      { status: 200, headers: commonHeaders },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg, bars: [] }), {
      status: 200,
      headers: commonHeaders,
    });
  }
}
