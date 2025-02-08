import express from "express";
import { createServer } from "http";
import { connectSocket } from "./controller/socketIoConnection.js";
import connectDB from "./db/connect.js";
import auth from "./routes/auth.js"
import crud from "./routes/crud.js";
import cors from "cors";
const app = express();
const server = createServer(app); // Create an HTTP server

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.get("/", (req, res) => {
  res.send("Socket.io Server Running");
});

// Initialize Socket.IO
const io = connectSocket(server); // Ensure socket is initialized

app.use("/api", crud);
app.use("/api",auth);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
