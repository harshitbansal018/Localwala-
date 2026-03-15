import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ShopLayout.css";

function ShopLayout() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [current, setCurrent] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const images = [
    "/images/shop_layout1.jpg",
    "/images/shop_layout2.jpg",
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("customer"));
    setCustomer(stored);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`cart_${slug}`)) || [];
    setCart(stored);
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`cart_${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    setCustomer(null);
    setNavOpen(false);
  };

  const formattedName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const closeNav = () => setNavOpen(false);

  return (
    <div className="shop-layout">
      <nav className="shop-navbar">
        <Link to={`/shop/${slug}`} className="shop-logo" onClick={closeNav}>
          {formattedName}
        </Link>

        <button
          className="shop-nav-toggle"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Menu"
        >
          <span className={navOpen ? "open" : ""}></span>
          <span className={navOpen ? "open" : ""}></span>
          <span className={navOpen ? "open" : ""}></span>
        </button>

        <div className={`shop-nav-links ${navOpen ? "open" : ""}`}>
          <Link to={`/shop/${slug}`} onClick={closeNav}>Home</Link>
          <Link to={`/shop/${slug}/products`} onClick={closeNav}>Products</Link>
          <Link to={`/shop/${slug}/track`} onClick={closeNav}>Track Order</Link>

          <button
            className="shop-cart-btn"
            onClick={() => { navigate(`/shop/${slug}/cart`); closeNav(); }}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cart.length}</span>
          </button>

          {customer ? (
            <>
              <span className="customer-badge">👤 {customer.name}</span>
              <button className="shop-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to={`/shop/${slug}/login`} className="shop-login-link" onClick={closeNav}>
              Login / Signup
            </Link>
          )}
        </div>
      </nav>

      <div
        className={`shop-nav-overlay ${navOpen ? "active" : ""}`}
        onClick={closeNav}
        aria-hidden="true"
      />

      <div className="shop-hero">
        {images.map((img, i) => (
          <div
            key={i}
            className={`shop-hero-slide ${i === current ? "active" : ""}`}
          >
            <img src={img} alt="" />
          </div>
        ))}
        <div className="shop-hero-overlay">
          <h1>Welcome to {formattedName}</h1>
          <p>Explore our collection & order with ease</p>
          <Link to={`/shop/${slug}/products`} className="shop-hero-cta">
            Shop Now
          </Link>
        </div>
      </div>

      <main className="shop-main">
        <Outlet context={{ cart, setCart, setCustomer }} />
      </main>
    </div>
  );
}

export default ShopLayout;
