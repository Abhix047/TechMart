import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createBanner,
  getBanners,
  getAllBanners,
  updateBanner,
  deleteBanner,
  getBannerById,
} from "../controllers/bannerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, upload.single("media"), createBanner);
router.get("/", getBanners);                                // public – active only
router.get("/all", protect, admin, getAllBanners);          // admin – all banners
router.get("/:id", getBannerById);
router.put("/:id", protect, admin, upload.single("media"), updateBanner);
router.delete("/:id", protect, admin, deleteBanner);

export default router;