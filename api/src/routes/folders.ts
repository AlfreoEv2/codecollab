import express, { Router } from "express";
import FolderModel from "../models/Folder";
import FileModel from "../models/File";

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

// PATCH route to rename a folder
router.patch("/:id", async (req, res) => {
  try {
    const folderId = req.params.id;
    const { newFolderName } = req.body;

    const updatedFolder = await FolderModel.findByIdAndUpdate(
      folderId,
      {
        folderName: newFolderName,
        lastModifiedDate: new Date(),
      },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(updatedFolder);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a folder
router.delete("/:id", async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await FolderModel.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Delete all files inside the folder
    await FileModel.deleteMany({ parentFolder: folderId });

    // Delete all subfolders recursively
    await deleteFoldersRecursively(folderId);

    // Remove the folder from its parent's children array
    if (folder.parentFolder) {
      await FolderModel.findByIdAndUpdate(
        folder.parentFolder,
        { $pull: { children: folderId } },
        { new: true }
      );
    }

    // Delete the folder itself
    await FolderModel.findByIdAndDelete(folderId);

    res.json({ message: "Folder deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Recursive function to delete subfolders
async function deleteFoldersRecursively(folderId: string) {
  const subfolders = await FolderModel.find({ parentFolder: folderId });

  for (const subfolder of subfolders) {
    await deleteFoldersRecursively(subfolder._id);
    await FolderModel.findByIdAndDelete(subfolder._id);
  }
}

export default router;
