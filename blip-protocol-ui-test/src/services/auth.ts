import { api } from "./api";

export interface RegisterData {
  email: string;
  password: string;
  referral_code?: string;
  captchaToken?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LinkWalletData {
  wallet_address: string;
}

export const authApi = {
  /**
   * Register a new user with email and password
   */
  register: (data: RegisterData) => api.post("/auth/register", data),

  /**
   * Login with email and password
   */
  login: (data: LoginData) => api.post("/auth/login", data),

  /**
   * Verify email with token from URL (old method)
   */
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),

  /**
   * Verify email with OTP (new method)
   */
  verifyOTP: (email: string, otp: string) =>
    api.post("/auth/verify-otp", { email, otp }),

  /**
   * Confirm email verified via Firebase
   */
  confirmEmailVerified: (email: string) =>
    api.post("/auth/confirm-email-verified", { email }),

  /**
   * Resend verification email
   */
  resendVerification: (email: string) =>
    api.post("/auth/resend-verification", { email }),

  /**
   * Request password reset
   */
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, password: string) =>
    api.post(`/auth/reset-password/${token}`, { password }),

  /**
   * Link wallet to authenticated user
   */
  linkWallet: (data: LinkWalletData) => api.post("/auth/link-wallet", data),

  /**
   * Unlink wallet from authenticated user
   */
  unlinkWallet: () => api.post("/auth/unlink-wallet"),

  /**
   * Logout user
   */
  logout: () => api.post("/auth/logout"),
};

export default authApi;
