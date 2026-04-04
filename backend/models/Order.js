import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // Order Type
    orderType: {
      type: String,
      enum: ["pickup", "delivery"],
      default: "pickup",
    },

    // Delivery Address (only for delivery)
    deliveryAddress: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    // Items
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    // ✅ FIXED STATUS ENUM (matches frontend)
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Optional: auto set deliveredAt


const Order = mongoose.model("Order", orderSchema);

export default Order;