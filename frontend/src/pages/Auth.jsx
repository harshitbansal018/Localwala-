import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 LOADING STATE

  // =========================
  // ✅ VALIDATION
  // =========================
  const validateForm = () => {
    if (!isLogin) {
      if (name.trim().length < 3) {
        alert("Name must be at least 3 characters");
        return false;
      }

      if (shopName.trim().length < 3) {
        alert("Shop name must be at least 3 characters");
        return false;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits");
        return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  // =========================
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // 🔥 START LOADING

    try {
      const url = isLogin
        ? "  http://localhost:5000/api/auth/login"
        : "  http://localhost:5000/api/auth/signup";

      const bodyData = isLogin
        ? { email, password }
        : {
          name,
          shopName,
          email,
          password,
          phone,
          upiId,
          role: "shopkeeper",
          plan: "Basic",
        };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            shopName: data.shopName,
          })
        );

        navigate("/dashboard");
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false); // 🔥 STOP LOADING ALWAYS
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Shopkeeper Login" : "Shopkeeper Signup"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
  <input
    type="text"
    placeholder="Enter UPI ID (e.g. 9876543210@paytm)"
    value={upiId}
    onChange={(e) => setUpiId(e.target.value)}
  />
)}

          {/* 🔥 BUTTON WITH LOADING */}
          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : isLogin ? (
              "Login"
            ) : (
              "Signup"
            )}
          </button>
        </form>

        <p
          className="toggle-text"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default Auth;