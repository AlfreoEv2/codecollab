import express, { Router } from "express";
import FileModel from "../models/File";

const router: Router = express.Router();

// GET all files
router.get("/", async (req, res) => {
  try {
    const files = await FileModel.find();
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific file
router.get("/:id", async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(file);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new file
router.post("/", async (req, res) => {
  const newFile = new FileModel({
    filename: req.body.filename,
    content: req.body.content,
    project: req.body.project,
  });

  try {
    const savedFile = await newFile.save();
    res.status(201).json(savedFile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
