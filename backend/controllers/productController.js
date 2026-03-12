import asyncHandler from "express-async-handler";
import Product from "../models/products.js";


// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {

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

  product.name = name || product.name;
  product.brand = brand || product.brand;
  product.category = category || product.category;
  product.description = description || product.description;
  product.images = images || product.images;
  product.price = price || product.price;
  product.discountPrice = discountPrice || product.discountPrice;
  product.countInStock = countInStock || product.countInStock;
  product.colors = colors || product.colors;
  product.specifications = specifications || product.specifications;

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