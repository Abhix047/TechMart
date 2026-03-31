import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js";

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay/order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error("Amount is required");
  }

  // Validate presence of keys to prevent vague error
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith("YOUR_") || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.startsWith("YOUR_")) {
     res.status(500);
     throw new Error("Razorpay keys not configured in environment variables.");
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Math.round(amount * 100), // convert to paise
    currency: "INR",
    receipt: `receipt_${Date.now().toString()}`,
  };

  try {
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Some error occurred while creating Razorpay order");
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Payment details missing");
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Optionally update local DB order
    if (orderId) {
       const order = await Order.findById(orderId);
       if (order) {
           order.isPaid = true;
           order.paidAt = Date.now();
           await order.save();
       }
    }

    res.json({
      success: true,
      message: "Payment successfully verified",
    });
  } else {
    res.status(400);
    throw new Error("Invalid signature");
  }
});

// @desc    Get Razorpay Key Id
// @route   GET /api/payment/razorpay/key
// @access  Private
export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});
