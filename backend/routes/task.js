import express from "express";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create task — supports assignedTo and dueDate
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, project, assignedTo, dueDate } = req.body;
    const task = await Task.create({
      title,
      project,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
    });
    const populated = await task.populate("assignedTo", "name email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task" });
  }
});

// Get tasks for a project
router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// Update task status (and optionally assignedTo / dueDate)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.assignedTo !== undefined) updates.assignedTo = req.body.assignedTo;
    if (req.body.dueDate !== undefined) updates.dueDate = req.body.dueDate;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("assignedTo", "name email");
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task" });
  }
});

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting task" });
  }
});

// Dashboard stats — tasks across all projects the user is a member of
// GET /api/tasks/dashboard/stats
router.get("/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    const Project = (await import("../models/Project.js")).default;
    const projects = await Project.find({ members: req.user.id });
    const projectIds = projects.map((p) => p._id);

    const now = new Date();

    const [total, todo, inprogress, done, overdue] = await Promise.all([
      Task.countDocuments({ project: { $in: projectIds } }),
      Task.countDocuments({ project: { $in: projectIds }, status: "todo" }),
      Task.countDocuments({ project: { $in: projectIds }, status: "inprogress" }),
      Task.countDocuments({ project: { $in: projectIds }, status: "done" }),
      Task.countDocuments({
        project: { $in: projectIds },
        status: { $ne: "done" },
        dueDate: { $lt: now, $ne: null },
      }),
    ]);

    // Fetch overdue task details (limit 5)
    const overdueTasks = await Task.find({
      project: { $in: projectIds },
      status: { $ne: "done" },
      dueDate: { $lt: now, $ne: null },
    })
      .populate("project", "name")
      .populate("assignedTo", "name")
      .sort({ dueDate: 1 })
      .limit(5);

    res.json({ total, todo, inprogress, done, overdue, overdueTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching stats" });
  }
});

export default router;
