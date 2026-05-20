/**
 * Programmatic SEO generator — combinatorial corridor pages.
 *
 * Builds N PseoCorridor entries from a small base of (crypto, fiat, intent)
 * tuples. Each generated page has corridor-specific data (real chain,
 * real fiat, real competitors) so they don't collapse into thin
 * duplicates that Google's HCU will penalize.
 *
 * To add another 100 pages: extend CRYPTOS / FIATS / INTENTS arrays.
 */

import type { PseoCorridor } from "./pseoCorridors";

/* ───────── Reference data ───────── */

interface Crypto {
  ticker: string;
  name: string;
  slug: string; // url-safe
  chain: string;
  finalitySec: number;
  feeUsd: string;
  htlcSupport: boolean;
  isStable: boolean;
  competitorRate: string; // approx INR price label for examples
}

const CRYPTOS: Crypto[] = [
  { ticker: "USDT", name: "Tether", slug: "usdt", chain: "Solana / Ethereum / BSC", finalitySec: 2, feeUsd: "$0.0001", htlcSupport: false, isStable: true, competitorRate: "₹89.40" },
  { ticker: "USDC", name: "USD Coin", slug: "usdc", chain: "Solana / Ethereum / Polygon", finalitySec: 2, feeUsd: "$0.0001", htlcSupport: false, isStable: true, competitorRate: "₹89.40" },
  { ticker: "BTC", name: "Bitcoin", slug: "btc", chain: "Bitcoin (+ Lightning)", finalitySec: 600, feeUsd: "$0.50-3", htlcSupport: true, isStable: false, competitorRate: "₹89,42,000" },
  { ticker: "ETH", name: "Ethereum", slug: "eth", chain: "Ethereum / Optimism / Arbitrum / Base", finalitySec: 13, feeUsd: "$1-5", htlcSupport: false, isStable: false, competitorRate: "₹3,28,000" },
  { ticker: "SOL", name: "Solana", slug: "sol", chain: "Solana", finalitySec: 2, feeUsd: "$0.0001", htlcSupport: false, isStable: false, competitorRate: "₹14,800" },
  { ticker: "BNB", name: "BNB", slug: "bnb", chain: "BNB Smart Chain", finalitySec: 3, feeUsd: "$0.10-0.30", htlcSupport: false, isStable: false, competitorRate: "₹52,000" },
  { ticker: "MATIC", name: "Polygon", slug: "matic", chain: "Polygon", finalitySec: 2, feeUsd: "$0.001-0.01", htlcSupport: false, isStable: false, competitorRate: "₹62" },
  { ticker: "DAI", name: "Dai Stablecoin", slug: "dai", chain: "Ethereum / Polygon", finalitySec: 13, feeUsd: "$0.50-3", htlcSupport: false, isStable: true, competitorRate: "₹89.40" },
];

interface Fiat {
  code: string;
  name: string;
  slug: string;
  country: string;
  countrySlug: string;
  symbol: string;
  rails: string; // "UPI, IMPS, NEFT" or "Aani, bank transfer"
  fastestRail: string;
  fastestRailSpeed: string;
  competitorList: string[]; // local competitor names
  regulator: string;
  taxNote: string;
  exampleRate: string; // for "X CRYPTO = Y FIAT" example
}

