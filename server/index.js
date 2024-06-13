import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

// Connect to DB
mongoose
  .connect(process.env.MONG_URL)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

// Initialize the app
const app = express();

app.use(express.json());

app.use(cookieParser());

// Run the Server
app.listen(3000, () => {
  console.log("Server is Running on Port 3000 ");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
