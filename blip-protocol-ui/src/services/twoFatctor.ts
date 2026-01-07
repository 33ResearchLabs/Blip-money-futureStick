import { api } from "./api";

export const twoFactorApi = {
  enableGoogleAuth: async () => {
    const response = await api.post("/2fa/enable");
    return response;
  },

    // Verify Otp  
   verifyGoogleAuth: async (otp) => {
    try {
      const res = await api.post("/2fa/verify-enable", { otp });
      return res.data;
    } catch (error) {
      throw error?.response?.data || { message: "OTP verification failed" };
    }
  },

   verifyOtpLogin: async ({ email, otp }) => {
  try {
    const res = await api.post("/2fa/verify-login", { email, otp });
    return res; // ✅ already unwrapped
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "OTP verification failed"
    );
  }
}




};
