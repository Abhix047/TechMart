import asyncHandler from "express-async-handler";
import Product from "../models/products.js";
 import Order from "../models/order.js";
 import mongoose from "mongoose";
// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: { $ne: false } });
  res.status(200).json(products);
});

// @desc    Get all products (Admin)
// @route   GET /api/products/all
// @access  Admin
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});


// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (product) {

    res.status(200).json(product);

  } else {

    res.status(404);
    throw new Error("Product not found");

  }

});


// @desc    Create new product
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {

  const {
    name,
    brand,
    category,
    description,
    images,
    price,
    discountPrice,
    countInStock,
    colors,
    specifications,
  } = req.body;

  const product = new Product({
    user: req.user._id,
    name,
    brand,
    category,
    description,
    images,
    price,
    discountPrice,
    countInStock,
    colors,
    specifications,
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);

});


// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {

    res.status(404);
    throw new Error("Product not found");

  }

  const {
    name,
    brand,
    category,
    description,
    images,
    price,
    discountPrice,
    countInStock,
    colors,
    specifications,
  } = req.body;

  product.name = name ?? product.name;
  product.brand = brand ?? product.brand;
  product.category = category ?? product.category;
  product.description = description ?? product.description;
  product.images = images ?? product.images;
  product.price = price ?? product.price;
  product.discountPrice = discountPrice ?? product.discountPrice;
  product.countInStock = countInStock ?? product.countInStock;
  product.colors = colors ?? product.colors;
  product.specifications = specifications ?? product.specifications;
  if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

  const updatedProduct = await product.save();

  res.json(updatedProduct);

});


// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {

    res.status(404);
    throw new Error("Product not found");

  }

  await product.deleteOne();

  res.json({ message: "Product removed" });

});

export const createProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  const rating = Number(req.body.rating);
  const comment = req.body.comment;

  const resolveUploadedFileUrl = (file) => {
    if (!file) return "";

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

    return "";
  };

  const image = resolveUploadedFileUrl(req.file);

  // ✅ delivered check
 const order = await Order.findOne({
  user: req.user._id,
  isDelivered: true,
  orderItems: {
    $elemMatch: {
      product: new mongoose.Types.ObjectId(product),
    },
  },
});
  if (!order) {
    res.status(403);
    throw new Error("Review allowed only after delivery");
  }

  // ✅ check already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
    image,
  };

  product.reviews.push(review);

  // ✅ update rating
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added" });
});
