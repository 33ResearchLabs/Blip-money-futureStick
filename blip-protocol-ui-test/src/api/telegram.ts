// ===============================
// 📨 Send Form Notification via Telegram HTTP API
// ===============================
// This works directly from the frontend without a backend

const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

export const sendFormNotification = async (formData) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn(
      "⚠️ Telegram bot not configured (missing BOT_TOKEN or CHAT_ID)"
    );
    throw new Error("Telegram configuration missing");
  }

  const { name, email, companyName, website, goals } = formData;
  const time = new Date().toLocaleString();

  // Build formatted message using Telegram's HTML formatting
  const message = `
<b>📋 New Form Submission on Blip money</b>

<b>Full Name:</b> ${name}
<b>Email:</b> ${email}
<b>Company Name:</b> ${companyName}
<b>Website:</b> ${website}
${goals ? `<b>Goals:</b> ${goals}\n` : ""}
<b>Submitted At:</b> ${time}
`.trim();

  const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.description || "Failed to send message");
    }

    console.log("✅ Form notification sent to Telegram");
    return data;
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error.message);
    throw error;
  }
};