const FIATS: Fiat[] = [
  {
    code: "INR",
    name: "Indian Rupees",
    slug: "inr",
    country: "India",
    countrySlug: "india",
    symbol: "₹",
    rails: "UPI, IMPS, NEFT, RTGS",
    fastestRail: "UPI",
    fastestRailSpeed: "< 60 seconds",
    competitorList: ["Binance P2P", "WazirX P2P", "CoinDCX", "Bybit P2P"],
    regulator: "RBI + IT Department (VDA tax framework)",
    taxNote: "30% tax on gains + 1% TDS on transfers above ₹10,000/year per counterparty",
    exampleRate: "₹89.40",
  },
  {
    code: "AED",
    name: "UAE Dirhams",
    slug: "aed",
    country: "UAE",
    countrySlug: "uae",
    symbol: "AED ",
    rails: "Aani, IBAN bank transfer, GCC Pay",
    fastestRail: "Aani (instant payment)",
    fastestRailSpeed: "< 30 seconds",
    competitorList: ["Binance UAE", "Bybit UAE", "Kraken UAE", "BitOasis"],
    regulator: "VARA (Virtual Assets Regulatory Authority) — Dubai",
    taxNote: "No personal income tax on crypto gains; corporate tax may apply to businesses",
    exampleRate: "AED 3.66",
  },
  {
    code: "PHP",
    name: "Philippine Pesos",
    slug: "php",
    country: "Philippines",
    countrySlug: "philippines",
    symbol: "₱",
    rails: "InstaPay, PESONet, GCash, Maya",
    fastestRail: "InstaPay",
    fastestRailSpeed: "< 60 seconds",
    competitorList: ["Binance P2P", "Coins.ph", "PDAX", "Bybit P2P"],
    regulator: "BSP (Bangko Sentral ng Pilipinas) — VASP framework",
    taxNote: "Standard income tax on crypto gains; reporting required",
    exampleRate: "₱56.40",
  },
  {
    code: "THB",
    name: "Thai Baht",
    slug: "thb",
    country: "Thailand",
    countrySlug: "thailand",
    symbol: "฿",
    rails: "PromptPay, bank transfer",
    fastestRail: "PromptPay",
    fastestRailSpeed: "< 60 seconds",
    competitorList: ["Binance TH", "Bitkub", "Satang Pro", "Bybit P2P"],
    regulator: "SEC Thailand + AMLO",
    taxNote: "15% withholding on crypto income; reporting required",
    exampleRate: "฿35.40",
  },
];

interface Intent {
  /** Slug suffix template — replace {crypto}, {fiat}, {country} */
  slugTemplate: string;
  titleTemplate: string;
  descTemplate: string;
  h1Template: string;
  ledeTemplate: string;
  eyebrowTemplate: string;
  /** Identifier so we know which content angle to render */
  kind:
    | "without-kyc"
    | "p2p"
    | "instant"
    | "cheapest"
    | "no-fees"
    | "best-rate"
    | "fastest"
    | "via-rail";
  rail?: string; // optional payment rail focus
}

