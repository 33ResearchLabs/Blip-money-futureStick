import { api } from "./api";

export const twoFactorApi = {
  enableGoogleAuth: async () => {
    const response = await api.post("/twofa/enable");
    return response;
  },

    // Verify Otp  
   verifyGoogleAuth: async (otp: string) => {
    try {
      const res = await api.post("/twofa/verify-enable", { otp });
      return res.data;
    } catch (error) {
      throw error?.response?.data || { message: "OTP verification failed" };
    }
  },

   verifyOtpLogin: async ({ email, otp }: { email: string; otp: string }): Promise<{ user: any }> => {
  try {
    const res = await api.post("/twofa/verify-login", { email, otp });
    return res as any; // already unwrapped by interceptor
  } catch (error: any) {
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
