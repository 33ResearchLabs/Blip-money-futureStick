import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// HARDCODED to the Resend-verified domain — see services/email.service.js for context.
const FROM_EMAIL = "Blip Money <noreply@blip.money>";

export const sendVerificationEmailNew = async (email, otp) => {
  console.log(`[email-otp] verification → to=${email} from=${FROM_EMAIL}`);
  if (!process.env.RESEND_API_KEY) {
    console.error("[email-otp] RESEND_API_KEY is not set — send will fail.");
  }
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Verify Your Email - Blip Money",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification OTP is:</p>
          <h1 style="color: #000000; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <br/>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log(
      `[email-otp] verification result for ${email}:`,
      JSON.stringify(result, null, 2),
    );
    // Resend SDK v6 returns { data, error } instead of throwing on rejection.
    if (result?.error) {
      console.error(`[email-otp] Resend returned an error object:`, result.error);
      throw new Error(
        result.error.message || result.error.name || "Resend rejected the send",
      );
    }
  } catch (error) {
    console.error(
      `[email-otp] sendVerificationEmailNew FAILED to=${email}:`,
      error?.message || error,
    );
    throw error;
  }
};
