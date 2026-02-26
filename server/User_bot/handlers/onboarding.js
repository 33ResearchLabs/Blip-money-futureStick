import BotUser from '../../models/botUser.model.js';
import { MESSAGES } from '../utils/messages.js';
import { KEYBOARDS } from '../utils/keyboards.js';

const SIGNUP_POINTS = 100;
const ONBOARD_BONUS = 50;
const REFERRAL_POINTS = 50;

// ─── /start ──────────────────────────────────────────────────────────────────

export async function handleStart(ctx, sessions) {
  const userId = String(ctx.from.id);

  try {
    const existing = await BotUser.findOne({ telegram_id: userId });

    if (existing && existing.onboarded) {
      return ctx.reply(MESSAGES.alreadyRegistered(existing.points), {
        parse_mode: 'Markdown',
      });
    }

    if (existing && !existing.onboarded) {
      sessions.set(userId, { step: 'waiting_name' });
      return ctx.reply(MESSAGES.resumeOnboarding, {
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.joinEarlyAccess,
      });
    }

    // New user
    const referrerId = ctx.startPayload || null;

    const user = new BotUser({
      telegram_id: userId,
      username: ctx.from.username || null,
      points: SIGNUP_POINTS,
      referred_by: referrerId && referrerId !== userId ? referrerId : null,
    });

    await user.save();

    // Credit referrer
    if (referrerId && referrerId !== userId) {
      await BotUser.findOneAndUpdate(
        { telegram_id: referrerId, onboarded: true },
        { $inc: { points: REFERRAL_POINTS, referrals: 1 } }
      );
    }

    return ctx.reply(MESSAGES.welcome(SIGNUP_POINTS), {
      parse_mode: 'Markdown',
      reply_markup: KEYBOARDS.joinEarlyAccess,
    });
  } catch (err) {
    console.error('[user-bot] handleStart error:', err.message);
    ctx.reply('Something went wrong. Please try again.');
  }
}

// ─── "Join Early Access" button ─────────────────────────────────────────────

export async function handleOnboardStart(ctx, sessions) {
  const userId = String(ctx.from.id);

  try { await ctx.answerCbQuery(); } catch (_) {}

  sessions.set(userId, { step: 'waiting_name' });

  return ctx.editMessageText(MESSAGES.askName, {
    parse_mode: 'Markdown',
  });
}

// ─── Name (text input) ─────────────────────────────────────────────────────

export async function handleNameInput(ctx, sessions) {
  const userId = String(ctx.from.id);
  const session = sessions.get(userId);

  if (!session || session.step !== 'waiting_name') return;

  const name = ctx.message.text.trim();

  if (!name || name.length > 100) {
    return ctx.reply('Please enter a valid name.');
  }

  await BotUser.findOneAndUpdate(
    { telegram_id: userId },
    { name }
  );

  session.step = 'waiting_country';

  return ctx.reply(MESSAGES.askCountry, {
    parse_mode: 'Markdown',
    reply_markup: KEYBOARDS.country,
  });
}

// ─── Country (button) ──────────────────────────────────────────────────────

export async function handleCountry(ctx, sessions) {
  const userId = String(ctx.from.id);
  const session = sessions.get(userId);

  if (!session || session.step !== 'waiting_country') {
    try { await ctx.answerCbQuery(); } catch (_) {}
    return;
  }

  try { await ctx.answerCbQuery(); } catch (_) {}

  const country = ctx.callbackQuery.data.replace('country_', '');

  await BotUser.findOneAndUpdate(
    { telegram_id: userId },
    { country }
  );

  session.step = 'waiting_role';

  return ctx.editMessageText(MESSAGES.askRole, {
    parse_mode: 'Markdown',
    reply_markup: KEYBOARDS.role,
  });
}

// ─── Role (button) — completes onboarding ──────────────────────────────────

export async function handleRole(ctx, sessions) {
  const userId = String(ctx.from.id);
  const session = sessions.get(userId);

  if (!session || session.step !== 'waiting_role') {
    try { await ctx.answerCbQuery(); } catch (_) {}
    return;
  }

  try { await ctx.answerCbQuery(); } catch (_) {}

  const role = ctx.callbackQuery.data.replace('role_', '');

  const user = await BotUser.findOneAndUpdate(
    { telegram_id: userId },
    { role, onboarded: true, $inc: { points: ONBOARD_BONUS } },
    { new: true }
  );

  sessions.delete(userId);

  return ctx.editMessageText(MESSAGES.onboardComplete(user.points), {
    parse_mode: 'Markdown',
  });
}
