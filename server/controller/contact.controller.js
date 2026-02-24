const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, companyName, website, goals } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Sanitize inputs - strip HTML tags
    const sanitize = (str) => (str ? String(str).replace(/<[^>]*>/g, "").slice(0, 500) : "");

    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeCompany = sanitize(companyName);
    const safeWebsite = sanitize(website);
    const safeGoals = sanitize(goals);

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const time = new Date().toISOString();
      const message = [
        `<b>New Form Submission</b>`,
        `<b>Name:</b> ${safeName}`,
        `<b>Email:</b> ${safeEmail}`,
        safeCompany ? `<b>Company:</b> ${safeCompany}` : "",
        safeWebsite ? `<b>Website:</b> ${safeWebsite}` : "",
        safeGoals ? `<b>Goals:</b> ${safeGoals}` : "",
        `<b>Time:</b> ${time}`,
      ]
        .filter(Boolean)
        .join("\n");

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "HTML",
          }),
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit form",
    });
  }
};
