import { MESSAGES } from '../utils/messages.js';
import Merchant from '../../models/botMerchant.model.js';

/** ~20 msg/sec — well under Telegram's 30/sec flood limit. */
const RATE_LIMIT_MS = 50;

function isAdmin(userId) {
  return String(userId) === String(process.env.ADMIN_CHAT_ID);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a message to all approved merchants with rate limiting.
 * Reports delivery stats back to the admin.
 */
async function sendToAll(bot, message, adminChatId) {
  const merchants = await Merchant.find({ status: 'approved' }).select('telegram_id').lean();

  let sent = 0;
  let failed = 0;

  for (const m of merchants) {
    try {
      await bot.sendMessage(m.telegram_id, message, { parse_mode: 'Markdown' });
      sent++;
    } catch (err) {
      // Skip blocked users, deactivated accounts, or bad chat IDs silently
      failed++;
    }
    await sleep(RATE_LIMIT_MS);
  }

  bot.sendMessage(adminChatId, MESSAGES.broadcastComplete(sent, failed));
}

// ─── Predefined announcement templates ───────────────────────────────────────

const ANNOUNCE_TEMPLATES = {
  rewards:
    `*Blip Merchant Network — Rewards Update* 🏆\n\n` +
    `The next BLIP token snapshot is approaching.\n\n` +
    `Ensure your account is active and review your tier by sending /rewards.\n\n` +
    `_Blip Merchant Network_`,

  snapshot:
    `*Snapshot Recorded* 📸\n\n` +
    `A new allocation snapshot has been recorded for all active merchants in the Blip Phase-1 pool.\n\n` +
    `Your estimated BLIP allocation has been updated. Send /rewards to view your current status.\n\n` +
    `_Blip Merchant Network_`,

  update:
    `*Network Update* 🔔\n\n` +
    `Blip Merchant Network has been updated with new features and infrastructure improvements.\n\n` +
    `Stay tuned for upcoming announcements from the Blip team.\n\n` +
    `_Blip Merchant Network_`,
};

// ─── Handlers ────────────────────────────────────────────────────────────────

/**
 * /broadcast <message>
 * Sends a free-form message to all approved merchants.
 */
export async function handleBroadcast(bot, msg, message) {
  const userId = String(msg.from.id);
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    return bot.sendMessage(chatId, MESSAGES.notAdmin);
  }

  if (!message || !message.trim()) {
    return bot.sendMessage(chatId, 'Usage: /broadcast <message>');
  }

  await bot.sendMessage(chatId, `Broadcasting to approved merchants…`);
  await sendToAll(bot, message.trim(), chatId);
}

/**
 * /announce <rewards|snapshot|update>
 * Sends a predefined announcement template to all approved merchants.
 */
export async function handleAnnounce(bot, msg, type) {
  const userId = String(msg.from.id);
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    return bot.sendMessage(chatId, MESSAGES.notAdmin);
  }

  const key = (type || '').trim().toLowerCase();
  const template = ANNOUNCE_TEMPLATES[key];

  if (!template) {
    return bot.sendMessage(
      chatId,
      `Unknown announcement type.\n\nAvailable options:\n/announce rewards\n/announce snapshot\n/announce update`
    );
  }

  await bot.sendMessage(chatId, `Sending *${key}* announcement to approved merchants…`, {
    parse_mode: 'Markdown',
  });
  await sendToAll(bot, template, chatId);
}