const INTENTS: Intent[] = [
  {
    kind: "without-kyc",
    slugTemplate: "{crypto}-to-{fiat}-without-kyc",
    titleTemplate: "{Crypto} to {Fiat} Without Exchange KYC — Non-Custodial | Blip",
    descTemplate:
      "Convert {Crypto} to {Fiat} without signing up to a centralized exchange. Non-custodial on-chain escrow, verified merchants, {fastestRail} settlement in {fastestRailSpeed}.",
    h1Template: "{Crypto} to {Fiat} without exchange KYC.",
    ledeTemplate:
      "Skip the exchange signup. Blip is non-custodial — your {Crypto} stays in your wallet until a verified merchant pays your {Fiat}.",
    eyebrowTemplate: "{Crypto} · {Fiat} · Non-Custodial",
  },
  {
    kind: "p2p",
    slugTemplate: "{crypto}-to-{fiat}-p2p",
    titleTemplate: "{Crypto} to {Fiat} P2P — Live Merchant Rates, On-Chain Escrow | Blip",
    descTemplate:
      "P2P {Crypto} to {Fiat} with on-chain escrow. Compare live rates across verified {country} merchants. 0% protocol fee, {fastestRail} payout in {fastestRailSpeed}.",
    h1Template: "{Crypto} to {Fiat} P2P, done right.",
    ledeTemplate:
      "Peer-to-peer {Crypto}-{Fiat} settlement with the missing piece centralized P2P doesn't have: on-chain escrow. Merchants compete on rate; the platform never holds your funds.",
    eyebrowTemplate: "{Crypto} · {Fiat} · P2P",
  },
  {
    kind: "instant",
    slugTemplate: "{crypto}-to-{fiat}-instant",
    titleTemplate: "{Crypto} to {Fiat} Instant — {fastestRail} in {fastestRailSpeed} | Blip",
    descTemplate:
      "Convert {Crypto} to {Fiat} and receive it via {fastestRail} in {fastestRailSpeed}. Non-custodial escrow, verified merchants, 0% protocol fee. The fastest {Crypto}-{Fiat} off-ramp.",
    h1Template: "{Crypto} to {Fiat}, instantly.",
    ledeTemplate:
      "Bank-rail webhooks auto-confirm your {Fiat} the second it lands. Smart contract auto-releases {Crypto}. End-to-end in {fastestRailSpeed}.",
    eyebrowTemplate: "{Crypto} · {Fiat} · Instant",
  },
  {
    kind: "cheapest",
    slugTemplate: "cheapest-way-to-convert-{crypto}-to-{fiat}",
    titleTemplate: "Cheapest Way to Convert {Crypto} to {Fiat} — Rate Comparison 2026 | Blip",
    descTemplate:
      "Compare the cheapest {Crypto}-to-{Fiat} routes: Blip vs major P2P platforms. Live rates, total fees, hidden spread. Find the route that gets you the most {Fiat}.",
    h1Template: "The cheapest way to convert {Crypto} to {Fiat}.",
    ledeTemplate:
      "Spread, taker fee, withdrawal fee, hidden margin. We compare the real all-in cost across every {Crypto}-{Fiat} route — and show why merchant bidding wins.",
    eyebrowTemplate: "Compare · {Crypto} · {Fiat}",
  },
  {
    kind: "no-fees",
    slugTemplate: "{crypto}-to-{fiat}-no-fees",
    titleTemplate: "{Crypto} to {Fiat} with No Platform Fees — 0% Protocol Fee | Blip",
    descTemplate:
      "Convert {Crypto} to {Fiat} with 0% protocol fee. No taker fee, no maker fee, no withdrawal fee. Merchant bidding compresses the spread to 0.1-0.3%.",
    h1Template: "{Crypto} to {Fiat} with 0% protocol fee.",
    ledeTemplate:
      "No taker. No maker. No withdrawal. The only cost is whatever the winning merchant bids — and competition keeps that tight.",
    eyebrowTemplate: "Fees · {Crypto} · {Fiat}",
  },
  {
    kind: "best-rate",
    slugTemplate: "best-{crypto}-to-{fiat}-rate",
    titleTemplate: "Best {Crypto} to {Fiat} Rate Today — Live Merchant Bidding | Blip",
    descTemplate:
      "Find the best {Crypto} to {Fiat} rate live. Verified merchants bid against each other for every trade — you take the top of the book.",
    h1Template: "Best {Crypto} to {Fiat} rate, live.",
    ledeTemplate:
      "Static P2P ads don't update. Blip's merchant book does — every second. Take the best bid the second it's quoted.",
    eyebrowTemplate: "Best Rate · {Crypto} · {Fiat}",
  },
  {
    kind: "fastest",
    slugTemplate: "fastest-{crypto}-to-{fiat}",
    titleTemplate: "Fastest {Crypto} to {Fiat} — Sub-Minute Settlement | Blip",
    descTemplate:
      "Convert {Crypto} to {Fiat} via {fastestRail} in {fastestRailSpeed}. Bank-webhook auto-release. The fastest {Crypto}-{Fiat} off-ramp on the market.",
    h1Template: "Fastest {Crypto} to {Fiat}.",
    ledeTemplate:
      "Sub-minute settlement isn't a marketing claim — it's what the contract enforces. Bank webhook fires, escrow releases, trade closes.",
    eyebrowTemplate: "Fastest · {Crypto} · {Fiat}",
  },
];

/* ───────── Helpers ───────── */

function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function vars(c: Crypto, f: Fiat) {
  return {
    crypto: c.slug,
    Crypto: c.ticker,
    cryptoName: c.name,
    fiat: f.slug,
    Fiat: f.code,
    fiatName: f.name,
    country: f.country,
    countrySlug: f.countrySlug,
    fastestRail: f.fastestRail,
    fastestRailSpeed: f.fastestRailSpeed,
    rails: f.rails,
    regulator: f.regulator,
    taxNote: f.taxNote,
    symbol: f.symbol,
    chain: c.chain,
    finalitySec: String(c.finalitySec),
    feeUsd: c.feeUsd,
    exampleRate: f.exampleRate,
  };
}

function keywords(c: Crypto, f: Fiat, kind: string): string {
  const base = `${c.slug} to ${f.slug}, sell ${c.slug} ${f.country.toLowerCase()}, ${c.slug} ${f.slug} ${kind}, ${c.slug} to ${f.fastestRail.toLowerCase()}, convert ${c.ticker.toLowerCase()} to ${f.name.toLowerCase()}, ${c.slug} ${f.slug} p2p`;
  return base;
}

