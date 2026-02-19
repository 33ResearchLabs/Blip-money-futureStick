export interface LeaderboardEntry {
  rank: number;
  name: string;
  verified: boolean;
  allocation: number;
  followers: number;
}

const MERCHANT_NAMES = [
  "Alpine Trading Co",
  "Nexus Payments",
  "Meridian Labs",
  "BlockVault",
  "ChainBridge Capital",
  "DeFi Dynamics",
  "Sol Commerce",
  "Phantom Pay",
  "Digital Bazaar",
  "Gulf Tech Solutions",
  "Nova Merchants",
  "Stellar Trades",
  "Quantum Finance",
  "Cipher Exchange",
  "Atlas Protocol",
  "Vortex Systems",
  "Prism Payments",
  "Eclipse Digital",
  "Zenith Ventures",
  "Apex Markets",
  "Pulse Trading",
  "Forge Labs",
  "Beacon Finance",
  "Summit Exchange",
  "Vector Payments",
  "Orbit Commerce",
  "Flux Merchants",
  "Helix Protocol",
  "Solstice Pay",
  "Horizon Digital",
  "Catalyst Labs",
  "Vertex Trading",
  "Pinnacle Finance",
  "Genesis Exchange",
  "Nimbus Pay",
  "Aurora Systems",
  "Titan Merchants",
  "Stratos Digital",
  "Fusion Commerce",
  "Core Protocol",
  "Onyx Payments",
  "Cobalt Trading",
  "Ember Finance",
  "Drift Exchange",
  "Shard Labs",
];

export function generateLeaderboardData(
  count: number = 20,
): LeaderboardEntry[] {
  const shuffled = [...MERCHANT_NAMES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, MERCHANT_NAMES.length));

  const entries: LeaderboardEntry[] = selected.map((name, index) => {
    const baseAllocation = Math.floor(
      50000 * Math.pow(0.85, index) + Math.random() * 2000,
    );
    const followers = Math.floor(Math.random() * 500) + (index < 5 ? 200 : 10);

    return {
      rank: index + 1,
      name,
      verified: Math.random() > 0.4,
      allocation: baseAllocation,
      followers,
    };
  });

  entries.sort((a, b) => b.allocation - a.allocation);
  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  return entries;
}
