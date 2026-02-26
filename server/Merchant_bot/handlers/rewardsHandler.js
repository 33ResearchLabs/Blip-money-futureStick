import { MESSAGES } from '../utils/messages.js';
import { getTierAllocation, getNextSnapshotDate } from '../utils/scoring.js';
import { KEYBOARDS } from '../utils/keyboards.js';
import Merchant from '../../models/botMerchant.model.js';

/**
 * /rewards — show the caller's tier, approval status, and estimated BLIP allocation.
 * If not registered, prompt to apply.
 */
export async function handleRewards(bot, msg) {
  const userId = String(msg.from.id);
  const chatId = msg.chat.id;

  try {
    const merchant = await Merchant.findOne({ telegram_id: userId });

    if (!merchant) {
      return bot.sendMessage(chatId, MESSAGES.rewardsNotFound, {
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.applyNow,
      });
    }

    const allocation = getTierAllocation(merchant.tier);
    const nextSnapshot = getNextSnapshotDate();

    bot.sendMessage(
      chatId,
      MESSAGES.rewardsFound(merchant, allocation, nextSnapshot),
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error('[rewardsHandler] error:', err.message);
    bot.sendMessage(chatId, 'Unable to fetch reward status. Please try again later.');
  }
}
