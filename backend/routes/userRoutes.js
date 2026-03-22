import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUsers,
  deleteUser,
  getWishlist,
  toggleWishlist
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { validate, validateObjectIdParam } from "../middleware/validationMiddleware.js";
import { validateLoginBody, validateRegisterBody } from "../validators/requestValidators.js";

const router = express.Router();

router.post("/register", authRateLimiter, validate(validateRegisterBody), registerUser);
router.post("/login", authRateLimiter, validate(validateLoginBody), loginUser);
router.post("/logout", authRateLimiter, logoutUser);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, validateObjectIdParam(), deleteUser);

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:id", protect, toggleWishlist);

export default router;
