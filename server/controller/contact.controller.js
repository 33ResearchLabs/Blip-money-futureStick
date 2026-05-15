import { sendContactNotificationEmail } from "../services/email.service.js";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const sendTelegramNotification = async ({
  safeName,
  safeEmail,
  safeInquiryType,
  safeWebsite,
  safeMessage,
}) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return { skipped: true };

  const time = new Date().toISOString();
  const text = [
    `<b>New Form Submission</b>`,
    `<b>Name:</b> ${safeName}`,
    `<b>Email:</b> ${safeEmail}`,
    safeInquiryType ? `<b>Inquiry Type:</b> ${safeInquiryType}` : "",
    safeWebsite ? `<b>Website:</b> ${safeWebsite}` : "",
    safeMessage ? `<b>Message:</b> ${safeMessage}` : "",
    `<b>Time:</b> ${time}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Telegram API ${response.status}: ${body.slice(0, 200)}`);
  }
  return { skipped: false };
};

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, inquiryType, website, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const sanitize = (str) =>
      str ? String(str).replace(/<[^>]*>/g, "").slice(0, 500) : "";

    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeInquiryType = sanitize(inquiryType);
    const safeWebsite = sanitize(website);
    const safeMessage = sanitize(message);

    const [telegramResult, emailResult] = await Promise.allSettled([
      sendTelegramNotification({
        safeName,
        safeEmail,
        safeInquiryType,
        safeWebsite,
        safeMessage,
      }),
      sendContactNotificationEmail({
        name: safeName,
        email: safeEmail,
        inquiryType: safeInquiryType,
        website: safeWebsite,
        message: safeMessage,
      }),
    ]);

    if (telegramResult.status === "rejected") {
      console.error("[contact] Telegram send failed:", telegramResult.reason?.message || telegramResult.reason);
    }
    if (emailResult.status === "rejected") {
      console.error("[contact] Email send failed:", emailResult.reason?.message || emailResult.reason);
    }

    const telegramOk = telegramResult.status === "fulfilled";
    const emailOk = emailResult.status === "fulfilled";

    if (!telegramOk && !emailOk) {
      return res.status(502).json({
        success: false,
        message: "Failed to deliver your message. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      delivery: {
        telegram: telegramOk
          ? telegramResult.value?.skipped
            ? "skipped"
            : "sent"
          : "failed",
        email: emailOk ? "sent" : "failed",
      },
    });
  } catch (error) {
    console.error("[contact] submitContactForm error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit form",
    });
  }
};
