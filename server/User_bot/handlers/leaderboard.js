import BotUser from '../../models/botUser.model.js';
import { MESSAGES } from '../utils/messages.js';

export async function handleLeaderboard(ctx) {
  try {
    const top = await BotUser.find({ onboarded: true })
      .sort({ points: -1 })
      .limit(10)
      .select('name username points')
      .lean();

    if (top.length === 0) {
      return ctx.reply('No users on the leaderboard yet.', { parse_mode: 'Markdown' });
    }

    return ctx.reply(MESSAGES.leaderboard(top), { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('[user-bot] handleLeaderboard error:', err.message);
    ctx.reply('Something went wrong. Please try again.');
  }
}
