import TweetVerification from "../models/TweetVerification.model.js";
import User from "../models/user.model.js";
import twitterService from "../services/twitter.service.js";

/**
 * Verify Twitter/X tweet and award points
 * POST /api/twitter/verify
 */
export const verifyTweet = async (req, res) => {
  try {
    const { tweetId, tweetUrl, wallet_address } = req.body;
    const userId = req.user?._id; // Assumes auth middleware sets req.user

    // Validation
    if (!tweetId || !tweetUrl || !wallet_address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: tweetId, tweetUrl, wallet_address",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if wallet is linked to this user
    if (!user.walletLinked || user.wallet_address !== wallet_address) {
      return res.status(403).json({
        success: false,
        message:
          "Wallet not linked to your account. Please link your wallet first.",
      });
    }

    // Check if user has already verified a tweet for this campaign
    const hasVerified = await TweetVerification.hasUserVerifiedCampaign(
      userId,
      "general_twitter_share"
    );

    if (hasVerified) {
      return res.status(400).json({
        success: false,
        message: "You have already completed this campaign.",
      });
    }

    // Check if this specific tweet has already been claimed by anyone
    const isTweetClaimed = await TweetVerification.isTweetAlreadyClaimed(
      tweetId
    );

    if (isTweetClaimed) {
      return res.status(400).json({
        success: false,
        message: "This tweet has already been used to claim rewards.",
      });
    }

    // Verify tweet via free oEmbed API
    const verificationResult = await twitterService.verifyTweet(tweetId, tweetUrl, {
      requiredMentions: ["@BlipMoney"],
      requiredKeywords: ["BlipMoney", "Blip"],
    });

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
        code: verificationResult.code,
      });
    }

    const { tweetData } = verificationResult;

    // Points to award
    const pointsAwarded = 100;

    // Save successful verification
    const verification = await TweetVerification.create({
      userId,
      walletAddress: wallet_address,
      tweetId: tweetData.id,
      tweetUrl,
      tweetText: tweetData.text,
      tweetAuthorId: tweetData.authorId,
      tweetCreatedAt: new Date(tweetData.createdAt),
      pointsAwarded,
      verificationStatus: "verified",
      campaignId: "general_twitter_share",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Award points to user
    user.totalBlipPoints = (user.totalBlipPoints || 0) + pointsAwarded;

    // Add to points history
    if (!user.pointsHistory) {
      user.pointsHistory = [];
    }

    user.pointsHistory.push({
      action: "Twitter Campaign - Share",
      points: pointsAwarded,
      date: new Date(),
      details: `Tweet verified: ${tweetId}`,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Tweet verified successfully! Points awarded.",
      data: {
        pointsAwarded,
        totalPoints: user.totalBlipPoints,
        verificationId: verification._id,
        tweetText: tweetData.text,
      },
    });
  } catch (error) {
    console.error("Tweet verification error:", error);

    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This tweet has already been verified.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during verification. Please try again later.",
    });
  }
};

/**
 * Get user's tweet verification history
 * GET /api/twitter/verifications
 */
export const getUserVerifications = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const verifications = await TweetVerification.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        "tweetId tweetUrl tweetText pointsAwarded verificationStatus campaignId verifiedAt"
      );

    return res.status(200).json({
      success: true,
      data: verifications,
    });
  } catch (error) {
    console.error("Get verifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification history",
    });
  }
};

/**
 * Check if user has completed a specific campaign
 * GET /api/twitter/campaign-status/:campaignId
 */
export const getCampaignStatus = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { campaignId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const hasCompleted = await TweetVerification.hasUserVerifiedCampaign(
      userId,
      campaignId
    );

    return res.status(200).json({
      success: true,
      data: {
        campaignId,
        completed: hasCompleted,
      },
    });
  } catch (error) {
    console.error("Campaign status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check campaign status",
    });
  }
};