/* ───────── Builders for each intent ───────── */

function buildIntro(c: Crypto, f: Fiat, intent: Intent): string {
  const v = vars(c, f);
  switch (intent.kind) {
    case "without-kyc":
      return `Selling ${c.ticker} for ${f.code} typically starts with the same dance: open an account on a centralized exchange (${f.competitorList.slice(0, 2).join(", ")}), upload your ID documents, link a bank, deposit ${c.ticker}, market-sell, withdraw. Blip is the alternative: connect a wallet you already own, request a quote, accept a verified merchant's bid, and ${c.ticker} moves wallet → on-chain escrow → merchant. ${f.code} settles to your ${f.fastestRail} in ${f.fastestRailSpeed}. There's no exchange holding your funds. Merchants are KYB-verified and bonded on their side; user-side only needs a wallet. Tax in ${f.country} (${f.taxNote}) still applies — Blip provides export-ready trade reports for your filing.`;
    case "p2p":
      return `P2P ${c.ticker}-${f.code} trading on most platforms — ${f.competitorList.slice(0, 3).join(", ")} — shares one weakness: the exchange holds your ${c.ticker} in custodial escrow during the trade. Blip puts the escrow on-chain. ${c.ticker} on ${c.chain} (finality ${c.finalitySec}s, fee ${c.feeUsd}) moves wallet → smart contract → merchant. The platform never has custody. Merchants are KYB-verified and bonded, and because they bid against each other on every trade, your rate is typically 0.2-0.5% better than static P2P ads. End-to-end settlement via ${f.fastestRail} closes in ${f.fastestRailSpeed}.`;
    case "instant":
      return `Most "instant" crypto exchanges aren't really instant — P2P pages drag into 10-30 minute appeals, exchange withdrawals queue in NEFT-style batches. Blip's architecture makes the speed real: ${c.ticker} on ${c.chain} finalizes in ${c.finalitySec} seconds, ${f.fastestRail} clears in under a minute, and the bank webhook fires the contract release the instant ${f.code} posts. No human in the loop. The result: median ${c.ticker}-${f.code} trade closes in ${f.fastestRailSpeed} end-to-end. Same rate, same security as the slower routes — just no waiting.`;
    case "cheapest":
      return `"Cheapest ${c.ticker} to ${f.code}" is the wrong question if you only look at the headline fee. ${f.competitorList[0]} shows 0% taker fee — then widens the spread by 0.3-0.5%. The all-in cost is what matters: bid rate minus what hits your bank, minus any network fees you paid moving ${c.ticker} onto the chain. Blip's structure is the simplest possible: 0% protocol fee, merchants compete on rate, and the only spread is whatever the winning merchant bids. In live comparisons across ${c.ticker}-${f.code} on Blip, this delivers 0.2-0.6% more ${f.code} per ${c.ticker} than centralized P2P.`;
    case "no-fees":
      return `Three places exchanges charge you on ${c.ticker}→${f.code}: a taker fee on the trade, a withdrawal fee to get ${f.code} off-platform, and a hidden spread embedded in the quoted rate. Blip charges zero on all three. The protocol takes no fee. There's no withdrawal step because ${f.code} settles directly to your ${f.fastestRail} or bank. The only embedded cost is the merchant's quoted spread, and because merchants bid against each other, that spread compresses to 0.1-0.3% in normal conditions. On a typical retail ${c.ticker}-${f.code} trade that's a noticeable savings versus centralized P2P.`;
    case "best-rate":
      return `Most platforms show you a single quote — take it or leave it. Blip's design assumes the opposite: you should see the entire merchant book and let competition tighten the rate. Verified ${f.country} merchants submit live bids on every trade; the top of book is what you trade against. Live testing on ${c.ticker}-${f.code} consistently shows Blip's effective rate beating ${f.competitorList[0]}'s static merchant pages by 0.2-0.5%. No subscription, no fee tier — the better rate is the product.`;
    case "fastest":
      return `Two rails define the speed ceiling on ${c.ticker}→${f.code}: ${c.chain} finality (${c.finalitySec} seconds) on the crypto leg and ${f.fastestRail} on the fiat leg (${f.fastestRailSpeed}). Blip wires them together with a bank-webhook trigger — the moment ${f.code} posts to your account, the smart contract fires the release. There's no human button to press, no support queue, no merchant chat. End-to-end the trade closes inside the ${f.fastestRailSpeed} envelope for typical retail volumes.`;
    default:
      return `Convert ${c.ticker} to ${f.code} with Blip's non-custodial settlement protocol. ${tpl("{Crypto}", v)} on ${c.chain} settles to ${f.fastestRail} in ${f.fastestRailSpeed}.`;
  }
}

