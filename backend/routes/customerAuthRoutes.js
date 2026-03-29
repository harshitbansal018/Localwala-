import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

const router = express.Router();

/* =========================
CUSTOMER SIGNUP
========================= */
router.post("/signup", async (req, res) => {
try {


const { name, email, password, phone } = req.body;

// check email
const existingEmail = await Customer.findOne({ email });
if (existingEmail) {
  return res.status(400).json({ message: "Customer already exists with this email" });
}

// check phone
const existingPhone = await Customer.findOne({ phone });
if (existingPhone) {
  return res.status(400).json({ message: "Phone number already registered" });
}

const hashedPassword = await bcrypt.hash(password, 10);

const customer = await Customer.create({
  name,
  email,
  phone,
  password: hashedPassword
});

res.status(201).json({
  message: "Signup successful"
});


} catch (error) {
res.status(500).json({ message: error.message });
}
});

/* =========================
CUSTOMER LOGIN
========================= */
router.post("/login", async (req, res) => {
try {


const { email, password } = req.body;

const customer = await Customer.findOne({ email });

if (!customer) {
  return res.status(400).json({ message: "Invalid credentials" });
}

const isMatch = await bcrypt.compare(password, customer.password);

if (!isMatch) {
  return res.status(400).json({ message: "Invalid credentials" });
}

const token = jwt.sign(
  { id: customer._id, role: "customer" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

res.json({
  token,
  name: customer.name,
  email: customer.email,
  phone: customer.phone
});


} catch (error) {
res.status(500).json({ message: error.message });
}
});

export default router;
