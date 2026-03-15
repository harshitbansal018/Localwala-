import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Correct reference
      required: true,
      unique: true, // ✅ One shop per user
    },

    plan: {
      type: String,
      enum: ["Basic", "Pro", "Premium"],
      default: "Basic",
    },

    productLimit: {
      type: Number,
      default: 10,
    },

    isActive: {
      type: Boolean,
      default: false, // activate after payment
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);