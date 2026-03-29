import express from "express";
import {
  submitQuery,
  getMyQueries,
  getAllQueries,
  getQueryById,
  replyToQuery,
  deleteQuery,
} from "../controllers/queryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────────────────
// Submit a new query (anyone can do this, login optional)
router.post("/", submitQuery);

// Get replies for my email (public check by email)
router.get("/my", getMyQueries);

// ── Admin routes ────────────────────────────────────────────────────────────
router.get("/", protect, admin, getAllQueries);
router.get("/:id", protect, admin, getQueryById);
router.put("/:id/reply", protect, admin, replyToQuery);
router.delete("/:id", protect, admin, deleteQuery);

export default router;
