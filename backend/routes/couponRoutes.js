import express from "express";
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createCoupon);
router.get("/", protect, admin, getCoupons);
router.delete("/:id", protect, admin, deleteCoupon);

router.post("/validate", protect, validateCoupon);

export default router;
