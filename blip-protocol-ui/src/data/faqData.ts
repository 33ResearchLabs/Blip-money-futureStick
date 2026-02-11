export interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
}

export type FAQCategory = "General" | "Payments" | "Security" | "Merchant" | "Tokenomics" | "Technical";

export const faqCategories: FAQCategory[] = [
  "General",
  "Payments",
  "Security",
  "Merchant",
  "Tokenomics",
  "Technical",
];

export const faqItems: FAQItem[] = [
  // General
  {
    question: "What is Blip Money?",
    answer: "Blip Money is a non-custodial settlement protocol that enables fast, secure crypto-to-fiat and crypto-to-crypto transactions. Built on Solana, it uses on-chain escrow to protect every trade without requiring traditional KYC or intermediaries.",
    category: "General",
  },
  {
    question: "How does Blip Money work?",
    answer: "Blip connects buyers and sellers through a matching engine. When a trade is initiated, funds are locked in an on-chain escrow smart contract. Once both parties confirm the exchange, the escrow releases automatically. This ensures trustless, secure settlement.",
    category: "General",
  },
  {
    question: "Is Blip Money available in my country?",
    answer: "Blip Money is launching first in the UAE with crypto-to-AED corridors. We are expanding to additional regions and fiat corridors throughout 2026. Join our waitlist to be notified when we launch in your area.",
    category: "General",
  },
  {
    question: "Do I need to complete KYC to use Blip?",
    answer: "Blip uses a DAO-governed escrow model that eliminates traditional KYC requirements. Basic identity verification (phone/email + wallet) is required to prevent fraud, but there are no lengthy document verification processes.",
    category: "General",
  },
  {
    question: "What blockchains does Blip support?",
    answer: "Blip is built on Solana for its speed, low fees, and high throughput. We support SOL, USDT (SPL), USDC (SPL), and other Solana-based tokens. Cross-chain support via bridges is on our roadmap.",
    category: "General",
  },
  {
    question: "Is Blip Money a custodial service?",
    answer: "No. Blip is fully non-custodial. Your funds remain in your wallet until a trade is initiated, at which point they are held in a transparent on-chain escrow smart contract — never in Blip's possession.",
    category: "General",
  },

  // Payments
  {
    question: "How do I convert crypto to AED?",
    answer: "Connect your Solana wallet, select the crypto you want to sell, enter the AED amount, and submit a request. A verified merchant will accept your trade, funds go into escrow, and once the AED transfer is confirmed, the crypto is released to the merchant.",
    category: "Payments",
  },
  {
    question: "What are the fees for using Blip?",
    answer: "Blip charges a small protocol fee on each transaction, which varies by corridor and trade size. Exact fees are displayed transparently before you confirm any trade. During the beta phase, reduced fees may apply for early adopters.",
    category: "Payments",
  },
  {
    question: "How long do transactions take?",
    answer: "Most transactions settle within minutes. The escrow lock happens instantly on-chain, and the total time depends on how quickly the counterparty confirms the fiat transfer. Average completion time is under 15 minutes.",
    category: "Payments",
  },
  {
    question: "What payment methods are supported for fiat?",
    answer: "For the UAE corridor, we support bank transfers, instant transfers, and cash handoffs. Each merchant may offer different payment methods, which are displayed when you match with them.",
    category: "Payments",
  },
  {
    question: "Is there a minimum or maximum transaction amount?",
    answer: "Minimum and maximum amounts vary by corridor and merchant. Generally, the minimum is around 100 AED equivalent, and maximums depend on merchant liquidity and corridor limits. These are clearly shown during the trade flow.",
    category: "Payments",
  },
  {
    question: "Can I send crypto to someone who doesn't have a wallet?",
    answer: "Currently, both parties need a Solana wallet to transact. However, our roadmap includes features for wallet-less recipients via temporary escrow links, making it easier to onboard new users.",
    category: "Payments",
  },

  // Security
  {
    question: "How does the escrow system protect my funds?",
    answer: "When a trade begins, the seller's crypto is locked in an on-chain Solana smart contract. The funds can only be released when both parties confirm, or through dispute resolution. Neither Blip nor any third party can access the escrowed funds unilaterally.",
    category: "Security",
  },
  {
    question: "What happens if a trade goes wrong?",
    answer: "If either party disputes a trade, the escrow holds the funds while the dispute is reviewed. During beta, the Blip team handles dispute resolution. The DAO will eventually govern disputes for full decentralization.",
    category: "Security",
  },
  {
    question: "Are smart contracts audited?",
    answer: "Yes. Blip's escrow smart contracts are audited by reputable third-party security firms. Audit reports are published for transparency, and we maintain an ongoing bug bounty program.",
    category: "Security",
  },
  {
    question: "Can Blip access or freeze my funds?",
    answer: "No. Blip is non-custodial — we never hold your funds. During active trades, funds are held in transparent on-chain escrow controlled by smart contract logic, not by Blip's team.",
    category: "Security",
  },
  {
    question: "How do I keep my account safe?",
    answer: "Use a hardware wallet for large trades, enable two-factor authentication on your Blip account, never share your private keys or seed phrases, and always verify trade details before confirming.",
    category: "Security",
  },

  // Merchant
  {
    question: "How do I become a Blip merchant?",
    answer: "Apply through our merchant waitlist. During beta, we onboard merchants through an invite-only process. You'll need to demonstrate liquidity in at least one corridor and pass basic verification.",
    category: "Merchant",
  },
  {
    question: "What are the benefits of being a merchant?",
    answer: "Merchants earn margin on each trade, get priority visibility in the matching engine, access a professional dashboard with analytics, and receive BLIP token rewards. Early merchants also get reduced fees and priority support.",
    category: "Merchant",
  },
  {
    question: "Can I set my own exchange rates?",
    answer: "Yes. Blip provides a live market reference rate, and you can adjust your quote within allowed ranges. Competitive pricing helps you win more trade requests.",
    category: "Merchant",
  },
  {
    question: "What tools do merchants get?",
    answer: "The merchant dashboard includes real-time order feeds, margin controls, risk filters (amount limits, corridor selection, timeouts), trade timeline tracking, performance analytics, and volume/profit reporting.",
    category: "Merchant",
  },
  {
    question: "How does merchant reputation work?",
    answer: "Merchants build reputation through completion rate, response time, trade volume, and dispute history. Higher reputation leads to better matching priority and access to larger trade corridors.",
    category: "Merchant",
  },

  // Tokenomics
  {
    question: "What is the BLIP token?",
    answer: "BLIP is the native utility token of the Blip protocol. It's used for governance voting, staking rewards, fee discounts, cashback rewards, and accessing premium features within the ecosystem.",
    category: "Tokenomics",
  },
  {
    question: "How can I earn BLIP tokens?",
    answer: "You can earn BLIP tokens through trading rewards (cashback on transactions), staking, referral bonuses, early adopter incentives, and merchant performance bonuses. Airdrop events are also planned for active community members.",
    category: "Tokenomics",
  },
  {
    question: "Is BLIP deflationary?",
    answer: "Yes. A portion of protocol fees is used to buy back and burn BLIP tokens, creating deflationary pressure. Additionally, staking locks reduce circulating supply, further supporting token value.",
    category: "Tokenomics",
  },
  {
    question: "Where can I buy BLIP tokens?",
    answer: "BLIP tokens will be available on Solana DEXs at launch. Details on the token generation event and exchange listings will be announced through our official channels.",
    category: "Tokenomics",
  },
  {
    question: "What are the staking rewards?",
    answer: "BLIP stakers earn a share of protocol fees, boosted trading rewards, and governance voting power. Staking tiers unlock additional benefits like reduced fees and priority matching.",
    category: "Tokenomics",
  },

  // Technical
  {
    question: "Why did Blip choose Solana?",
    answer: "Solana offers sub-second finality, extremely low transaction fees (fractions of a cent), and high throughput (thousands of TPS). These characteristics are essential for a real-time settlement protocol where speed and cost matter.",
    category: "Technical",
  },
  {
    question: "How does the matching engine work?",
    answer: "The matching engine pairs trade requests with available merchants based on corridor, amount, payment method, price, and merchant reputation. The algorithm optimizes for speed, price, and reliability.",
    category: "Technical",
  },
  {
    question: "What wallets are supported?",
    answer: "Blip supports all major Solana wallets including Phantom, Solflare, Backpack, and any wallet compatible with the Solana Wallet Adapter. Hardware wallets like Ledger are also supported through compatible interfaces.",
    category: "Technical",
  },
  {
    question: "Is there an API for developers?",
    answer: "Yes. Blip offers a developer API for integrating settlement functionality into your own applications. The API supports trade initiation, status tracking, webhook notifications, and more. Documentation is available at blip.money/docs.",
    category: "Technical",
  },
  {
    question: "What is Blip Scan?",
    answer: "Blip Scan is our on-chain transaction explorer that provides full transparency into escrow transactions, trade status, settlement history, and protocol metrics. Any trade can be verified independently through Blip Scan.",
    category: "Technical",
  },
];
