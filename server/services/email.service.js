import { Resend } from "resend";
import nodemailer from "nodemailer";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_SERVICE = process.env.SMTP_SERVICE;
const SMTP_MAIL = process.env.SMTP_MAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL;

let smtpTransporter = null;
if (SMTP_MAIL && SMTP_PASSWORD) {
  smtpTransporter = nodemailer.createTransport({
    service: SMTP_SERVICE || undefined,
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_MAIL, pass: SMTP_PASSWORD },
  });
} else {
  console.warn("[email] SMTP_MAIL/SMTP_PASSWORD missing — contact-form emails will be skipped.");
}

const escapeHtml = (str) =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendContactNotificationEmail = async ({
  name,
  email,
  inquiryType,
  website,
  message,
}) => {
  if (!smtpTransporter) {
    throw new Error("SMTP transporter not configured");
  }
  if (!CONTACT_RECEIVER_EMAIL) {
    throw new Error("CONTACT_RECEIVER_EMAIL is not set in environment");
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    inquiryType: escapeHtml(inquiryType),
    website: escapeHtml(website),
    message: escapeHtml(message),
  };

  const subject = `New Contact Form Submission from ${name}${
    inquiryType ? ` (${inquiryType})` : ""
  }`;

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: #000000; color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.85; }
        .content { padding: 30px; }
        .row { display: block; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 15px; }
        .row:last-child { border-bottom: none; }
        .label { color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 4px; }
        .value { color: #111; font-size: 15px; word-break: break-word; }
        .goals { white-space: pre-wrap; }
        .footer { background: #f9f9f9; padding: 16px 30px; text-align: center; font-size: 12px; color: #888; }
        a { color: #000; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p>Blip Money website</p>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">Name</span>
            <span class="value">${safe.name}</span>
          </div>
          <div class="row">
            <span class="label">Email</span>
            <span class="value"><a href="mailto:${safe.email}">${safe.email}</a></span>
          </div>
          ${
            safe.inquiryType
              ? `<div class="row"><span class="label">Inquiry Type</span><span class="value">${safe.inquiryType}</span></div>`
              : ""
          }
          ${
            safe.website
              ? `<div class="row"><span class="label">Website</span><span class="value">${safe.website}</span></div>`
              : ""
          }
          ${
            safe.message
              ? `<div class="row"><span class="label">Message</span><span class="value goals">${safe.message}</span></div>`
              : ""
          }
          <div class="row">
            <span class="label">Submitted At</span>
            <span class="value">${new Date().toUTCString()}</span>
          </div>
        </div>
        <div class="footer">
          Reply directly to this email to respond to ${safe.name}.
        </div>
      </div>
    </body>
  </html>`;

  const text = [
    `New Contact Form Submission`,
    `Name: ${name}`,
    `Email: ${email}`,
    inquiryType ? `Inquiry Type: ${inquiryType}` : null,
    website ? `Website: ${website}` : null,
    message ? `Message: ${message}` : null,
    `Submitted At: ${new Date().toUTCString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const info = await smtpTransporter.sendMail({
    from: `"${name}" <${email}>`,
    sender: SMTP_MAIL,
    envelope: { from: SMTP_MAIL, to: CONTACT_RECEIVER_EMAIL },
    replyTo: email,
    to: CONTACT_RECEIVER_EMAIL,
    subject,
    html,
    text,
  });

  console.log(`[email] contact-form sent messageId=${info.messageId} to=${CONTACT_RECEIVER_EMAIL}`);
  return info;
};


// HARDCODED to the Resend-verified domain. The env var EMAIL_FROM on Railway
// was set to "blipmoney.com" (unverified) and was causing Resend to reject
// every send. The verified domain in Resend is "blip.money" (with the dot,
// because .money is a real TLD). We ignore EMAIL_FROM intentionally — if you
// ever need to switch sender, change this line.
const FROM_EMAIL = "Blip Money <noreply@blip.money>";

// Boot-time visibility — log once so we can confirm prod env in Railway logs
console.log(
  `[email] init  key=${RESEND_API_KEY ? `present (${RESEND_API_KEY.slice(0, 6)}…, len=${RESEND_API_KEY.length})` : "MISSING"}  from=${FROM_EMAIL}`,
);
if (!RESEND_API_KEY) {
  console.error("[email] RESEND_API_KEY is not set — every send call will fail.");
}
if (process.env.EMAIL_FROM && process.env.EMAIL_FROM !== FROM_EMAIL) {
  console.warn(
    `[email] ignoring EMAIL_FROM=${process.env.EMAIL_FROM} — using hardcoded verified sender ${FROM_EMAIL}`,
  );
}

const resend = new Resend(RESEND_API_KEY);

/**
 * Send email verification link via Resend
 * @param {string} email - User's email address
 * @param {string} verificationUrl - Full verification URL with token
 */
export const sendVerificationEmail = async (email, verificationUrl) => {
  console.log(`[email] verification → to=${email} from=${FROM_EMAIL}`);
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Verify Your Email - Blip Money",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: #000000; color: #ffffff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .content h2 { color: #000000; font-size: 20px; margin-top: 0; }
            .content p { color: #666; font-size: 16px; margin: 16px 0; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 14px; color: #888; }
            .footer a { color: #000000; text-decoration: none; }
            .note { background: #f9f9f9; border-left: 4px solid #000000; padding: 16px; margin: 20px 0; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Blip Money</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering with Blip Money! Please click the button below to verify your email address and activate your account.</p>

              <div class="button-container">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </div>

              <div class="note">
                <strong>Note:</strong> This verification link will expire in 30 minutes for security reasons.
              </div>

              <p style="font-size: 14px; color: #888;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #000000; word-break: break-all;">${verificationUrl}</a>
              </p>

              <p style="font-size: 14px; color: #888;">
                If you didn't create an account with Blip Money, please ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Blip Money. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}">Home</a> &middot;
                <a href="${process.env.FRONTEND_URL}/contact">Support</a> &middot;
                <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
      text: `Verify Your Email - Blip Money\n\nPlease verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 30 minutes.\n\nIf you didn't create an account with Blip Money, please ignore this email.`,
    });
    console.log(
      `[email] verification result for ${email}:`,
      JSON.stringify(result, null, 2),
    );
    // Resend SDK returns { data, error } — when domain/key is wrong, error is non-null
    // but no exception is thrown. Surface that as an exception so callers retry.
    if (result?.error) {
      console.error(`[email] Resend returned an error object:`, result.error);
      throw new Error(
        result.error.message || result.error.name || "Resend rejected the send",
      );
    }
  } catch (error) {
    console.error(
      `[email] sendVerificationEmail FAILED to=${email}:`,
      error?.message || error,
    );
    if (error?.response) console.error("Resend API response:", error.response);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Send password reset link
 * @param {string} email - User's email address
 * @param {string} resetUrl - Full reset URL with token
 */
export const sendPasswordResetEmail = async (email, resetUrl) => {
  console.log("📧 Sending password reset email:", { to: email, from: FROM_EMAIL, resetUrl });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Password Reset Request - Blip Money",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: #000000; color: #ffffff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .content h2 { color: #000000; font-size: 20px; margin-top: 0; }
            .content p { color: #666; font-size: 16px; margin: 16px 0; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 14px; color: #888; }
            .footer a { color: #000000; text-decoration: none; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 20px 0; font-size: 14px; color: #856404; }
            .note { background: #f9f9f9; border-left: 4px solid #000000; padding: 16px; margin: 20px 0; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Blip Money</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>

              <div class="button-container">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>

              <div class="note">
                <strong>Note:</strong> This password reset link will expire in 15 minutes for security reasons.
              </div>

              <div class="warning">
                <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              </div>

              <p style="font-size: 14px; color: #888;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #000000; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Blip Money. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}">Home</a> &middot;
                <a href="${process.env.FRONTEND_URL}/contact">Support</a> &middot;
                <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
      text: `Password Reset Request - Blip Money\n\nReset Link: ${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request a password reset, please ignore this email.`,
    });
    console.log(
      `[email] password-reset result for ${email}:`,
      JSON.stringify(result, null, 2),
    );
    if (result?.error) {
      console.error(`[email] Resend returned an error object:`, result.error);
      throw new Error(
        result.error.message || result.error.name || "Resend rejected the send",
      );
    }
  } catch (error) {
    console.error(
      `[email] sendPasswordResetEmail FAILED to=${email}:`,
      error?.message || error,
    );
    throw new Error("Failed to send password reset email");
  }
};


/**
 * Send welcome email after successful verification
 * @param {string} email - User's email address
 * @param {string} name - User's name (optional)
 */
export const sendWelcomeEmail = async (email, name = "there") => {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Welcome to Blip Money!",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
            .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .content h2 { color: #000000; font-size: 20px; margin-top: 0; }
            .content p { color: #666; font-size: 16px; margin: 16px 0; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 14px; color: #888; }
            .footer a { color: #000000; text-decoration: none; }
            .features { background: #f9f9f9; border-radius: 4px; padding: 20px; margin: 20px 0; }
            .features ul { margin: 10px 0; padding-left: 20px; }
            .features li { margin: 8px 0; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Blip Money!</h1>
              <p>Your email has been verified successfully</p>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Congratulations! Your account is now active and you're ready to start your journey with Blip Money.</p>

              <div class="features">
                <h3 style="margin-top: 0; color: #000;">What's Next?</h3>
                <ul>
                  <li><strong>Connect Your Wallet:</strong> Link your Solana wallet to unlock full features</li>
                  <li><strong>Earn Points:</strong> Complete tasks and earn BLIP points</li>
                  <li><strong>Refer Friends:</strong> Share your referral code and get bonus points</li>
                  <li><strong>Stay Updated:</strong> Keep an eye on new features and rewards</li>
                </ul>
              </div>

              <div class="button-container">
                <a href="${process.env.FRONTEND_URL}/login" class="button">Go to Dashboard</a>
              </div>

              <p>If you have any questions, our support team is here to help!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Blip Money. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}">Home</a> &middot;
                <a href="${process.env.FRONTEND_URL}/contact">Support</a> &middot;
                <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
      text: `Welcome to Blip Money!\n\nHi ${name}!\n\nYour email has been verified and your account is now active.\n\nLogin here: ${process.env.FRONTEND_URL}/login`,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error for welcome email - it's not critical
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendContactNotificationEmail,
};
