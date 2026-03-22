import express from "express";
import { addToCart,getCart,removeCartItem,updateCartItem} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect,addToCart);
router.get("/",protect,getCart);
router.delete("/:id",protect,removeCartItem);
router.put("/:id", protect, updateCartItem);

export default router;