import { api } from "./api";

export const twoFactorApi = {
  enableGoogleAuth: async (): Promise<{ success: boolean; qrCode: string; manualEntryKey: string }> => {
    const response = await api.post("/twofa/enable");
    return response as any;
  },

  verifyGoogleAuth: async (otp: string): Promise<{ success: boolean; message: string; recoveryCodes: string[] }> => {
    try {
      const res = await api.post("/twofa/verify-enable", { otp });
      return res as any;
    } catch (error: any) {
      throw error?.response?.data || { message: "OTP verification failed" };
    }
  },

  verifyOtpLogin: async ({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<{ user: any }> => {
    try {
      const res = await api.post("/twofa/verify-login", { email, otp });
      return res as any;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "OTP verification failed"
      );
    }
  },

  verifyRecoveryCode: async ({
    email,
    recoveryCode,
  }: {
    email: string;
    recoveryCode: string;
  }): Promise<{ user: any; remainingRecoveryCodes?: number; warning?: string }> => {
    try {
      const res = await api.post("/twofa/verify-recovery", {
        email,
        recoveryCode,
      });
      return res as any;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Recovery code verification failed"
      );
    }
  },

  regenerateRecoveryCodes: async (otp: string): Promise<{ success: boolean; recoveryCodes: string[] }> => {
    try {
      const res = await api.post("/twofa/regenerate-recovery", { otp });
      return res as any;
    } catch (error: any) {
      throw error?.response?.data || { message: "Failed to regenerate codes" };
    }
  },

  disableGoogleAuth: async (otp: string) => {
    const { data } = await api.post("/twofa/disable", { otp });
    return data;
  },
};