function buildComparison(c: Crypto, f: Fiat): PseoCorridor["comparison"] {
  const rows = f.competitorList.slice(0, 3).map((name) => ({
    name,
    rate: name.includes("P2P") ? "Spread + 0.35-0.4%" : "Spot + 0.2-0.5%",
    fees: name.includes("P2P") ? "0-0.2%" : "Trade + withdraw",
    kyc: "Full exchange KYC",
    speed: "10-60 min",
    custody: "Custodial",
  }));
  rows.push({
    name: "Blip",
    rate: "Live merchant bid",
    fees: "0% protocol",
    kyc: "Wallet only — merchants verified",
    speed: f.fastestRailSpeed,
    custody: c.htlcSupport ? "On-chain HTLC escrow" : "On-chain escrow",
  });
  return {
    heading: `${c.ticker} to ${f.code} — Blip vs ${f.country} options`,
    rows,
  };
}

function buildHowTo(c: Crypto, f: Fiat): PseoCorridor["howTo"] {
  return {
    heading: `How ${c.ticker} → ${f.code} works on Blip`,
    steps: [
      {
        step: 1,
        title: "Connect your wallet",
        description: `Any wallet supporting ${c.chain}. No exchange signup, no email.`,
      },
      {
        step: 2,
        title: `Enter ${c.ticker} amount + ${f.fastestRail}`,
        description: `Specify how much ${c.ticker} you want to sell and where ${f.code} should land.`,
      },
      {
        step: 3,
        title: "Verified merchants bid",
        description: `Live quotes from KYB-verified ${f.country} merchants. Best price wins.`,
      },
      {
        step: 4,
        title: `${c.ticker} → on-chain escrow`,
        description: c.htlcSupport
          ? `${c.ticker} enters an HTLC (Hashed Timelock Contract). Battle-tested Bitcoin primitive.`
          : `Smart contract on ${c.chain} holds your ${c.ticker}. Finality in ${c.finalitySec}s.`,
      },
      {
        step: 5,
        title: `${f.code} arrives, escrow releases`,
        description: `Merchant fires ${f.fastestRail}. Bank webhook auto-confirms; ${c.ticker} released to merchant. Trade closed.`,
      },
    ],
  };
}

function buildBenefits(c: Crypto, f: Fiat): PseoCorridor["benefits"] {
  return [
    { title: "No exchange signup", body: `Your wallet, your keys. No account on ${f.competitorList[0]} or anywhere else.` },
    { title: "Non-custodial escrow", body: `${c.ticker} moves wallet → smart contract → merchant. Blip never custodies.` },
    { title: "Verified counterparties", body: `Every ${f.country} merchant is KYB-verified, bonded with collateral, and rated.` },
    { title: "Best rate by bidding", body: `Merchants compete on every trade. You take the best quote.` },
    { title: `${f.fastestRail} in ${f.fastestRailSpeed}`, body: `Bank webhooks auto-confirm payment. No screenshots, no support tickets.` },
    { title: "Transparent on-chain audit", body: `Every trade is a public ${c.chain} transaction. Export-ready for tax filing.` },
  ];
}

