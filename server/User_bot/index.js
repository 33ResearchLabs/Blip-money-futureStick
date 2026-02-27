import { Telegraf } from 'telegraf';
import {
  handleStart,
  handleOnboardStart,
  handleNameInput,
  handleCountry,
  handleRole,
} from './handlers/onboarding.js';
import { handleTasks, handleTaskComplete, handleTwitterProof } from './handlers/tasks.js';
import { handlePoints } from './handlers/points.js';
import { handleDaily } from './handlers/daily.js';
import { handleRef } from './handlers/referral.js';
import { handleLeaderboard } from './handlers/leaderboard.js';
import { handleAdminStats, handleExport } from './handlers/admin.js';
import { handleRedeem } from './handlers/redeem.js';

/**
 * Start the Blip Airdrop Telegram bot.
 * Assumes MongoDB is already connected by the main server.
 */
export function startUserBot() {
  console.log('[user-bot] startUserBot() called');

  const { USER_BOT_TOKEN } = process.env;

  console.log('[user-bot] USER_BOT_TOKEN exists:', !!USER_BOT_TOKEN);

  if (!USER_BOT_TOKEN) {
    console.warn('[user-bot] Missing USER_BOT_TOKEN — bot not started.');
    return;
  }

  const bot = new Telegraf(USER_BOT_TOKEN);
  const sessions = new Map();

  // ── Commands ──────────────────────────────────────────────────────────────

  bot.command('start', (ctx) => handleStart(ctx, sessions));
  bot.command('tasks', handleTasks);
  bot.command('points', handlePoints);
  bot.command('daily', handleDaily);
  bot.command('ref', handleRef);
  bot.command('leaderboard', handleLeaderboard);
  bot.command('redeem', handleRedeem);
  bot.command('adminstats', handleAdminStats);
  bot.command('export', handleExport);

  // ── Callbacks ─────────────────────────────────────────────────────────────

  bot.action('onboard_start', (ctx) => handleOnboardStart(ctx, sessions));
  bot.action(/^country_/, (ctx) => handleCountry(ctx, sessions));
  bot.action(/^role_/, (ctx) => handleRole(ctx, sessions));
  bot.action(/^task_/, (ctx) => handleTaskComplete(ctx, sessions));

  // ── Text handler (Twitter proof + onboarding name input) ─────────────────

  bot.on('text', async (ctx) => {
    const handled = await handleTwitterProof(ctx, sessions);
    if (!handled) await handleNameInput(ctx, sessions);
  });

  // ── Error handling ────────────────────────────────────────────────────────

  bot.catch((err) => {
    console.error('[user-bot error]', err.message);
  });

  // ── Launch ────────────────────────────────────────────────────────────────

  bot.launch({ dropPendingUpdates: true }).then(() => {
    console.log('[user-bot] Blip Airdrop Bot is running.');
  }).catch((err) => {
    console.error('[user-bot] Failed to start:', err.message);
  });
}
