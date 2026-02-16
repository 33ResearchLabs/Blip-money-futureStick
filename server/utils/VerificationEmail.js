import nodemailer from "nodemailer";

export const sendVerificationEmailNew = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    const mailOptions = {
      from: `"Blip Money" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Blip Money",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification OTP is:</p>
          <h1 style="color: #4f46e5;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <br/>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
