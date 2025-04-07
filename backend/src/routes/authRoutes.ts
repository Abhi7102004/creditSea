import express from "express";
import {
  register,
  login,
  deleteUser,
  getUsers,
  createAdmins,
  createVerifier,
} from "../controllers/authController";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/users", authenticate, authorizeAdmin, getUsers);
router.delete("/users/:userId", authenticate, authorizeAdmin, deleteUser);

// Admin routes
router.post("/admin/create", authenticate, authorizeAdmin, createAdmins);
router.post("/verifier/create", authenticate, authorizeAdmin, createVerifier);

export default router;
