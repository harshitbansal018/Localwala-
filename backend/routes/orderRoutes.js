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
      quantity: item.quantity
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
    console.error(error);
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

    if (!customer) {
      return res.json([]);
    }

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

    if (!shop) {
      return res.json([]);
    }

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

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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

router.post("/cod", async (req, res) => {

  try {

    const order = new Order({
      ...req.body,
      paymentMethod: "COD",
      paymentStatus: "Not Paid",
      orderStatus: "Placed"
    });

    await order.save();

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});
// ==========================
// SHOP ANALYTICS
// ==========================
router.get("/shopkeeper/analytics", protect, async (req, res) => {
  try {

    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.json({
        todaySales: 0,
        monthlyRevenue: 0,
        totalRevenue: 0,
        totalDeliveredOrders: 0,
      });
    }

    const deliveredOrders = await Order.find({
      shop: shop._id,
      status: "Delivered",
    });

    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    let todaySales = 0;
    let monthlyRevenue = 0;
    let totalRevenue = 0;

    deliveredOrders.forEach((order) => {

      totalRevenue += order.total;

      if (order.deliveredAt && order.deliveredAt >= startOfToday) {
        todaySales += order.total;
      }

      if (order.deliveredAt && order.deliveredAt >= startOfMonth) {
        monthlyRevenue += order.total;
      }

    });

    res.json({
      todaySales,
      monthlyRevenue,
      totalRevenue,
      totalDeliveredOrders: deliveredOrders.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;