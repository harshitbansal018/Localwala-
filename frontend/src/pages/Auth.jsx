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

const handleSubmit = async (e) => {
e.preventDefault();


try {

  const url = isLogin
    ? "http://localhost:5000/api/auth/login"
    : "http://localhost:5000/api/auth/signup";

  const bodyData = isLogin
    ? { email, password }
    : {
        name,
        shopName,
        email,
        password,
        phone,
        role: "shopkeeper",
        plan: "Basic"
      };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyData)
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
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
        shopName: data.shopName
      })
    );

    navigate("/dashboard");

  } else {
    alert("Signup successful! Please login.");
    setIsLogin(true);
  }

} catch (error) {
  console.error("Error:", error);
}


};

return ( <div className="auth-container">


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
            required
          />

          <input
            type="text"
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
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

      <button type="submit">
        {isLogin ? "Login" : "Signup"}
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
