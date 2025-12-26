import express from "express";
import {
  connectWallet,
  getWalletByUser,
  getWalletByAddress,
} from "../controller/wallet.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

/**
 * POST /api/wallet/connect
 */
router.post("/connect", protect,connectWallet);

/**
 * GET /api/wallet/user/:user_id
 */
router.get("/me", protect,getWalletByUser);

/**
 * GET /api/wallet/address/:wallet_address
 */
router.get("/address/:wallet_address", getWalletByAddress);

export default router;
