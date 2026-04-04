import React from "react";
import "./About_us.css";

function About() {
  return (
    <div className="about-container">

      {/* 🔥 HERO SECTION */}
      <section className="about-hero">
        <h1>From Streets to Screens — Bringing Local Shops Online.</h1>
        <p>
          Empowering local shopkeepers to create their digital presence effortlessly,
          with zero technical knowledge.
        </p>
      </section>

      {/* 🏪 ABOUT SECTION */}
      <section className="about-section">
        <h2>What is LocalWala?</h2>
        <p>
          LocalWala is a platform designed to uplift local shopkeepers by helping them
          bring their businesses online. We understand that many small business owners
          struggle with technology, and our goal is to simplify the entire process.
        </p>
        <p>
          With LocalWala, anyone can create an online shop, upload products, manage
          orders, and connect with customers — all without any technical expertise.
        </p>
      </section>

      {/* 🚀 MISSION + VISION */}
      <section className="about-grid">
        <div className="about-card">
          <h3>🚀 Our Mission</h3>
          <p>
            To empower local businesses by making digital tools simple, accessible,
            and effective for everyone.
          </p>
        </div>

        <div className="about-card">
          <h3>❤️ Our Vision</h3>
          <p>
            To create a future where every local shop is digitally empowered and
            thriving in both offline and online worlds.
          </p>
        </div>
      </section>

      {/* 💡 FEATURES */}
      <section className="about-section">
        <h2>What We Offer</h2>

        <div className="about-features">
          <div className="feature-card">
            <h4>🛍️ Easy Shop Creation</h4>
            <p>Create your online store in minutes without coding.</p>
          </div>

          <div className="feature-card">
            <h4>📦 Order Management</h4>
            <p>Track and manage orders efficiently in one place.</p>
          </div>

          <div className="feature-card">
            <h4>🚚 Flexible Delivery</h4>
            <p>Offer delivery or self-pickup options to customers.</p>
          </div>

          <div className="feature-card">
            <h4>📸 Product Showcase</h4>
            <p>Upload products with images and details easily.</p>
          </div>
        </div>
      </section>

      {/* 👤 STORY */}
      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          LocalWala was built with a vision to solve real-world challenges faced by
          small shopkeepers. Many businesses struggle to go online due to lack of
          technical knowledge. This platform was created to bridge that gap and make
          digital transformation accessible to everyone.
        </p>
      </section>

    </div>
  );
}

export default About;