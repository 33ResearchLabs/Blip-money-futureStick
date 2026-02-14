import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send email verification link
 * @param {string} email - User's email address
 * @param {string} token - Verification token
 */
export const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Blip Money" <noreply@blipmoney.com>',
    to: email,
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
            .button { display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; transition: background 0.3s; }
            .button:hover { background: #333333; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 14px; color: #888; }
            .footer a { color: #000000; text-decoration: none; }
            .divider { height: 1px; background: #e5e5e5; margin: 30px 0; }
            .note { background: #f9f9f9; border-left: 4px solid #000000; padding: 16px; margin: 20px 0; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Blip Money</h1>
            </div>
            <div class="content">
              <h2>Welcome to Blip Money!</h2>
              <p>Thank you for registering. Please use the verification code below to complete your account setup and start using Blip Money.</p>

              <div style="text-align: center; margin: 40px 0;">
                <div style="display: inline-block; background: #f9f9f9; border: 2px solid #000000; border-radius: 8px; padding: 20px 40px;">
                  <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Verification Code</p>
                  <p style="margin: 10px 0 0 0; font-size: 36px; font-weight: 700; color: #000000; letter-spacing: 8px; font-family: 'Courier New', monospace;">${token}</p>
                </div>
              </div>

              <div class="note">
                <strong>Note:</strong> This verification code will expire in 10 minutes for security reasons.
              </div>

              <p style="font-size: 14px; color: #888;">
                If you didn't create an account with Blip Money, please ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Blip Money. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}">Home</a> ·
                <a href="${process.env.FRONTEND_URL}/contact">Support</a> ·
                <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Blip Money!

Thank you for registering. Please use the verification code below to complete your account setup.

Your Verification Code: ${token}

This code will expire in 10 minutes.

If you didn't create an account with Blip Money, please ignore this email.

© ${new Date().getFullYear()} Blip Money
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Send password reset link
 * @param {string} email - User's email address
 * @param {string} token - Reset token
 */
export const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Blip Money" <noreply@blipmoney.com>',
    to: email,
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
            .button { display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; transition: background 0.3s; }
            .button:hover { background: #333333; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 14px; color: #888; }
            .footer a { color: #000000; text-decoration: none; }
            .divider { height: 1px; background: #e5e5e5; margin: 30px 0; }
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
                <strong>Note:</strong> This password reset link will expire in 1 hour for security reasons.
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              </div>

              <div class="divider"></div>

              <p style="font-size: 14px; color: #888;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #000000; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Blip Money. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}">Home</a> ·
                <a href="${process.env.FRONTEND_URL}/contact">Support</a> ·
                <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Password Reset Request - Blip Money

We received a request to reset your password.

Reset Link: ${resetUrl}

This link will expire in 1 hour.

⚠️ If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

© ${new Date().getFullYear()} Blip Money
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} email - User's email address
 * @param {string} name - User's name (optional)
 */
export const sendWelcomeEmail = async (email, name = "there") => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Blip Money" <noreply@blipmoney.com>',
    to: email,
    subject: "Welcome to Blip Money! 🎉",
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
            .button { display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; transition: background 0.3s; }
            .button:hover { background: #333333; }
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
              <h1>🎉 Welcome to Blip Money!</h1>
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
              <p>© ${new Date().getFullYear()} Blip Money. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}">Home</a> ·
                <a href="${process.env.FRONTEND_URL}/contact">Support</a> ·
                <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Blip Money!

Hi ${name}!

Congratulations! Your email has been verified successfully and your account is now active.

What's Next?
- Connect Your Wallet: Link your Solana wallet to unlock full features
- Earn Points: Complete tasks and earn BLIP points
- Refer Friends: Share your referral code and get bonus points
- Stay Updated: Keep an eye on new features and rewards

Login here: ${process.env.FRONTEND_URL}/login

If you have any questions, our support team is here to help!

© ${new Date().getFullYear()} Blip Money
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    // Don't throw error for welcome email - it's not critical
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
