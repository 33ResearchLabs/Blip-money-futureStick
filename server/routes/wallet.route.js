import express from "express";
import {
  connectWallet,
  getWalletByUser,
  getWalletByAddress,
} from "../controller/wallet.controller";

const router = express.Router();

/**
 * POST /api/wallet/connect
 */
router.post("/connect", connectWallet);

/**
 * GET /api/wallet/user/:user_id
 */
router.get("/user/:user_id", getWalletByUser);

/**
 * GET /api/wallet/address/:wallet_address
 */
router.get("/address/:wallet_address", getWalletByAddress);

export default router;