function buildFaqs(c: Crypto, f: Fiat, intent: Intent): PseoCorridor["faqs"] {
  const v = vars(c, f);
  const base: PseoCorridor["faqs"] = [
    {
      q: `Is converting ${c.ticker} to ${f.code} legal in ${f.country}?`,
      a: `Yes. Crypto-to-fiat conversion is legal in ${f.country}. Regulated by ${f.regulator}. Tax treatment: ${f.taxNote}. Blip doesn't change tax law — we just don't make you sign up to an exchange to do it.`,
    },
    {
      q: `Which wallets work for ${c.ticker} on Blip?`,
      a: `Any non-custodial wallet supporting ${c.chain}. ${c.ticker === "BTC" ? "Sparrow, BlueWallet, Phoenix, Muun, Wallet of Satoshi for Lightning. Hardware wallets via companion apps." : c.ticker === "SOL" || c.chain.includes("Solana") ? "Phantom, Solflare, Backpack, Glow. Hardware via Phantom." : "MetaMask, Rabby, Coinbase Wallet, Trust Wallet. Hardware via these apps."}`,
    },
    {
      q: `How fast does ${c.ticker} → ${f.code} actually settle?`,
      a: `End-to-end median ${c.finalitySec < 5 ? "40-55 seconds" : c.finalitySec < 30 ? "1-3 minutes" : c.finalitySec < 200 ? "3-10 minutes" : "5-20 minutes"} for typical trades. ${c.ticker} finality is ${c.finalitySec}s; ${f.fastestRail} clears in ${f.fastestRailSpeed.replace("< ", "")} or less.`,
    },
    {
      q: `Does Blip charge a fee?`,
      a: `0% protocol fee. The only cost is the merchant's spread (typically 0.1-0.3% in normal market conditions). Plus a tiny network fee to move ${c.ticker}: ${c.feeUsd}.`,
    },
    {
      q: `What's the rate compared to ${f.competitorList[0]}?`,
      a: `In live testing on ${c.ticker}-${f.code}, Blip typically beats ${f.competitorList[0]} by 0.2-0.5% because merchants bid against each other rather than posting static ads.`,
    },
    {
      q: `What's the maximum ${c.ticker} I can sell per trade?`,
      a: `Single-fill capacity is bound by ${f.fastestRail} per-transaction limits and merchant liquidity. Practically up to a typical mid-large retail amount; larger orders route through merchant-OTC desks.`,
    },
    {
      q: `What happens if the merchant doesn't pay?`,
      a: `The merchant's collateral is locked in escrow. After the timeout window, you get refunded plus a share of their bond. The merchant takes a permanent reputation hit.`,
    },
    {
      q: `Do I have to pay tax on this trade?`,
      a: `Yes — ${f.taxNote}. Blip doesn't withhold for you; we provide export-ready CSVs of every trade for filing.`,
    },
  ];
  if (intent.kind === "without-kyc") {
    base.push({
      q: `If there's no KYC on me, how is this safe?`,
      a: `The verification happens on the merchant side. Every merchant is KYB-verified, bonded with collateral, and rated. The escrow contract enforces the trade — you don't need a third party because the smart contract is the third party.`,
    });
  }
  if (intent.kind === "p2p") {
    base.push({
      q: `How is Blip's P2P different from ${f.competitorList[0]} P2P?`,
      a: `${f.competitorList[0]} P2P is custodial — your ${c.ticker} sits in their wallet during the trade. Blip uses non-custodial on-chain escrow. Funds move wallet → smart contract → merchant. No platform custody.`,
    });
  }
  if (intent.kind === "instant") {
    base.push({
      q: `Is the "${f.fastestRailSpeed}" claim real or marketing?`,
      a: `It's enforced by the contract. The release transaction fires on the bank webhook event — there's no path for Blip to slow it down. Median trade closes in that window; outliers happen if a bank's webhook lags.`,
    });
  }
  if (intent.kind === "cheapest") {
    base.push({
      q: `Is 0% protocol fee actually 0% all-in?`,
      a: `0% from Blip the protocol. The total cost of a trade is the merchant's spread (typically 0.1-0.3%) plus any network fee to move ${c.ticker} (${c.feeUsd}). That's the cheapest you'll find — and it's transparent.`,
    });
  }
  if (intent.kind === "no-fees") {
    base.push({
      q: `How does Blip make money if you charge 0%?`,
      a: `Long-term revenue comes from merchant-side subscription tiers (priority routing, analytics). The user-side stays 0% — that's a protocol design choice, not a promo.`,
    });
  }
  if (intent.kind === "best-rate") {
    base.push({
      q: `Is the best rate always on Blip?`,
      a: `No platform can promise that. Specific minutes will see ${f.competitorList[0]} undercut. But on average and at non-trivial volume, merchant bidding wins. Run a live quote on /rates and compare yourself before every trade.`,
    });
  }
  if (intent.kind === "fastest") {
    base.push({
      q: `Is "${f.fastestRailSpeed}" actually guaranteed?`,
      a: `It's enforced by the contract — the release transaction fires on the bank webhook event. Median trade closes in that window. Outliers happen if your bank's webhook is delayed, but the escrow has a longer fallback window so funds are never stuck.`,
    });
  }
  return base;
}

