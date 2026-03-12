import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  (req, res) => {

    const imagePaths = req.files.map(
      file => `/uploads/${file.filename}`
    );

    res.json(imagePaths);
  }
);

export default router;