import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


import protect from "./gateway/middleware/auth.middleware.js";
import { getCurrentUser } from "./gateway/controllers/user.controller.js";

import authRouter from "./services/auth/routes/auth.route.js";
import chatRouter from "./services/chat/routes/chat.routes.js";
import agentRouter from "./services/agent/routes/agent.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());


const attachUserId = (req, _res, next) => {
  if (req.user?.userId) req.headers["x-user-id"] = String(req.user.userId);
  next();
};


app.use("/api/auth", authRouter);


app.get("/api/me", protect, getCurrentUser);
app.use("/api/chat", protect, attachUserId, chatRouter);
app.use("/api/agent", protect, attachUserId, agentRouter);


app.get("/", (_req, res) => res.send("Backend is running ✅"));


app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.status) return res.status(err.status).json(err.data);
  return res.status(500).json({ message: `server error ${err}` });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