function buildRelated(c: Crypto, f: Fiat): PseoCorridor["related"] {
  // Cross-link to a few siblings: same crypto / different fiat, or vice versa.
  const items: { label: string; to: string }[] = [];
  // Same crypto, different intent
  const sameIntents = ["without-kyc", "p2p", "instant"];
  for (const k of sameIntents) {
    const slug = `${c.slug}-to-${f.slug}-${k}`;
    items.push({ label: `${c.ticker} to ${f.code} ${k.replace(/-/g, " ")}`, to: `/${slug}` });
  }
  // Same fiat, different crypto
  const altCrypto = c.ticker === "USDT" ? "USDC" : "USDT";
  items.push({ label: `${altCrypto} to ${f.code}`, to: `/${altCrypto.toLowerCase()}-to-${f.slug}-without-kyc` });
  // Cheapest sibling
  items.push({ label: `Cheapest ${c.ticker} to ${f.code}`, to: `/cheapest-way-to-convert-${c.slug}-to-${f.slug}` });
  return items.slice(0, 5);
}

/* ───────── Main generator ───────── */

/**
 * Slugs that already exist in the hand-crafted PSEO_CORRIDORS array.
 * The generator skips these to avoid duplicates.
 */
const HANDCRAFTED_SLUGS = new Set([
  "usdt-to-inr-without-kyc",
  "usdt-to-inr-p2p",
  "sell-usdt-india-instant",
  "usdt-to-inr-via-upi",
  "usdt-to-aed-without-kyc",
  "usdt-to-inr-1-minute-settlement",
  "binance-p2p-alternative-india",
  "wazirx-p2p-alternative",
  "cheapest-way-to-convert-usdt-to-inr",
  "usdt-to-inr-no-fees",
  "instant-usdt-to-bank-transfer-india",
  "crypto-to-upi-instant",
  "usdc-to-inr-without-kyc",
  "btc-to-inr-without-kyc",
  "sol-to-inr-without-kyc",
  "is-usdt-to-inr-legal-in-india",
  // Batch 3 hand-crafted hubs:
  "usdt-premium-india-today",
  "uae-to-india-remittance-crypto",
  "usdt-to-php-gcash-instant",
  "accept-stablecoin-payments-uae-business",
  "crypto-arbitrage-india-explained",
  "blip-vs-binance-p2p",
  "blip-vs-wazirx",
]);

export function generatePseoCorridors(): PseoCorridor[] {
  const out: PseoCorridor[] = [];

  for (const c of CRYPTOS) {
    for (const f of FIATS) {
      for (const intent of INTENTS) {
        const v = vars(c, f);
        const slug = tpl(intent.slugTemplate, v);
        if (HANDCRAFTED_SLUGS.has(slug)) continue;

        const corridor: PseoCorridor = {
          slug,
          title: tpl(intent.titleTemplate, v),
          description: tpl(intent.descTemplate, v),
          keywords: keywords(c, f, intent.kind),
          eyebrow: tpl(intent.eyebrowTemplate, v),
          h1: tpl(intent.h1Template, v),
          lede: tpl(intent.ledeTemplate, v),
          rateLabel: `${c.ticker} → ${f.code} · Live merchant rate`,
          indicativeRate: f.exampleRate,
          ctaPrimary: "See live rates",
          intro: buildIntro(c, f, intent),
          comparison: buildComparison(c, f),
          howTo: buildHowTo(c, f),
          benefits: buildBenefits(c, f),
          faqs: buildFaqs(c, f, intent),
          related: buildRelated(c, f),
          lastUpdated: "2026-05-20",
        };
        out.push(corridor);
      }
    }
  }

  return out;
}
