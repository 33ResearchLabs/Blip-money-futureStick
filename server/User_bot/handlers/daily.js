import BotUser from '../../models/botUser.model.js';
import { MESSAGES } from '../utils/messages.js';

const DAILY_POINTS = 20;
const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export async function handleDaily(ctx) {
  const userId = String(ctx.from.id);

  try {
    const user = await BotUser.findOne({ telegram_id: userId });

    if (!user || !user.onboarded) {
      return ctx.reply(MESSAGES.notOnboarded, { parse_mode: 'Markdown' });
    }

    const now = new Date();

    if (user.last_daily) {
      const elapsed = now - new Date(user.last_daily);
      if (elapsed < DAILY_COOLDOWN_MS) {
        return ctx.reply(MESSAGES.dailyAlready, { parse_mode: 'Markdown' });
      }
    }

    user.points += DAILY_POINTS;
    user.last_daily = now;
    await user.save();

    return ctx.reply(MESSAGES.dailyClaimed(user.points), { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('[user-bot] handleDaily error:', err.message);
    ctx.reply('Something went wrong. Please try again.');
  }
}
