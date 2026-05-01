import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
});

// Get all projects for current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id })
      .populate("members", "name email")
      .populate("createdBy", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

// Get single project by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching project" });
  }
});

// Add member to project by email (only project creator)
router.post("/:id/members", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only the project creator can add members" });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (project.members.map(String).includes(user._id.toString())) {
      return res.status(400).json({ msg: "User is already a member" });
    }

    project.members.push(user._id);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate("members", "name email")
      .populate("createdBy", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error adding member" });
  }
});

// Remove member from project (only project creator)
router.delete("/:id/members/:userId", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only the project creator can remove members" });
    }

    if (project.createdBy.toString() === req.params.userId) {
      return res.status(400).json({ msg: "Cannot remove the project creator" });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();

    const updated = await Project.findById(project._id)
      .populate("members", "name email")
      .populate("createdBy", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error removing member" });
  }
});

export default router;
