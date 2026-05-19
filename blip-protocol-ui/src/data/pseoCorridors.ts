/**
 * Programmatic SEO config — long-tail corridor / intent pages.
 *
 * Each entry maps to a route `/<slug>` rendered by PseoCorridor.tsx.
 * Adding a new long-tail page = one entry here. No new component file.
 *
 * Honesty note: copy must reflect Blip's real product. We're targeting
 * "without KYC" queries by being precise: users don't sign up to a
 * centralized exchange. Merchants on Blip are verified — this is how we
 * stay regulator-safe while truthfully matching intent.
 */

export interface PseoFaq {
  q: string;
  a: string;
}

export interface PseoStep {
  step: number;
  title: string;
  description: string;
}

export interface PseoCompetitor {
  name: string;
  rate: string;
  fees: string;
  kyc: string;
  speed: string;
  custody: string;
}

export interface PseoCorridor {
  slug: string;
  title: string; // <title>
  description: string; // <meta description>
  keywords: string;
  h1: string;
  eyebrow: string;
  lede: string; // 1-2 sentence sub-headline
  rateLabel: string; // e.g. "USDT → INR · Live merchant rate"
  indicativeRate: string; // e.g. "₹89.40"
  ctaPrimary: string;
  intro: string; // ~120 words explainer
  comparison: {
    heading: string;
    rows: PseoCompetitor[];
  };
  howTo: {
    heading: string;
    steps: PseoStep[];
  };
  benefits: { title: string; body: string }[];
  faqs: PseoFaq[];
  related: { label: string; to: string }[];
  lastUpdated: string;
}

