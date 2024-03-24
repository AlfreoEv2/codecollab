import express, { Router } from "express";
import ProjectModel from "../models/Project";
import FolderModel from "../models/Folder";

const router: Router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific project by Owner
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const projects = await ProjectModel.find({ owner: ownerId });

    if (projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for the given owner" });
    }

    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Recursive function to populate nested folders and files
async function populateFolderRecursive(folder: any) {
  await FolderModel.populate(folder, {
    path: "children",
    model: "Folder",
  });

  await FolderModel.populate(folder, {
    path: "files",
    model: "File",
  });

  for (const childFolder of folder.children) {
    await populateFolderRecursive(childFolder);
  }
}

// GET a specific project
router.get("/:id", async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id).populate({
      path: "rootFolder",
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await populateFolderRecursive(project.rootFolder);

    res.json(project);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new project
router.post("/", async (req, res) => {
  const newProject = new ProjectModel({
    projectName: req.body.projectName,
    owner: req.body.owner,
    collaborators: req.body.collaborators,
    language: req.body.language,
  });

  try {
    // Save the project
    await newProject.save();

    // Create the root folder for the project
    const rootFolder = new FolderModel({
      folderName: "ROOT-" + newProject.projectName,
      project: newProject._id,
    });

    // Save the root folder
    await rootFolder.save();

    // Update the project with the root folder reference
    newProject.rootFolder = rootFolder._id;
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
