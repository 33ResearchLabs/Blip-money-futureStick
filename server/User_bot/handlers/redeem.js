import crypto from "crypto";
import BotUser from "../../models/botUser.model.js";
import User from "../../models/user.model.js";
import RedeemToken from "../../models/redeemToken.model.js";

const WEBSITE_URL = process.env.CLIENT_URL?.split(",")[0]?.trim() || "https://blip.money";
const OTP_EXPIRY_MINUTES = 5;

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function handleRedeem(ctx) {
  try {
    const telegramId = String(ctx.from.id);

    // Check if user is onboarded
    const botUser = await BotUser.findOne({ telegram_id: telegramId });
    if (!botUser || !botUser.onboarded) {
      return ctx.reply(
        "You need to complete onboarding first.\n\nUse /start to begin.",
      );
    }

    // Check if already linked to a website account
    const linkedUser = await User.findOne({
      telegramUserId: telegramId,
      telegramVerified: true,
    });

    if (linkedUser) {
      const totalPoints = (linkedUser.totalBlipPoints || 0) + (botUser.points || 0);
      return ctx.reply(
        `✅ *Already Linked*\n\n` +
          `Your Telegram is linked to *${linkedUser.email}*\n\n` +
          `Website Points: *${linkedUser.totalBlipPoints || 0}*\n` +
          `Telegram Points: *${botUser.points || 0}*\n` +
          `Total: *${totalPoints} Blip Points*`,
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
      role: "user",
      expiresAt,
    });

    // URL uses random token — OTP and role are NOT exposed
    const redeemUrl = `${WEBSITE_URL}/redeem?token=${linkToken}`;

    await ctx.reply(
      `🔗 *Link Your Telegram Points*\n\n` +
        `Tap the button below to link your *${botUser.points} points* to your Blip account.\n\n` +
        `Or enter this OTP manually: \`${otp}\`\n` +
        `Expires in *${OTP_EXPIRY_MINUTES} minutes*.`,
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
    console.error("[user-bot] redeem error:", err.message);
    ctx.reply("Something went wrong. Please try again later.");
  }
}
