import BotUser from '../../models/botUser.model.js';
import { MESSAGES } from '../utils/messages.js';

export async function handlePoints(ctx) {
  const userId = String(ctx.from.id);

  try {
    const user = await BotUser.findOne({ telegram_id: userId });

    if (!user || !user.onboarded) {
      return ctx.reply(MESSAGES.notOnboarded, { parse_mode: 'Markdown' });
    }

    return ctx.reply(MESSAGES.points(user.points), { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('[user-bot] handlePoints error:', err.message);
    ctx.reply('Something went wrong. Please try again.');
  }
}
