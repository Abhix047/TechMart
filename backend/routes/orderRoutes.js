import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  cancelOrder,
  updateOrderToConfirmed,
  updateOrderToShipped,
  updateOrderToPaid,
  updateOrderExpectedDelivery,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { validate, validateObjectIdParam } from "../middleware/validationMiddleware.js";
import { validateOrderBody } from "../validators/requestValidators.js";

const router = express.Router();

router.route("/")
  .get(protect, admin, getOrders)
  .post(protect, validate(validateOrderBody), createOrder);

router.get("/myorders", protect, getMyOrders);

router.get("/:id", protect, validateObjectIdParam(), getOrderById);
router.put("/:id/confirm", protect, admin, validateObjectIdParam(), updateOrderToConfirmed);
router.put("/:id/ship", protect, admin, validateObjectIdParam(), updateOrderToShipped);
router.put("/:id/deliver", protect, admin, validateObjectIdParam(), updateOrderToDelivered);
router.put("/:id/cancel", protect, validateObjectIdParam(), cancelOrder);
router.put("/:id/pay", protect, admin, validateObjectIdParam(), updateOrderToPaid);
router.put("/:id/delivery-date", protect, admin, validateObjectIdParam(), updateOrderExpectedDelivery);

export default router;
