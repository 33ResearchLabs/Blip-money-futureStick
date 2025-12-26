import crypto from "crypto";

export const generateReferralId = ({ email, walletAddress }) => {
  const baseString = `${email || ""}:${walletAddress}`;

  // create hash
  const hash = crypto
    .createHash("sha256")
    .update(baseString)
    .digest("hex");

  // take random-looking part
  const shortCode = hash.substring(0, 6).toUpperCase();

  return `BLIP-${shortCode}`;
};
