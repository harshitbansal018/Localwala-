import Catalog from "../models/Catalog.js";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";

/* =================================================
   🔥 CREATE CATALOG
================================================= */
export const createCatalog = async (req, res) => {
  try {
    const { name } = req.body;
    const { shopId } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Catalog name is required" });
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // ownership check
    if (String(shop.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized for this shop" });
    }

    const catalog = await Catalog.create({
      name,
      shop: shopId,
    });

    res.status(201).json(catalog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   🔥 GET CATALOGS BY SHOP
================================================= */
export const getCatalogsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const catalogs = await Catalog.find({ shop: shopId })
      .sort({ createdAt: -1 });

    res.json(catalogs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   🔥 DELETE CATALOG
================================================= */
export const deleteCatalog = async (req, res) => {
  try {
    const { catalogId } = req.params;

    const catalog = await Catalog.findById(catalogId);

    if (!catalog) {
      return res.status(404).json({ message: "Catalog not found" });
    }

    const shop = await Shop.findById(catalog.shop);

    if (String(shop.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // delete products
    await Product.deleteMany({ catalog: catalog._id });

    // delete catalog
    await catalog.deleteOne();

    res.json({ message: "Catalog and its products deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};