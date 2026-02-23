import mongoose from "mongoose";

const tweetVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    walletAddress: {
      type: String,
      required: false,
      default: "",
      index: true,
    },
    tweetId: {
      type: String,
      required: true,
      index: true,
    },
    tweetUrl: {
      type: String,
      required: true,
    },
    tweetText: {
      type: String,
      required: true,
    },
    tweetAuthorId: {
      type: String,
      required: true,
    },
    tweetCreatedAt: {
      type: Date,
      required: true,
    },
    pointsAwarded: {
      type: Number,
      required: true,
      default: 250,
    },
    verificationStatus: {
      type: String,
      enum: ["verified", "failed", "duplicate"],
      default: "verified",
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    // Campaign tracking
    campaignId: {
      type: String,
      default: "general_twitter_share",
    },
    // Fraud prevention fields
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user campaign history
tweetVerificationSchema.index({ userId: 1, campaignId: 1, createdAt: -1 });

// Index for querying by wallet
tweetVerificationSchema.index({ walletAddress: 1, campaignId: 1 });

// Static method to check if user has already verified a tweet for this campaign
tweetVerificationSchema.statics.hasUserVerifiedCampaign = async function (
  userId,
  campaignId = "general_twitter_share"
) {
  const verification = await this.findOne({
    userId,
    campaignId,
    verificationStatus: "verified",
  });
  return !!verification;
};

// Static method to get retweet campaign status (count + last completion date)
tweetVerificationSchema.statics.getRetweetCampaignStatus = async function (
  userId,
  campaignId = "retweet_campaign"
) {
  const verifications = await this.find({
    userId,
    campaignId,
    verificationStatus: "verified",
  }).sort({ createdAt: -1 });

  return {
    count: verifications.length,
    lastCompletedAt: verifications.length > 0 ? verifications[0].createdAt : null,
  };
};

// Static method to check if tweet has already been successfully claimed
tweetVerificationSchema.statics.isTweetAlreadyClaimed = async function (
  tweetId
) {
  const verification = await this.findOne({
    tweetId,
    verificationStatus: "verified",
  });
  return !!verification;
};

const TweetVerification = mongoose.model(
  "TweetVerification",
  tweetVerificationSchema
);

export default TweetVerification;
