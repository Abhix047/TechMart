import express from "express";
import { getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

// display all products
router.get("/", getProducts);

// id specific products
router.get("/:id", getProductById);

export default router;