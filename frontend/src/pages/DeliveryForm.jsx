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
    pincode: ""
  });

  const token = localStorage.getItem("customerToken");
  // FETCH SHOP
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
  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };
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
          paymentMethod: "cod",
          paymentStatus: "COD - Not Paid"
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

  // PLACE ORDER
  const placeOrder = async () => {

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!shopId) {
      alert("Shop not loaded yet");
      return;
    }

    if (!validateForm()) {
      return;
    }

    await saveOrder();

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
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          <button
            className="place-order-btn"
            onClick={placeOrder}
          >
            Place Order (Cash on Delivery)
          </button>

        </div>

      </div>

    </div>

  );
}

export default DeliveryForm;