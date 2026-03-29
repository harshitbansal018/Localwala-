import express from "express";
import Catalog from "../models/Catalog.js";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =================================================
   🔥 CREATE CATALOG
================================================= */
router.post("/:shopId", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Catalog name is required" });
    }

    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // 🔐 Ownership check
    if (String(shop.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized for this shop" });
    }

    const catalog = await Catalog.create({
      name,
      shop: req.params.shopId,
    });

    res.status(201).json(catalog);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


/* =================================================
   🔥 GET CATALOGS BY SHOP
================================================= */
router.get("/shop/:shopId", async (req, res) => {
  try {
    const catalogs = await Catalog.find({
      shop: req.params.shopId,
    }).sort({ createdAt: -1 }); // 🔥 latest first

    res.json(catalogs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* =================================================
   🔥 DELETE CATALOG (AND ITS PRODUCTS)
================================================= */
router.delete("/:catalogId", protect, async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.catalogId);

    if (!catalog) {
      return res.status(404).json({ message: "Catalog not found" });
    }

    const shop = await Shop.findById(catalog.shop);

    // 🔐 Ownership check
    if (String(shop.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔥 Delete all products of this catalog
    await Product.deleteMany({
      catalog: catalog._id,
    });

    // 🔥 Delete catalog
    await catalog.deleteOne();

    res.json({ message: "Catalog and its products deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;