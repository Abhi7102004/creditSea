import express from "express";
import {
  createLoanApplication,
  verifyApplication,
  approveApplication,
  getAllApplications,
} from "../controllers/loanController";
import {
  authenticate,
  authorizeAdmin,
  authorizeVerifier,
} from "../middleware/auth";

const router = express.Router();

router.post("/new-application", authenticate, createLoanApplication);
router.get("/applications", authenticate, getAllApplications);

router.post(
  "/applications/:applicationId/verify",
  authenticate,
  authorizeVerifier,
  verifyApplication
);

router.post(
  "/applications/:applicationId/approve",
  authenticate,
  authorizeAdmin,
  approveApplication
);

export default router;
