/** All inline keyboards used in the merchant flow and rewards system. */
export const KEYBOARDS = {
  step1: {
    inline_keyboard: [
      [{ text: '🏪  I am a Merchant', callback_data: 'flow_role_merchant' }],
      [{ text: '💧  Liquidity Partner', callback_data: 'flow_role_liquidity' }],
      [{ text: '👀  Just Exploring', callback_data: 'flow_role_exploring' }],
    ],
  },

  step2: {
    inline_keyboard: [
      [{ text: '🌍  Accept payments globally', callback_data: 'flow_uc_payments' }],
      [{ text: '🔄  Cross-border settlement', callback_data: 'flow_uc_settlement' }],
      [{ text: '💸  Reduce fees', callback_data: 'flow_uc_fees' }],
      [{ text: '🔁  Crypto ↔ Fiat', callback_data: 'flow_uc_cryptofiat' }],
      [{ text: '🏦  Treasury management', callback_data: 'flow_uc_treasury' }],
    ],
  },

  step3: {
    inline_keyboard: [
      [{ text: 'Under $50K', callback_data: 'flow_vol_under_50k' }],
      [{ text: '$50K – $250K', callback_data: 'flow_vol_50k_250k' }],
      [{ text: '$250K – $1M', callback_data: 'flow_vol_250k_1m' }],
      [{ text: '$1M – $5M', callback_data: 'flow_vol_1m_5m' }],
      [{ text: '$5M+', callback_data: 'flow_vol_5m_plus' }],
    ],
  },

  step4: {
    inline_keyboard: [
      [{ text: '🇦🇪  UAE', callback_data: 'flow_cor_uae' }],
      [{ text: '🇮🇳  India', callback_data: 'flow_cor_india' }],
      [{ text: '🇪🇺  Europe', callback_data: 'flow_cor_europe' }],
      [{ text: '🇬🇧  UK', callback_data: 'flow_cor_uk' }],
      [{ text: '🌐  Global', callback_data: 'flow_cor_global' }],
    ],
  },

  step5: {
    inline_keyboard: [
      [{ text: '⚡  Immediate', callback_data: 'flow_int_immediate' }],
      [{ text: '📅  Within 7 days', callback_data: 'flow_int_7days' }],
      [{ text: '🗓  Within 30 days', callback_data: 'flow_int_30days' }],
      [{ text: '🔍  Still exploring', callback_data: 'flow_int_exploring' }],
    ],
  },

  step6: {
    inline_keyboard: [
      [{ text: '📥  Use liquidity only', callback_data: 'flow_liq_useonly' }],
      [{ text: '📤  Provide liquidity', callback_data: 'flow_liq_provide' }],
      [{ text: '↔️  Both', callback_data: 'flow_liq_both' }],
    ],
  },

  step7: {
    inline_keyboard: [
      [{ text: '💬  Use Telegram', callback_data: 'flow_con_telegram' }],
      [{ text: '🔗  Connect wallet', callback_data: 'flow_con_wallet' }],
      [{ text: '✅  Both', callback_data: 'flow_con_both' }],
    ],
  },

  submit: {
    inline_keyboard: [
      [
        { text: '✅  Confirm & Submit', callback_data: 'flow_submit_confirm' },
        { text: '🔄  Start Over', callback_data: 'flow_restart' },
      ],
    ],
  },

  applyNow: {
    inline_keyboard: [
      [{ text: '📋  Apply as Merchant', callback_data: 'flow_restart' }],
    ],
  },
};

/**
 * Build the admin action keyboard for a specific applicant.
 * @param {string} userId — Telegram user ID of the applicant.
 */
export function adminKeyboard(userId) {
  return {
    inline_keyboard: [
      [
        { text: '✅  Approve', callback_data: `adm_approve_${userId}` },
        { text: '❌  Reject', callback_data: `adm_reject_${userId}` },
      ],
      [{ text: '⭐  Set Priority', callback_data: `adm_priority_${userId}` }],
    ],
  };
}
