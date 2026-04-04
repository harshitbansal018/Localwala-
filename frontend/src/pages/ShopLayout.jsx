import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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

  /* =========================
     🔥 CUSTOMER + TOKEN CHECK
  ========================= */
  useEffect(() => {
    let logoutTimer;

    const checkCustomerAuth = () => {
      const storedCustomer = localStorage.getItem("customer");
      const token = localStorage.getItem("customerToken");

      if (!storedCustomer || !token) {
        setCustomer(null);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();

        const timeLeft = expiryTime - currentTime;

        console.log("🛒 Customer time left:", timeLeft);

        // 🔥 If expired
        if (timeLeft <= 0) {
          localStorage.removeItem("customer");
          localStorage.removeItem("customerToken");
          setCustomer(null);
          return;
        }

        // ✅ Token valid
        setCustomer(JSON.parse(storedCustomer));

        // 🔥 Auto logout timer
        logoutTimer = setTimeout(() => {
          localStorage.removeItem("customer");
          localStorage.removeItem("customerToken");
          setCustomer(null);
        }, Math.min(timeLeft, 2147483647));

      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("customer");
        localStorage.removeItem("customerToken");
        setCustomer(null);
      }
    };

    checkCustomerAuth();

    // 🔥 Backup interval
    const interval = setInterval(checkCustomerAuth, 5000);

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      clearInterval(interval);
    };
  }, []);

  /* =========================
     🛒 CART
  ========================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`cart_${slug}`)) || [];
    setCart(stored);
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`cart_${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  /* =========================
     🎞 HERO SLIDER
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* =========================
     📦 FETCH SHOP INFO
  ========================= */
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(
          `https://localwala-1.onrender.com/api/shops/slug/${slug}`
        );
        const data = await res.json();
        setShopInfo(data);
      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };

    fetchShop();
  }, [slug]);

  /* =========================
     🔓 LOGOUT
  ========================= */
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

      {/* MAIN */}
      <main className="shop-main">
        <Outlet context={{ cart, setCart, setCustomer }} />
      </main>

      {/* FOOTER */}
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
         <p className="footer-copy">
         Powered by LocalWala 
        </p>

      </footer>

    </div>
  );
}

export default ShopLayout;