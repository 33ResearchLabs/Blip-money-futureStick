import UserBlipPoint from "../models/UserBlipPoint.js";
import BlipPointLog from "../models/BlipPointLog.js";

export const applyBonus = async (req, res) => {
  try {
    const { label } = req.body;
    const userId = req.user._id;

    if (!label) {
      return res.status(400).json({ message: "label is required" });
    }

    const BONUS_MAP = {
      TWITTER_FOLLOW: 100,
      TELEGRAM_JOIN: 100,
      WHITEPAPER_READ: 200,
      CROSS_BORDER_SWAP: 750,
    };

    const bonusPoints = BONUS_MAP[label];

    if (!bonusPoints) {
      return res.status(400).json({ message: "Invalid bonus label" });
    }

    // 🔎 Find or create user blip points
    let userBlipPoint = await UserBlipPoint.findOne({ userId });

    if (!userBlipPoint) {
      userBlipPoint = await UserBlipPoint.create({
        userId,
        points: 0,
      });
    }

    // ➕ Add bonus
    userBlipPoint.points += bonusPoints;
    await userBlipPoint.save();

    // 🧾 LOG ENTRY (FIXED)
    await BlipPointLog.create({
      userId,
      bonusPoints: bonusPoints,         
      totalPoints: userBlipPoint.points, 
      event: label,
    });

    return res.status(200).json({
      message: "Bonus applied successfully",
      event: label,
      addedPoints: bonusPoints,
      totalPoints: userBlipPoint.points,
    });
  } catch (error) {
    console.error("Bonus apply error:", error);
    return res.status(500).json({
      message: "Failed to apply bonus",
    });
  }
};
