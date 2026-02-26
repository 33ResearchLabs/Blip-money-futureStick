import BotUser from '../../models/botUser.model.js';
import { MESSAGES } from '../utils/messages.js';

function isAdmin(userId) {
  return String(userId) === String(process.env.USER_BOT_ADMIN_ID);
}

// ─── /adminstats ────────────────────────────────────────────────────────────

export async function handleAdminStats(ctx) {
  if (!isAdmin(ctx.from.id)) return;

  try {
    const totalUsers = await BotUser.countDocuments();
    const result = await BotUser.aggregate([
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]);
    const totalPoints = result[0]?.total || 0;

    return ctx.reply(MESSAGES.adminStats(totalUsers, totalPoints), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error('[user-bot] handleAdminStats error:', err.message);
    ctx.reply('Failed to fetch stats.');
  }
}

// ─── /export ────────────────────────────────────────────────────────────────

export async function handleExport(ctx) {
  if (!isAdmin(ctx.from.id)) return;

  try {
    const users = await BotUser.find()
      .select('telegram_id username name country role points referrals join_date')
      .lean();

    const json = JSON.stringify(users, null, 2);

    return ctx.replyWithDocument({
      source: Buffer.from(json),
      filename: 'users.json',
    });
  } catch (err) {
    console.error('[user-bot] handleExport error:', err.message);
    ctx.reply('Failed to export data.');
  }
}
