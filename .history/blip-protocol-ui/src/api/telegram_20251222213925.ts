import TelegramBot from "node-telegram-bot-api";

do

const CHANNEL_ID = process.env.CHANNEL_ID;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Initialize bot only if a token is present
export const bot = TOKEN ? new TelegramBot(TOKEN, { polling: true }) : null;

// Store detected chat IDs as fallback (for testing)
let detectedChatIds = new Set();

// Helper to calculate UTF-16 string length (Telegram uses UTF-16 offsets)
const getUTF16Length = (str) => {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) i++; // handle surrogate pairs
    length++;
  }
  return length;
};

// ===============================
// 📨 Send Form Notification
// ===============================
export const sendFormNotification = async (formData) => {
  if (!bot) {
    console.warn("⚠️ Telegram bot not configured (missing TOKEN)");
    return;
  }

  let targetChatId = CHANNEL_ID;

  if (!targetChatId && detectedChatIds.size === 0) {
    throw new Error("CHANNEL_ID not configured or no chat detected yet");
  }

  const { name, email, companyName, website, goals } = formData;
  const time = new Date().toLocaleString();

  // Build the message
  let message = "";
  const entities = [];
  let offset = 0;

  // Header
  const headerText = `📋 New Form Submission`;
  message += headerText + "\n\n";
  entities.push({
    offset: getUTF16Length("📋 "),
    length: getUTF16Length("New Form Submission"),
    type: "bold",
  });
  offset = getUTF16Length(message);

  // Full Name
  const nameLabel = "Full Name:";
  message += `${nameLabel} ${name}\n`;
  entities.push({ offset, length: getUTF16Length(nameLabel), type: "bold" });
  offset = getUTF16Length(message);

  // Email
  const emailLabel = "Email:";
  message += `${emailLabel} ${email}\n`;
  entities.push({ offset, length: getUTF16Length(emailLabel), type: "bold" });
  offset = getUTF16Length(message);

  // Company Name
  const companyLabel = "Company Name:";
  message += `${companyLabel} ${companyName}\n`;
  entities.push({ offset, length: getUTF16Length(companyLabel), type: "bold" });
  offset = getUTF16Length(message);

  // Website
  const websiteLabel = "Website:";
  message += `${websiteLabel} ${website}\n`;
  entities.push({ offset, length: getUTF16Length(websiteLabel), type: "bold" });
  offset = getUTF16Length(message);

  // Goals (optional)
  if (goals && goals.trim()) {
    const goalsLabel = "Goals:";
    message += `${goalsLabel} ${goals}\n`;
    entities.push({ offset, length: getUTF16Length(goalsLabel), type: "bold" });
    offset = getUTF16Length(message);
  }

  // Time
  const timeLabel = "Submitted At:";
  message += `${timeLabel} ${time}`;
  entities.push({ offset, length: getUTF16Length(timeLabel), type: "bold" });

  const options = {
    entities,
    // reply_markup: {
    //   inline_keyboard: [
    //     [{ text: "📧 Reply to Lead", url: `mailto:${email}` }],
    //     [{ text: "🌐 Visit Website", url: website }],
    //   ],
    // },
  };

  try {
    if (targetChatId) {
      await bot.sendMessage(targetChatId, message, options);
      console.log("✅ Form notification sent to Telegram channel");
      return;
    }

    // fallback if no CHANNEL_ID is set
    for (const chatId of detectedChatIds) {
      await bot.sendMessage(chatId, message, options);
      console.log(`✅ Sent notification to detected chat: ${chatId}`);
      break;
    }
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error.message);
    console.error("Full error:", error);
  }
};

// ===============================
// 🧠 Listen for messages (detect chat IDs)
// ===============================
if (bot) {
  bot.on("message", (msg) => {
    const chatId = msg.chat.id.toString();
    detectedChatIds.add(chatId);
    console.log(`📱 Detected chat ID: ${chatId}`);
  });
}
