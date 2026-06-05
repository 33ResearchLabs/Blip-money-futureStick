/**
 * Central SEO registry — edit titles and meta descriptions here.
 * Every page reads from this file automatically via the SEO component.
 * Pages that need dynamic values (blog posts, use-case slugs) override
 * at the component level by passing title/description props directly.
 */

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string;
}

const BASE_KEYWORDS = "blip money, crypto payments, send money globally, crypto to aed, sell usdt dubai, crypto payments uae, fintech, escrow payments, solana payments";

export const SEO_DATA: Record<string, PageSEO> = {
  "/": {
    title: "Blip Money | Send Money Globally Through Open Markets",
    description: "Send money anywhere in the world. Verified merchants compete to give you the best rate, and your funds are protected in escrow until delivery is confirmed. No banks, no delays.",
    keywords: BASE_KEYWORDS,
  },
  "/rates": {
    title: "Best USDT Rate, Live | Blip vs Binance, Paxful & More",
    description: "Find the cheapest USDT rate in the market. Blip beats Binance, Paxful, KuCoin, OKX, and direct exchanges on rate, speed, privacy, and guaranteed settlement. See live rates compared.",
    keywords: "best usdt rate, live usdt price, usdt to aed, usdt to inr, cheapest crypto rate",
  },
  "/how-it-works": {
    title: "How Blip Works | Merchants Compete, Funds Protected",
    description: "Post a transfer request, verified merchants compete to fill it at the best rate, and your funds are protected until delivery is confirmed. Simple, fast, and safe.",
    keywords: "how blip works, crypto transfer, merchant network, escrow protection",
  },
  "/market": {
    title: "Blip Market | Live Transfer Marketplace",
    description: "Watch merchants compete live to fill transfer requests — track orders, rates, and settlement status in real time. All on Solana for instant settlement.",
    keywords: "blip market, live crypto market, transfer marketplace, crypto settlement",
  },
  "/whitepaper": {
    title: "Blip Market Whitepaper | How the Network Works",
    description: "Read the Blip Market whitepaper — how merchants, users, and escrow work together to move money globally at the best rates.",
    keywords: "blip whitepaper, blip protocol, open liquidity network",
  },
  "/merchant": {
    title: "Become a Blip Merchant | Earn on Every Transfer",
    description: "Fill transfer orders and earn on every one. Set your own rates, get paid instantly on-chain, and grow a merchant business with Blip.",
    keywords: "blip merchant, earn crypto, merchant payments, crypto business",
  },
  "/user": {
    title: "Blip Money for Users | Convert Crypto to Cash Instantly",
    description: "Convert crypto to cash instantly. Merchants compete to fill your order at the best rate — funds protected until delivery.",
    keywords: "convert crypto to cash, crypto to fiat, instant crypto transfer",
  },
  "/use-cases": {
    title: "Use Cases | Blip Money — Money Transfers for Everyone",
    description: "See how Blip Money serves freelancers, businesses, traders, and anyone sending money internationally — fast, secure, and at the best rates.",
    keywords: "blip use cases, freelancer payments, crypto remittance, business crypto",
  },
  "/about": {
    title: "About Blip Money — Our Mission & Vision",
    description: "Blip Money is building the world's first open money-transfer marketplace — where merchants compete to move your money faster and cheaper than any bank.",
    keywords: "about blip money, blip mission, blip team",
  },
  "/contact": {
    title: "Contact Blip Money | Get in Touch with Our Team",
    description: "Contact Blip Money for support, partnerships, or general inquiries. Our team is here to help.",
    keywords: "contact blip money, blip support, blip partnerships",
  },
  "/press": {
    title: "Press & Media | Blip Money News & Coverage",
    description: "Read the latest Blip Money press releases, media coverage, and download brand assets. Stay up to date with our announcements and milestones.",
    keywords: "blip money press, blip news, blip media",
  },
  "/community": {
    title: "Blip Community & Ecosystem | Join the Movement",
    description: "Join the Blip Money community across Telegram, Twitter, Discord, and GitHub. Connect with our ecosystem partners, contributors, and ambassador program.",
    keywords: "blip community, blip telegram, blip discord, blip ambassador",
  },
  "/blog": {
    title: "Blog | Blip Money — Crypto Payments & Money Transfers",
    description: "Explore articles on crypto payments, merchant solutions, money transfers, and the future of borderless finance from the Blip Money team.",
    keywords: "blip blog, crypto payments articles, money transfer news",
  },
  "/research": {
    title: "Research | Blip Money — Fintech, Crypto & Payments",
    description: "In-depth research on crypto markets, AI-powered trading tools, autonomous agents, and the future of global money movement.",
    keywords: "blip research, crypto research, fintech research, payments research",
  },
  "/faq": {
    title: "FAQ | Blip Money — Frequently Asked Questions",
    description: "Answers to the most common questions about sending money with Blip — how it works, fees, safety, supported corridors, and getting started.",
    keywords: "blip faq, blip help, blip questions, how does blip work",
  },
  "/glossary": {
    title: "Glossary | Blip Money — Crypto & Payments Terms Explained",
    description: "A plain-English glossary of crypto, payments, and blockchain terms. Learn the key concepts behind Blip Money and decentralized finance.",
    keywords: "crypto glossary, defi terms, blockchain glossary, payments terms",
  },
  "/changelog": {
    title: "Changelog | Blip Money — Product Updates & Release Notes",
    description: "Track the latest updates, features, improvements, and fixes across the Blip Money platform. Full development history and release timeline.",
    keywords: "blip changelog, blip updates, blip release notes",
  },
  "/compare": {
    title: "Blip vs Wise, Binance & Traditional Banks | Compare",
    description: "See how Blip Money stacks up against Wise, Binance, and traditional banks — honest feature-by-feature comparisons on speed, fees, security, and more.",
    keywords: "blip vs wise, blip vs binance, crypto vs bank transfer, best money transfer",
  },
  "/bounty": {
    title: "Blip Bug Bounty | Report Vulnerabilities & Earn",
    description: "Found a security issue in Blip? Report it through our bug bounty program and earn rewards for helping keep the network safe.",
    keywords: "blip bounty, blip security, bug bounty, crypto security",
  },
  "/rewards": {
    title: "Blip Rewards | Earn Points for Every Transfer",
    description: "Earn BLIP points for every transfer, referral, and completed task. Redeem for rewards and unlock early access to new features.",
    keywords: "blip rewards, blip points, earn blip, blip referral",
  },
  "/signup": {
    title: "Create Your Blip Account | Start Sending Money",
    description: "Create your Blip account to send money globally, track your transfers, and earn bonus points. Early users get priority access.",
    keywords: "blip signup, create blip account, join blip",
  },
  "/signin": {
    title: "Sign In to Blip Money",
    description: "Sign in to your Blip account to access your dashboard, track transfers, and manage your rewards.",
    keywords: "blip signin, blip login",
  },
  "/dashboard": {
    title: "Your Blip Dashboard | Points, Tasks & Early Access",
    description: "Track your waitlist position, complete tasks to earn BLIP points, and unlock early access the moment the app opens.",
  },
  "/merchant-dashboard": {
    title: "Blip Merchant Dashboard | Manage Orders & Earnings",
    description: "Manage your live transfer orders, view settlements and earnings, and complete merchant quests to earn bonus rewards.",
  },
  "/privacy": {
    title: "Blip Money — Privacy & Personal Data Policy",
    description: "Read Blip Money's Privacy Policy to understand how we collect, use, and protect your personal information and handle data securely.",
    keywords: "blip privacy policy, blip data policy",
  },
  "/terms": {
    title: "Terms of Service | Blip Money",
    description: "Read Blip Money's terms of service — your rights, obligations, and how the platform works.",
    keywords: "blip terms of service, blip terms",
  },
  "/cookies": {
    title: "Cookie Policy | Blip Money",
    description: "How Blip Money uses cookies to improve your experience — what we collect and how to manage your preferences.",
    keywords: "blip cookie policy, blip cookies",
  },
  "/gdpr": {
    title: "Blip Money — GDPR & Data Protection Policy",
    description: "Discover how Blip Money complies with GDPR regulations and protects your personal data, privacy rights, and information security.",
    keywords: "blip gdpr, blip data protection",
  },
  "/legal": {
    title: "Legal | Blip Money",
    description: "Access all Blip Money legal documents — privacy policy, terms of service, GDPR, and cookie policy.",
  },
  // ── Market / SEO pages ──────────────────────────────────
  "/sell-usdt-dubai": {
    title: "Sell USDT in Dubai — Instant AED Payout | Blip Money",
    description: "Sell USDT in Dubai and get paid in AED instantly with Blip Money. Competitive rates, protected trades, and multiple payout options across the UAE.",
    keywords: "sell usdt dubai, usdt to aed dubai, tether to aed",
  },
  "/buy-usdt-dubai": {
    title: "Buy USDT in Dubai — Instant Tether Purchase | Blip Money",
    description: "Buy USDT in Dubai and convert AED to Tether instantly with Blip Money. Competitive rates, protected trades, and multiple payment options across the UAE.",
    keywords: "buy usdt dubai, aed to usdt, buy tether dubai",
  },
  "/crypto-to-aed": {
    title: "Crypto to AED Converter — Live Rates | Blip Money",
    description: "Convert USDT, USDC, BTC, ETH, SOL to AED instantly. Live exchange rates updated every 30 seconds. Funds protected until delivery, low fees, settlement under 15 minutes.",
    keywords: "crypto to aed, usdt to aed, bitcoin to aed, ethereum to aed",
  },
  "/crypto-to-inr": {
    title: "Crypto to INR Converter — Live Rates | Blip Money",
    description: "Convert USDT, USDC, BTC, ETH, SOL to INR instantly. Live exchange rates updated every 30 seconds. Funds protected until delivery, low fees, settlement under 15 minutes.",
    keywords: "crypto to inr, usdt to inr, bitcoin to inr, ethereum to inr",
  },
  "/btc-to-aed": {
    title: "Bitcoin to AED — Live BTC/AED Rate | Blip Money",
    description: "Convert Bitcoin to UAE Dirhams instantly. Live BTC/AED exchange rate updated every 30 seconds. Funds secured until delivery, 0.5% fees, settlement under 15 minutes.",
    keywords: "btc to aed, bitcoin to aed, bitcoin uae, btc aed rate",
  },
  "/btc-to-inr": {
    title: "Bitcoin to INR — Live BTC/INR Rate | Blip Money",
    description: "Convert Bitcoin to Indian Rupees instantly. Live BTC/INR exchange rate updated every 30 seconds. Funds secured until delivery, 0.5% fees, settlement under 15 minutes.",
    keywords: "btc to inr, bitcoin to inr, bitcoin india, btc inr rate",
  },
  "/eth-to-aed": {
    title: "Ethereum to AED — Live ETH/AED Rate | Blip Money",
    description: "Convert Ethereum to UAE Dirhams instantly. Live ETH/AED exchange rate updated every 30 seconds. Funds secured until delivery, 0.5% fees, settlement under 15 minutes.",
    keywords: "eth to aed, ethereum to aed, ethereum uae, eth aed rate",
  },
  "/eth-to-inr": {
    title: "Ethereum to INR — Live ETH/INR Rate | Blip Money",
    description: "Convert Ethereum to Indian Rupees instantly. Live ETH/INR exchange rate updated every 30 seconds. Funds secured until delivery, 0.5% fees, settlement under 15 minutes.",
    keywords: "eth to inr, ethereum to inr, ethereum india, eth inr rate",
  },
  "/sol-to-aed": {
    title: "Solana to AED — Live SOL/AED Rate | Blip Money",
    description: "Convert Solana to UAE Dirhams instantly. Live SOL/AED exchange rate updated every 30 seconds. Sub-cent fees, fastest settlement in the UAE.",
    keywords: "sol to aed, solana to aed, solana uae, sol aed rate",
  },
  "/sol-to-inr": {
    title: "Solana to INR — Live SOL/INR Rate | Blip Money",
    description: "Convert Solana to Indian Rupees instantly. Live SOL/INR exchange rate updated every 30 seconds. Sub-cent fees, fastest settlement in India.",
    keywords: "sol to inr, solana to inr, solana india, sol inr rate",
  },
  "/crypto-payments-uae": {
    title: "Send & Receive Crypto in the UAE | Blip Money",
    description: "Make crypto payments in the UAE with Blip Money. Buy, sell, and transfer cryptocurrency across Dubai and the Emirates with protected, fast settlement.",
    keywords: "crypto payments uae, crypto dubai, send crypto uae, receive crypto uae",
  },
  "/crypto-remittance-uae": {
    title: "Send Money from UAE to India & Beyond | Blip Money",
    description: "Send money from UAE to India, Pakistan, Philippines using crypto. Compare fees vs bank wire. Save up to 90% on international transfer costs.",
    keywords: "crypto remittance uae, send money uae india, uae to india transfer, cheap remittance",
  },
  "/accept-crypto-business": {
    title: "Accept Crypto Payments for Your Business | Blip Money",
    description: "Accept cryptocurrency payments for your business with Blip Money. Instant AED settlement, zero chargebacks, lower fees, and a full merchant dashboard.",
    keywords: "accept crypto business, crypto merchant, crypto payments uae business",
  },
  "/crypto-escrow-uae": {
    title: "Crypto Escrow UAE — Protected Trades | Blip Money",
    description: "Secure your crypto trades in the UAE with protected escrow. Funds are held safely until delivery is confirmed — for direct trades, OTC deals, and real estate transactions.",
    keywords: "crypto escrow uae, secure crypto trade, protected crypto dubai",
  },
  "/crypto-salary-uae": {
    title: "Get Paid in Crypto in Dubai 2026 | Blip Money",
    description: "Pay or receive salary in crypto in the UAE. Instant conversion, protected payroll settlement, and compliant transfers for businesses and freelancers.",
    keywords: "crypto salary uae, get paid crypto dubai, crypto payroll uae",
  },
  "/crypto-tax-uae": {
    title: "Crypto Tax UAE 2026 — Complete Guide | Blip Money",
    description: "Crypto tax guidance for UAE residents in 2026. Understand regulations, reporting obligations, and how to stay compliant with on-chain records.",
    keywords: "crypto tax uae, crypto tax dubai, uae crypto regulations 2026",
  },
  "/crypto-otc-dubai": {
    title: "Crypto OTC Trading Dubai — Secure Large Trades | Blip Money",
    description: "Execute large-volume crypto trades in Dubai with protected settlement. Competitive rates, verified merchants, and transparent on-chain settlement.",
    keywords: "crypto otc dubai, large crypto trade dubai, otc crypto uae",
  },
  "/best-crypto-exchange-uae": {
    title: "Best Crypto Exchange UAE — Fast, Secure | Blip Money",
    description: "Find the best crypto exchange in the UAE. Blip offers protected trading, low fees, VARA-aligned architecture, and instant crypto-to-AED settlement across Dubai and Abu Dhabi.",
    keywords: "best crypto exchange uae, best crypto exchange dubai, vara crypto uae",
  },
  "/bitcoin-price-uae": {
    title: "Bitcoin Price UAE — Live BTC to AED Rate | Blip Money",
    description: "Track the live Bitcoin price in UAE Dirhams (AED). Real-time BTC/AED rate, market insights, and instant conversion tools for UAE residents.",
    keywords: "bitcoin price uae, btc aed price, bitcoin price dubai, btc uae",
  },
  "/usdt-vs-usdc": {
    title: "USDT vs USDC — Which is Best for UAE? | Blip Money",
    description: "Compare USDT (Tether) and USDC (USD Coin) for UAE traders. Market cap, fees, AED off-ramp support, and which is better for your transfers.",
    keywords: "usdt vs usdc, tether vs usdc uae, best stablecoin uae",
  },
  "/crypto-to-bank-uae": {
    title: "Cash Out Crypto to UAE Bank | Blip Money",
    description: "Learn how to withdraw crypto to your UAE bank account. Compare methods, fees, and settlement times. Cash out BTC, ETH, USDT to AED safely.",
    keywords: "crypto to bank uae, withdraw crypto uae, crypto to aed bank",
  },
  "/cryptoToAed": {
    title: "Crypto to AED | USDT to AED Converter & Cashout in UAE | Blip Money",
    description: "Convert crypto to AED easily with Blip Money. Estimate USDT to AED rates, sell crypto in UAE, and explore reliable crypto cashout solutions for UAE residents.",
    keywords: "crypto to aed, usdt to aed, crypto cashout uae",
  },
  "/how-it-works": {
    title: "How Blip Works | Merchants Compete, Funds Protected",
    description: "Post a transfer request, verified merchants compete to fill it at the best rate, and your funds are protected until delivery is confirmed.",
  },
  "/app": {
    title: "Blip — Two Apps. One Network.",
    description: "Open the Blip money app to send & receive globally, or launch Blip Market to run a merchant desk and earn on every fill.",
  },
  "/coming-soon": {
    title: "Coming Soon | Blip Money",
    description: "This feature is coming soon. Stay tuned for updates from Blip Money.",
  },
  "/redeem": {
    title: "Redeem Telegram Points | Blip Money",
    description: "Redeem your Blip Telegram points and connect them to your account.",
  },
};

/** Fallback used when a path has no entry in SEO_DATA */
export const DEFAULT_SEO: PageSEO = {
  title: "Blip Money | Send Money Globally Through Open Markets",
  description: "Send money anywhere in the world. Verified merchants compete to give you the best rate, with funds protected until delivery.",
  keywords: BASE_KEYWORDS,
};

/** Returns the SEO entry for a given pathname, falling back to DEFAULT_SEO */
export function getSEO(pathname: string): PageSEO {
  // Exact match
  if (SEO_DATA[pathname]) return SEO_DATA[pathname];
  // Strip trailing slash
  const clean = pathname.replace(/\/$/, "");
  if (SEO_DATA[clean]) return SEO_DATA[clean];
  return DEFAULT_SEO;
}
