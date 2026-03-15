import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DeliveryForm.css";

function DeliveryForm() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [shopId, setShopId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod"
  });

  const token = localStorage.getItem("customerToken");

  // ==========================
  // FETCH SHOP
  // ==========================

  useEffect(() => {

    const fetchShop = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/shops/slug/${slug}`
        );

        const data = await res.json();

        setShopId(data._id);

      } catch (error) {

        console.error("Error fetching shop:", error);

      }

    };

    fetchShop();

  }, [slug]);


  // ==========================
  // HANDLE INPUT
  // ==========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // ==========================
  // SAVE ORDER FUNCTION
  // ==========================

  const saveOrder = async (paymentStatus, paymentId = null) => {

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

    const res = await fetch(
      "http://localhost:5000/api/orders",
      {
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
          paymentMethod: formData.paymentMethod,
          paymentStatus,
          paymentId
        }),
      }
    );

    if (!res.ok) {

      alert("Order failed");
      return;

    }

    alert("Order Placed Successfully!");

    localStorage.removeItem("cartItems");

    navigate(`/shop/${slug}/track`);

  };


  // ==========================
  // PLACE ORDER
  // ==========================

  const placeOrder = async () => {

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!shopId) {
      alert("Shop not loaded yet");
      return;
    }

    const cartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    const total = cartItems.reduce(
      (sum, item) =>
        item.product
          ? sum + item.product.price * item.quantity
          : sum,
      0
    );



    // ======================
    // COD FLOW
    // ======================

    if (formData.paymentMethod === "cod") {

      await saveOrder("COD - Not Paid");

      return;

    }



    // ======================
    // RAZORPAY PAYMENT
    // ======================

    try {

      const order = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: total
          })
        }
      );

      const data = await order.json();

      const options = {

        key: "RAZORPAY_KEY_ID",

        amount: data.amount,

        currency: "INR",

        name: "LocalWala",

        description: "Order Payment",

        order_id: data.id,


        handler: async function (response) {

          await saveOrder(
            "Paid",
            response.razorpay_payment_id
          );

        },


        prefill: {
          name: formData.name,
          contact: formData.phone
        },

        theme: {
          color: "#3399cc"
        }

      };

      const rzp = new window.Razorpay(options);

      rzp.open();

    } catch (error) {

      console.error(error);

      alert("Payment failed");

    }

  };



  return (

    <div className="delivery-container">

      <div className="delivery-box">

        <h2>Delivery Address</h2>

        <div className="delivery-form">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
            required
          />


          {/* PAYMENT METHOD */}

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="cod">
              Cash on Delivery
            </option>

            <option value="razorpay">
              Online Payment
            </option>
          </select>



          <button
            className="place-order-btn"
            onClick={placeOrder}
          >
            Place Order
          </button>

        </div>

      </div>

    </div>

  );
}

export default DeliveryForm;