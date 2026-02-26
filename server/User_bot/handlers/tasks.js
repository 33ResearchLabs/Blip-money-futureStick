import BotUser from '../../models/botUser.model.js';
import { MESSAGES } from '../utils/messages.js';
import { KEYBOARDS } from '../utils/keyboards.js';

const TASK_POINTS = {
  telegram: 50,
  twitter: 50,
  retweet: 100,
};

const TASK_FIELD = {
  telegram: 'telegram_group',
  twitter: 'twitter_follow',
  retweet: 'retweet',
};

const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@blipmoney';
const TWITTER_HANDLE = process.env.BLIP_TWITTER_HANDLE || 'blipmoney';
const FOLLOW_URL = `https://x.com/intent/follow?screen_name=${TWITTER_HANDLE}`;

// Pre-filled tweet text for the retweet/post task
const TWEET_TEXT = process.env.BLIP_TWEET_TEXT ||
  'Just joined @blipmoney early access — the P2P payment protocol built for cross-border payments.\n\nEarn Blip Points before launch.\n\n#BlipMoney #Crypto #P2P';
const TWEET_INTENT_URL = `https://x.com/intent/tweet?text=${encodeURIComponent(TWEET_TEXT)}`;

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Check if a user is a member of the Telegram channel.
 */
async function isChannelMember(ctx, telegramUserId) {
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, Number(telegramUserId));
    return ['member', 'administrator', 'creator'].includes(member.status);
  } catch (err) {
    console.error('[user-bot] getChatMember error:', err.message);
    return false;
  }
}

/**
 * Verify a Twitter username exists via Twitter API v2.
 */
async function verifyTwitterUser(username) {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return { valid: false, reason: 'no_token' };

  try {
    const decoded = decodeURIComponent(token);
    const res = await fetch(
      `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}`,
      { headers: { Authorization: `Bearer ${decoded}` } }
    );
    const data = await res.json();
    if (data.data?.id) return { valid: true, id: data.data.id };
    return { valid: false, reason: 'not_found' };
  } catch (err) {
    console.error('[user-bot] Twitter API error:', err.message);
    return { valid: false, reason: 'api_error' };
  }
}

/**
 * Verify a tweet URL points to a real tweet via Twitter API v2.
 */
async function verifyTweet(url) {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return { valid: false, reason: 'no_token' };

  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  if (!match) return { valid: false, reason: 'bad_url' };

  try {
    const decoded = decodeURIComponent(token);
    const res = await fetch(
      `https://api.twitter.com/2/tweets/${match[1]}?tweet.fields=text,author_id`,
      { headers: { Authorization: `Bearer ${decoded}` } }
    );
    const data = await res.json();
    if (data.data?.id) return { valid: true };
    return { valid: false, reason: 'not_found' };
  } catch (err) {
    console.error('[user-bot] Twitter API error:', err.message);
    return { valid: false, reason: 'api_error' };
  }
}

/**
 * Award task points and refresh the task list message.
 */
async function awardTaskPoints(ctx, userId, taskKey, extra = {}) {
  const field = TASK_FIELD[taskKey];
  const points = TASK_POINTS[taskKey];

  await BotUser.findOneAndUpdate(
    { telegram_id: userId },
    { [`tasks_completed.${field}`]: true, $inc: { points }, ...extra }
  );

  const updated = await BotUser.findOne({ telegram_id: userId });
  const keyboard = KEYBOARDS.tasks(updated.tasks_completed);

  const msg =
    `*+${points} Blip Points earned!*\n` +
    `Balance: *${updated.points} Points*\n\n` +
    (keyboard.inline_keyboard.length === 0
      ? 'All tasks completed!'
      : 'Select another task to continue.');

  return ctx.reply(msg, {
    parse_mode: 'Markdown',
    ...(keyboard.inline_keyboard.length > 0 ? { reply_markup: keyboard } : {}),
  });
}

// ─── /tasks ─────────────────────────────────────────────────────────────────

