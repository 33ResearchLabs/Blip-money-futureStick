# Contact Form - Telegram Integration

## What Was Done

Successfully integrated Telegram notifications into the Contact Us form without requiring any backend server.

## Changes Made

### 1. Updated [ContactUs.tsx](src/pages/ContactUs.tsx)

- Added import for `sendFormNotification` from `@/api/telegram`
- Updated form state to track:
  - `name` - User's name (optional, defaults to "Anonymous")
  - `email` - User's email (required)
  - `inquiryType` - Type of inquiry selected
  - `message` - User's message content
  - `isSubmitting` - Loading state during submission
  - `error` - Error messages if submission fails

- Connected all form inputs to state with `value` and `onChange` handlers
- Updated `handleSubmit` to:
  - Prevent default form submission
  - Show "ENCRYPTING..." status
  - Send data to Telegram via the API
  - Show success animation or error message
  - Reset form after successful submission

### 2. Form Field Mapping

The form fields are mapped to Telegram notification as follows:

| Form Field | Telegram Field | Notes |
|------------|---------------|-------|
| Ident_Name | name | Optional, defaults to "Anonymous" |
| Endpoint_Addr | email | Required field |
| Route_Selection | companyName | Shows inquiry type |
| Secure_Payload | goals | The message content |
| - | website | Auto-filled with current URL |

## How It Works

1. User fills out the contact form
2. User clicks "Establish Secure Connection"
3. Button shows "Transmitting..." while processing
4. Form data is sent directly to Telegram via HTTP API
5. Success animation appears with transmission hash
6. Form is reset and ready for next submission
7. If error occurs, error message is displayed above the form

## Telegram Message Format

Messages appear in Telegram like this:

```
📋 New Form Submission on Blip money

Full Name: John Doe
Email: john@example.com
Company Name: merchant
Website: http://localhost:5173
Goals: I'm interested in becoming a merchant partner...
Submitted At: 12/22/2025, 10:30:00 AM
```

## Testing

1. **Restart your dev server** to load the new environment variables:
   ```bash
   npm run dev
   ```

2. Navigate to the Contact Us page

3. Fill out the form and submit

4. Check your Telegram channel/chat for the notification

## Configuration

Environment variables are already set in `.env`:

```env
VITE_TELEGRAM_BOT_TOKEN=8429296356:AAFJKWFsV2gTY3yWfqTPTY8ZfV5i8ZG61iM
VITE_TELEGRAM_CHAT_ID=-1002974496510
```

## Error Handling

- If Telegram API fails, user sees: "Failed to send message. Please try again or contact us directly."
- Error is logged to console for debugging
- Form remains filled so user can retry
- Status resets to "ACTIVE"

## Security Notes

⚠️ Since this is a frontend-only solution:
- The bot token is visible in client-side code
- Users could potentially spam the form
- Consider adding rate limiting or captcha for production

For more secure implementation, see [TELEGRAM_USAGE.md](src/api/TELEGRAM_USAGE.md)

## Ready to Use!

The integration is complete and ready to test. Just restart your dev server and try submitting the contact form.
