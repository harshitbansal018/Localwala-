import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createOrder,
  getCustomerOrders,
  getShopkeeperOrders,
  updateOrderStatus,
  getShopAnalytics
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/shop/:shopId/:email", getCustomerOrders);
router.get("/shopkeeper", protect, getShopkeeperOrders);
router.put("/:orderId", protect, updateOrderStatus);
router.get("/shopkeeper/analytics", protect, getShopAnalytics);

export default router;