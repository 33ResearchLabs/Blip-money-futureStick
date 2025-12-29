
import BlipPointLog from "../models/BlipPointLog.model.js";
import Referral from "../models/referral.model.js";
import UserBlipPoint from "../models/userBlipPoints.model.js"


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

    const ACTION_MAP = {
      TWITTER_FOLLOW: "FOLLOW_TWITTER",
      TELEGRAM_JOIN: "JOIN_TELEGRAM",
      WHITEPAPER_READ: "WHITEPAPER_READ",
      CROSS_BORDER_SWAP: "CROSS_BORDER_SWAP",
    };

    const bonusPoints = BONUS_MAP[label];
    const referralAction = ACTION_MAP[label];

    if (!bonusPoints || !referralAction) {
      return res.status(400).json({ message: "Invalid bonus label" });
    }

    //  GLOBAL DUPLICATE CHECK 
    const alreadyClaimed = await BlipPointLog.findOne({
      userId,
      event: label,
    });

    if (alreadyClaimed) {
      return res.status(400).json({
        message: "Bonus already claimed for this action",
      });
    }
   
    // 🔎 Find referral (ONLY if user was referred)
    const referral = await Referral.findOne({
      referred_user_id: userId,
    });

    // 🔁 Prevent duplicate bonus for same action
    if (referral) {
      const action = referral.actions.find(
        (a) => a.action === referralAction
      );

      if (action && action.completed) {
        return res.status(400).json({
          message: "Bonus already claimed for this action",
        });
      }
    }

    // 🔎 Find or create blip points
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

    // 🧾 Log
    await BlipPointLog.create({
      userId,
      bonusPoints,
      totalPoints: userBlipPoint.points,
      event: label,
    });

    // ✅ UPDATE REFERRAL ACTION (MAIN REQUIREMENT)
    if (referral) {
      await Referral.updateOne(
        {
          referred_user_id: userId,
          "actions.action": referralAction,
        },
        {
          $set: {
            "actions.$.completed": true,
            "actions.$.completedAt": new Date(),
          },
        }
      );
    }

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


export const getBonusStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Default all actions as pending
    const statusMap = {
      TWITTER_FOLLOW: "pending",
      TELEGRAM_JOIN: "pending",
      WHITEPAPER_READ: "pending",
      CROSS_BORDER_SWAP: "pending",
    };

    // 2️⃣ Check claimed bonuses globally (BlipPointLog)
    const claimedLogs = await BlipPointLog.find({
      userId,
      event: { $in: Object.keys(statusMap) },
    }).select("event");

    claimedLogs.forEach((log) => {
      statusMap[log.event] = "completed";
    });

    // 3️⃣ Check referral actions (if referral exists)
    const referral = await Referral.findOne({
      referred_user_id: userId,
    }).select("actions");

    if (referral) {
      referral.actions.forEach((action) => {
        if (action.completed && statusMap[action.action] !== undefined) {
          statusMap[action.action] = "completed";
        }
      });
    }

    return res.status(200).json({
      success: true,
      actions: statusMap,
    });
  } catch (error) {
    console.error("Get bonus status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bonus status",
    });
  }
};