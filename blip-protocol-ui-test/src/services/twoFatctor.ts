import { api } from "./api";

export const twoFactorApi = {
  enableGoogleAuth: async () => {
    const response = await api.post("/twofa/enable");
    return response;
  },

    // Verify Otp  
   verifyGoogleAuth: async (otp) => {
    try {
      const res = await api.post("/twofa/verify-enable", { otp });
      return res.data;
    } catch (error) {
      throw error?.response?.data || { message: "OTP verification failed" };
    }
  },

   verifyOtpLogin: async ({ email, otp }) => {
  try {
    const res = await api.post("/twofa/verify-login", { email, otp });
    return res; // ✅ already unwrapped
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "OTP verification failed"
    );
  }
},


disableGoogleAuth: async (otp: string) => {
    const { data } = await api.post("/twofa/disable", { otp });
    return data;
  },




};
