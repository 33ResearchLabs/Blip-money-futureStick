# Telegram Notification Setup (Frontend Only - No Backend Required)

## How It Works

The Telegram notification system sends form submissions directly from your frontend to Telegram using the Telegram Bot HTTP API. This requires **no backend server**.

## Setup Steps

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the instructions
3. Copy the **Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Get Your Chat ID

Option A: Use a Channel (Recommended for team notifications)
1. Create a Telegram channel
2. Add your bot as an administrator
3. Get the channel ID using [@userinfobot](https://t.me/userinfobot) or by forwarding a message from the channel

Option B: Use a Direct Message
1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for the `chat.id` in the response

### 3. Configure Environment Variables

Your `.env` file should already be configured:

```env
VITE_TELEGRAM_BOT_TOKEN=8429296356:AAFJKWFsV2gTY3yWfqTPTY8ZfV5i8ZG61iM
VITE_TELEGRAM_CHAT_ID=-1002974496510
```

**Important:**
- Variables MUST have the `VITE_` prefix to be accessible in the frontend
- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore`

### 4. Usage in Your Form Component

```tsx
import { sendFormNotification } from '@/api/telegram';

const handleSubmit = async (formData) => {
  try {
    await sendFormNotification({
      name: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      website: formData.website,
      goals: formData.goals // optional
    });

    console.log('Notification sent successfully!');
    // Show success message to user
  } catch (error) {
    console.error('Failed to send notification:', error);
    // Handle error (optional - you might want to still show success to user)
  }
};
```

## Security Considerations

**Warning:** Since this is a frontend-only solution, your bot token will be exposed in the client-side code. This means:

1. **Anyone can see your bot token** in the browser's developer tools
2. Users could potentially spam your Telegram with fake submissions

### Mitigation Strategies:

1. **Rate Limiting:** Set up Telegram's built-in anti-flood protection
2. **Bot Restrictions:** Configure your bot to only send messages (not receive commands)
3. **Monitoring:** Regularly check for suspicious activity
4. **Validation:** Add frontend validation and consider adding a captcha

### More Secure Alternative:

For production apps with sensitive data, consider using a lightweight backend proxy:
- Deploy a simple serverless function (Vercel, Netlify, Cloudflare Workers)
- Keep the bot token on the server
- Frontend calls your function, which then calls Telegram

## Testing

1. Restart your dev server after changing `.env`:
   ```bash
   npm run dev
   ```

2. Submit your form and check your Telegram channel/chat

## Message Format

Messages will appear like this:

```
📋 New Form Submission

Full Name: John Doe
Email: john@example.com
Company Name: Acme Corp
Website: https://acme.com
Goals: Looking to integrate payment solutions
Submitted At: 12/22/2025, 10:30:00 AM
```
