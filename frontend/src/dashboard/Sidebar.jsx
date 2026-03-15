import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const handleNav = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2>LOCALWALA</h2>
      <nav className="sidebar-nav">
        <Link to="/dashboard" onClick={handleNav}>Create Shop</Link>
        <Link to="/dashboard/history" onClick={handleNav}>Shop History</Link>
        <Link to="/dashboard/plans" onClick={handleNav}>Upgrade Plan</Link>
        <Link to="/dashboard/orders" onClick={handleNav}>Orders</Link>
        <Link to="/dashboard/analytics" onClick={handleNav}>Sales Analytics</Link>
      </nav>
    </aside>
  );
}


export default Sidebar;
