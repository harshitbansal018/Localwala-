import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import Dashboard from "./dashboard/Dashboard";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import ShopLayout from "./pages/ShopLayout";
import ShopHome from "./pages/ShopHome";
import ShopProducts from "./pages/ShopProducts";
import CatalogProducts from "./pages/CatalogProducts";
import CustomerAuth from "./pages/CustomerAuth";
import OrderTracking from "./pages/OrderTracking";
import DeliveryForm from "./pages/DeliveryForm";
import Footer from "./components/Footer";
import About_us from "./components/About_us";

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRedirecting = useRef(false);

  const path = location.pathname;


  // 🔥 ROLE DETECTION
  const isShopRoute = path.startsWith("/shop");
  const isDashboardRoute = path.startsWith("/dashboard");

  const hideNavbar = isShopRoute;

  useEffect(() => {
    const logout = (role) => {
      if (isRedirecting.current) return;
      isRedirecting.current = true;

      if (role === "shopkeeper") {
        localStorage.removeItem("shopkeeperToken");
        alert("Shopkeeper session expired. Please login again.");
        navigate("/auth", { replace: true });
      } else {
        localStorage.removeItem("customerToken");
        alert("Customer session expired. Please login again.");
        navigate("/shop/login", { replace: true });
      }
    };

    const checkToken = (tokenKey, role) => {
      const token = localStorage.getItem(tokenKey);
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000;
        const timeLeft = expiryTime - Date.now();

        console.log(`${role} time left:`, timeLeft);

        if (timeLeft <= 0) {
          logout(role);
          return;
        }

        return setTimeout(
          () => logout(role),
          Math.min(timeLeft, 2147483647)
        );
      } catch {
        logout(role);
      }
    };

    let timer;

    // ✅ 🔥 ONLY ONE ROLE RUNS (MAIN FIX)
    if (isDashboardRoute) {
      timer = checkToken("shopkeeperToken", "shopkeeper");
    } else if (isShopRoute) {
      timer = checkToken("customerToken", "customer");
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [path]);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ===== MAIN WEBSITE ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About_us />} />

        {/* ===== DASHBOARD (SHOPKEEPER) ===== */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* ===== SHOP ROUTES (CUSTOMER) ===== */}
        <Route path="/shop/:slug" element={<ShopLayout />}>
          <Route index element={<ShopHome />} />
          <Route path="products" element={<ShopProducts />} />
          <Route path="catalog/:catalogId" element={<CatalogProducts />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<CustomerAuth />} />
          <Route path="track" element={<OrderTracking />} />
          <Route path="delivery" element={<DeliveryForm />} />
        </Route>
  
      </Routes>
       {!isShopRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;