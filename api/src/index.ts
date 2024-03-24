import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import projectsRouter from "./routes/projects";
import filesRouter from "./routes/files";
import foldersRouter from "./routes/folders";
import commentsRouter from "./routes/comments";
import changelogsRouter from "./routes/changelogs";
import editSessionsRouter from "./routes/editSessions";
import usersRouter from "./routes/users";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/projects", projectsRouter);
app.use("/files", filesRouter);
app.use("/folders", foldersRouter);
app.use("/comments", commentsRouter);
app.use("/changelogs", changelogsRouter);
app.use("/editSessions", editSessionsRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to CodeCollab!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL!)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after connecting to MongoDB
    app.listen(port, () => {
      console.log(`App is listening on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
