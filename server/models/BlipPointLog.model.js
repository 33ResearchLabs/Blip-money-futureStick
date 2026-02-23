import mongoose from "mongoose";

const blipPointLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        bonusPoints: {
            type: Number,
        },

        totalPoints: {
            type: Number,

        },
        event: {
            type: String,
            enum: [
                "REGISTER",
                "MERCHANT_REGISTER",
                "TWITTER_FOLLOW",
                "TELEGRAM_JOIN",
                "RETWEET",
                "WHITEPAPER_READ",
                "CROSS_BORDER_SWAP",
                "REFERRAL_BONUS_EARNED",
                "REFERRAL_BONUS_RECEIVED"
            ],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("BlipPointLog", blipPointLogSchema);
