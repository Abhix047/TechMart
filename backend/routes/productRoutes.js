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

router.post("/upload", protect, admin, upload.array("images", 5), (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  const imagePaths = files.map(f => f?.secure_url || (f?.filename ? `/uploads/${f.filename}` : null)).filter(Boolean);

  if (imagePaths.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  res.json(imagePaths);
});

router.route("/")
  .get(getProducts)
  .post(protect, admin, validate(validateProductBody), createProduct);

router.get("/all", protect, admin, getAllProducts);

router.route("/:id")
  .get(validateObjectIdParam(), getProductById)
  .put(protect, admin, validateObjectIdParam(), validate(validateProductBody), updateProduct)
  .delete(protect, admin, validateObjectIdParam(), deleteProduct);

router.post("/:id/reviews", protect, upload.single("image"), createProductReview);

export default router;
