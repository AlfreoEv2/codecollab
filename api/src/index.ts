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
import WebSocket from "ws";

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

// WebSocket server
const wss: WebSocket.Server = new WebSocket.Server({ port: 8080 });
const sessions: Map<string, Set<WebSocket>> = new Map();

wss.on("connection", (ws) => {
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
  console.log("Client connected");

  ws.on("message", (data) => {
    const message: {
      type: string;
      session: string;
      lines?: string[];
      files?: string[];
    } = JSON.parse(data.toString());
    const session: Set<WebSocket> | undefined = sessions.get(message.session);

    switch (message.type) {
      case "join":
        console.log("Client joined session:", message.session);
        if (!session) {
          // Create a new session
          sessions.set(message.session, new Set([ws]));
        } else {
          // Add client to session
          session.add(ws);
        }
        break;
      case "leave":
        // Remove the client from the session
        session?.delete(ws);
        break;
      case "lines":
      case "files":
        // Broadcast the data to all clients in the session except the sender
        session?.forEach((client: WebSocket) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: message.type,
                [message.type]: (message as any)[message.type],
              })
            );
          }
        });
        break;
      default:
        console.error("Invalid message type:", message.type);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    // Remove the client from all sessions
    sessions.forEach((clients, session) => {
      clients.delete(ws);
      // Delete the session
      if (clients.size === 0) {
        sessions.delete(session);
      }
    });
  });
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
