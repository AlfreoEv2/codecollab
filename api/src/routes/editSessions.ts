import express, { Router } from "express";
import EditSessionModel from "../models/EditSession";

const router: Router = express.Router();

// GET all edit sessions for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const editSessions = await EditSessionModel.find({ project: projectId });
    res.json(editSessions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific edit session
router.get("/:id", async (req, res) => {
  try {
    const editSession = await EditSessionModel.findById(req.params.id);
    if (!editSession) {
      return res.status(404).json({ message: "Edit session not found" });
    }
    res.json(editSession);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new edit session
router.post("/", async (req, res) => {
  const newEditSession = new EditSessionModel({
    project: req.body.project,
    participants: req.body.participants,
  });

  try {
    const savedEditSession = await newEditSession.save();
    res.status(201).json(savedEditSession);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
