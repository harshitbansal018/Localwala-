// models/Catalog.js
import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Catalog", catalogSchema);
