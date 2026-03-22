import express from "express";
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../controllers/offerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, admin, getOffers)
  .post(protect, admin, createOffer);

router.route("/:id")
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer);

export default router;
