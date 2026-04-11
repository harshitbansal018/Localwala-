import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DeliveryForm.css";

function DeliveryForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [shopId, setShopId] = useState(null);
  const [shopPhone, setShopPhone] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const token = localStorage.getItem("customerToken");

  // =========================
  // FETCH SHOP DATA
  // =========================
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(
          `https://localwala-1.onrender.com/api/shops/slug/${slug}`
        );

        const data = await res.json();

        setShopId(data._id);
        setShopPhone(data.owner?.phone);

      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
  }, [slug]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Enter name");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Enter valid 10-digit phone");
      return false;
    }

    if (!formData.address.trim()) {
      alert("Enter address");
      return false;
    }

    if (!formData.city.trim()) {
      alert("Enter city");
      return false;
    }

    if (!formData.state.trim()) {
      alert("Enter state");
      return false;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      alert("Enter valid pincode");
      return false;
    }

    return true;
  };

  // =========================
  // SAVE ORDER
  // =========================
  const saveOrder = async () => {
    const cartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    const orderItems = cartItems
      .filter((item) => item.product)
      .map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

    const total = cartItems.reduce(
      (sum, item) =>
        item.product
          ? sum + item.product.price * item.quantity
          : sum,
      0
    );

    const res = await fetch("https://localwala-1.onrender.com/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shopId,
        items: orderItems,
        total,
        orderType: "delivery",
        deliveryAddress: formData,
        paymentMethod: "pending",   // ✅ generic
        paymentStatus: "Pending"
      }),
    });

    if (!res.ok) {
      alert("Order failed");
      return null;
    }

    return total;
  };

  // =========================
  // WHATSAPP MESSAGE (UPDATED)
  // =========================
  const sendToWhatsApp = (total) => {
    const cartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    let message = `🛒 *New Order*\n\n`;

    cartItems.forEach((item, index) => {
      if (item.product) {
        message += `${index + 1}. ${item.product.name} x ${
          item.quantity
        } = ₹${item.product.price * item.quantity}\n`;
      }
    });

    message += `\n💰 *Total:* ₹${total}\n\n`;

    message += `📍 *Delivery Address:*\n`;
    message += `${formData.name}\n${formData.phone}\n`;
    message += `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

    // 🔥 NEW LINE FOR QR REQUEST
    message += `\n\n💳 *Please share your UPI QR code for payment.*`;

    const encodedMessage = encodeURIComponent(message);

    const whatsappURL = `https://wa.me/91${shopPhone}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    if (!shopId) {
      alert("Shop not loaded yet");
      return;
    }

    if (!validateForm()) return;

    const total = await saveOrder();
    if (!total) return;

    // ✅ ALERT
    alert("Order placed successfully! Shopkeeper will contact you.");

    // ✅ WHATSAPP REDIRECT
    sendToWhatsApp(total);

    localStorage.removeItem("cartItems");

    navigate(`/shop/${slug}/track`);
  };

  return (
    <div className="delivery-container">
      <div className="delivery-box">
        <h2>Delivery Address</h2>

        <div className="delivery-form">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />

          {/* ✅ BUTTON TEXT UPDATED */}
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryForm;