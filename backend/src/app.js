import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import connectToSocket from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "49kb" }));
app.use(express.urlencoded({ limit: "49kb", extended: true }));
app.use(cors());

const server = createServer(app);
const io = connectToSocket(server);

app.get("/", (req, res) => res.send("Hello Voxen this side ! "));

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log("Listening on 8000"));

mongoose
  .connect("mongodb+srv://nishant_gawdiya:HR13n1058%40%40%23@cluster0.8xwe4yh.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
