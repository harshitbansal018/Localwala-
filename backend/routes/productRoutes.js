import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  createProduct,
  getProductsByCatalog,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);
router.get("/catalog/:catalogId", getProductsByCatalog);
router.put("/:productId", protect, upload.single("image"), updateProduct);
router.delete("/:productId", protect, deleteProduct);

export default router;