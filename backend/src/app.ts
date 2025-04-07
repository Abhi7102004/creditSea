import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import loanRoutes from "./routes/loanRoutes";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://creditsea-3.onrender.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/loan", loanRoutes);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/creditsea";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
