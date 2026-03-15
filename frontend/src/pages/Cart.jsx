import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import "./Cart.css";
import { useNavigate } from "react-router-dom";


function Cart() {
  const { slug } = useParams();
const [showOption, setShowOption] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [shopId, setShopId] = useState(null);

  const { setCart } = useOutletContext();

  const token = localStorage.getItem("customerToken");
const navigate = useNavigate();
  // ==========================
  // 🔹 FETCH SHOP BY SLUG
  // ==========================

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/shops/slug/${slug}`
        );

        if (!res.ok) {
          console.error("Shop not found");
          return;
        }

        const data = await res.json();
        setShopId(data._id);

      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
  }, [slug]);

  // ==========================
  // 🔹 FETCH CART WHEN SHOP READY
  // ==========================
  useEffect(() => {
    if (shopId) {
      fetchCart(shopId);
    }
  }, [shopId]);

  const fetchCart = async (shopId) => {
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/cart/${shopId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setCartItems([]);
        return;
      }

      const data = await res.json();
      const items = data.items || [];
      setCartItems(items);
      setCart(items);

    } catch (error) {
      console.error("Cart fetch error:", error);
      setCartItems([]);
    }
  };

  // ==========================
  // 🔹 REMOVE ITEM (FIXED ROUTE)
  // ==========================
  const handleRemove = async (productId) => {
    if (!shopId) return;

    try {
      await fetch(
        `http://localhost:5000/api/cart/${shopId}/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart(shopId);

    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  // ==========================
  // 🔹 CALCULATE TOTAL
  // ==========================
 const total = cartItems.reduce((sum, item) => {
  if (!item.product) return sum;
  return sum + item.product.price * item.quantity;
}, 0);

  // ==========================
  // 🔹 PLACE ORDER
  // ==========================
 const placeOrder = async (type, address = null) => {

  if (!token) {
    alert("Login first");
    return;
  }

  try {

  const orderItems = cartItems
  .filter((item) => item.product)
  .map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));
   console.log("Sending order:", {
    shopId,
    items: orderItems,
    total,
    orderType: type,
    deliveryAddress: address
  });

    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shopId,
        items: orderItems,
        total,
        orderType: type,
        deliveryAddress: address
      }),
    });

    alert("Order Placed Successfully!");

    setCartItems([]);
    setCart([]);

  } catch (error) {
    console.error("Order error:", error);
  }
};
  const updateQuantity = async (productId, action) => {
    try {
      await fetch(
        `http://localhost:5000/api/cart/${shopId}/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      fetchCart(shopId);

    } catch (error) {
      console.error("Quantity update error:", error);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-icon">🛒</span>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          {cartItems
            .filter((item) => item.product)
            .map((item) => (
              <div key={item.product._id} className="cart-item">

                <img
                  src={`http://localhost:5000${item.product.image}`}
                  alt={item.product.name}
                  className="cart-product-image"
                />
                <div className="cart-item-info">
                  <h4>{item.product.name}</h4>
                  <p>₹ {item.product.price}</p>
                  <div className="qty-controls">
                    <button
                      onClick={() => updateQuantity(item.product._id, "decrease")}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, "increase")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.product._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          <div className="cart-summary">
            <h3>Total: ₹ {total}</h3>
            <button
              className="place-order-btn"
              onClick={() => setShowOption(true)}
            >
              Place Order
            </button>
          </div>
          {showOption && (
  <div className="order-option-modal">
    <div className="order-option-box">
      <h3>Select Order Type</h3>

      <button
        onClick={() => {
          placeOrder("pickup");
        }}
      >
        Self Pickup
      </button>

      <button
        onClick={() => {
         localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );

    navigate(`/shop/${slug}/delivery`);
        }}
      >
        Delivery
      </button>

      <button onClick={() => setShowOption(false)}>
        Cancel
      </button>
    </div>
  </div>
)}
        </>
      )}
    </div>
  );
}

export default Cart;
