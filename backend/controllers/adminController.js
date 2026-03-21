import asyncHandler from "express-async-handler";
import Product from "../models/products.js";
import User from "../models/user.js";
import Order from "../models/order.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" }
      }
    }
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  const recentOrders = await Order.find()
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue,
    recentOrders
  });
});
