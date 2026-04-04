import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DeliveryForm.css";

function DeliveryForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [shopId, setShopId] = useState(null);
  const [upiId, setUpiId] = useState("");
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
          `http://localhost:5000/api/shops/slug/${slug}`
        );

        const data = await res.json();

        console.log("SHOP DATA:", data);

        setShopId(data._id);
        setShopPhone(data.owner?.phone);
        setUpiId(data.owner?.upiId); // 🔥 IMPORTANT

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

    const res = await fetch("http://localhost:5000/api/orders", {
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
        paymentMethod: "upi",
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
  // WHATSAPP MESSAGE
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

    const encodedMessage = encodeURIComponent(message);

    const whatsappURL = `https://wa.me/91${shopPhone}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  // =========================
  // PLACE ORDER (FINAL FLOW)
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

    if (!upiId) {
      alert("Payment not available for this shop");
      return;
    }

    // 🔥 FIXED UPI LINK
    const upiLink = `upi://pay?pa=${upiId.trim()}&pn=${encodeURIComponent(slug)}&am=${total}&cu=INR`;

    // 🔥 OPEN PAYMENT APP FIRST
    window.location.href = upiLink;

    // 🔥 SEND WHATSAPP AFTER DELAY
    setTimeout(() => {
      sendToWhatsApp(total);
    }, 1500);

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

          <button className="place-order-btn" onClick={placeOrder}>
            Place Order (With Payment)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryForm;