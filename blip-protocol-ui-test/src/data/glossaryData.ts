export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: GlossaryCategory;
}

export type GlossaryCategory = "Crypto Basics" | "DeFi" | "Payments" | "Security" | "Blip Protocol" | "Trading";

export const glossaryCategories: GlossaryCategory[] = [
  "Crypto Basics",
  "DeFi",
  "Payments",
  "Security",
  "Blip Protocol",
  "Trading",
];

export const glossaryTerms: GlossaryTerm[] = [
  // Crypto Basics
  { term: "Blockchain", slug: "blockchain", definition: "A distributed, immutable digital ledger that records transactions across a network of computers. Each block contains a list of transactions and is cryptographically linked to the previous block, forming a chain that cannot be altered without consensus.", category: "Crypto Basics" },
  { term: "Cryptocurrency", slug: "cryptocurrency", definition: "A digital or virtual currency secured by cryptography that operates on a decentralized network. Unlike traditional currencies, cryptocurrencies are not controlled by any central authority like a government or bank.", category: "Crypto Basics" },
  { term: "Wallet", slug: "wallet", definition: "A software application or hardware device that stores your private keys and allows you to send, receive, and manage your cryptocurrency. Popular Solana wallets include Phantom, Solflare, and Backpack.", category: "Crypto Basics" },
  { term: "Private Key", slug: "private-key", definition: "A secret cryptographic key that proves ownership of a wallet and authorizes transactions. Your private key should never be shared with anyone — whoever has it controls the associated funds.", category: "Crypto Basics" },
  { term: "Seed Phrase", slug: "seed-phrase", definition: "A 12 or 24-word recovery phrase that can regenerate your wallet's private key. It serves as a backup — if you lose access to your wallet, you can restore it using the seed phrase. Store it offline and never share it.", category: "Crypto Basics" },
  { term: "Gas Fees", slug: "gas-fees", definition: "Transaction fees paid to network validators for processing and confirming transactions on a blockchain. On Solana, gas fees are extremely low (fractions of a cent), making it ideal for frequent, small transactions.", category: "Crypto Basics" },
  { term: "Solana", slug: "solana", definition: "A high-performance blockchain known for sub-second transaction finality, low fees, and high throughput. Blip Money is built on Solana to leverage these characteristics for real-time settlement.", category: "Crypto Basics" },
  { term: "Token", slug: "token", definition: "A digital asset created on an existing blockchain. On Solana, tokens follow the SPL (Solana Program Library) standard. Examples include USDT, USDC, and BLIP — each representing different utilities or values.", category: "Crypto Basics" },
  { term: "Stablecoin", slug: "stablecoin", definition: "A cryptocurrency designed to maintain a stable value by being pegged to a reserve asset like the US dollar. USDT and USDC are popular stablecoins used for trading and payments without the volatility of other crypto assets.", category: "Crypto Basics" },
  { term: "USDT", slug: "usdt", definition: "Tether (USDT) is the world's largest stablecoin by market cap, pegged 1:1 to the US Dollar. On Solana, USDT is available as an SPL token and is one of the primary trading pairs on Blip.", category: "Crypto Basics" },
  { term: "USDC", slug: "usdc", definition: "USD Coin (USDC) is a regulated stablecoin issued by Circle, pegged 1:1 to the US Dollar. It's widely used in DeFi and payments, and is supported on Blip for settlement and trading.", category: "Crypto Basics" },

  // DeFi
  { term: "DeFi", slug: "defi", definition: "Decentralized Finance — a category of financial applications built on blockchain that operate without traditional intermediaries like banks. DeFi enables lending, trading, payments, and more through smart contracts.", category: "DeFi" },
  { term: "Smart Contract", slug: "smart-contract", definition: "A self-executing program stored on a blockchain that automatically enforces the terms of an agreement when predefined conditions are met. Blip uses smart contracts for escrow, ensuring trustless trade execution.", category: "DeFi" },
  { term: "Liquidity", slug: "liquidity", definition: "The ease with which an asset can be bought or sold without significantly affecting its price. In Blip's context, liquidity refers to the availability of merchants ready to fulfill trade requests in a given corridor.", category: "DeFi" },
  { term: "Yield", slug: "yield", definition: "The return earned on a crypto investment, typically expressed as an annual percentage. On Blip, yield can be earned through staking BLIP tokens or providing liquidity as a merchant.", category: "DeFi" },
  { term: "DAO", slug: "dao", definition: "Decentralized Autonomous Organization — a community-governed entity where decisions are made through token-holder voting rather than by a central authority. Blip uses DAO governance for protocol upgrades and dispute resolution.", category: "DeFi" },
  { term: "Staking", slug: "staking", definition: "Locking up tokens in a smart contract to support network operations or earn rewards. BLIP token stakers earn protocol fees, boosted trading rewards, and governance voting power.", category: "DeFi" },
  { term: "DEX", slug: "dex", definition: "Decentralized Exchange — a platform for trading cryptocurrencies directly from your wallet without an intermediary. Unlike centralized exchanges, DEXs don't hold your funds and trades execute via smart contracts.", category: "DeFi" },
  { term: "TVL", slug: "tvl", definition: "Total Value Locked — the total amount of assets deposited in a DeFi protocol. TVL is a common metric for measuring a protocol's adoption, trust, and growth over time.", category: "DeFi" },

  // Payments
  { term: "Settlement", slug: "settlement", definition: "The final step in a transaction where assets are exchanged between parties. In traditional finance, settlement can take days. Blip's on-chain settlement happens in minutes through smart contract escrow.", category: "Payments" },
  { term: "Fiat Currency", slug: "fiat-currency", definition: "Government-issued currency that is not backed by a physical commodity like gold. Examples include USD, AED, EUR, and GBP. Blip enables conversion between cryptocurrency and fiat currencies.", category: "Payments" },
  { term: "Corridor", slug: "corridor", definition: "A specific trading pair or route for exchanging one currency for another. For example, USDT-to-AED is a corridor. Blip operates multiple corridors, each with its own merchants and liquidity.", category: "Payments" },
  { term: "P2P Trading", slug: "p2p-trading", definition: "Peer-to-peer trading allows buyers and sellers to transact directly without a centralized intermediary. Blip facilitates P2P trading with escrow protection, ensuring both parties are safeguarded.", category: "Payments" },
  { term: "Remittance", slug: "remittance", definition: "The transfer of money from one location to another, typically across borders. Crypto-powered remittances through Blip can be faster and cheaper than traditional wire transfer services.", category: "Payments" },
  { term: "Off-Ramp", slug: "off-ramp", definition: "The process of converting cryptocurrency into fiat currency. Blip provides a seamless off-ramp experience through its escrow-protected merchant network.", category: "Payments" },
  { term: "On-Ramp", slug: "on-ramp", definition: "The process of converting fiat currency into cryptocurrency. Blip enables on-ramping by connecting users with merchants who sell crypto for local currency.", category: "Payments" },

  // Security
  { term: "Escrow", slug: "escrow", definition: "A financial arrangement where a third party (in Blip's case, a smart contract) holds funds during a transaction until both parties fulfill their obligations. On-chain escrow provides trustless, transparent, and automatic fund protection.", category: "Security" },
  { term: "Non-Custodial", slug: "non-custodial", definition: "A system where the user retains full control of their private keys and funds at all times. Blip is non-custodial — your crypto stays in your wallet until you initiate a trade, and escrow is controlled by smart contracts, not Blip.", category: "Security" },
  { term: "KYC", slug: "kyc", definition: "Know Your Customer — identity verification procedures required by traditional financial institutions. Blip minimizes KYC requirements through its DAO-governed escrow model, requiring only basic verification.", category: "Security" },
  { term: "AML", slug: "aml", definition: "Anti-Money Laundering — regulations designed to prevent the generation of income through illegal actions. Blip's on-chain transparency and escrow system provide inherent AML compliance through traceable transactions.", category: "Security" },
  { term: "Two-Factor Authentication (2FA)", slug: "two-factor-authentication", definition: "An extra layer of security that requires two different forms of identification to access an account. Blip supports 2FA to protect your account from unauthorized access.", category: "Security" },
  { term: "Audit", slug: "audit", definition: "A thorough review of smart contract code by independent security experts to identify vulnerabilities. Blip's escrow contracts are audited by reputable firms to ensure the safety of user funds.", category: "Security" },

  // Blip Protocol
  { term: "BLIP Token", slug: "blip-token", definition: "The native utility token of the Blip protocol. BLIP is used for governance voting, staking rewards, fee discounts, cashback rewards, and premium feature access within the ecosystem.", category: "Blip Protocol" },
  { term: "Blip Scan", slug: "blip-scan", definition: "Blip's on-chain transaction explorer that provides full transparency into escrow transactions, trade status, settlement history, and protocol metrics. Any trade can be independently verified.", category: "Blip Protocol" },
  { term: "Merchant", slug: "merchant-term", definition: "A verified liquidity provider on Blip who fulfills trade requests. Merchants set exchange rates, manage corridors, and earn margins on completed trades through the merchant dashboard.", category: "Blip Protocol" },
  { term: "Matching Engine", slug: "matching-engine", definition: "Blip's algorithm that pairs trade requests with available merchants based on corridor, amount, payment method, price competitiveness, and merchant reputation for optimal trade execution.", category: "Blip Protocol" },
  { term: "Trade Request", slug: "trade-request", definition: "A user-initiated order to buy or sell cryptocurrency through Blip. Once submitted, the matching engine finds a suitable merchant, and the trade enters the escrow-protected execution flow.", category: "Blip Protocol" },
  { term: "Protocol Fee", slug: "protocol-fee", definition: "A small fee charged on each Blip transaction that supports protocol operations, development, and the BLIP token buy-back-and-burn mechanism. Fees are displayed transparently before trade confirmation.", category: "Blip Protocol" },
  { term: "Cashback", slug: "cashback", definition: "A reward mechanism where users receive a percentage of their transaction fees back in BLIP tokens. Cashback rates vary based on trade volume, staking tier, and promotional events.", category: "Blip Protocol" },

  // Trading
  { term: "OTC Trading", slug: "otc-trading", definition: "Over-the-Counter trading — direct transactions between two parties outside of a public exchange. OTC trades are common for large crypto transactions to avoid market slippage. Blip facilitates OTC trades with escrow protection.", category: "Trading" },
  { term: "Slippage", slug: "slippage", definition: "The difference between the expected price of a trade and the actual price at execution. Blip's merchant-based model provides fixed quotes, minimizing slippage compared to DEX trading.", category: "Trading" },
  { term: "Market Rate", slug: "market-rate", definition: "The current price of an asset as determined by supply and demand on exchanges. Blip displays a live reference market rate that merchants use as a baseline for their quotes.", category: "Trading" },
  { term: "Spread", slug: "spread", definition: "The difference between the buy and sell price of an asset. On Blip, the spread is determined by individual merchants within allowed ranges, creating competitive pricing.", category: "Trading" },
  { term: "Volume", slug: "volume", definition: "The total amount of a cryptocurrency traded within a given time period. Trading volume on Blip indicates platform activity and liquidity availability across corridors.", category: "Trading" },
  { term: "Order Book", slug: "order-book", definition: "A list of all pending buy and sell orders for an asset, organized by price. While Blip uses a matching engine rather than a traditional order book, the concept of matching supply and demand applies.", category: "Trading" },
];
