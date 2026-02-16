import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmailNew = async (email, otp) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Blip Money <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Email - Blip Money",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification OTP is:</p>
          <h1 style="color: #4f46e5;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <br/>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
