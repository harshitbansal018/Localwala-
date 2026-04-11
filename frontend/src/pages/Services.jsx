import { Helmet } from "react-helmet";
import "./Services.css";

function Services() {

  const phoneNumber = "918591707091";
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

  return (
    <>
      {/* 🔥 SEO META TAGS */}
      <Helmet>
        <title>Pricing & Services - Localwala</title>

        <meta
          name="description"
          content="Explore Localwala services and pricing plans. Create your online shop, manage products, track sales, and grow your business easily."
        />

        <meta
          name="keywords"
          content="Localwala pricing, ecommerce plans, create online shop pricing, shop subscription plans"
        />

        <meta name="author" content="Localwala" />

        {/* Open Graph */}
        <meta property="og:title" content="Localwala Pricing & Services" />
        <meta
          property="og:description"
          content="Choose the best plan to create and grow your online shop with Localwala."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="services-page">

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

            {/* Basic */}
            <div className="plan-card">
              <h3>Basic</h3>
              <h4>Free</h4>
              <ul>
                <li>✔ Create Shop</li>
                <li>✔ Add up to 10 Products</li>
                <li>✔ Order Management</li>
                <li>✔ Sales Analytics</li>
              </ul>
              <button onClick={() => handlePlanSelect("Basic", "Free")}>
                Select Plan
              </button>
            </div>

            {/* Pro */}
            <div className="plan-card popular">
              <h3>Pro</h3>
              <h4>₹99 / month</h4>
              <ul>
                <li>✔ Create Shop</li>
                <li>✔ Add up to 30 Products</li>
                <li>✔ Order Management</li>
                <li>✔ Basic Sales Analytics</li>
              </ul>
              <button onClick={() => handlePlanSelect("Pro", "₹99/month")}>
                Select Plan
              </button>
            </div>

            {/* Premium */}
            <div className="plan-card">
              <h3>Premium</h3>
              <h4>₹199 / month</h4>
              <ul>
                <li>✔ Create Shop</li>
                <li>✔ Unlimited Products</li>
                <li>✔ Advanced Analytics</li>
                <li>✔ Priority Support</li>
              </ul>
              <button onClick={() => handlePlanSelect("Premium", "₹199/month")}>
                Select Plan
              </button>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}

export default Services;