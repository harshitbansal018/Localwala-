import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const images = [
    "/images/shop1.jpg",
    "/images/shop2.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <>
      {/* 🔥 SEO META TAGS */}
      <Helmet>
        <title>Localwala - Create Your Own Online Shop</title>

        <meta
          name="description"
          content="Localwala helps you create your own online shop easily. Sell products locally, manage orders, and grow your business."
        />

        <meta
          name="keywords"
          content="Localwala, online shop, create shop, local business, ecommerce platform"
        />

        <meta name="author" content="Localwala" />

        {/* Open Graph (for sharing) */}
        <meta property="og:title" content="Localwala - Start Your Own Shop" />
        <meta
          property="og:description"
          content="Create your own online shop and start selling today with Localwala."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div
        className="home-slider"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        <div className="overlay">
          <h1>Create Your Own Shop</h1>
          <p>Start Selling Online with LOCALWALA</p>
          <button className="home-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;