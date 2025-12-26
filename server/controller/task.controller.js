import Task from "../models/task.model.js";

/**
 * CREATE TASK (auto-create or manual)
 * - Same user + same task_type duplicate nahi banega (schema index handle karega)
 */
export const createTask = async (req, res) => {
  try {
    const { user_id, task_type, proof_data } = req.body;

    if (!user_id || !task_type) {
      return res.status(400).json({
        message: "user_id and task_type are required",
      });
    }

    const task = await Task.create({
      user_id,
      task_type,
      proof_data,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    // Duplicate task error (unique index)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Task already exists for this user",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET ALL TASKS BY USER
 */
export const getTasksByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const tasks = await Task.find({ user_id }).sort({ createdAt: -1 });

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * UPDATE TASK STATUS (pending → completed)
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, proof_data } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = status;

    // proof optional
    if (proof_data) {
      task.proof_data = proof_data;
    }

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET SINGLE TASK BY USER + TYPE
 */
export const getTaskByType = async (req, res) => {
  try {
    const { user_id, task_type } = req.params;

    const task = await Task.findOne({ user_id, task_type });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
