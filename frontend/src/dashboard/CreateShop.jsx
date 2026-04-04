import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateShop.css";

function CreateShop() {
  const [shopName, setShopName] = useState("");
  const navigate = useNavigate();

  const handleCreateShop = async () => {
    if (!shopName) {
      alert("Enter shop name");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must login first");
      return;
    }

    try {
      const response = await fetch(
        "https://localwala-1.onrender.com/api/shops",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: shopName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setShopName("");
      navigate("/dashboard/history");

    } catch (error) {
      console.error("Error creating shop:", error);
    }
  };

  return (
    <div className="create-shop-container">
      <h2>Create New Shop</h2>

      <input
        type="text"
        placeholder="Enter Shop Name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
      />

      <button onClick={handleCreateShop}>
        Create Shop
      </button>
    </div>
  );
}

export default CreateShop;
