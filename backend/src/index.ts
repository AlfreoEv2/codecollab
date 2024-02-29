import express from "express";

export const PORT = 5555;

const app = express();

app.get("/", (request, response) => {
  console.log(request);
  return response.status(200).send("Welcome to CodeCollab!");
});

app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
