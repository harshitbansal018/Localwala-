import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";
import Customer from "../models/Customer.js";
import Shop from "../models/Shop.js";

const router = express.Router();


// ==========================
// CREATE ORDER
// ==========================
router.post("/", protect, async (req, res) => {
  try {
    const { shopId, items, total, orderType, deliveryAddress } = req.body;

    const formattedItems = items.map(item => ({
      productId: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      shop: shopId,
      customer: req.user.id,
      items: formattedItems,
      total,
      orderType,
      deliveryAddress
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================
// GET CUSTOMER ORDERS
// ==========================
router.get("/shop/:shopId/:email", async (req, res) => {
  try {
    const { shopId, email } = req.params;

    const customer = await Customer.findOne({ email });

    if (!customer) return res.json([]);

    const orders = await Order.find({
      shop: shopId,
      customer: customer._id,
    });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================
// SHOPKEEPER ORDERS
// ==========================
router.get("/shopkeeper", protect, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) return res.json([]);

    const orders = await Order.find({ shop: shop._id })
      .populate("customer", "name email");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================
// UPDATE ORDER STATUS
// ==========================
router.put("/:orderId", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ["Pending", "Processing", "Shipped", "Delivered"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // OPTIONAL SECURITY CHECK 🔐
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop || order.shop.toString() !== shop._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ==========================
// SHOPKEEPER ANALYTICS
// ==========================
router.get("/shopkeeper/analytics", protect, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const orders = await Order.find({ shop: shop._id });

    let todaySales = 0;
    let monthlyRevenue = 0;
    let pendingAmount = 0;
    let totalRevenue = 0;
    let totalDeliveredOrders = 0;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);

      // Total revenue
      totalRevenue += order.total;

      // Delivered orders
      if (order.status === "Delivered") {
        totalDeliveredOrders++;
      }

      // Pending amount
      if (order.status !== "Delivered") {
        pendingAmount += order.total;
      }

      // Today's sales
      if (
        orderDate.toDateString() === today.toDateString() &&
        order.status === "Delivered"
      ) {
        todaySales += order.total;
      }

      // Monthly revenue
      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear &&
        order.status === "Delivered"
      ) {
        monthlyRevenue += order.total;
      }
    });

    res.json({
      todaySales,
      monthlyRevenue,
      pendingAmount,
      totalRevenue,
      totalDeliveredOrders,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;

// ❌ REMOVED COD ROUTE (or fix like below if needed)