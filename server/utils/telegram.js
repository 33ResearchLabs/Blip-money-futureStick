/**
 * Telegram Bot API - Verify Channel/Group Membership
 *
 * To use this:
 * 1. Create a bot via @BotFather on Telegram
 * 2. Add the bot as admin to your channel/group
 * 3. Set TELEGRAM_BOT_TOKEN in .env
 * 4. Set TELEGRAM_CHANNEL_ID in .env (e.g., @channelname or -1001234567890)
 */

// Read env vars at function call time (not module load time)
// to ensure dotenv has loaded the .env file
const getConfig = () => ({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  channelId: process.env.TELEGRAM_CHANNEL_ID || "@blipmoney",
});

/**
 * Check if a user is a member of the Telegram channel
 * @param {string} telegramUserId - The Telegram user ID
 * @returns {Promise<{isMember: boolean, status: string, error?: string}>}
 */
export const verifyTelegramMembership = async (telegramUserId) => {
  const { botToken, channelId } = getConfig();

  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN not configured");
    return { isMember: false, status: "error", error: "Bot not configured" };
  }

  if (!telegramUserId) {
    return { isMember: false, status: "error", error: "Telegram user ID required" };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/getChatMember`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: channelId,
        user_id: telegramUserId,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram API error:", data);
      return {
        isMember: false,
        status: "error",
        error: data.description || "Failed to check membership"
      };
    }

    // Check membership status
    // Possible statuses: creator, administrator, member, restricted, left, kicked
    const memberStatus = data.result.status;
    const validStatuses = ["creator", "administrator", "member", "restricted"];
    const isMember = validStatuses.includes(memberStatus);

    return {
      isMember,
      status: memberStatus,
    };
  } catch (error) {
    console.error("Telegram verification error:", error);
    return {
      isMember: false,
      status: "error",
      error: error.message
    };
  }
};

/**
 * Get bot info (useful for testing if bot token is valid)
 */
export const getBotInfo = async () => {
  const { botToken } = getConfig();

  if (!botToken) {
    return { ok: false, error: "Bot not configured" };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );
    return await response.json();
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
