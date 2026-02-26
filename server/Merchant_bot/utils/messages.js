/** Human-readable labels for stored enum values. */
export const LABELS = {
  role: {
    merchant: 'Merchant',
    liquidity: 'Liquidity Partner',
    exploring: 'Just Exploring',
  },
  use_case: {
    payments: 'Accept payments globally',
    settlement: 'Cross-border settlement',
    fees: 'Reduce fees',
    cryptofiat: 'Crypto ↔ Fiat',
    treasury: 'Treasury management',
  },
  volume: {
    under_50k: 'Under $50K',
    '50k_250k': '$50K – $250K',
    '250k_1m': '$250K – $1M',
    '1m_5m': '$1M – $5M',
    '5m_plus': '$5M+',
  },
  corridor: {
    uae: 'UAE',
    india: 'India',
    europe: 'Europe',
    uk: 'UK',
    global: 'Global',
  },
  integration_speed: {
    immediate: 'Immediate',
    '7days': 'Within 7 days',
    '30days': 'Within 30 days',
    exploring: 'Still exploring',
  },
  liquidity_role: {
    useonly: 'Use liquidity only',
    provide: 'Provide liquidity',
    both: 'Both',
  },
  contact_method: {
    telegram: 'Use Telegram',
    wallet: 'Connect wallet',
    both: 'Both',
  },
};

export function label(category, key) {
  return (LABELS[category] && LABELS[category][key]) || key;
}

export const MESSAGES = {
  // ─── Flow steps ──────────────────────────────────────────────────────────────

  step1:
    `*Welcome to Blip Merchant Network* 🌐\n\n` +
    `Blip is building the world's fastest cross-border merchant settlement layer.\n\n` +
    `*Step 1 of 8* — What best describes you?`,

  step2:
    `*Step 2 of 8* — Primary Use Case\n\n` +
    `What is your primary reason for joining the Blip network?`,

  step3:
    `*Step 3 of 8* — Monthly Volume\n\n` +
    `What is your estimated monthly settlement volume?`,

  step4:
    `*Step 4 of 8* — Primary Corridor\n\n` +
    `Which payment corridor do you primarily operate in?`,

  step5:
    `*Step 5 of 8* — Integration Speed\n\n` +
    `How quickly are you looking to integrate with Blip?`,

  step6:
    `*Step 6 of 8* — Liquidity Role\n\n` +
    `What is your preferred liquidity role on the Blip network?`,

  step7:
    `*Step 7 of 8* — Contact Method\n\n` +
    `How would you like to be reached by our team?`,

  // ─── Summary & submission ────────────────────────────────────────────────────

  summary(data) {
    return (
      `*Step 8 of 8* — Review & Submit\n\n` +
      `Role: ${label('role', data.role)}\n` +
      `Use Case: ${label('use_case', data.use_case)}\n` +
      `Volume: ${label('volume', data.volume)}\n` +
      `Corridor: ${label('corridor', data.corridor)}\n` +
      `Integration: ${label('integration_speed', data.integration_speed)}\n` +
      `Liquidity Role: ${label('liquidity_role', data.liquidity_role)}\n` +
      `Contact: ${label('contact_method', data.contact_method)}\n\n` +
      `_Confirm your details and submit your application._`
    );
  },

  submitted(tier) {
    return (
      `*Application Received* ✅\n\n` +
      `Your merchant application has been submitted for review.\n\n` +
      `*Assigned Tier:* ${tier}\n\n` +
      `Our team will review your application and notify you within 24–48 hours.\n\n` +
      `_Blip Merchant Network_`
    );
  },

  // ─── Admin decisions ─────────────────────────────────────────────────────────

  approved:
    `*Access Granted* 🎉\n\n` +
    `You are approved for *Blip Phase-1 Merchant Pool*.\n\n` +
    `Welcome to the network. Our onboarding team will follow up shortly.\n\n` +
    `Use /rewards to view your estimated BLIP allocation.`,

  rejected:
    `*Application Update*\n\n` +
    `After careful review, we are unable to onboard your account at this time.\n\n` +
    `You may resubmit an application by sending /start.`,

  // ─── Status messages ─────────────────────────────────────────────────────────

  alreadyApplied(status) {
    const cap = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      `*Application Status*\n\n` +
      `You have already submitted a merchant application.\n\n` +
      `*Current Status:* ${cap}\n\n` +
      `Use /rewards to view your reward allocation.`
    );
  },

  // ─── Admin notification ──────────────────────────────────────────────────────

  adminNotification(data, tier) {
    const who = data.username ? `@${data.username}` : data.first_name || 'Unknown';
    return (
      `*New Merchant Application* 📋\n\n` +
      `User: ${who} (${data.telegram_id})\n` +
      `Role: ${label('role', data.role)}\n` +
      `Use Case: ${label('use_case', data.use_case)}\n` +
      `Volume: ${label('volume', data.volume)}\n` +
      `Corridor: ${label('corridor', data.corridor)}\n` +
      `Integration: ${label('integration_speed', data.integration_speed)}\n` +
      `Liquidity: ${label('liquidity_role', data.liquidity_role)}\n` +
      `Contact: ${label('contact_method', data.contact_method)}\n\n` +
      `*Tier: ${tier}*`
    );
  },

  // ─── Rewards ─────────────────────────────────────────────────────────────────

  rewardsFound(merchant, allocation, nextSnapshot) {
    const cap = merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1);
    return (
      `*Blip Merchant Reward Status* 🏆\n\n` +
      `Tier: *${merchant.tier}*\n` +
      `Approval Status: *${cap}*\n` +
      `Estimated Allocation: *${allocation}*\n` +
      `Next Snapshot Date: *${nextSnapshot}*`
    );
  },

  rewardsNotFound:
    `*Blip Rewards* 💎\n\n` +
    `No merchant record found for your account.\n\n` +
    `Apply to join the Blip Merchant Network and qualify for the BLIP token airdrop.`,

  // ─── Admin / broadcast ───────────────────────────────────────────────────────

  notAdmin: `⛔ Unauthorized. This command is restricted to administrators.`,

  broadcastComplete(sent, failed) {
    return `Broadcast complete.\n\n✅ Delivered: ${sent}\n❌ Failed / Blocked: ${failed}`;
  },
};
