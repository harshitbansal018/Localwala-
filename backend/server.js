import express from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< HEAD

dotenv.config();

import connectDB from "./config/db.js";

=======
import connectDB from "./config/db.js";
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
<<<<<<< HEAD
import contactRoutes from "./routes/contact.js";
import paymentRoutes from "./routes/paymentRoutes.js";


=======
import path from "path";
import contactRoutes from "./routes/contact.js";
dotenv.config();
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
=======
app.use("/api/auth", authRoutes);

>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
app.get("/", (req, res) => {
  res.send("LOCALWALA API Running");
});

<<<<<<< HEAD
/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customer-auth", customerAuthRoutes);
app.use("/api/catalogs", catalogRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);

/* STATIC */

app.use("/uploads", express.static("uploads"));

/* SERVER */

=======
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
<<<<<<< HEAD
});
=======
});


app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);


app.use("/api/customer-auth", customerAuthRoutes);
app.use("/api/catalogs", catalogRoutes);


app.use("/api/cart", cartRoutes);

app.use("/uploads", express.static("uploads"));


app.use("/api/contact", contactRoutes);


>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
