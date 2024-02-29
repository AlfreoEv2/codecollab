import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
  console.log(request);
  return response.status(200).send("Welcome to CodeCollab!");
});

app.listen(port, () => {
  console.log(`App is listening to port: ${port}`);
});
