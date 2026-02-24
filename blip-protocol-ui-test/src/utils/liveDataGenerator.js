// ── Live Data Generator ─────────────────────────────────────────────────────
// Generates realistic mock trading data for the Advanced Trading Dashboard

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Kai', 'Riley', 'Morgan', 'Avery', 'Quinn', 'Blake',
  'Reese', 'Drew', 'Sam', 'Taylor', 'Casey', 'Devon', 'Jamie', 'Skyler',
  'Hayden', 'Parker', 'Emery', 'Rowan', 'Phoenix', 'Sage', 'River', 'Asher',
  'Zain', 'Omar', 'Yuki', 'Luca', 'Nico', 'Arjun', 'Wei', 'Ravi',
];

const CURRENCY_PAIRS = [
  { base: 'USDT', quote: 'AED', rate: 3.67, spread: 0.03 },
  { base: 'USDC', quote: 'AED', rate: 3.67, spread: 0.02 },
  { base: 'BTC', quote: 'AED', rate: 246500, spread: 150 },
  { base: 'ETH', quote: 'AED', rate: 12800, spread: 45 },
  { base: 'SOL', quote: 'AED', rate: 520, spread: 3 },
  { base: 'USDT', quote: 'INR', rate: 83.50, spread: 0.15 },
  { base: 'BTC', quote: 'USD', rate: 67200, spread: 80 },
];

const PAYMENT_METHODS = [
  'Bank Transfer', 'Cash', 'Wise', 'Revolut', 'PayPal', 'Zelle',
  'Apple Pay', 'Google Pay', 'SEPA', 'Wire Transfer',
];

const NOTIFICATION_TEMPLATES = [
  { text: 'New order matched — {amount} {currency}', type: 'trade' },
  { text: 'Market rate updated for {pair}', type: 'market' },
  { text: '{user} completed trade #{id}', type: 'completion' },
  { text: 'Your spread was undercut on {pair}', type: 'alert' },
  { text: 'Escrow released — {amount} {currency}', type: 'escrow' },
  { text: 'New LP assignment available', type: 'lp' },
  { text: 'Withdrawal processed — {amount} AED', type: 'withdrawal' },
  { text: 'KYC verification approved', type: 'system' },
  { text: 'Price alert: {pair} crossed {rate}', type: 'alert' },
  { text: 'New message from {user}', type: 'message' },
];

const MESSAGE_TEMPLATES = [
  'Hey, is the {amount} USDT still available?',
  'Can you do bank transfer for this?',
  'Trade confirmed on my end. Check wallet.',
  'What\'s your best rate for {amount}?',
  'Payment sent. Please verify.',
  'Can we do this via Wise instead?',
  'I\'ll take the full amount. Let\'s proceed.',
  'Need to split into 2 transactions. OK?',
];

