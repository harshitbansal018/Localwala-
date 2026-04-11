import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createShop,
  getMyShops,
  deleteShop,
  getShopBySlug,
  updatePlanByAdmin,
  upgradePlan
} from "../controllers/shopController.js";

const router = express.Router();

router.post("/", protect, createShop);
router.get("/my", protect, getMyShops);
router.delete("/:id", protect, deleteShop);
router.get("/slug/:slug", getShopBySlug);
router.put("/:shopId/admin-plan", updatePlanByAdmin);
router.put("/upgrade-plan", protect, upgradePlan);

export default router;