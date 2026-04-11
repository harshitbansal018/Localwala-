import { useEffect, useState } from "react";
import { ADMIN_WHATSAPP_NUMBER } from "../config";
import "./Plans.css";

function Plans() {
  const [shops, setShops] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("https://localwala-1.onrender.com/api/shops/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setShops(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, [token]);

  const handleWhatsAppUpgrade = (shop, targetPlan) => {
    const message = [
      "Hello, I want to upgrade my shop plan.",
      "",
      `Name: ${user.name || "—"}`,
      `Email: ${user.email || "—"}`,
      `Shop: ${shop.name}`,
      `Current Plan: ${shop.plan || "Basic"}`,
      `Product Limit: ${shop.productLimit || 10}`,
      `Requested Plan: ${targetPlan}`,
    ].join("\n");

    const url =
      "https://wa.me/" +
      ADMIN_WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    window.open(url, "_blank");
  };

  return (
    <div className="plans-container">
      {/* <h2>Upgrade Plan</h2> */}


      {shops.length === 0 ? (
        <p className="no-shops">Create a shop first to upgrade.</p>
      ) : (
        <div className="plans-grid">
          <h2>Upgrade plan</h2>
          <p >
            Pay via WhatsApp to upgrade. After payment, your plan will be updated and
            you can add more products.
          </p>
          {shops.map((shop) => (
            <div key={shop._id} className="plan-card">
              <h3>{shop.name}</h3>
              <p className="current-plan">
                Current: <strong>{shop.plan || "Basic"}</strong> (
                {shop.productLimit || 10} products)
              </p>

              <div className="plan-actions">
                {shop.plan !== "Pro" && shop.plan !== "Premium" && (
                  <button
                    className="upgrade-btn pro"
                    onClick={() => handleWhatsAppUpgrade(shop, "Pro")}
                  >
                    Upgrade to Pro (50 products) via WhatsApp
                  </button>
                )}
                {shop.plan !== "Premium" && (
                  <button
                    className="upgrade-btn premium"
                    onClick={() => handleWhatsAppUpgrade(shop, "Premium")}
                  >
                    Upgrade to Premium (Unlimited) via WhatsApp
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Plans;