// ── Utility Helpers ──────────────────────────────────────────────────────────

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function timeAgo(seconds) {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function formatNumber(num) {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
  return `$${num.toFixed(0)}`;
}

// ── Data Generators ──────────────────────────────────────────────────────────

export function generateBalance() {
  return {
    available: randFloat(5000, 150000, 2),
    locked: randFloat(100, 15000, 2),
    aedEquivalent: 0, // computed in component
    dailyPnl: randFloat(-500, 2000, 2),
    dailyPnlPercent: randFloat(-3, 8, 2),
  };
}

export function generateMarketRate(pair = CURRENCY_PAIRS[0]) {
  const fluctuation = (Math.random() - 0.5) * pair.spread * 2;
  return {
    pair: `${pair.base}/${pair.quote}`,
    base: pair.base,
    quote: pair.quote,
    rate: parseFloat((pair.rate + fluctuation).toFixed(4)),
    change24h: randFloat(-2.5, 4.5, 2),
    high24h: parseFloat((pair.rate + pair.spread * 3).toFixed(4)),
    low24h: parseFloat((pair.rate - pair.spread * 3).toFixed(4)),
    volume24h: randInt(500000, 15000000),
  };
}

export function generateOrder() {
  const pair = pick(CURRENCY_PAIRS);
  const isBuy = Math.random() > 0.5;
  const amount = pick([500, 1000, 2000, 5000, 10000, 15000, 25000, 50000]);
  const spread = randFloat(1.0, 3.5, 1);
  const tags = [];
  if (amount >= 25000) tags.push('Large');
  if (spread <= 1.5) tags.push('Cheap');
  if (spread >= 2.5) tags.push('Premium');
  if (Math.random() > 0.7) tags.push('Mineable');

  return {
    id: generateId(),
    user: pick(FIRST_NAMES),
    type: isBuy ? 'BUY' : 'SELL',
    amount,
    currency: pair.base,
    quoteCurrency: pair.quote,
    rate: parseFloat((pair.rate + (isBuy ? 1 : -1) * randFloat(0, pair.spread, 4)).toFixed(4)),
    spread: `+${spread}%`,
    paymentMethod: pick(PAYMENT_METHODS),
    tags,
    completedTrades: randInt(1, 200),
    rating: randFloat(4.0, 5.0, 1),
    online: Math.random() > 0.3,
    timePosted: timeAgo(randInt(5, 3600)),
    expiresIn: `${randInt(5, 60)}m`,
  };
}

export function generateOrders(count = 8) {
  return Array.from({ length: count }, () => generateOrder());
}

export function generateActiveOrder() {
  const pair = pick(CURRENCY_PAIRS);
  const progress = randInt(10, 95);
  return {
    id: generateId(),
    user: pick(FIRST_NAMES),
    amount: pick([1000, 2500, 5000, 10000]),
    currency: pair.base,
    rate: pair.rate.toFixed(4),
    status: pick(['Awaiting Payment', 'Payment Sent', 'Confirming', 'Releasing']),
    progress,
    paymentMethod: pick(PAYMENT_METHODS),
    timeStarted: timeAgo(randInt(30, 1800)),
  };
}

export function generateLeaderboardEntry(rank) {
  const trades = randInt(5, 500);
  return {
    rank,
    name: pick(FIRST_NAMES),
    trades,
    volume: randInt(10000, 2000000),
    rating: randFloat(4.0, 5.0, 1),
    profit: randFloat(0.5, 35, 1),
    online: Math.random() > 0.4,
    streak: randInt(0, 30),
    badge: trades > 300 ? 'diamond' : trades > 100 ? 'gold' : trades > 50 ? 'silver' : 'bronze',
  };
}

export function generateLeaderboard(count = 10) {
  return Array.from({ length: count }, (_, i) => generateLeaderboardEntry(i + 1))
    .sort((a, b) => b.volume - a.volume)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export function generateNotification() {
  const template = pick(NOTIFICATION_TEMPLATES);
  const text = template.text
    .replace('{amount}', String(pick([500, 1000, 2500, 5000, 10000])))
    .replace('{currency}', pick(['USDT', 'USDC', 'BTC', 'ETH']))
    .replace('{pair}', pick(['USDT/AED', 'BTC/AED', 'ETH/AED', 'SOL/AED']))
    .replace('{user}', pick(FIRST_NAMES))
    .replace('{id}', String(randInt(10000, 99999)))
    .replace('{rate}', String(randFloat(3.5, 4.0, 4)));

  return {
    id: generateId(),
    text,
    type: template.type,
    time: timeAgo(randInt(1, 300)),
    read: false,
  };
}

export function generateNotifications(count = 5) {
  return Array.from({ length: count }, () => generateNotification());
}

export function generateMessage() {
  const text = pick(MESSAGE_TEMPLATES)
    .replace('{amount}', String(pick([500, 1000, 2500, 5000])));

  return {
    id: generateId(),
    user: pick(FIRST_NAMES),
    text,
    time: timeAgo(randInt(10, 7200)),
    unread: Math.random() > 0.5,
    online: Math.random() > 0.4,
  };
}

export function generateMessages(count = 4) {
  return Array.from({ length: count }, () => generateMessage());
}

export function generateActivity() {
  const types = ['trade', 'deposit', 'withdrawal', 'escrow', 'lp'];
  const type = pick(types);
  const statuses = ['done', 'pending', 'failed'];
  const status = pick(statuses);

  return {
    id: generateId(),
    type,
    status,
    amount: pick([500, 1000, 2500, 5000, 10000]),
    currency: pick(['USDT', 'AED', 'BTC']),
    description: type === 'trade' ? 'P2P Trade' :
      type === 'deposit' ? 'Deposit' :
      type === 'withdrawal' ? 'Withdrawal' :
      type === 'escrow' ? 'Escrow Release' : 'LP Assignment',
    time: timeAgo(randInt(30, 86400)),
    counterparty: pick(FIRST_NAMES),
  };
}

export function generateActivities(count = 6) {
  return Array.from({ length: count }, () => generateActivity());
}

export function getCurrencyPairs() {
  return CURRENCY_PAIRS;
}

export { formatNumber, timeAgo, pick, randInt, randFloat, generateId };
