import React from "react";
import { Helmet } from "react-helmet";
import "./About_us.css";

function About() {
  return (
    <>
      {/* 🔥 SEO META TAGS */}
      <Helmet>
        <title>About Localwala - Empowering Local Businesses</title>

        <meta
          name="description"
          content="Learn about Localwala, a platform helping local shopkeepers bring their businesses online with ease and grow digitally."
        />

        <meta
          name="keywords"
          content="Localwala, about Localwala, local business platform, online shop for local vendors"
        />

        <meta name="author" content="Localwala" />

        {/* Open Graph (Social Sharing) */}
        <meta property="og:title" content="About Localwala" />
        <meta
          property="og:description"
          content="Empowering local shopkeepers to build their online presence easily."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="about-container">

        {/* 🔥 HERO */}
        <section className="about-hero">
          <h1>From Streets to Screens — Bringing Local Shops Online.</h1>
          <p>
            Empowering local shopkeepers to create their digital presence effortlessly,
            with zero technical knowledge.
          </p>
        </section>

        {/* 🏪 ABOUT CARD */}
        <section className="about-card big-card">
          <h2>What is LocalWala?</h2>
          <p>
            LocalWala is a platform designed to uplift local shopkeepers by helping them
            bring their businesses online. We simplify technology so anyone can build
            and manage their digital store.
          </p>
        </section>

        {/* 🚀 MISSION + VISION */}
        <section className="card-grid">
          <div className="about-card">
            <h3>🚀 Our Mission</h3>
            <p>
              To make digital tools simple, accessible, and powerful for every local business.
            </p>
          </div>

          <div className="about-card">
            <h3>❤️ Our Vision</h3>
            <p>
              A future where every local shop thrives both offline and online.
            </p>
          </div>
        </section>

        {/* 💡 FEATURES */}
        <section className="about-section">
          <h2>What We Offer</h2>

          <div className="card-grid">
            <div className="feature-card">
              <h4>🛍️ Easy Shop Creation</h4>
              <p>Create your store in minutes without coding.</p>
            </div>

            <div className="feature-card">
              <h4>📦 Order Management</h4>
              <p>Manage orders efficiently in one place.</p>
            </div>

            <div className="feature-card">
              <h4>🚚 Flexible Delivery</h4>
              <p>Delivery or self-pickup options.</p>
            </div>

            <div className="feature-card">
              <h4>📸 Product Showcase</h4>
              <p>Upload products with images easily.</p>
            </div>
          </div>
        </section>

        {/* 👤 STORY CARD */}
        <section className="about-card big-card">
          <h2>Our Story</h2>
          <p>
            LocalWala was created to solve real-world problems faced by small shopkeepers.
            We aim to make digital transformation simple, accessible, and impactful.
          </p>
        </section>

      </div>
    </>
  );
}

export default About;