import { error } from "console";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
  console.log(request);
  return response.status(200).send("Welcome to CodeCollab!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL!)
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