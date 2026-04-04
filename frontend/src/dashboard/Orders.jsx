import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchOrders = async () => {
      try {

        const res = await fetch(
          "http://localhost:5000/api/orders/shopkeeper",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        }

      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchOrders();

  }, [token]);



  const updateStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await res.json(); // 👈 ADD THIS

    if (!res.ok) {
      console.error("Backend Error:", data.message); // 👈 SHOW ERROR
      alert(data.message); // 👈 OPTIONAL
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

  } catch (error) {
    console.error("Frontend Error:", error);
  }
};


  if (loading) return <p>Loading orders...</p>;



  return (
    <div className="orders-container">

      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (

        orders.map((order) => (

          <div key={order._id} className="order-card">

            <h4>Customer: {order.customer?.name || "—"}</h4>

            <p>Email: {order.customer?.email || "—"}</p>

            <p>Total: ₹ {order.total}</p>

            <p>
              Order Type:
              <strong>
                {order.orderType === "delivery" ? " Delivery" : " Self Pickup"}
              </strong>
            </p>

            <p>Status: <strong>{order.status}</strong></p>


            {/* SHOW ADDRESS ONLY IF DELIVERY */}

            {order.orderType === "delivery" && order.deliveryAddress && (

              <div className="delivery-address">

                <h4>Delivery Address</h4>

                <p><b>Name:</b> {order.deliveryAddress.name}</p>

                <p><b>Phone:</b> {order.deliveryAddress.phone}</p>

                <p><b>Address:</b> {order.deliveryAddress.address}</p>

                <p>
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state}
                </p>

                <p>Pincode: {order.deliveryAddress.pincode}</p>

              </div>

            )}


            {/* ORDER ITEMS */}

            <div className="order-items">

              <h4>Items</h4>

              {order.items.map((item, index) => (

                <p key={index}>
                  {item.name} × {item.quantity} — ₹ {item.price}
                </p>

              ))}

            </div>
            <div className="order-actions">

              <button
                onClick={() => updateStatus(order._id, "Processing")}
              >
                Processing
              </button>

              <button
                onClick={() => updateStatus(order._id, "Shipped")}
              >
                Shipped
              </button>

              <button
                onClick={() => updateStatus(order._id, "Delivered")}
              >
                Delivered
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default Orders;