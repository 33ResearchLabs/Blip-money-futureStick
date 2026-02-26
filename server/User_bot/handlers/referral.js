import BotUser from '../../models/botUser.model.js';
import { MESSAGES } from '../utils/messages.js';

export async function handleRef(ctx) {
  const userId = String(ctx.from.id);

  try {
    const user = await BotUser.findOne({ telegram_id: userId });

    if (!user || !user.onboarded) {
      return ctx.reply(MESSAGES.notOnboarded, { parse_mode: 'Markdown' });
    }

    const botUsername = ctx.botInfo.username;
    const link = `https://t.me/${botUsername}?start=${userId}`;

    return ctx.reply(MESSAGES.referral(link, user.referrals), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error('[user-bot] handleRef error:', err.message);
    ctx.reply('Something went wrong. Please try again.');
  }
}
