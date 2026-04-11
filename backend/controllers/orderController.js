import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Shop from "../models/Shop.js";

/* ==========================
   CREATE ORDER
========================== */
export const createOrder = async (req, res) => {
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
};


/* ==========================
   GET CUSTOMER ORDERS
========================== */
export const getCustomerOrders = async (req, res) => {
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
};


/* ==========================
   SHOPKEEPER ORDERS
========================== */
export const getShopkeeperOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) return res.json([]);

    const orders = await Order.find({ shop: shop._id })
      .populate("customer", "name email");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ==========================
   UPDATE ORDER STATUS
========================== */
export const updateOrderStatus = async (req, res) => {
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
};


/* ==========================
   SHOPKEEPER ANALYTICS
========================== */
export const getShopAnalytics = async (req, res) => {
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

      totalRevenue += order.total;

      if (order.status === "Delivered") {
        totalDeliveredOrders++;
      }

      if (order.status !== "Delivered") {
        pendingAmount += order.total;
      }

      if (
        orderDate.toDateString() === today.toDateString() &&
        order.status === "Delivered"
      ) {
        todaySales += order.total;
      }

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
};