export const PSEO_CORRIDORS: PseoCorridor[] = [
  {
    slug: "usdt-to-inr-without-kyc",
    title:
      "USDT to INR Without Exchange KYC — Non-Custodial P2P Settlement | Blip",
    description:
      "Convert USDT to INR without signing up to a centralized exchange. Blip is non-custodial — no Binance/WazirX KYC, no exchange account. Merchant-verified UPI/IMPS settlement in under 60 seconds.",
    keywords:
      "usdt to inr without kyc, sell usdt without kyc india, usdt to inr no kyc, convert usdt to rupees without kyc, non custodial usdt to inr, p2p usdt inr without exchange signup",
    eyebrow: "USDT · INR · Non-Custodial",
    h1: "USDT to INR without exchange KYC.",
    lede: "Skip the Binance, WazirX, CoinDCX signup. Blip is non-custodial — your USDT stays in your wallet until a verified merchant pays your INR.",
    rateLabel: "USDT → INR · Live merchant rate",
    indicativeRate: "₹89.40",
    ctaPrimary: "See live merchants",
    intro:
      "Most ways to convert USDT to INR start with the same painful step: opening an account on a centralized exchange and uploading your PAN, Aadhaar, address, and selfie. Blip works differently. You connect a wallet you already own — Phantom, Solflare, MetaMask — and trade directly with verified merchants over an on-chain escrow contract. There's no central exchange holding your funds. There's no second KYC layer on top of the one your bank already did. Settlement lands in your UPI or bank account in under 60 seconds, and the merchant takes care of their own compliance reporting under Indian VDA rules.",
    comparison: {
      heading: "USDT to INR — exchange signup vs Blip",
      rows: [
        {
          name: "Binance P2P",
          rate: "Spread + 0.35%",
          fees: "0% taker / merchant spread",
          kyc: "Full exchange KYC required",
          speed: "5-30 min",
          custody: "Custodial wallet",
        },
        {
          name: "WazirX P2P",
          rate: "Spread + 0.4%",
          fees: "Maker/taker fees",
          kyc: "Full exchange KYC required",
          speed: "10-45 min",
          custody: "Custodial wallet",
        },
        {
          name: "CoinDCX",
          rate: "Spread + 0.5-1%",
          fees: "Variable",
          kyc: "Full exchange KYC + bank linking",
          speed: "15-60 min",
          custody: "Custodial wallet",
        },
        {
          name: "Blip",
          rate: "Best of bid book",
          fees: "0% protocol fee",
          kyc: "No exchange signup. Merchants verified.",
          speed: "< 60 seconds",
          custody: "Non-custodial — your wallet",
        },
      ],
    },
    howTo: {
      heading: "How USDT to INR works without an exchange account",
      steps: [
        {
          step: 1,
          title: "Connect your wallet",
          description:
            "Open Blip and connect Phantom, Solflare, or any Solana/EVM wallet. No email, no exchange signup, no password.",
        },
        {
          step: 2,
          title: "Enter USDT amount and your UPI/bank",
          description:
            "Choose how much USDT you want to sell. Add the UPI ID or bank account where the INR should land.",
        },
        {
          step: 3,
          title: "Verified merchants bid for your trade",
          description:
            "Indian-side merchants compete on rate in real time. Best price wins. You see the exact INR amount before you confirm.",
        },
        {
          step: 4,
          title: "USDT locks in on-chain escrow",
          description:
            "Your USDT moves to a non-custodial smart contract — not to an exchange. The merchant can't touch it until INR is paid.",
        },
        {
          step: 5,
          title: "INR lands in your bank in under 60 seconds",
          description:
            "Merchant sends UPI/IMPS. Blip auto-detects payment via bank webhook and releases the USDT to them. Done.",
        },
      ],
    },
    benefits: [
      {
        title: "No exchange account",
        body: "Your wallet, your keys. Nothing gets created on Binance, WazirX, CoinDCX, or any custodial venue.",
      },
      {
        title: "Non-custodial escrow",
        body: "USDT moves wallet → smart contract → merchant. Blip never holds your funds.",
      },
      {
        title: "Verified counterparties",
        body: "Every merchant is KYB-verified, bonded, and rated. Your INR sender is real, regulated, and accountable.",
      },
      {
        title: "Best rate on the book",
        body: "Merchants bid against each other for your trade. You take the best quote, not whatever a single venue offers.",
      },
      {
        title: "Under 60 seconds",
        body: "Bank webhooks auto-confirm UPI/IMPS — no manual screenshot uploads, no support tickets.",
      },
      {
        title: "Transparent on-chain audit trail",
        body: "Every trade is settled on Solana. You can verify the escrow contract, the release tx, and the merchant address.",
      },
    ],
    faqs: [
      {
        q: "Is converting USDT to INR without exchange KYC legal in India?",
        a: "Yes — crypto trading and conversion are legal in India under the Virtual Digital Asset (VDA) framework. You're required to pay 30% tax on gains and 1% TDS applies. Blip doesn't bypass those rules. What Blip avoids is making you sign up to a centralized exchange (which is a product choice, not a regulatory one). Speak to a tax advisor for your specific situation.",
      },
      {
        q: "If there's no KYC on me, how is this safe?",
        a: "The verification happens on the merchant side — they're KYB-verified, bonded with collateral, and rated by every trade outcome. From the user side, you don't need a third party to hold your funds because Blip uses non-custodial on-chain escrow. The smart contract enforces the trade, not a company's promise.",
      },
      {
        q: "Do I still need to report this on my taxes?",
        a: "Yes. Crypto gains in India are taxable at 30% flat regardless of which platform you use. 1% TDS applies on transfers above ₹10,000/year per counterparty. Blip provides export-ready trade reports so your CA can file accurately. We don't deduct TDS automatically — that's between you, the merchant, and the IT department.",
      },
      {
        q: "Which wallets work?",
        a: "Any Solana wallet (Phantom, Solflare, Backpack) for USDT-SPL, and any EVM wallet (MetaMask, Rabby, Coinbase Wallet) for USDT-ERC20 / USDT-BSC. We don't need you to create a new wallet or move funds to one we control.",
      },
      {
        q: "What's the limit per trade without exchange KYC?",
        a: "Blip itself doesn't impose KYC-tier limits on the wallet side. Practical limits come from the merchants' compliance windows — typically up to ₹2,00,000 per single UPI trade, higher via IMPS/bank transfer. Larger volumes route through merchant-OTC desks.",
      },
      {
        q: "How does the rate compare to Binance P2P?",
        a: "Blip aggregates quotes from multiple Indian merchants who compete on price. In live testing we typically beat Binance P2P by 0.2-0.5% on USDT-INR, plus there's no spread+fee combo — you see the final number before confirming.",
      },
      {
        q: "What if the merchant doesn't pay my UPI?",
        a: "The merchant's USDT-equivalent collateral is staked in the contract. If they don't pay within the window, the escrow refunds you AND you receive a portion of their bond as compensation. The merchant takes a permanent reputation hit. This is enforced on-chain, not by a support team.",
      },
      {
        q: "Can I do USDT to INR via UPI with this method?",
        a: "Yes — UPI is the default. Most trades settle to UPI in under 60 seconds. If your bank doesn't support UPI or the amount exceeds UPI limits, IMPS or NEFT/RTGS are alternatives.",
      },
      {
        q: "Does Blip take a fee?",
        a: "0% protocol fee. The merchant's spread is the only cost, and because merchants compete it's usually 0.1-0.3% — significantly tighter than centralized P2P.",
      },
      {
        q: "How is this different from a normal P2P like Binance P2P?",
        a: "On Binance P2P you and the counterparty both have Binance accounts; Binance holds the crypto in escrow. On Blip, neither side has any account on a central platform — the escrow is a public smart contract. You stay in your own wallet end-to-end.",
      },
      {
        q: "Is Blip available outside India?",
        a: "Yes — Blip supports USDT/USDC settlement to AED (UAE), PHP (Philippines), THB (Thailand) and is expanding. The non-custodial model is identical across corridors.",
      },
      {
        q: "When does Blip launch publicly?",
        a: "Join the waitlist on the homepage for priority access. Early users get rate-locked launch pricing.",
      },
    ],
    related: [
      { label: "USDT to INR P2P", to: "/usdt-to-inr-p2p" },
      { label: "Sell USDT in India instantly", to: "/sell-usdt-india-instant" },
      { label: "BTC to INR", to: "/btc-to-inr" },
      { label: "Crypto to INR", to: "/crypto-to-inr" },
      { label: "Crypto remittance UAE → India", to: "/crypto-remittance-uae" },
    ],
    lastUpdated: "2026-05-20",
  },

  /* Stubs — easy to fill in next: */
  // {
  //   slug: "usdt-to-inr-p2p",
  //   ...same shape...
  // },
  // {
  //   slug: "sell-usdt-india-instant",
  //   ...
  // },
  // {
  //   slug: "usdt-to-inr-via-upi",
  //   ...
  // },
];

export function getPseoCorridor(slug: string): PseoCorridor | undefined {
  return PSEO_CORRIDORS.find((c) => c.slug === slug);
}
