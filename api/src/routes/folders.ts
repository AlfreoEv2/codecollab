import express, { Router } from "express";
import FolderModel from "../models/Folder";

const router: Router = express.Router();

// GET all folders for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const folders = await FolderModel.find({ project: projectId });
    res.json(folders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific folder
router.get("/:id", async (req, res) => {
  try {
    const folder = await FolderModel.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.json(folder);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new folder
router.post("/", async (req, res) => {
  const { folderName, project, parentFolder } = req.body;

  try {
    // Create a new folder
    const newFolder = new FolderModel({
      folderName,
      project,
      parentFolder,
    });

    // Save the new folder
    const savedFolder = await newFolder.save();

    // Update the parent folder's children array
    if (parentFolder) {
      await FolderModel.findByIdAndUpdate(
        parentFolder,
        { $push: { children: savedFolder._id } },
        { new: true }
      );
    }

    res.status(201).json(savedFolder);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
