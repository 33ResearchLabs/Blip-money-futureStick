import Task from "../models/task.model.js";
import User from "../models/user.model.js";

/**
 * ============================
 * GET ALL SUBMITTED TASKS (ADMIN)
 * ============================
 */
export const getAllSubmittedTasks = async (req, res) => {
  try {
    const { status = "SUBMITTED", task_type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (task_type) filter.task_type = task_type;

    const tasks = await Task.find(filter)
      .populate("user_id", "wallet_address email totalBlipPoints")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET ALL USERS (ADMIN)
 * ============================
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET DASHBOARD STATS (ADMIN)
 * ============================
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      pendingTasks,
      submittedTasks,
      verifiedTasks,
    ] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments({ status: "PENDING" }),
      Task.countDocuments({ status: "SUBMITTED" }),
      Task.countDocuments({ status: "VERIFIED" }),
    ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        pendingTasks,
        submittedTasks,
        verifiedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
