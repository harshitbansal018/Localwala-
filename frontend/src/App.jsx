import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

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
function AppWrapper() {
  const location = useLocation();

  // Hide main navbar on all /shop pages
  const hideNavbar = location.pathname.startsWith("/shop");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ===== MAIN WEBSITE ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/*" element={<Dashboard />} />

       <Route path="/shop/:slug" element={<ShopLayout />}>

  {/* Shop Home Page */}
  <Route index element={<ShopHome />} />

  {/* All Products */}
  <Route path="products" element={<ShopProducts />} />

  {/* Filter by Catalog */}
  <Route path="catalog/:catalogId" element={<CatalogProducts />} />

  {/* Cart */}
  <Route path="cart" element={<Cart />} />

  {/* Customer Login */}
  <Route path="login" element={<CustomerAuth />} />

  {/* Order Tracking */}
  <Route path="track" element={<OrderTracking />} />

  {/* Delivery Form */}
  <Route path="delivery" element={<DeliveryForm />} />

</Route>

      </Routes>
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
