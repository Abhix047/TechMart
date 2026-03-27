import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllProducts,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate, validateObjectIdParam } from "../middleware/validationMiddleware.js";
import { validateProductBody } from "../validators/requestValidators.js";

const router = express.Router();

const resolveUploadedFileUrl = (file) => {
  if (!file) return null;

  if (typeof file.secure_url === "string" && file.secure_url.trim().length > 0) {
    return file.secure_url.trim();
  }

  if (typeof file.url === "string" && file.url.trim().length > 0) {
    return file.url.trim();
  }

  if (typeof file.path === "string" && file.path.trim().length > 0) {
    const trimmed = file.path.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

    const normalized = trimmed.replace(/\\/g, "/");
    if (normalized.startsWith("uploads/")) return `/${normalized}`;

    const uploadsIdx = normalized.lastIndexOf("/uploads/");
    if (uploadsIdx !== -1) return normalized.slice(uploadsIdx);
  }

  if (typeof file.filename === "string" && file.filename.trim().length > 0) {
    return `/uploads/${file.filename.trim()}`;
  }

  return null;
};

router.post(
  "/upload",
  protect,
  admin,
  upload.array("images", 5),
  (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];
    const imagePaths = files.map(resolveUploadedFileUrl).filter(Boolean);

    if (imagePaths.length === 0) {
      return res.status(500).json({ message: "Upload succeeded but no file URLs were produced" });
    }

    res.json(imagePaths);
  }
);
router.get("/", getProducts);
router.get("/all", protect, admin, getAllProducts);
router.route("/")
  .get(getProducts)
  .post(protect, admin, validate(validateProductBody), createProduct);

router.route("/:id")
  .get(validateObjectIdParam(), getProductById)
  .put(protect, admin, validateObjectIdParam(), validate(validateProductBody), updateProduct)
  .delete(protect, admin, deleteProduct);

  router.post("/:id/reviews", protect,  upload.single("image"),createProductReview);

export default router;
