import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import projectsRouter from "./routes/projects";
import filesRouter from "./routes/files";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/projects", projectsRouter);
app.use("/files", filesRouter);

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
