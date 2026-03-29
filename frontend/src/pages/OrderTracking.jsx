import { useParams } from "react-router-dom";
import { useState } from "react";
import "./OrderTracking.css";

function OrderTracking() {
  const { slug } = useParams();

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleCheck = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const shopRes = await fetch(
        `https://localwala-1.onrender.com/api/shops/slug/${slug}`
      );
      const shopData = await shopRes.json();

      if (!shopRes.ok) {
        alert("Shop not found");
        setOrders([]);
        setLoading(false);
        return;
      }

      const orderRes = await fetch(
        `https://localwala-1.onrender.com/api/orders/shop/${shopData._id}/${email}`
      );
      const orderData = await orderRes.json();

      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    }
    setLoading(false);
  };

  const statusColors = {
    Pending: "#f59e0b",
    Packaging: "#3b82f6",
    Delivered: "#22c55e",
  };

  return (
    <div className="order-tracking-wrap">
      <div className="order-tracking-card">
        <h2>Track Your Order</h2>
        <p className="order-tracking-desc">
          Enter your email to see order status
        </p>

        <div className="order-tracking-input-wrap">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <button onClick={handleCheck} disabled={loading}>
            {loading ? "Checking..." : "Track"}
          </button>
        </div>

        {loading && (
          <div className="order-tracking-loading">
            <div className="loading-spinner"></div>
            <span>Fetching orders...</span>
          </div>
        )}

        {!loading && searched && orders.length === 0 && (
          <div className="order-tracking-empty">
            <span>📭</span>
            <p>No orders found for this email</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="order-tracking-list">
            {orders.map((order) => (
              <div
                key={order._id}
                className="order-tracking-item"
                style={{
                  borderLeftColor: statusColors[order.status] || "#64748b",
                }}
              >
                <div className="order-tracking-item-header">
                  <span className="order-id">
                    #{order._id?.slice(-8)?.toUpperCase()}
                  </span>
                  <span
                    className="order-status"
                    style={{ background: statusColors[order.status] || "#64748b" }}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="order-total">Total: ₹ {order.total}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;
