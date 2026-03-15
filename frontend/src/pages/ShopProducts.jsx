import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ShopProducts.css";

function ShopProducts() {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch shop
        const shopRes = await fetch(
          `http://localhost:5000/api/shops/slug/${slug}`
        );
        const shopData = await shopRes.json();

        if (shopRes.ok) {
          setShop(shopData);

          // 2️⃣ Fetch catalogs
          const catalogRes = await fetch(
            `http://localhost:5000/api/catalogs/shop/${shopData._id}`
          );

          const catalogData = await catalogRes.json();

          if (Array.isArray(catalogData)) {
            setCatalogs(catalogData);
          }
        }

      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

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

  return (
    <div className="shop-products">
      <h2 className="catalog-title">Select Category</h2>
      <p className="catalog-subtitle">Choose a category to browse products</p>

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
              <span className="catalog-name">{catalog.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

}

export default ShopProducts;
