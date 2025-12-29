import { api } from "./api";

interface AirdropLoginData {
  email: string;
  referral_code: string;
  wallet_address: string;
}

export const airdropApi = {
  postAirdrop: async (data: AirdropLoginData) => {
    // api.post already returns response.data due to interceptor (see api.ts line 27)
    const response = await api.post("/user/login", data);
    return response;
  },

  logout: async () => {
    // api.post already returns response.data due to interceptor
    const response = await api.post("/user/logout");
    return response;
  },

  getMyPoints: async () => {
    // withCredentials NOT needed if api.ts already sets it
    const response = await api.get("/blip-points/my-points");
    return response;
  },

  // Wallet Connect
  connectWallet: async (wallet_address: string) => {
    const res = await api.post("/wallet/connect", {
      wallet_address,
    });
    return res;
  },

  // Apply Bonus
  applyBonus: async (label: string) => {
  const res = await api.post("/bonus/apply", {
    label,
  });
  return res;
},


  // fetch status for bonus points 
 fetchStatus : async () => {
    const res = await api.get("/bonus/bonus-status");
    return res;
  },

  // Fetch status of wallet connected or not
  getWalletStatus: async () => {
    const res = await api.get("/wallet/status");
    return res;
  },

};
