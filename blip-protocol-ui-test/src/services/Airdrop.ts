import { api } from "./api";

interface AirdropLoginData {
  email?: string;
  phone?: string;
  wallet_address: string;
  referral_code?: string;
}

interface TaskData {
  task_type: "TWITTER" | "TELEGRAM" | "QUIZ" | "WHITEPAPER" | "CUSTOM";
  proof_data?: {
    post_url?: string;
    screenshot_url?: string;
    text_proof?: string;
  };
}

export const airdropApi = {
  // =====================
  // USER ENDPOINTS
  // =====================

  // Register or Login user
  login: async (data: AirdropLoginData) => {
    const response = await api.post("/user/login", data);
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/user/logout");
    return response;
  },

  // Get current user profile (includes totalBlipPoints)
  getMe: async () => {
    const response = await api.get("/user/me");
    return response;
  },

  // Get my referrals (users I referred)
  getMyReferrals: async () => {
    const response = await api.get("/user/referrals");
    return response;
  },

  // Get my points history
  getMyPointsHistory: async () => {
    const response = await api.get("/user/points-history");
    return response;
  },

  // =====================
  // TASK ENDPOINTS
  // =====================

  // Create a new task
  createTask: async (data: TaskData) => {
    const response = await api.post("/tasks", data);
    return response;
  },

  // Get all user's tasks
  getMyTasks: async () => {
    const response = await api.get("/tasks");
    return response;
  },

  // Get specific task by type
  getTaskByType: async (taskType: string) => {
    const response = await api.get(`/tasks/type/${taskType}`);
    return response;
  },

  // Submit task for verification
  submitTask: async (taskId: string, proofData?: TaskData["proof_data"]) => {
    const response = await api.post(`/tasks/${taskId}/submit`, { proof_data: proofData });
    return response;
  },

  // Submit quiz answers for whitepaper task
  submitQuiz: async (taskId: string, quizData: { score: number; answers: number[] }) => {
    const response = await api.post(`/tasks/${taskId}/quiz`, quizData);
    return response;
  },

  // Verify Telegram channel membership
  verifyTelegram: async (taskId: string, telegramUserId: string) => {
    const response = await api.post(`/tasks/${taskId}/verify-telegram`, {
      telegram_user_id: telegramUserId,
    });
    return response;
  },

  // =====================
  // ADMIN ENDPOINTS
  // =====================

  // Get admin dashboard stats
  getAdminStats: async () => {
    const response = await api.get("/admin/stats");
    return response;
  },

  // Get all users (admin only)
  getAdminUsers: async () => {
    const response = await api.get("/admin/users");
    return response;
  },

  // Get all tasks with filters (admin only)
  getAdminTasks: async (status?: string, taskType?: string) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (taskType) params.append("task_type", taskType);
    const response = await api.get(`/admin/tasks?${params.toString()}`);
    return response;
  },

  // Verify a task (admin only)
  verifyTask: async (taskId: string) => {
    const response = await api.post(`/admin/tasks/${taskId}/verify`);
    return response;
  },

  // Reject a task (admin only)
  rejectTask: async (taskId: string) => {
    const response = await api.post(`/admin/tasks/${taskId}/reject`);
    return response;
  },

  // =====================
  // SUPERADMIN ENDPOINTS
  // =====================

  getSuperadminStats: async () => {
    const response = await api.get("/admin/superadmin-stats");
    return response;
  },

  getUsersDetailed: async (page = 1, limit = 20, role?: string, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (role) params.append("role", role);
    if (search) params.append("search", search);
    const response = await api.get(`/admin/users-detailed?${params.toString()}`);
    return response;
  },

  getReferralStats: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/referral-stats?page=${page}&limit=${limit}`);
    return response;
  },

  getVolumeCommitments: async () => {
    const response = await api.get("/admin/volume-commitments");
    return response;
  },

  getRegistrationChart: async () => {
    const response = await api.get("/admin/registration-chart");
    return response;
  },

  getPointsChart: async () => {
    const response = await api.get("/admin/points-chart");
    return response;
  },

  getVolumeChart: async () => {
    const response = await api.get("/admin/volume-chart");
    return response;
  },

  // Bot merchants (from Telegram bot)
  getBotMerchants: async (page = 1, limit = 20, status?: string, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    const response = await api.get(`/admin/bot-merchants?${params.toString()}`);
    return response;
  },

  // Bot users (from Telegram airdrop bot)
  getBotUsers: async (page = 1, limit = 20, country?: string, onboarded?: string, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (country) params.append("country", country);
    if (onboarded) params.append("onboarded", onboarded);
    if (search) params.append("search", search);
    const response = await api.get(`/admin/bot-users?${params.toString()}`);
    return response;
  },

  // =====================
  // LEADERBOARD ENDPOINTS
  // =====================

  // Get merchant leaderboard
  getMerchantLeaderboard: async (sort?: "points" | "referrals") => {
    const params = sort ? `?sort=${sort}` : "";
    const response = await api.get(`/leaderboard/merchants${params}`);
    return response;
  },

  // Get merchant activity feed
  getMerchantActivity: async (scope?: "all" | "mine") => {
    const params = scope ? `?scope=${scope}` : "";
    const response = await api.get(`/leaderboard/merchant-activity${params}`);
    return response;
  },
};
