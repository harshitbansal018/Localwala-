import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./CustomerAuth.css";

function CustomerAuth() {
const outletContext = useOutletContext();
const setCustomer = outletContext?.setCustomer;

const [isLogin, setIsLogin] = useState(true);
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

try {
  const url = isLogin
    ? "https://localwala-1.onrender.com/api/customer-auth/login"
    : "https://localwala-1.onrender.com/api/customer-auth/signup";

  const bodyData = isLogin
    ? { email, password }
    : { name, phone, email, password };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Something went wrong");
    setLoading(false);
    return;
  }

  if (isLogin) {
    localStorage.setItem("customerToken", data.token);

    localStorage.setItem(
      "customer",
      JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone
      })
    );

    if (setCustomer) {
      setCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone
      });
    }

  } else {
    alert("Signup successful! Please login.");
    setIsLogin(true);
  }

} catch (error) {
  console.error("Customer Auth Error:", error);
  alert("Something went wrong");
}

setLoading(false);


};

return ( <div className="customer-auth-wrap"> <div className="customer-auth-card">


    <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

    <p className="customer-auth-subtitle">
      {isLogin
        ? "Login to add items to cart"
        : "Sign up to start shopping"}
    </p>

    <form onSubmit={handleSubmit} className="customer-auth-form">

      {!isLogin && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]{10}"
            title="Enter 10 digit phone number"
            required
          />
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading
          ? "Please wait..."
          : isLogin
          ? "Login"
          : "Sign Up"}
      </button>

    </form>

    <p
      className="customer-auth-toggle"
      onClick={() => !loading && setIsLogin(!isLogin)}
    >
      {isLogin
        ? "Don't have an account? Sign up"
        : "Already have an account? Login"}
    </p>

  </div>
</div>


);
}

export default CustomerAuth;
