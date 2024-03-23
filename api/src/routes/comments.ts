import express, { Router } from "express";
import CommentModel from "../models/Comment";

const router: Router = express.Router();

// GET all comments for a file
router.get("/file/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const comments = await CommentModel.find({ file: fileId });
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific comment
router.get("/:id", async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new comment
router.post("/", async (req, res) => {
  const newComment = new CommentModel({
    content: req.body.content,
    file: req.body.file,
    author: req.body.author,
    lineReference: req.body.lineReference,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
