import asyncHandler from "express-async-handler";
import Order from "../models/order.js";
import Cart from "../models/cartModel.js"; // 👈 ADD THIS

export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // ✅ validation (important)
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // ✅ create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  // ✅ CART CLEAR (MAIN CHANGE)
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
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("You do not have permission to view this order");
  }

  res.json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isDelivered) {
      res.status(400);
      throw new Error("Order has already been delivered");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export const updateOrderToConfirmed = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isConfirmed) {
      res.status(400);
      throw new Error("Order has already been confirmed");
    }
    if (order.isCancelled) {
      res.status(400);
      throw new Error("Cannot confirm a cancelled order");
    }
    
    order.isConfirmed = true;
    order.confirmedAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isShipped) {
      res.status(400);
      throw new Error("Order has already been shipped");
    }
    if (order.isCancelled) {
      res.status(400);
      throw new Error("Cannot ship a cancelled order");
    }
    if (!order.isConfirmed) {
      // Auto confirm if they ship directly, or throw error. Let's just auto-confirm for flexibility
      order.isConfirmed = true;
      order.confirmedAt = order.confirmedAt || Date.now();
    }
    
    order.isShipped = true;
    order.shippedAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
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

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check ownership
  const isOwner = order.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("You do not have permission to cancel this order");
  }

  if (order.isShipped || order.isDelivered) {
    res.status(400);
    throw new Error("Cannot cancel an order that has already been shipped or delivered");
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error("Order is already cancelled");
  }

  order.isCancelled = true;
  order.cancelledAt = Date.now();

  const cancelledOrder = await order.save();
  res.json(cancelledOrder);
});

/* Toggle paid / unpaid — admin only */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Toggle: if already paid → mark unpaid, else → mark paid
  if (order.isPaid) {
    order.isPaid   = false;
    order.paidAt   = undefined;
  } else {
    order.isPaid   = true;
    order.paidAt   = Date.now();
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

/* Update expected delivery date — admin only */
export const updateOrderExpectedDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.expectedDeliveryDate = req.body.expectedDeliveryDate;

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
