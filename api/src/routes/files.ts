import express, { Router } from "express";
import FileModel from "../models/File";
import FolderModel from "../models/Folder";

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
  const { filename, content, parentFolder } = req.body;

  try {
    // Create a new file
    const newFile = new FileModel({
      filename,
      content,
      parentFolder,
    });

    // Save the new file
    const savedFile = await newFile.save();

    // Update the parent folder's files array
    await FolderModel.findByIdAndUpdate(
      parentFolder,
      { $push: { files: savedFile._id } },
      { new: true }
    );

    res.status(201).json(savedFile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a file
router.delete("/:id", async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Remove the file from the parent folder's files array
    await FolderModel.findByIdAndUpdate(
      file.parentFolder,
      { $pull: { files: file._id } },
      { new: true }
    );

    // Delete the file
    await FileModel.deleteOne({ _id: file._id });

    res.json({ message: "File deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH route to rename a file
router.patch("/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const { newFilename } = req.body;

    const updatedFile = await FileModel.findByIdAndUpdate(
      fileId,
      {
        filename: newFilename,
        lastModifiedDate: new Date(),
      },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(updatedFile);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
