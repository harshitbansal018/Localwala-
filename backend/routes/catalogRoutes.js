import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createCatalog,
  getCatalogsByShop,
  deleteCatalog
} from "../controllers/catalogController.js";

const router = express.Router();

router.post("/:shopId", protect, createCatalog);
router.get("/shop/:shopId", getCatalogsByShop);
router.delete("/:catalogId", protect, deleteCatalog);

export default router;