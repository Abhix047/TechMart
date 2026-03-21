import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createBanner,
  getBanners,
  deleteBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

router.post("/", upload.single("media"), createBanner);
router.get("/", getBanners);
router.delete("/:id", deleteBanner);

export default router;