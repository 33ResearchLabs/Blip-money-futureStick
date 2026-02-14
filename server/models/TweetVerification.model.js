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
      required: true,
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

// Compound index to prevent same user from claiming multiple times for same campaign
tweetVerificationSchema.index({ userId: 1, campaignId: 1 });

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
