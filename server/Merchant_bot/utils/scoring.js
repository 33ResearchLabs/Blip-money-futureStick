/**
 * Derive merchant tier from volume callback value.
 * Volume keys match the callback_data values set in keyboards.js.
 */
export function calculateTier(volume) {
  const map = {
    under_50k: 'Bronze',
    '50k_250k': 'Silver',
    '250k_1m': 'Gold',
    '1m_5m': 'Platinum',
    '5m_plus': 'Platinum',
  };
  return map[volume] || 'Bronze';
}

/** Estimated BLIP token allocation per tier. */
export function getTierAllocation(tier) {
  const map = {
    Bronze: '2,000 BLIP',
    Silver: '6,000 BLIP',
    Gold: '12,000 BLIP',
    Platinum: '25,000 BLIP',
  };
  return map[tier] || '2,000 BLIP';
}

/** Returns the 1st day of the next month formatted as a readable date. */
export function getNextSnapshotDate() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
