/**
 * Central SEO registry — edit titles and meta descriptions here.
 * Every page reads from this file automatically via the SEO component.
 * Pages that need dynamic values (blog posts, use-case slugs, research)
 * override at the component level by passing title/description props directly.
 */

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string;
}

const BASE_KEYWORDS =
  "blip money, global money settlement, send money globally, verified merchants, crypto payments, stablecoin settlement";

export const SEO_DATA: Record<string, PageSEO> = {
  "/": {
    title: "Blip Money | Global Money Settlement Network",
    description:
      "Blip Money helps people move money globally through verified merchants competing to offer better rates, faster settlement, and safer transactions.",
    keywords: BASE_KEYWORDS,
  },

  "/rates": {
    title: "Best USDT Rates Live | Blip Money",
    description:
      "Compare live USDT rates across Blip and major crypto markets. Find better rates, faster settlement, and safer trades in one place.",
    keywords: "usdt rate live, best usdt rate, usdt to aed, usdt to inr, compare crypto rates",
  },

  "/how-it-works": {
    title: "How Blip Money Works | Fast Global Settlement",
    description:
      "See how Blip connects users with verified merchants who compete to settle money faster, safer, and at better rates.",
    keywords: "how blip works, blip settlement, verified merchants, global money transfer",
  },

  "/market": {
    title: "Blip Market | Open Market for Money Settlement",
    description:
      "Blip Market lets verified merchants compete to fulfill money movement requests with better pricing, speed, and trust.",
    keywords: "blip market, open market, merchant settlement, crypto market",
  },

  "/whitepaper": {
    title: "Blip Money Whitepaper | Global Settlement Network",
    description:
      "Read the Blip Money whitepaper and learn how open merchant markets can power faster, safer global money settlement.",
    keywords: "blip whitepaper, blip protocol, settlement network whitepaper",
  },

  "/merchant": {
    title: "Blip Money for Merchants | Earn on Settlement",
    description:
      "Become a Blip merchant, fulfill user orders, earn on every settlement, and access demand from a global money movement network.",
    keywords: "blip merchant, earn crypto, merchant settlement, crypto business",
  },

  "/user": {
    title: "Blip Money for Users | Move Money Faster",
    description:
      "Send, convert, and settle money through verified merchants competing to give you better rates and faster execution.",
    keywords: "send money, convert crypto, fast money transfer, blip user",
  },

  "/use-cases": {
    title: "Blip Money Use Cases | Global Settlement Ideas",
    description:
      "Explore how Blip Money can support remittance, crypto conversion, merchant payments, large trades, salaries, and escrow-based settlement.",
    keywords: "blip use cases, remittance, crypto conversion, merchant payments",
  },

  "/about": {
    title: "About Blip Money | Building Open Money Markets",
    description:
      "Learn why Blip Money is building a global settlement network where verified merchants compete to move money faster and at better rates.",
    keywords: "about blip money, blip mission, open money markets",
  },

  "/contact": {
    title: "Contact Blip Money | Support and Partnerships",
    description:
      "Contact Blip Money for support, partnerships, merchant onboarding, press, or general questions about the platform.",
    keywords: "contact blip money, blip support, blip partnerships",
  },

  "/press": {
    title: "Blip Money Press | News and Media Resources",
    description:
      "Read Blip Money news, media updates, company announcements, and access official brand resources.",
    keywords: "blip press, blip news, blip media, blip announcements",
  },

  "/community": {
    title: "Blip Money Community | Join the Network",
    description:
      "Join the Blip Money community, follow product updates, connect with builders, merchants, users, and early supporters.",
    keywords: "blip community, blip telegram, blip discord, blip network",
  },

  "/blog": {
    title: "Blip Money Blog | Stablecoins and Settlement",
    description:
      "Read insights on stablecoins, crypto payments, merchant markets, global settlement, escrow, and the future of money movement.",
    keywords: "blip blog, stablecoins, crypto payments, global settlement",
  },

  "/research": {
    title: "Blip Money Research | Money Movement Insights",
    description:
      "Deep research on stablecoins, global settlement, merchant networks, crypto payments, AI agents, and open money markets.",
    keywords: "blip research, money movement, settlement research, stablecoin research",
  },

  "/faq": {
    title: "Blip Money FAQ | Questions and Answers",
    description:
      "Answers to common questions about Blip Money, how it works, fees, safety, supported markets, merchants, and getting started.",
    keywords: "blip faq, blip help, blip questions",
  },

  "/glossary": {
    title: "Blip Money Glossary | Crypto and Payment Terms",
    description:
      "Learn key crypto, payment, settlement, escrow, stablecoin, and merchant market terms used across Blip Money.",
    keywords: "crypto glossary, payment terms, settlement terms, stablecoin glossary",
  },

  "/changelog": {
    title: "Blip Money Changelog | Product Updates",
    description:
      "Track the latest Blip Money product updates, feature releases, platform improvements, and fixes.",
    keywords: "blip changelog, blip updates, blip releases",
  },

  "/compare": {
    title: "Compare Blip Money | Rates, Speed and Safety",
    description:
      "Compare Blip Money with other money movement options across pricing, speed, safety, settlement design, and user experience.",
    keywords: "compare blip, blip vs wise, blip vs binance, best money transfer",
  },

  "/bounty": {
    title: "Blip Money Bug Bounty | Report Security Issues",
    description:
      "Report security issues in Blip Money and help keep the global settlement network safer for users and merchants.",
    keywords: "blip bounty, blip security, bug bounty",
  },

  "/signup": {
    title: "Create Your Blip Money Account",
    description:
      "Create your Blip Money account, join early access, track rewards, and start using faster global settlement.",
    keywords: "blip signup, create account, join blip",
  },

  "/signin": {
    title: "Sign In to Blip Money",
    description:
      "Sign in to your Blip Money account to access your dashboard, manage transfers, and track rewards.",
  },

  "/signup?role=user": {
    title: "Join Blip Money | Early User Access",
    description:
      "Join Blip Money as an early user and access better rates, faster settlement, rewards, and priority product access.",
  },

  "/signup?role=merchant": {
    title: "Become a Blip Merchant | Earn on Every Order",
    description:
      "Join Blip Money as a merchant, fulfill settlement orders, earn on volume, and access early network demand.",
  },

  "/privacy": {
    title: "Blip Money Privacy Policy",
    description:
      "Read how Blip Money collects, uses, stores, and protects your personal data and privacy.",
    keywords: "blip privacy policy, blip data",
  },

  "/terms": {
    title: "Blip Money Terms of Service",
    description:
      "Read the Blip Money terms of service, including user rights, platform rules, obligations, and account requirements.",
    keywords: "blip terms, blip terms of service",
  },

  "/cookies": {
    title: "Blip Money Cookie Policy",
    description:
      "Learn how Blip Money uses cookies to improve performance, personalize your experience, and manage preferences.",
    keywords: "blip cookies, blip cookie policy",
  },

  "/gdpr": {
    title: "Blip Money GDPR and Data Protection Policy",
    description:
      "Learn how Blip Money handles GDPR rights, data protection, privacy requests, and personal information security.",
    keywords: "blip gdpr, blip data protection",
  },

  "/legal": {
    title: "Legal | Blip Money",
    description:
      "Access all Blip Money legal documents — privacy policy, terms of service, GDPR, and cookie policy.",
  },

  // ── Market / SEO pages — UAE ─────────────────────────────
  "/sell-usdt-dubai": {
    title: "Sell USDT in Dubai | Convert USDT to AED",
    description:
      "Sell USDT in Dubai and convert Tether to AED with competitive rates, verified merchants, and safer settlement through Blip Money.",
    keywords: "sell usdt dubai, usdt to aed, tether to aed dubai",
  },

  "/buy-usdt-dubai": {
    title: "Buy USDT in Dubai | AED to Tether",
    description:
      "Buy USDT in Dubai with AED using Blip Money. Access competitive rates, verified merchants, and safer crypto settlement.",
    keywords: "buy usdt dubai, aed to usdt, buy tether dubai",
  },

  "/crypto-to-aed": {
    title: "Crypto to AED Converter | Live Rates",
    description:
      "Convert crypto to AED with live rates for USDT, USDC, BTC, ETH, and SOL. Compare pricing and settle faster with Blip Money.",
    keywords: "crypto to aed, usdt to aed, bitcoin to aed, ethereum to aed",
  },

  "/crypto-to-inr": {
    title: "Crypto to INR Converter | Live Rates",
    description:
      "Convert crypto to INR with live rates for USDT, USDC, BTC, ETH, and SOL. Compare pricing and settle faster with Blip Money.",
    keywords: "crypto to inr, usdt to inr, bitcoin to inr, ethereum to inr",
  },

  "/btc-to-aed": {
    title: "Bitcoin to AED | Live BTC/AED Rate",
    description:
      "Track the live Bitcoin to AED rate and convert BTC to UAE Dirhams with competitive pricing and faster settlement.",
    keywords: "btc to aed, bitcoin to aed, bitcoin uae, btc aed rate",
  },

  "/btc-to-inr": {
    title: "Bitcoin to INR | Live BTC/INR Rate",
    description:
      "Track the live Bitcoin to INR rate and convert BTC to Indian Rupees with competitive pricing and faster settlement.",
    keywords: "btc to inr, bitcoin to inr, bitcoin india, btc inr rate",
  },

  "/eth-to-aed": {
    title: "Ethereum to AED | Live ETH/AED Rate",
    description:
      "Track the live Ethereum to AED rate and convert ETH to UAE Dirhams with competitive pricing and faster settlement.",
    keywords: "eth to aed, ethereum to aed, ethereum uae, eth aed rate",
  },

  "/eth-to-inr": {
    title: "Ethereum to INR | Live ETH/INR Rate",
    description:
      "Track the live Ethereum to INR rate and convert ETH to Indian Rupees with competitive pricing and faster settlement.",
    keywords: "eth to inr, ethereum to inr, ethereum india, eth inr rate",
  },

  "/sol-to-aed": {
    title: "Solana to AED | Live SOL/AED Rate",
    description:
      "Track the live Solana to AED rate and convert SOL to UAE Dirhams with fast settlement and low network fees.",
    keywords: "sol to aed, solana to aed, solana uae, sol aed rate",
  },

  "/sol-to-inr": {
    title: "Solana to INR | Live SOL/INR Rate",
    description:
      "Track the live Solana to INR rate and convert SOL to Indian Rupees with fast settlement and low network fees.",
    keywords: "sol to inr, solana to inr, solana india, sol inr rate",
  },

  "/crypto-payments-uae": {
    title: "Crypto Payments UAE | Blip Money",
    description:
      "Make crypto payments in the UAE with Blip Money. Buy, sell, and settle crypto with verified merchants and faster execution.",
    keywords: "crypto payments uae, crypto dubai, send crypto uae",
  },

  "/crypto-remittance-uae": {
    title: "Crypto Remittance UAE | Send Money Faster",
    description:
      "Send money from the UAE using crypto. Compare rates, reduce transfer costs, and settle faster through Blip Money.",
    keywords: "crypto remittance uae, send money uae, uae to india transfer",
  },

  "/accept-crypto-business": {
    title: "Accept Crypto Payments for Business",
    description:
      "Accept crypto payments for your business with Blip Money. Access faster settlement, lower fees, and merchant tools.",
    keywords: "accept crypto business, crypto merchant, business crypto payments",
  },

  "/crypto-escrow-uae": {
    title: "Crypto Escrow UAE | Secure Crypto Trades",
    description:
      "Use crypto escrow in the UAE for safer trades, large deals, OTC transactions, and settlement through Blip Money.",
    keywords: "crypto escrow uae, secure crypto trade, protected crypto dubai",
  },

  "/crypto-salary-uae": {
    title: "Crypto Salary UAE | Pay and Get Paid in Crypto",
    description:
      "Pay or receive salary in crypto in the UAE with faster conversion, safer settlement, and clear transaction records.",
    keywords: "crypto salary uae, get paid crypto dubai, crypto payroll uae",
  },

  "/crypto-tax-uae": {
    title: "Crypto Tax UAE 2026 | Guide for Users",
    description:
      "Understand crypto tax basics in the UAE, reporting considerations, and how transaction records can support compliance.",
    keywords: "crypto tax uae, crypto tax dubai, uae crypto regulations 2026",
  },

  "/crypto-otc-dubai": {
    title: "Crypto OTC Trading Dubai | Secure Large Trades",
    description:
      "Execute large crypto OTC trades in Dubai with competitive pricing, verified merchants, and safer settlement through Blip Money.",
    keywords: "crypto otc dubai, large crypto trade dubai, otc crypto uae",
  },

  "/best-crypto-exchange-uae": {
    title: "Best Crypto Exchange UAE | Compare Options",
    description:
      "Compare crypto exchange options in the UAE across rates, speed, safety, custody, fees, and settlement experience.",
    keywords: "best crypto exchange uae, best crypto exchange dubai, crypto exchange comparison",
  },

  "/bitcoin-price-uae": {
    title: "Bitcoin Price UAE | Live BTC to AED Rate",
    description:
      "Track the live Bitcoin price in UAE Dirhams. View BTC/AED rates, market movement, and conversion options.",
    keywords: "bitcoin price uae, btc aed price, bitcoin price dubai",
  },

  "/usdt-vs-usdc": {
    title: "USDT vs USDC | Which Stablecoin Is Better?",
    description:
      "Compare USDT and USDC across liquidity, transparency, fees, market usage, and crypto settlement support.",
    keywords: "usdt vs usdc, tether vs usdc, best stablecoin",
  },

  "/crypto-to-bank-uae": {
    title: "Withdraw Crypto to UAE Bank Account",
    description:
      "Learn how to withdraw crypto to a UAE bank account, compare methods, fees, settlement times, and safer options.",
    keywords: "crypto to bank uae, withdraw crypto uae, crypto to aed bank",
  },

  "/cryptoToAed": {
    title: "Crypto to AED | USDT to AED Converter UAE",
    description:
      "Convert USDT and other crypto to AED in the UAE. Compare rates and settle faster with Blip Money.",
    keywords: "crypto to aed, usdt to aed, crypto cashout uae",
  },

  // ── App & utility routes ──────────────────────────────────
  "/app": {
    title: "Blip — Two Apps. One Network.",
    description:
      "Open the Blip money app to send and receive globally, or launch Blip Market to run a merchant desk and earn on every fill.",
  },

  "/dashboard": {
    title: "Your Blip Dashboard | Points and Early Access",
    description:
      "Track your position, complete tasks to earn BLIP points, and unlock early access the moment the app opens.",
  },

  "/merchant-dashboard": {
    title: "Blip Merchant Dashboard | Orders and Earnings",
    description:
      "Manage your live transfer orders, view settlements and earnings, and complete quests to earn bonus rewards.",
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
  title: "Blip Money | Global Money Settlement Network",
  description:
    "Blip Money helps people move money globally through verified merchants competing to offer better rates, faster settlement, and safer transactions.",
  keywords: BASE_KEYWORDS,
};

/** Returns the SEO entry for a given pathname, falling back to DEFAULT_SEO */
export function getSEO(pathname: string): PageSEO {
  if (SEO_DATA[pathname]) return SEO_DATA[pathname];
  const clean = pathname.replace(/\/$/, "");
  if (SEO_DATA[clean]) return SEO_DATA[clean];
  return DEFAULT_SEO;
}
