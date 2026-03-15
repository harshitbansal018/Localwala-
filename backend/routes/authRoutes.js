import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* =========================
SIGNUP
========================= */
router.post("/signup", async (req, res) => {
try {


const { name, shopName, email, password, phone, role, plan } = req.body;

// check email
const userExists = await User.findOne({ email });
if (userExists) {
  return res.status(400).json({ message: "Email already registered" });
}

// check phone
const phoneExists = await User.findOne({ phone });
if (phoneExists) {
  return res.status(400).json({ message: "Phone number already registered" });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  shopName,
  email,
  password: hashedPassword,
  phone,
  role,
  subscription: {
    plan: plan || "Basic",
    isActive: true,
  },
});

res.status(201).json({
  message: "Signup successful",
  user
});


} catch (error) {
res.status(500).json({ message: error.message });
}
});

/* =========================
LOGIN
========================= */
router.post("/login", async (req, res) => {
try {


const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({ message: "Invalid credentials" });
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(400).json({ message: "Invalid credentials" });
}

const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({
  message: "Login successful",
  token,
  role: user.role,
  name: user.name,
  email: user.email,
  phone: user.phone,
  shopName: user.shopName,
  subscription: user.subscription
});


} catch (error) {
res.status(500).json({ message: error.message });
}
});

export default router;
