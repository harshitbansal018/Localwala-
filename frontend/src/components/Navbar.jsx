import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
const [user, setUser] = useState(null);
const navigate = useNavigate();

// Load user from localStorage
useEffect(() => {
const storedUser = localStorage.getItem("user");
if (storedUser) {
setUser(JSON.parse(storedUser));
}
}, []);

// Logout Function
const handleLogout = () => {
localStorage.removeItem("user");
localStorage.removeItem("token");
localStorage.removeItem("role");
setUser(null);
navigate("/auth");

};

return ( <nav className="navbar"> <div className="logo">LOCALWALA</div>

  <ul className="nav-links">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/services">Services</Link></li>
    <li><Link to="/contact">Contact</Link></li>
<li><Link to="/dashboard">Dashboard</Link></li>

    {!user ? (
      <li>
        <Link to="/auth">Signup / Login</Link>
      </li>
    ) : (
      <>
        <li className="profile-name">
          👤 {user.name}
        </li>

        {user.role === "shopkeeper" && (
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}

        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </>
    )}
  </ul>
</nav>


);
}

export default Navbar;
