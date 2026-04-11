import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ShopHome.css";

function ShopHome() {
  const { slug } = useParams();
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const shopRes = await fetch(
          `  https://localwala-1.onrender.com/api/shops/slug/${slug}`
        );
        const shopData = await shopRes.json();
        if (shopData && shopData._id)  {
          const catRes = await fetch(
            `  https://localwala-1.onrender.com/api/catalogs/shop/${shopData._id}`
          );
          const data = await catRes.json();
          setCatalogs(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchCatalogs();
  }, [slug]);

  const formattedName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="shop-home">
      <section className="shop-home-intro">
        <h1>Welcome to {formattedName}</h1>
        <p>Discover our products and order with ease. Fast delivery, great prices.</p>
        <Link to={`/shop/${slug}/products`} className="shop-home-cta">
          Browse All Products
        </Link>
      </section>

      {catalogs.length > 0 && (
        <section className="shop-home-categories">
          <h2>Categories</h2>
          <div className="shop-home-cat-grid">
            {catalogs.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop/${slug}/catalog/${cat._id}`}
                className="shop-home-cat-card"
              >
                <span className="cat-icon">📦</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!loading && catalogs.length === 0 && (
        <section className="shop-home-empty">
          <p>No categories yet. Check back soon!</p>
          <Link to={`/shop/${slug}/products`} className="shop-home-cta">
            View Products
          </Link>
        </section>
      )}
    </div>
  );
}

export default ShopHome;
