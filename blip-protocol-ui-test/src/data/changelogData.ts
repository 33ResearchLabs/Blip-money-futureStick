export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  type: ChangelogType;
  changes: string[];
}

export type ChangelogType = "feature" | "improvement" | "fix" | "security";

export const changelogEntries: ChangelogEntry[] = [
  {
    version: "0.9.0",
    date: "2026-02-10",
    title: "Blog & Research Launch",
    type: "feature",
    changes: [
      "Launched comprehensive blog with 36+ articles across 5 categories",
      "Added research section with 13 deep-dive papers on AI, DeFi, and infrastructure",
      "Full SEO optimization with structured data, sitemaps, and meta tags",
      "Category filtering and featured article highlights",
    ],
  },
  {
    version: "0.8.5",
    date: "2026-01-28",
    title: "Merchant Dashboard Enhancements",
    type: "improvement",
    changes: [
      "New real-time order feed with instant notifications",
      "Improved margin control interface with live market reference rates",
      "Added trade timeline visualization for escrow lifecycle tracking",
      "Performance analytics dashboard with volume and completion rate metrics",
    ],
  },
  {
    version: "0.8.0",
    date: "2026-01-15",
    title: "UAE Corridor Launch",
    type: "feature",
    changes: [
      "Launched crypto-to-AED conversion corridor",
      "Added UAE-specific landing page with localized content",
      "Integrated bank transfer and instant transfer payment methods",
      "Onboarded initial merchant network for AED settlement",
    ],
  },
  {
    version: "0.7.5",
    date: "2025-12-20",
    title: "Security Audit Completion",
    type: "security",
    changes: [
      "Completed third-party security audit of escrow smart contracts",
      "Implemented additional safeguards for large transaction handling",
      "Enhanced two-factor authentication system",
      "Published audit report for community transparency",
    ],
  },
  {
    version: "0.7.0",
    date: "2025-12-05",
    title: "Rewards System Launch",
    type: "feature",
    changes: [
      "Launched BLIP token cashback rewards for all transactions",
      "Introduced staking tiers with escalating benefits",
      "Added referral bonus program for user growth",
      "Merchant performance bonuses for high completion rates",
    ],
  },
  {
    version: "0.6.5",
    date: "2025-11-18",
    title: "Tokenomics & Whitepaper",
    type: "feature",
    changes: [
      "Published detailed tokenomics page with supply distribution",
      "Released comprehensive whitepaper covering protocol architecture",
      "Added deflationary mechanism documentation (buy-back-and-burn)",
      "Governance voting framework specification",
    ],
  },
  {
    version: "0.6.0",
    date: "2025-11-01",
    title: "Escrow Protocol V2",
    type: "improvement",
    changes: [
      "Upgraded escrow smart contracts for faster settlement",
      "Reduced on-chain transaction costs by 40%",
      "Added automatic timeout and refund mechanisms",
      "Improved dispute escalation flow with clearer status tracking",
    ],
  },
  {
    version: "0.5.0",
    date: "2025-10-15",
    title: "Platform Beta Launch",
    type: "feature",
    changes: [
      "Launched invite-only beta with core trading functionality",
      "Wallet connection support (Phantom, Solflare, Backpack)",
      "Basic merchant onboarding and verification system",
      "On-chain escrow for USDT and USDC trades",
    ],
  },
  {
    version: "0.4.0",
    date: "2025-09-20",
    title: "Matching Engine",
    type: "feature",
    changes: [
      "Built intelligent matching engine for trade request pairing",
      "Multi-factor matching: corridor, amount, price, reputation",
      "Automatic merchant selection optimization",
      "Real-time matching status notifications",
    ],
  },
  {
    version: "0.3.0",
    date: "2025-08-10",
    title: "Blip Scan Explorer",
    type: "feature",
    changes: [
      "Launched on-chain transaction explorer (Blip Scan)",
      "Real-time escrow status tracking",
      "Trade history and settlement verification",
      "Protocol metrics and analytics dashboard",
    ],
  },
];
