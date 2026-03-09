import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public (Koi bhi website par aake products dekh sakta hai)
export const getProducts = asyncHandler(async (req, res) => {
  // Database se saare products utha lo
  const products = await Product.find({});
  res.status(200).json(products);
});

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public (Details page ke liye)
export const getProductById = asyncHandler(async (req, res) => {
  // URL mein jo ID aayegi (req.params.id), usse product dhundo
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Bhai, ye product nahi mila!");
  }
});