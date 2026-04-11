import Shop from "../models/Shop.js";

/* =========================
CREATE SHOP
========================= */
export const createShop = async (req, res) => {
  try {
    const { name } = req.body;

    const existingUserShop = await Shop.findOne({ owner: req.user.id });
    if (existingUserShop) {
      return res.status(400).json({
        message: "You can only create one shop",
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const existingSlug = await Shop.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        message: "Shop name already taken",
      });
    }

    const shop = await Shop.create({
      name,
      slug,
      owner: req.user.id,
    });

    res.status(201).json(shop);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
GET MY SHOPS
========================= */
export const getMyShops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user.id });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
DELETE SHOP
========================= */
export const deleteShop = async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: "Shop deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
GET SHOP BY SLUG (PUBLIC)
========================= */
export const getShopBySlug = async (req, res) => {
  try {
    const shop = await Shop.findOne({ slug: req.params.slug })
      .populate("owner", "email phone name upiId");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
ADMIN UPDATE PLAN
========================= */
export const updatePlanByAdmin = async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];

    if (adminKey !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { shopId } = req.params;
    const { plan } = req.body;

    if (!["Basic", "Pro", "Premium"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const limits = { Basic: 10, Pro: 50, Premium: 999999 };

    shop.plan = plan;
    shop.productLimit = limits[plan];

    await shop.save();

    res.json(shop);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
USER UPGRADE PLAN
========================= */
export const upgradePlan = async (req, res) => {
  try {
    const { plan } = req.body;

    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const limits = { Basic: 10, Pro: 50, Premium: 999999 };

    if (!limits[plan]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    shop.plan = plan;
    shop.productLimit = limits[plan];

    await shop.save();

    res.json(shop);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};