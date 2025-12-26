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
                "TWITTER_FOLLOW",
                "TELEGRAM_JOIN",
                "WHITEPAPER_READ",
                "CROSS_BORDER_SWAP",
            ],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("BlipPointLog", blipPointLogSchema);
