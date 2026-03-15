import express from "express";
import Shop from "../models/Shop.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE SHOP
// CREATE SHOP
router.post("/", protect, async (req, res) => {
  try {
    const { name } = req.body;

    // 🚀 Check if user already owns a shop
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
      return res.status(400).json({ message: "Shop name already taken" });
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
});
// GET MY SHOPS
router.get("/my", protect, async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user.id });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE SHOP
router.delete("/:id", protect, async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: "Shop deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET SHOP BY SLUG (Public)
router.get("/slug/:slug", async (req, res) => {
  try {
<<<<<<< HEAD
   const shop = await Shop.findOne({ slug: req.params.slug })
  .populate("owner", "email phone name");
=======
    const shop = await Shop.findOne({ slug: req.params.slug });
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Update shop plan (after payment received via WhatsApp)
// Use: PUT /api/shops/:shopId/admin-plan
// Headers: X-Admin-Key: <ADMIN_SECRET from .env>
// Body: { plan: "Pro" | "Premium" | "Basic" }
router.put("/:shopId/admin-plan", async (req, res) => {
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
});

router.put("/upgrade-plan", protect, async (req, res) => {
  try {
    const { plan } = req.body;

    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (plan === "Basic") {
      shop.plan = "Basic";
      shop.productLimit = 10;
    }

    if (plan === "Pro") {
      shop.plan = "Pro";
      shop.productLimit = 50;
    }

    if (plan === "Premium") {
      shop.plan = "Premium";
      shop.productLimit = 999999; // unlimited
    }

    await shop.save();

    res.json(shop);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
