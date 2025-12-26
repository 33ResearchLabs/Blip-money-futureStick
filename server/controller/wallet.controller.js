import Wallet from "../models/wallet.js";
import User from "../models/user.js";

/**
 * CREATE / CONNECT WALLET
 * - User exist hona chahiye
 * - Wallet duplicate nahi hona chahiye
 */
export const connectWallet = async (req, res) => {
  try {
    const { wallet_address } = req.body;
     const userId = req.user._id; 

    if (!wallet_address || !userId) {
      return res.status(400).json({
        message: "wallet_address and user_id are required",
      });
    }

    // 🔍 Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔍 Check wallet already exists
    const existingWallet = await Wallet.findOne({ wallet_address });
    if (existingWallet) {
      return res.status(409).json({
        message: "Wallet already connected to a user",
      });
    }

    // ✅ Create wallet
    const wallet = await Wallet.create({
      wallet_address,
      userId,
    });

    // ✅ Update user status (optional but logical)
    if (user.status !== "connected") {
      user.status = "connected";
      await user.save();
    }

    return res.status(201).json({
      message: "Wallet connected successfully",
      wallet,
    });
  } catch (error) {
    console.error("Connect wallet error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET WALLET BY USER
 */
export const getWalletByUser = async (req, res) => {
  try {
    const { user_id } = req.user._id;

    const wallet = await Wallet.findOne({ user_id }).populate(
      "user_id",
      "email phone status"
    );

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found for this user",
      });
    }

    return res.status(200).json({
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET WALLET BY ADDRESS
 */
export const getWalletByAddress = async (req, res) => {
  try {
    const { wallet_address } = req.params;

    const wallet = await Wallet.findOne({ wallet_address }).populate(
      "user_id",
      "email phone status"
    );

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
