import crypto from "crypto";
import User from "../models/user.model.js";

export const generateReferralCode = async ({ wallet_address, email }) => {
  let codeExists = true;
  let code;

  while (codeExists) {
    const base = `${wallet_address}${email || ""}${Date.now()}${Math.random()}`;
    // Generate 5 character alphanumeric code (e.g., X9K2M)
    const hash = crypto
      .createHash("sha256")
      .update(base)
      .digest("hex")
      .substring(0, 5)
      .toUpperCase();

    // Format: BLIP-X9K2M
    code = `BLIP-${hash}`;

    codeExists = await User.exists({ referralCode: code });
  }

  return code;
};
