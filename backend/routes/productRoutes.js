import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate, validateObjectIdParam } from "../middleware/validationMiddleware.js";
import { validateProductBody } from "../validators/requestValidators.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  admin,
  upload.array("images", 5),
  (req, res) => {
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    res.json(imagePaths);
  }
);
router.get("/", getProducts);
router.route("/")
  .get(getProducts)
  .post(protect, admin, validate(validateProductBody), createProduct);

router.route("/:id")
  .get(validateObjectIdParam(), getProductById)
  .put(protect, admin, validateObjectIdParam(), validate(validateProductBody), updateProduct)
  .delete(protect, admin, deleteProduct);

  router.post("/:id/reviews", protect,  upload.single("image"),createProductReview);

export default router;
