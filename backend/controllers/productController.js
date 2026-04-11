import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import Catalog from "../models/Catalog.js";
import cloudinary from "../config/cloudinary.js";

/* =================================================
   🔥 CREATE PRODUCT
================================================= */
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, catalog } = req.body;

    if (!catalog) {
      return res.status(400).json({ message: "Catalog is required" });
    }

    const catalogDoc = await Catalog.findById(catalog);
    if (!catalogDoc) {
      return res.status(404).json({ message: "Catalog not found" });
    }

    const shop = await Shop.findById(catalogDoc.shop);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (String(shop.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized for this shop" });
    }

    const productCount = await Product.countDocuments({
      shop: shop._id,
    });

    if (productCount >= shop.productLimit) {
      return res.status(403).json({
        message: `Product limit reached for ${shop.plan} plan (${shop.productLimit} products)`,
      });
    }

    const publicId =
      req.file.public_id ||
      req.file.filename ||
      req.file.path
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

    const product = await Product.create({
      name,
      price,
      stock,
      shop: shop._id,
      catalog,
      image: req.file.path,
      public_id: publicId,
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   🔥 GET PRODUCTS BY CATALOG
================================================= */
export const getProductsByCatalog = async (req, res) => {
  try {
    const products = await Product.find({
      catalog: req.params.catalogId,
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   🔥 UPDATE PRODUCT
================================================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
    };

    if (req.file) {
      if (product.public_id) {
        await cloudinary.uploader.destroy(product.public_id);
      }

      const newPublicId =
        req.file.public_id ||
        req.file.filename ||
        req.file.path
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

      updateData.image = req.file.path;
      updateData.public_id = newPublicId;
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
};


/* =================================================
   🔥 DELETE PRODUCT
================================================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.public_id) {
      try {
        await cloudinary.uploader.destroy(product.public_id);
      } catch (err) {
        console.log("Cloudinary delete failed:", err.message);
      }
    }

    await Product.findByIdAndDelete(req.params.productId);

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};