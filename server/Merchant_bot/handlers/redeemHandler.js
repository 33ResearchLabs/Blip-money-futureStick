import crypto from "crypto";
import Merchant from "../../models/botMerchant.model.js";
import User from "../../models/user.model.js";
import RedeemToken from "../../models/redeemToken.model.js";

const WEBSITE_URL = process.env.CLIENT_URL?.split(",")[0]?.trim() || "https://blip.money";
const OTP_EXPIRY_MINUTES = 5;

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function handleRedeem(bot, msg) {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from.id);

  try {
    // Check if merchant has completed the application
    const merchant = await Merchant.findOne({ telegram_id: telegramId });
    if (!merchant) {
      return bot.sendMessage(chatId,
        "You need to complete your merchant application first.\n\nUse /start to begin.",
      );
    }

    // Check if already linked to a website account
    const linkedUser = await User.findOne({
      telegramUserId: telegramId,
      telegramVerified: true,
    });

    if (linkedUser) {
      return bot.sendMessage(
        chatId,
        `✅ *Already Linked*\n\n` +
          `Your Telegram is linked to *${linkedUser.email}*\n` +
          `Tier: *${merchant.tier}*`,
        { parse_mode: "Markdown" },
      );
    }

    // Invalidate any existing unused tokens for this user
    await RedeemToken.updateMany(
      { telegram_id: telegramId, used: false },
      { $set: { used: true } },
    );

    // Generate OTP + secure link token
    const otp = generateOTP();
    const linkToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await RedeemToken.create({
      otp,
      linkToken,
      telegram_id: telegramId,
      role: "merchant",
      expiresAt,
    });

    // URL uses random token — OTP and role are NOT exposed
    const redeemUrl = `${WEBSITE_URL}/redeem?token=${linkToken}`;

    await bot.sendMessage(
      chatId,
      `🔗 *Link Your Merchant Account*\n\n` +
        `Your OTP code: \`${otp}\`\n` +
        `Expires in *${OTP_EXPIRY_MINUTES} minutes*.\n\n` +
        `Tap the button below to link your merchant profile (*${merchant.tier}* tier) to your Blip website account.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔗 Link to Blip.money", url: redeemUrl }],
          ],
        },
      },
    );
  } catch (err) {
    console.error("[merchant-bot] redeem error:", err.message);
    bot.sendMessage(chatId, "Something went wrong. Please try again later.");
  }
}
