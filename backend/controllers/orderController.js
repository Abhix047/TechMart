import asyncHandler from "express-async-handler";
import Order from "../models/order.js";
import Cart from "../models/cartModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems?.length) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, totalPrice,
  });

  await Cart.deleteMany({ user: req.user._id });
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You do not have permission to view this order");
  }

  res.json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.isDelivered) { res.status(400); throw new Error("Order already delivered"); }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  res.json(await order.save());
});

export const updateOrderToConfirmed = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.isConfirmed) { res.status(400); throw new Error("Order already confirmed"); }
  if (order.isCancelled) { res.status(400); throw new Error("Cannot confirm a cancelled order"); }

  order.isConfirmed = true;
  order.confirmedAt = Date.now();
  res.json(await order.save());
});

export const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.isShipped) { res.status(400); throw new Error("Order already shipped"); }
  if (order.isCancelled) { res.status(400); throw new Error("Cannot ship a cancelled order"); }

  // Auto-confirm if shipping directly
  if (!order.isConfirmed) {
    order.isConfirmed = true;
    order.confirmedAt = order.confirmedAt || Date.now();
  }

  order.isShipped = true;
  order.shippedAt = Date.now();
  res.json(await order.save());
});

export const canReviewProduct = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    user: req.user._id,
    isDelivered: true,
    "orderItems.product": req.params.id,
  });

  if (!order) {
    res.status(403);
    throw new Error("Review allowed only after delivery");
  }

  res.json({ success: true });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You do not have permission to cancel this order");
  }
  if (order.isShipped || order.isDelivered) {
    res.status(400);
    throw new Error("Cannot cancel an order that has already been shipped or delivered");
  }
  if (order.isCancelled) { res.status(400); throw new Error("Order already cancelled"); }

  order.isCancelled = true;
  order.cancelledAt = Date.now();
  res.json(await order.save());
});

// Toggle paid/unpaid — admin only
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  order.isPaid = !order.isPaid;
  order.paidAt = order.isPaid ? Date.now() : undefined;
  res.json(await order.save());
});

// Update expected delivery date — admin only
export const updateOrderExpectedDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  order.expectedDeliveryDate = req.body.expectedDeliveryDate;
  res.json(await order.save());
});
