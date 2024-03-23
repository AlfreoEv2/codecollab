import express, { Router } from "express";
import ProjectModel from "../models/Project";

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

// POST a new project
router.post("/", async (req, res) => {
  const newProject = new ProjectModel({
    projectName: req.body.projectName,
    owner: req.body.owner,
    collaborators: req.body.collaborators,
    language: req.body.language,
  });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
