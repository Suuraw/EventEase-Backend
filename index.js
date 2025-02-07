import express from "express";
import { createServer } from "http";
import { connectSocket } from "./controller/socketIoConnection.js"; // Import the socket function
// import imagePost from "./routes/imagePost.js"
import connectDB from "./db/connect.js";
import crud from "./routes/crud.js"
const app = express();
const server = createServer(app); // Create an HTTP server
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB();
app.get("/", (req, res) => {
  res.send("Socket.io Server Running");
});

// Initialize Socket.IO
connectSocket(server);
// app.use("/api",imagePost);
app.use("/api",crud);
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
