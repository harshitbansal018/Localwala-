import "./Services.css";

function Services() {

const phoneNumber = "918591707091"; // Your WhatsApp number
const token = localStorage.getItem("token");

const handlePlanSelect = (planName, price) => {

if (!token) {
  alert("Please login first to select a plan.");
  return;
}

const message = `Hi, I want to purchase the ${planName} plan of LOCALWALA for ${price}. Please guide me for payment.`;

const encodedMessage = encodeURIComponent(message);

const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

window.open(whatsappURL, "_blank");


};

return ( <div className="services-page">


  {/* Services Section */}
  <section className="services-section">
    <h2>Our Services</h2>

    <div className="services-list">

      <div className="service-card">
        <h3>Create Your Online Shop</h3>
        <p>Launch your digital store within minutes and start selling locally.</p>
      </div>

      <div className="service-card">
        <h3>Manage Products Easily</h3>
        <p>Add, edit, and manage products with a simple dashboard interface.</p>
      </div>

      <div className="service-card">
        <h3>Receive Customer Orders</h3>
        <p>Get real-time order notifications and manage them efficiently.</p>
      </div>

      <div className="service-card">
        <h3>Track Sales & Revenue</h3>
        <p>View analytics, sales reports, and business performance insights.</p>
      </div>

    </div>
  </section>


  {/* Membership Plans Section */}
  <section className="plans-section">

    <h2>Membership Plans</h2>

    <div className="plans-container">

      {/* Basic Plan */}
      <div className="plan-card">

        <h3>Basic</h3>
        <h4>₹99 / month</h4>

        <ul>
          <li>✔ Create Shop</li>
          <li>✔ Add up to 10 Products</li>
          <li>✔ Order Management</li>
          <li>✔ Sales Analytics</li>
        </ul>

        <button onClick={() => handlePlanSelect("Basic", "₹99/month")}>
          Select Plan
        </button>

      </div>


      {/* Pro Plan */}
      <div className="plan-card popular">

        <h3>Pro</h3>
        <h4>₹499 / month</h4>

        <ul>
          <li>✔ Create Shop</li>
          <li>✔ Add up to 30 Products</li>
          <li>✔ Order Management</li>
          <li>✔ Basic Sales Analytics</li>
        </ul>

        <button onClick={() => handlePlanSelect("Pro", "₹499/month")}>
          Select Plan
        </button>

      </div>


      {/* Premium Plan */}
      <div className="plan-card">

        <h3>Premium</h3>
        <h4>₹999 / month</h4>

        <ul>
          <li>✔ Create Shop</li>
          <li>✔ Unlimited Products</li>
          <li>✔ Advanced Analytics</li>
          <li>✔ Priority Support</li>
        </ul>

        <button onClick={() => handlePlanSelect("Premium", "₹999/month")}>
          Select Plan
        </button>

      </div>

    </div>

  </section>

</div>


);
}

export default Services;
