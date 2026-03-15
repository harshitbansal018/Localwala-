import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true,
},


shopName: {
  type: String,
  trim: true,
  required: function () {
    return this.role === "shopkeeper";
  }
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},

password: {
  type: String,
  required: true,
  minlength: 6,
},

role: {
  type: String,
  enum: ["shopkeeper", "customer", "admin"],
  default: "shopkeeper",
},

phone: {
  type: String,
  required: true,
  unique: true,
  trim: true
},


},
{ timestamps: true }
);

export default mongoose.model("User", userSchema);
