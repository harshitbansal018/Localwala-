import express from "express";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import Catalog from "../models/Catalog.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();


/* =================================================
   🔥 CREATE PRODUCT (With Image + Plan Limit)
================================================= */
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, stock, catalog } = req.body;

      if (!catalog) {
        return res.status(400).json({ message: "Catalog is required" });
      }

      // 🔥 Get shop from catalog (correct shop when user has multiple shops)
      const catalogDoc = await Catalog.findById(catalog);
      if (!catalogDoc) {
        return res.status(404).json({ message: "Catalog not found" });
      }

      const shop = await Shop.findById(catalogDoc.shop);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      const ownerId = String(shop.owner);
      const userId = String(req.user?.id || "");
      if (ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized for this shop" });
      }

      // 🔥 Check plan product limit for THIS shop
      const productCount = await Product.countDocuments({
        shop: shop._id,
      });

      if (productCount >= shop.productLimit) {
        return res.status(403).json({
          message: `Product limit reached for ${shop.plan} plan (${shop.productLimit} products)`,
        });
      }

      const product = await Product.create({
        name,
        price,
        stock,
        shop: shop._id,
        catalog,
        image: req.file ? `/uploads/${req.file.filename}` : "",
      });

      res.status(201).json(product);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);


/* =================================================
   🔥 GET PRODUCTS BY CATALOG (Public)
================================================= */
router.get("/catalog/:catalogId", async (req, res) => {
  try {
    const products = await Product.find({
      catalog: req.params.catalogId,
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* =================================================
   🔥 UPDATE PRODUCT (Optional Image Update)
================================================= */
router.put(
  "/:productId",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
      };

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updated = await Product.findByIdAndUpdate(
        req.params.productId,
        updateData,
        { new: true }
      );

      res.json(updated);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* =================================================
   🔥 DELETE PRODUCT
================================================= */
router.delete("/:productId", protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;