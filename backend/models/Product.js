import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    catalog: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Catalog",
  required: true,
},
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
        image: {
    type: String, 
      required: true  // 🔥 store image path
  },
   public_id: {
      type: String, // 🔥 REQUIRED for Cloudinary delete
    },
    stock: {
      type: Number,
      default: 1,
    },

  },
  { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);

export default Product;
