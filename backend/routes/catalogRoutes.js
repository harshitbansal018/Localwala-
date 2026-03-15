import express from "express";
import Catalog from "../models/Catalog.js";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔥 CREATE CATALOG
router.post("/:shopId", protect, async (req, res) => {
  try {
    const { name } = req.body;
    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    if (String(shop.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized for this shop" });
    }

    const catalog = await Catalog.create({
      name,
      shop: req.params.shopId,
    });

    res.status(201).json(catalog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔥 GET CATALOGS BY SHOP
router.get("/shop/:shopId", async (req, res) => {
  try {
    const catalogs = await Catalog.find({
      shop: req.params.shopId,
    });

    res.json(catalogs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔥 DELETE CATALOG (AND ITS PRODUCTS)
router.delete("/:catalogId", protect, async (req, res) => {
  try {
    await Product.deleteMany({
      catalog: req.params.catalogId,
    });

    await Catalog.findByIdAndDelete(
      req.params.catalogId
    );

    res.json({ message: "Catalog deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
