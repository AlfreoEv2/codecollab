import express, { Router } from "express";
import ChangeLogModel from "../models/ChangeLog";

const router: Router = express.Router();

// GET all changelogs for a file
router.get("/file/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const changelogs = await ChangeLogModel.find({ file: fileId });
    res.json(changelogs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific changelog
router.get("/:id", async (req, res) => {
  try {
    const changelog = await ChangeLogModel.findById(req.params.id);
    if (!changelog) {
      return res.status(404).json({ message: "Changelog not found" });
    }
    res.json(changelog);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new changelog
router.post("/", async (req, res) => {
  const newChangeLog = new ChangeLogModel({
    file: req.body.file,
    changes: req.body.changes,
    author: req.body.author,
  });

  try {
    const savedChangeLog = await newChangeLog.save();
    res.status(201).json(savedChangeLog);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
