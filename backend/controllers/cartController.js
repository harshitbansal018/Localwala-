import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* =================================================
   🔹 GET CART
================================================= */
export const getCart = async (req, res) => {
  try {
    const { shopId } = req.params;

    const cart = await Cart.findOne({
      customer: req.user.id,
      shop: shopId,
    }).populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    // remove null products
    cart.items = cart.items.filter(item => item.product !== null);
    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   🔹 ADD TO CART
================================================= */
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { shopId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({
      customer: req.user.id,
      shop: shopId,
    });

    if (!cart) {
      cart = await Cart.create({
        customer: req.user.id,
        shop: shopId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }

      await cart.save();
    }

    const updatedCart = await cart.populate("items.product");
    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   🔹 REMOVE FROM CART
================================================= */
export const removeFromCart = async (req, res) => {
  try {
    const { shopId, productId } = req.params;

    const cart = await Cart.findOne({
      customer: req.user.id,
      shop: shopId,
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await cart.populate("items.product");
    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   🔹 UPDATE CART QUANTITY
================================================= */
export const updateCartQuantity = async (req, res) => {
  try {
    const { shopId, productId } = req.params;
    const { action } = req.body;

    const cart = await Cart.findOne({
      customer: req.user.id,
      shop: shopId,
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.json(cart);
    }

    if (action === "increase") {
      item.quantity += 1;
    }

    if (action === "decrease") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.product.toString() !== productId
        );
      }
    }

    await cart.save();

    const updatedCart = await cart.populate("items.product");
    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};