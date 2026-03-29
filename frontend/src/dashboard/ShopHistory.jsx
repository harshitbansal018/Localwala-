import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopHistory.css";

function ShopHistory() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔥 Fetch Shops From Backend
  const fetchShops = async () => {
    try {
      const res = await fetch(
        "https://localwala-1.onrender.com/api/shops/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setShops(data);

    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // 🔥 Delete Shop From Database
  const handleDeleteShop = async (shopId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shop?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `https://localwala-1.onrender.com/api/shops/${shopId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchShops();

    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  return (
    <div className="shop-history-container">
      <h2>My Shop History</h2>

      {shops.length === 0 ? (
        <p>No shops created yet.</p>
      ) : (
        shops.map((shop) => (
          <div key={shop._id} className="shop-card">
            <h3>{shop.name}</h3>

            <p>
              <strong>Public Link:</strong>{" "}
              <a
                href={`https://localwala.vercel.app/shop/${shop.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                View Shop
              </a>
            </p>

            <div className="shop-actions">
              <button
                className="manage-btn"
                onClick={() =>
                  navigate(`/dashboard/manage/${shop._id}`)
                }
              >
                Manage Shop
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDeleteShop(shop._id)
                }
              >
                Delete Shop
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ShopHistory;
