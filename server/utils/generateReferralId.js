import crypto from "crypto";
import User from "../models/user.js";

export const generateReferralCode = async ({ wallet_address, email }) => {
  let codeExists = true;
  let code;

  while (codeExists) {
    const base = `${wallet_address}${email || ""}${Date.now()}${Math.random()}`;
    code = crypto
      .createHash("sha256")
      .update(base)
      .digest("hex")
      .substring(0, 8)
      .toUpperCase();

    codeExists = await User.exists({ referralCode: code });
  }

  return code;
};
