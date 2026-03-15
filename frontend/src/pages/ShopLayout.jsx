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

  const [shopInfo, setShopInfo] = useState(null);

  const images = [
    "/images/shop_layout1.jpg",
    "/images/shop_layout2.jpg",
  ];

  // CUSTOMER
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("customer"));
    setCustomer(stored);
  }, []);

  // CART
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`cart_${slug}`)) || [];
    setCart(stored);
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`cart_${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  // HERO SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // FETCH SHOP DETAILS (PHONE + EMAIL)
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/shops/slug/${slug}`
        );
        const data = await res.json();
        setShopInfo(data);
      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };

    fetchShop();
  }, [slug]);

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

      {/* NAVBAR */}
      <nav className="shop-navbar">
        <Link to={`/shop/${slug}`} className="shop-logo" onClick={closeNav}>
          {formattedName}
        </Link>

        <button
          className="shop-nav-toggle"
          onClick={() => setNavOpen(!navOpen)}
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
            onClick={() => {
              navigate(`/shop/${slug}/cart`);
              closeNav();
            }}
          >
            🛒 {cart.length}
          </button>

          {customer ? (
            <>
              <span className="customer-badge">👤 {customer.name}</span>
              <button className="shop-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link
              to={`/shop/${slug}/login`}
              className="shop-login-link"
              onClick={closeNav}
            >
              Login / Signup
            </Link>
          )}
        </div>
      </nav>

      {/* HERO */}
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

          <Link
            to={`/shop/${slug}/products`}
            className="shop-hero-cta"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="shop-main">
        <Outlet context={{ cart, setCart, setCustomer }} />
      </main>

      {/* FOOTER CONTACT */}
      <footer className="shop-footer">

        <h3>Contact Us</h3>

        {shopInfo ? (
          <>
         <p>📞 Phone: {shopInfo.owner?.phone}</p>
<p>✉️ Email: {shopInfo.owner?.email}</p>
          </>
        ) : (
          <p>Loading contact info...</p>
        )}
        <p className="footer-copy">
          © {new Date().getFullYear()} {formattedName}
        </p>

      </footer>

    </div>
  );
}

export default ShopLayout;