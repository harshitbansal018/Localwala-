import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DeliveryForm.css";

function DeliveryForm() {
<<<<<<< HEAD
=======

>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  const { slug } = useParams();
  const navigate = useNavigate();

  const [shopId, setShopId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
<<<<<<< HEAD
    pincode: ""
  });

  const token = localStorage.getItem("customerToken");
  // FETCH SHOP
=======
    pincode: "",
    paymentMethod: "cod"
  });

  const token = localStorage.getItem("customerToken");

  // ==========================
  // FETCH SHOP
  // ==========================

>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
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
<<<<<<< HEAD
  // HANDLE INPUT
=======


  // ==========================
  // HANDLE INPUT
  // ==========================

>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };
<<<<<<< HEAD
  // VALIDATION FUNCTION
  const validateForm = () => {

    if (!formData.name.trim()) {
      alert("Please enter your name");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }

    if (formData.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return false;
    }

    if (!formData.address.trim()) {
      alert("Please enter your address");
      return false;
    }

    if (!formData.city.trim()) {
      alert("Please enter your city");
      return false;
    }

    if (!formData.state.trim()) {
      alert("Please enter your state");
      return false;
    }

    if (!formData.pincode.trim()) {
      alert("Please enter your pincode");
      return false;
    }

    if (formData.pincode.length !== 6) {
      alert("Pincode must be 6 digits");
      return false;
    }

    return true;

  };
  // SAVE ORDER
  const saveOrder = async () => {
=======


  // ==========================
  // SAVE ORDER FUNCTION
  // ==========================

  const saveOrder = async (paymentStatus, paymentId = null) => {
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0

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
<<<<<<< HEAD
          paymentMethod: "cod",
          paymentStatus: "COD - Not Paid"
=======
          paymentMethod: formData.paymentMethod,
          paymentStatus,
          paymentId
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
        }),
      }
    );

    if (!res.ok) {
<<<<<<< HEAD
      alert("Order failed");
      return;
=======

      alert("Order failed");
      return;

>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
    }

    alert("Order Placed Successfully!");

    localStorage.removeItem("cartItems");

    navigate(`/shop/${slug}/track`);

  };

<<<<<<< HEAD
  // PLACE ORDER
=======

  // ==========================
  // PLACE ORDER
  // ==========================

>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  const placeOrder = async () => {

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!shopId) {
      alert("Shop not loaded yet");
      return;
    }

<<<<<<< HEAD
    if (!validateForm()) {
      return;
    }

    await saveOrder();

  };
=======
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



>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  return (

    <div className="delivery-container">

      <div className="delivery-box">

        <h2>Delivery Address</h2>

        <div className="delivery-form">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
<<<<<<< HEAD
            value={formData.name}
            onChange={handleChange}
=======
            onChange={handleChange}
            required
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
<<<<<<< HEAD
            value={formData.phone}
            onChange={handleChange}
=======
            onChange={handleChange}
            required
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          />

          <textarea
            name="address"
            placeholder="Full Address"
<<<<<<< HEAD
            value={formData.address}
            onChange={handleChange}
=======
            onChange={handleChange}
            required
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          />

          <input
            type="text"
            name="city"
            placeholder="City"
<<<<<<< HEAD
            value={formData.city}
            onChange={handleChange}
=======
            onChange={handleChange}
            required
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          />

          <input
            type="text"
            name="state"
            placeholder="State"
<<<<<<< HEAD
            value={formData.state}
            onChange={handleChange}
=======
            onChange={handleChange}
            required
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
<<<<<<< HEAD
            value={formData.pincode}
            onChange={handleChange}
          />

=======
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



>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          <button
            className="place-order-btn"
            onClick={placeOrder}
          >
<<<<<<< HEAD
            Place Order (Cash on Delivery)
=======
            Place Order
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          </button>

        </div>

      </div>

    </div>

  );
}

export default DeliveryForm;