import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import path from "path";
import contactRoutes from "./routes/contact.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("LOCALWALA API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);


app.use("/api/customer-auth", customerAuthRoutes);
app.use("/api/catalogs", catalogRoutes);


app.use("/api/cart", cartRoutes);

app.use("/uploads", express.static("uploads"));


app.use("/api/contact", contactRoutes);


