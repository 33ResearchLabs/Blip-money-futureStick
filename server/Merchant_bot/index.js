import TelegramBot from 'node-telegram-bot-api';
import { handleStart, handleFlowCallback } from './handlers/merchantFlow.js';
import { handleAdminCallback } from './handlers/adminHandler.js';
import { handleRewards } from './handlers/rewardsHandler.js';
import { handleBroadcast, handleAnnounce } from './handlers/broadcastHandler.js';
import { handleRedeem } from './handlers/redeemHandler.js';

/**
 * Start the Merchant Network Telegram bot.
 * Assumes MongoDB is already connected by the main server.
 */
export function startMerchantBot() {
  const { BOT_TOKEN, ADMIN_CHAT_ID } = process.env;

  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn('[merchant-bot] Missing BOT_TOKEN or ADMIN_CHAT_ID — bot not started.');
    return;
  }

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  // ── Commands ────────────────────────────────────────────────────────────────

  bot.onText(/^\/start$/, (msg) => handleStart(bot, msg));

  bot.onText(/^\/rewards$/, (msg) => handleRewards(bot, msg));

  bot.onText(/^\/broadcast (.+)/s, (msg, match) =>
    handleBroadcast(bot, msg, match[1])
  );

  bot.onText(/^\/announce (.+)/, (msg, match) =>
    handleAnnounce(bot, msg, match[1])
  );

  bot.onText(/^\/redeem$/, (msg) => handleRedeem(bot, msg));

  // ── Callback query router ─────────────────────────────────────────────────

  bot.on('callback_query', async (query) => {
    const data = query.data || '';

    if (data.startsWith('adm_')) {
      await handleAdminCallback(bot, query);
    } else if (data.startsWith('flow_')) {
      await handleFlowCallback(bot, query);
    } else {
      try { await bot.answerCallbackQuery(query.id); } catch (_) {}
    }
  });

  // ── Error handling ────────────────────────────────────────────────────────

  bot.on('polling_error', (err) => {
    console.error('[merchant-bot polling]', err.code, err.message);
  });

  bot.on('error', (err) => {
    console.error('[merchant-bot error]', err.message);
  });

  // Stop polling cleanly on restart (prevents 409 conflict with nodemon)
  const stopBot = () => bot.stopPolling();
  process.once('SIGINT', stopBot);
  process.once('SIGTERM', stopBot);

  console.log('[merchant-bot] Blip Merchant Network bot is running.');
}
