export interface UseCase {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string;
  icon: string;
  gradient: string;
  painPoints: string[];
  howBlipHelps: { title: string; description: string }[];
  cta: { text: string; link: string };
  seo: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
  };
}

export const useCases: UseCase[] = [
  {
    id: "freelancers",
    slug: "freelancers",
    title: "Blip for Freelancers",
    headline: "Get paid globally, settle locally",
    description: "Freelancers working with international clients face slow bank transfers, high conversion fees, and payment platform restrictions. Blip lets you receive crypto payments and convert to local currency in minutes — not days.",
    icon: "laptop",
    gradient: "from-blue-500/20 to-purple-500/20",
    painPoints: [
      "International wire transfers take 3-5 business days and charge $15-50 per transaction",
      "Payment platforms like PayPal charge 3-5% conversion fees plus hidden exchange rate markups",
      "Some countries have restricted access to services like Stripe, Wise, or PayPal",
      "Clients in crypto-native industries prefer paying in USDT or USDC but you need local currency",
    ],
    howBlipHelps: [
      { title: "Instant Settlement", description: "Receive USDT/USDC from clients worldwide and convert to local currency in under 15 minutes through Blip's escrow-protected network." },
      { title: "Low Fees", description: "Pay a fraction of traditional wire transfer fees. Solana's network costs are under $0.01 per transaction, and Blip's protocol fees are transparent and competitive." },
      { title: "No Platform Lock-in", description: "Your crypto goes directly to your wallet — no platform can freeze, hold, or limit your funds. You're in full control." },
      { title: "Earn While You Settle", description: "Get BLIP token cashback on every conversion, turning your regular payment settlement into a rewards-earning activity." },
    ],
    cta: { text: "Start Receiving Payments", link: "/waitlist" },
    seo: {
      title: "Blip for Freelancers - Get Paid in Crypto, Settle in Local Currency",
      description: "Freelancers: receive international crypto payments and convert to local currency in minutes. Low fees, instant settlement, no platform restrictions. Powered by Blip Money.",
      keywords: "freelancer crypto payments, receive USDT as freelancer, crypto to fiat freelancer, international payments freelancer, Blip freelancer",
      canonical: "https://blip.money/use-cases/freelancers",
    },
  },
  {
    id: "otc-traders",
    slug: "otc-traders",
    title: "Blip for OTC Traders",
    headline: "Trade large volumes with escrow protection",
    description: "OTC traders handle high-value crypto transactions but face counterparty risk, scams, and unreliable settlement. Blip's escrow-first protocol eliminates these risks while providing the speed and flexibility OTC trading demands.",
    icon: "trending-up",
    gradient: "from-emerald-500/20 to-teal-500/20",
    painPoints: [
      "Counterparty risk on large trades — the other party could disappear after receiving funds",
      "No protection mechanism for cash-to-crypto or crypto-to-cash deals",
      "Relying on personal trust or Telegram groups for high-value transactions",
      "Centralized OTC desks charge high premiums and require extensive KYC",
    ],
    howBlipHelps: [
      { title: "Escrow Protection", description: "Every trade is secured by on-chain Solana escrow. Funds are locked until both parties confirm, eliminating counterparty risk completely." },
      { title: "On-Chain Verification", description: "Every transaction is verifiable through Blip Scan. Both parties can independently confirm escrow status, trade history, and settlement proof." },
      { title: "Competitive Rates", description: "Set your own rates within allowed ranges. The matching engine connects you with the best available counterparty based on price, speed, and reputation." },
      { title: "Reputation System", description: "Build a verifiable trading history on-chain. High-reputation traders get priority matching and access to larger trade corridors." },
    ],
    cta: { text: "Start Trading on Blip", link: "/waitlist" },
    seo: {
      title: "Blip for OTC Traders - Escrow-Protected Large Volume Crypto Trading",
      description: "OTC traders: execute high-value crypto trades with on-chain escrow protection. No counterparty risk, transparent settlement, competitive rates. Powered by Blip Money.",
      keywords: "OTC crypto trading, escrow OTC, large volume crypto, P2P crypto trading, secure OTC trades, Blip OTC",
      canonical: "https://blip.money/use-cases/otc-traders",
    },
  },
  {
    id: "e-commerce",
    slug: "e-commerce",
    title: "Blip for E-Commerce",
    headline: "Accept crypto, settle in cash",
    description: "E-commerce businesses miss out on the growing crypto-native customer base due to integration complexity and volatility concerns. Blip lets you accept crypto payments and instantly settle in your local currency.",
    icon: "shopping-cart",
    gradient: "from-orange-500/20 to-red-500/20",
    painPoints: [
      "Crypto payment processors charge 1-3% and take days to settle in fiat",
      "Volatility risk between receiving crypto and converting to operating currency",
      "Complex integration requirements with existing e-commerce platforms",
      "Limited access to the $2T+ crypto market customer base",
    ],
    howBlipHelps: [
      { title: "Instant Fiat Settlement", description: "Accept USDT, USDC, or SOL and settle in AED or your local currency within minutes — not days. Eliminate volatility risk entirely." },
      { title: "Simple Integration", description: "Blip's merchant API makes it easy to add crypto payments to your checkout flow. Generate payment links or integrate the SDK into your existing stack." },
      { title: "Transparent Dashboard", description: "Track all incoming payments, settlement status, and revenue analytics through the merchant dashboard. Export reports for accounting." },
      { title: "Grow Your Market", description: "Tap into the crypto-native customer base. Over 420 million people hold cryptocurrency globally — make your products accessible to all of them." },
    ],
    cta: { text: "Add Crypto Payments", link: "/merchant" },
    seo: {
      title: "Blip for E-Commerce - Accept Crypto Payments, Settle in Local Currency",
      description: "E-commerce businesses: accept cryptocurrency payments and settle instantly in your local currency. Simple integration, no volatility risk, transparent dashboard. Powered by Blip Money.",
      keywords: "accept crypto payments ecommerce, crypto payment gateway, USDT payments business, crypto to fiat merchant, Blip ecommerce",
      canonical: "https://blip.money/use-cases/e-commerce",
    },
  },
  {
    id: "remittance",
    slug: "remittance",
    title: "Blip for Remittances",
    headline: "Send money home, faster and cheaper",
    description: "Cross-border remittances through traditional channels are slow, expensive, and opaque. Blip enables near-instant cross-border transfers at a fraction of the cost through crypto rails and local merchant settlement.",
    icon: "globe",
    gradient: "from-cyan-500/20 to-blue-500/20",
    painPoints: [
      "Traditional remittance services charge 5-10% in fees and exchange rate markups",
      "Wire transfers take 3-7 business days to arrive",
      "Recipients often need to visit physical locations to collect funds",
      "Lack of transparency — hidden fees and unfavorable exchange rates",
    ],
    howBlipHelps: [
      { title: "Fraction of the Cost", description: "Send crypto across borders for under $0.01 in network fees. Blip's protocol fee is transparent and a fraction of traditional remittance costs." },
      { title: "Minutes, Not Days", description: "Your recipient can convert received crypto to local currency through Blip's merchant network in under 15 minutes. No more waiting days for bank transfers." },
      { title: "Full Transparency", description: "Every step is visible on-chain. Both sender and recipient can track the transaction through Blip Scan in real time." },
      { title: "No Middlemen", description: "Non-custodial, direct transfer. No correspondent banks, no hidden fees, no exchange rate manipulation." },
    ],
    cta: { text: "Send Money Now", link: "/waitlist" },
    seo: {
      title: "Blip for Remittances - Fast, Cheap Cross-Border Money Transfers",
      description: "Send money abroad faster and cheaper with crypto-powered remittances. Near-instant transfers, transparent fees, no middlemen. Powered by Blip Money.",
      keywords: "crypto remittance, send money abroad crypto, cheap international transfer, cross-border payments crypto, Blip remittance",
      canonical: "https://blip.money/use-cases/remittance",
    },
  },
];
