import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ShopProducts.css";

const API_URL = import.meta.env.VITE_API_URL || "  http://localhost:5000";

function ShopProducts() {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===========================
     FETCH DATA
  =========================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔥 Fetch shop
        const shopRes = await fetch(
          `${API_URL}/api/shops/slug/${slug}`
        );

        if (!shopRes.ok) {
          throw new Error("Shop not found");
        }

        const shopData = await shopRes.json();
        setShop(shopData);

        // 🔥 Fetch catalogs
        const catalogRes = await fetch(
          `${API_URL}/api/catalogs/shop/${shopData._id}`
        );

        if (!catalogRes.ok) {
          throw new Error("Failed to fetch catalogs");
        }

        const catalogData = await catalogRes.json();

        setCatalogs(Array.isArray(catalogData) ? catalogData : []);

      } catch (error) {
        console.error("Error:", error.message);
        setShop(null);
        setCatalogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  /* ===========================
     LOADING UI
  =========================== */
  if (loading) {
    return (
      <div className="shop-products">
        <div className="shop-products-skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ===========================
     ERROR UI
  =========================== */
  if (!shop) {
    return (
      <div className="shop-products">
        <div className="shop-products-error">
          <h2>Shop not found</h2>
          <p>This shop may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  /* ===========================
     MAIN UI
  =========================== */
  return (
    <div className="shop-products">
      <h2 className="catalog-title">Select Category</h2>
      <p className="catalog-subtitle">
        Choose a category to browse products
      </p>

      {catalogs.length === 0 ? (
        <div className="no-catalog-box">
          <span className="no-catalog-icon">📂</span>
          <p>No catalogs available yet</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {catalogs.map((catalog) => (
            <Link
              key={catalog._id}
              to={`/shop/${slug}/catalog/${catalog._id}`}
              className="catalog-card"
            >
              <span className="catalog-icon">📦</span>
              <span className="catalog-name">
                {catalog.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShopProducts;