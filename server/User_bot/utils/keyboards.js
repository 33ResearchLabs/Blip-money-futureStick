export const KEYBOARDS = {
  joinEarlyAccess: {
    inline_keyboard: [
      [{ text: 'Join Early Access', callback_data: 'onboard_start' }],
    ],
  },

  country: {
    inline_keyboard: [
      [
        { text: 'India', callback_data: 'country_india' },
        { text: 'UAE', callback_data: 'country_uae' },
      ],
      [
        { text: 'UK', callback_data: 'country_uk' },
        { text: 'USA', callback_data: 'country_usa' },
      ],
      [{ text: 'Other', callback_data: 'country_other' }],
    ],
  },

  role: {
    inline_keyboard: [
      [{ text: 'Individual User', callback_data: 'role_individual' }],
      [{ text: 'Merchant', callback_data: 'role_merchant' }],
      [{ text: 'P2P Trader', callback_data: 'role_trader' }],
      [{ text: 'Remittance User', callback_data: 'role_remittance' }],
    ],
  },

  tasks(completed) {
    const buttons = [];
    if (!completed.telegram_group) {
      buttons.push([{ text: 'Join Telegram Group  (+50)', callback_data: 'task_telegram' }]);
    }
    if (!completed.twitter_follow) {
      buttons.push([{ text: 'Follow on X  (+50)', callback_data: 'task_twitter' }]);
    }
    if (!completed.retweet) {
      buttons.push([{ text: 'Retweet Launch Post  (+100)', callback_data: 'task_retweet' }]);
    }
    return { inline_keyboard: buttons };
  },
};
