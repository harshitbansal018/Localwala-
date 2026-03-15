import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import CreateShop from "./CreateShop";
import Orders from "./Orders";
import Analytics from "./Analytics";
import ShopHistory from "./ShopHistory";
import ManageShop from "./ManageShop";
import Plans from "./Plans";

function Dashboard() {
const [sidebarOpen, setSidebarOpen] = useState(false);

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Protect dashboard route
if (!token || role !== "shopkeeper") {
return <Navigate to="/auth" />;
}

const closeSidebar = () => setSidebarOpen(false);

return ( <div className="dashboard-container">
{/* Sidebar Toggle Button */}
<button
className="sidebar-toggle"
onClick={() => setSidebarOpen(!sidebarOpen)}
aria-label="Toggle menu"
> <span></span> <span></span> <span></span> </button>


  {/* Overlay for mobile */}
  <div
    className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
    onClick={closeSidebar}
    aria-hidden="true"
  />

  {/* Sidebar */}
  <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

  {/* Dashboard Content */}
  <div className="dashboard-content">
    <div className="dashboard-header">
      <h2>Shopkeeper Dashboard</h2>
    </div>

    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route index element={<CreateShop />} />
      <Route path="create" element={<CreateShop />} />
      <Route path="history" element={<ShopHistory />} />
      <Route path="plans" element={<Plans />} />
      <Route path="manage/:shopId" element={<ManageShop />} />
      <Route path="orders" element={<Orders />} />
      <Route path="analytics" element={<Analytics />} />
    </Routes>
  </div>
</div>
);
}

export default Dashboard;
