import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:shopId", protect, getCart);
router.post("/:shopId", protect, addToCart);
router.delete("/:shopId/:productId", protect, removeFromCart);
router.put("/:shopId/:productId", protect, updateCartQuantity);

export default router;