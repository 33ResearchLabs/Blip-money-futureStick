import { KEYBOARDS, adminKeyboard } from '../utils/keyboards.js';
import { MESSAGES } from '../utils/messages.js';
import { calculateTier } from '../utils/scoring.js';
import Merchant from '../../models/botMerchant.model.js';

/**
 * In-memory session store.
 * Shape: Map<userId, { step: number, data: object, messageId: number }>
 */
const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, { step: 0, data: {}, messageId: null });
  }
  return sessions.get(userId);
}

function clearSession(userId) {
  sessions.delete(userId);
}

// ─── /start ──────────────────────────────────────────────────────────────────

export async function handleStart(bot, msg) {
  const userId = String(msg.from.id);
  const chatId = msg.chat.id;

  try {
    const existing = await Merchant.findOne({ telegram_id: userId });
    if (existing) {
      return bot.sendMessage(chatId, MESSAGES.alreadyApplied(existing.status), {
        parse_mode: 'Markdown',
      });
    }

    clearSession(userId);
    const session = getSession(userId);
    session.step = 1;
    session.data = {
      telegram_id: userId,
      username: msg.from.username || null,
      first_name: msg.from.first_name || null,
    };

    const sent = await bot.sendMessage(chatId, MESSAGES.step1, {
      parse_mode: 'Markdown',
      reply_markup: KEYBOARDS.step1,
    });
    session.messageId = sent.message_id;
  } catch (err) {
    console.error('[merchantFlow] handleStart error:', err.message);
    bot.sendMessage(chatId, 'Something went wrong. Please try again.');
  }
}

// ─── Callback router ─────────────────────────────────────────────────────────

export async function handleFlowCallback(bot, query) {
  const userId = String(query.from.id);
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  // Always acknowledge the callback to remove the loading state
  try {
    await bot.answerCallbackQuery(query.id);
  } catch (_) {}

  // ── Restart flow ────────────────────────────────────────────────────────────
  if (data === 'flow_restart') {
    try {
      clearSession(userId);

      const existing = await Merchant.findOne({ telegram_id: userId });
      if (existing) {
        return bot.editMessageText(MESSAGES.alreadyApplied(existing.status), {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
        });
      }

      const session = getSession(userId);
      session.step = 1;
      session.data = {
        telegram_id: userId,
        username: query.from.username || null,
        first_name: query.from.first_name || null,
      };
      session.messageId = messageId;

      return bot.editMessageText(MESSAGES.step1, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.step1,
      });
    } catch (err) {
      console.error('[merchantFlow] flow_restart error:', err.message);
    }
    return;
  }

  const session = getSession(userId);
  if (!session || session.step === 0) return;

  try {
    // Step 1 — Role
    if (data.startsWith('flow_role_') && session.step === 1) {
      session.data.role = data.replace('flow_role_', '');
      session.step = 2;
      return bot.editMessageText(MESSAGES.step2, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.step2,
      });
    }

    // Step 2 — Use case
    if (data.startsWith('flow_uc_') && session.step === 2) {
      session.data.use_case = data.replace('flow_uc_', '');
      session.step = 3;
      return bot.editMessageText(MESSAGES.step3, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.step3,
      });
    }

    // Step 3 — Volume
    if (data.startsWith('flow_vol_') && session.step === 3) {
      session.data.volume = data.replace('flow_vol_', '');
      session.step = 4;
      return bot.editMessageText(MESSAGES.step4, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.step4,
      });
    }

    // Step 4 — Corridor
    if (data.startsWith('flow_cor_') && session.step === 4) {
      session.data.corridor = data.replace('flow_cor_', '');
      session.step = 5;
      return bot.editMessageText(MESSAGES.step5, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.step5,
      });
    }

    // Step 5 — Integration speed
    if (data.startsWith('flow_int_') && session.step === 5) {
      session.data.integration_speed = data.replace('flow_int_', '');
      session.step = 6;
      return bot.editMessageText(MESSAGES.step6, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.step6,
      });
    }

    // Step 6 — Liquidity role
    if (data.startsWith('flow_liq_') && session.step === 6) {
      session.data.liquidity_role = data.replace('flow_liq_', '');
      session.step = 7;
      return bot.editMessageText(MESSAGES.step7, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.step7,
      });
    }

    // Step 7 — Contact method → show summary
    if (data.startsWith('flow_con_') && session.step === 7) {
      session.data.contact_method = data.replace('flow_con_', '');
      session.step = 8;
      return bot.editMessageText(MESSAGES.summary(session.data), {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: KEYBOARDS.submit,
      });
    }

    // Step 8 — Confirm & submit
    if (data === 'flow_submit_confirm' && session.step === 8) {
      // Guard against duplicate submission
      const existing = await Merchant.findOne({ telegram_id: userId });
      if (existing) {
        clearSession(userId);
        return bot.editMessageText(MESSAGES.alreadyApplied(existing.status), {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
        });
      }

      const tier = calculateTier(session.data.volume);
      const captured = { ...session.data }; // snapshot before clearing

      const merchant = new Merchant({
        telegram_id: userId,
        username: captured.username,
        first_name: captured.first_name,
        role: captured.role,
        use_case: captured.use_case,
        volume: captured.volume,
        corridor: captured.corridor,
        integration_speed: captured.integration_speed,
        liquidity_role: captured.liquidity_role,
        contact_method: captured.contact_method,
        wallet: captured.wallet || null,
        tier,
        status: 'pending',
        priority: false,
      });

      await merchant.save();
      clearSession(userId);

      // Confirm to the merchant
      await bot.editMessageText(MESSAGES.submitted(tier), {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
      });

      // Notify admin — isolated so a bad ADMIN_CHAT_ID never breaks the user flow
      const adminId = process.env.ADMIN_CHAT_ID;
      if (adminId && !adminId.includes('your_admin')) {
        try {
          await bot.sendMessage(
            adminId,
            MESSAGES.adminNotification(captured, tier),
            {
              parse_mode: 'Markdown',
              reply_markup: adminKeyboard(userId),
            }
          );
        } catch (adminErr) {
          console.error('[merchantFlow] Admin notify failed:', adminErr.message);
        }
      }
    }
  } catch (err) {
    console.error('[merchantFlow] handleFlowCallback error:', err.message);
    try {
      bot.sendMessage(chatId, 'An error occurred. Please try /start again.');
    } catch (_) {}
  }
}
