import asyncHandler from "express-async-handler";
import Product from "../models/products.js";
import Order from "../models/order.js";
import mongoose from "mongoose";

// @desc  Get all active products
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: { $ne: false } });
  res.json(products);
});

// @desc  Get all products (including inactive)
// @route GET /api/products/all
// @access Admin
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc  Get single product
// @route GET /api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc  Create product
// @route POST /api/products
// @access Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, category, description, images, price, discountPrice, countInStock, colors, specifications } = req.body;

  const product = await Product.create({
    user: req.user._id,
    name, brand, category, description, images,
    price, discountPrice, countInStock, colors, specifications,
  });

  res.status(201).json(product);
});

// @desc  Update product
// @route PUT /api/products/:id
// @access Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, brand, category, description, images, price, discountPrice, countInStock, colors, specifications } = req.body;

  product.name          = name          ?? product.name;
  product.brand         = brand         ?? product.brand;
  product.category      = category      ?? product.category;
  product.description   = description   ?? product.description;
  product.images        = images        ?? product.images;
  product.price         = price         ?? product.price;
  product.discountPrice = discountPrice ?? product.discountPrice;
  product.countInStock  = countInStock  ?? product.countInStock;
  product.colors        = colors        ?? product.colors;
  product.specifications = specifications ?? product.specifications;

  if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

  res.json(await product.save());
});

// @desc  Delete product
// @route DELETE /api/products/:id
// @access Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product removed" });
});

// @desc  Add product review
// @route POST /api/products/:id/reviews
// @access Private
export const createProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Only allow reviews after delivery
  const order = await Order.findOne({
    user: req.user._id,
    isDelivered: true,
    orderItems: { $elemMatch: { product: new mongoose.Types.ObjectId(req.params.id) } },
  });
  if (!order) {
    res.status(403);
    throw new Error("Review allowed only after delivery");
  }

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  // Cloudinary returns secure_url; fallback to path for local dev
  const file = req.file;
  const image = file?.secure_url || file?.path || "";

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(req.body.rating),
    comment: req.body.comment,
    image,
  });

  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});
