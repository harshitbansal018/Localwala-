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

<<<<<<< HEAD
  const [shopInfo, setShopInfo] = useState(null);

=======
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  const images = [
    "/images/shop_layout1.jpg",
    "/images/shop_layout2.jpg",
  ];

<<<<<<< HEAD
  // CUSTOMER
=======
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("customer"));
    setCustomer(stored);
  }, []);

<<<<<<< HEAD
  // CART
=======
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`cart_${slug}`)) || [];
    setCart(stored);
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`cart_${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

<<<<<<< HEAD
  // HERO SLIDER
=======
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

<<<<<<< HEAD
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

=======
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
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
<<<<<<< HEAD

      {/* NAVBAR */}
=======
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
      <nav className="shop-navbar">
        <Link to={`/shop/${slug}`} className="shop-logo" onClick={closeNav}>
          {formattedName}
        </Link>

        <button
          className="shop-nav-toggle"
          onClick={() => setNavOpen(!navOpen)}
<<<<<<< HEAD
=======
          aria-label="Menu"
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
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
<<<<<<< HEAD
            onClick={() => {
              navigate(`/shop/${slug}/cart`);
              closeNav();
            }}
          >
            🛒 {cart.length}
=======
            onClick={() => { navigate(`/shop/${slug}/cart`); closeNav(); }}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cart.length}</span>
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
          </button>

          {customer ? (
            <>
              <span className="customer-badge">👤 {customer.name}</span>
              <button className="shop-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
<<<<<<< HEAD
            <Link
              to={`/shop/${slug}/login`}
              className="shop-login-link"
              onClick={closeNav}
            >
=======
            <Link to={`/shop/${slug}/login`} className="shop-login-link" onClick={closeNav}>
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
              Login / Signup
            </Link>
          )}
        </div>
      </nav>

<<<<<<< HEAD
      {/* HERO */}
=======
      <div
        className={`shop-nav-overlay ${navOpen ? "active" : ""}`}
        onClick={closeNav}
        aria-hidden="true"
      />

>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
      <div className="shop-hero">
        {images.map((img, i) => (
          <div
            key={i}
            className={`shop-hero-slide ${i === current ? "active" : ""}`}
          >
            <img src={img} alt="" />
          </div>
        ))}
<<<<<<< HEAD

        <div className="shop-hero-overlay">
          <h1>Welcome to {formattedName}</h1>
          <p>Explore our collection & order with ease</p>

          <Link
            to={`/shop/${slug}/products`}
            className="shop-hero-cta"
          >
=======
        <div className="shop-hero-overlay">
          <h1>Welcome to {formattedName}</h1>
          <p>Explore our collection & order with ease</p>
          <Link to={`/shop/${slug}/products`} className="shop-hero-cta">
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
            Shop Now
          </Link>
        </div>
      </div>

<<<<<<< HEAD
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

=======
      <main className="shop-main">
        <Outlet context={{ cart, setCart, setCustomer }} />
      </main>
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
    </div>
  );
}

<<<<<<< HEAD
export default ShopLayout;
=======
export default ShopLayout;
>>>>>>> 427a94c66a5b8d53eaef84850350b598f71814e0
