import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* =========================
     🔥 LOAD USER + CHECK TOKEN
  ========================= */
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      let token =
        localStorage.getItem("shopkeeperToken") ||
        localStorage.getItem("customerToken");

      if (!token) {
        token = localStorage.getItem("token"); // fallback
      }

      if (!storedUser || !token) {
        setUser(null);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000;

        // 🔥 Check expiry
        if (Date.now() > expiryTime) {
          // Token expired → clear everything
          localStorage.removeItem("user");
          localStorage.removeItem("shopkeeperToken");
          localStorage.removeItem("customerToken");
          localStorage.removeItem("token");

          setUser(null);
          return;
        }

        // ✅ Token valid → set user
        const parsedUser = JSON.parse(storedUser);

        setUser({
          ...parsedUser,
          role: parsedUser.role || (parsedUser.shopName ? "shopkeeper" : "customer")
        });
      } catch (error) {
        console.error("Invalid token:", error);

        // Invalid token → clear
        localStorage.removeItem("user");
        localStorage.removeItem("shopkeeperToken");
        localStorage.removeItem("customerToken");
        localStorage.removeItem("token");

        setUser(null);
      }
    };

    checkAuth();
    // 🔥 Keep checking every 5 sec
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     🔥 LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("shopkeeperToken");
    localStorage.removeItem("customerToken");
    localStorage.removeItem("token");

    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="logo">LOCALWALA</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {!user ? (
          <li>
            <Link to="/auth">Signup / Login</Link>
          </li>
        ) : (
          <>
            <li className="profile-name">
              👤 {user.name}
            </li>

            {(user.role === "shopkeeper" || user.shopName) && (
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