export async function handleTasks(ctx) {
  const userId = String(ctx.from.id);

  try {
    const user = await BotUser.findOne({ telegram_id: userId });

    if (!user || !user.onboarded) {
      return ctx.reply(MESSAGES.notOnboarded, { parse_mode: 'Markdown' });
    }

    const keyboard = KEYBOARDS.tasks(user.tasks_completed);

    if (keyboard.inline_keyboard.length === 0) {
      return ctx.reply(MESSAGES.allTasksComplete, { parse_mode: 'Markdown' });
    }

    return ctx.reply(MESSAGES.tasks(user.tasks_completed), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('[user-bot] handleTasks error:', err.message);
    ctx.reply('Something went wrong. Please try again.');
  }
}

// ─── Task completion callback ───────────────────────────────────────────────

export async function handleTaskComplete(ctx, sessions) {
  const userId = String(ctx.from.id);
  const taskKey = ctx.callbackQuery.data.replace('task_', '');

  try {
    const user = await BotUser.findOne({ telegram_id: userId });

    if (!user) {
      try { await ctx.answerCbQuery(); } catch (_) {}
      return;
    }

    const field = TASK_FIELD[taskKey];
    if (!field || user.tasks_completed[field]) {
      try {
        await ctx.answerCbQuery('Task already completed.', { show_alert: true });
      } catch (_) {}
      return;
    }

    // ── Telegram: verify channel membership ──
    if (taskKey === 'telegram') {
      const isMember = await isChannelMember(ctx, userId);
      if (!isMember) {
        try {
          await ctx.answerCbQuery(
            `You haven't joined ${CHANNEL_ID} yet. Join first, then try again.`,
            { show_alert: true }
          );
        } catch (_) {}
        return;
      }

      try { await ctx.answerCbQuery(); } catch (_) {}
      return awardTaskPoints(ctx, userId, 'telegram');
    }

    // ── Twitter Follow: ask for username ──
    if (taskKey === 'twitter') {
      sessions.set(userId, { step: 'waiting_twitter_username' });
      try { await ctx.answerCbQuery(); } catch (_) {}
      return ctx.reply(
        `*Follow @${TWITTER_HANDLE} on X*\n\n` +
        `1. Tap the link below to follow:\n${FOLLOW_URL}\n\n` +
        `2. Then reply here with your X username to verify.\n\n` +
        `_Example: blipmoney_`,
        { parse_mode: 'Markdown', disable_web_page_preview: true }
      );
    }

    // ── Retweet / Post: send pre-filled tweet link, ask for proof ──
    if (taskKey === 'retweet') {
      sessions.set(userId, { step: 'waiting_tweet_url' });
      try { await ctx.answerCbQuery(); } catch (_) {}
      return ctx.reply(
        `*Post about Blip on X (+100 pts)*\n\n` +
        `1. Tap the link below — it opens X with a ready-made post:\n${TWEET_INTENT_URL}\n\n` +
        `2. Hit "Post" on X.\n` +
        `3. Then paste the URL of your post here to verify.`,
        { parse_mode: 'Markdown', disable_web_page_preview: true }
      );
    }
  } catch (err) {
    console.error('[user-bot] handleTaskComplete error:', err.message);
    try { await ctx.answerCbQuery(); } catch (_) {}
  }
}

// ─── Text handler for Twitter proof verification ────────────────────────────

export async function handleTwitterProof(ctx, sessions) {
  const userId = String(ctx.from.id);
  const session = sessions.get(userId);

  if (!session) return false;

  // ── Verify Twitter username ──
  if (session.step === 'waiting_twitter_username') {
    const username = ctx.message.text.trim().replace(/^@/, '').replace(/\s.*/g, '');

    if (!username || username.length > 30) {
      await ctx.reply('Please send a valid X username (without @).');
      return true;
    }

    const result = await verifyTwitterUser(username);

    if (!result.valid) {
      if (result.reason === 'no_token') {
        // No API key — accept on trust, store username
        await awardTaskPoints(ctx, userId, 'twitter', { twitter_username: username });
        sessions.delete(userId);
        return true;
      }
      await ctx.reply(
        `Could not find *@${username}* on X. Please check the username and try again.`,
        { parse_mode: 'Markdown' }
      );
      return true;
    }

    // Username verified
    await awardTaskPoints(ctx, userId, 'twitter', { twitter_username: username });
    sessions.delete(userId);
    return true;
  }

  // ── Verify tweet URL ──
  if (session.step === 'waiting_tweet_url') {
    const url = ctx.message.text.trim();

    if (!url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/\d+/)) {
      await ctx.reply(
        'Please paste a valid X post URL.\n\n_Example: https://x.com/yourname/status/123456_',
        { parse_mode: 'Markdown' }
      );
      return true;
    }

    const result = await verifyTweet(url);

    if (!result.valid) {
      if (result.reason === 'no_token') {
        // No API key — accept on trust
        await awardTaskPoints(ctx, userId, 'retweet');
        sessions.delete(userId);
        return true;
      }
      await ctx.reply('Could not verify that post. Make sure you posted it and paste the full URL.');
      return true;
    }

    // Tweet verified
    await awardTaskPoints(ctx, userId, 'retweet');
    sessions.delete(userId);
    return true;
  }

  return false;
}
