import { MESSAGES } from '../utils/messages.js';
import Merchant from '../../models/botMerchant.model.js';

function isAdmin(userId) {
  return String(userId) === String(process.env.ADMIN_CHAT_ID);
}

/**
 * Handles all adm_* callback queries from the admin notification message.
 * Callback data format: adm_<approve|reject|priority>_<userId>
 */
export async function handleAdminCallback(bot, query) {
  const callerId = String(query.from.id);

  if (!isAdmin(callerId)) {
    try {
      await bot.answerCallbackQuery(query.id, {
        text: 'Unauthorized.',
        show_alert: true,
      });
    } catch (_) {}
    return;
  }

  const parts = query.data.split('_');   // ['adm', action, ...userId]
  const action = parts[1];              // approve | reject | priority | done
  const targetUserId = parts.slice(2).join('_');

  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  // Already actioned button — silently ack
  if (action === 'done') {
    try { await bot.answerCallbackQuery(query.id); } catch (_) {}
    return;
  }

  try {
    if (action === 'approve') {
      await Merchant.findOneAndUpdate(
        { telegram_id: targetUserId },
        { status: 'approved' }
      );

      await bot.answerCallbackQuery(query.id, { text: '✅ Merchant approved.' });

      // Replace admin keyboard with a static label so it can't be clicked again
      await bot.editMessageReplyMarkup(
        { inline_keyboard: [[{ text: '✅ Approved', callback_data: 'adm_done' }]] },
        { chat_id: chatId, message_id: messageId }
      );

      // Notify merchant
      await bot.sendMessage(targetUserId, MESSAGES.approved, {
        parse_mode: 'Markdown',
      });
    }

    if (action === 'reject') {
      await Merchant.findOneAndUpdate(
        { telegram_id: targetUserId },
        { status: 'rejected' }
      );

      await bot.answerCallbackQuery(query.id, { text: '❌ Merchant rejected.' });

      await bot.editMessageReplyMarkup(
        { inline_keyboard: [[{ text: '❌ Rejected', callback_data: 'adm_done' }]] },
        { chat_id: chatId, message_id: messageId }
      );

      await bot.sendMessage(targetUserId, MESSAGES.rejected, {
        parse_mode: 'Markdown',
      });
    }

    if (action === 'priority') {
      await Merchant.findOneAndUpdate(
        { telegram_id: targetUserId },
        { priority: true }
      );

      await bot.answerCallbackQuery(query.id, {
        text: '⭐ Priority flag set.',
        show_alert: false,
      });
    }
  } catch (err) {
    console.error('[adminHandler] error:', err.message);
    try {
      await bot.answerCallbackQuery(query.id, {
        text: 'Error processing action.',
        show_alert: true,
      });
    } catch (_) {}
  }
}
