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

    // Delivery Address (only for delivery orders)
    deliveryAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        price: Number,

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

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Preparing", "Ready", "Out for Delivery", "Delivered"],
      default: "Pending",
    },

    deliveredAt: {
      type: Date,
    },
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;