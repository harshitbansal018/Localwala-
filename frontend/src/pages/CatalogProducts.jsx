import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CatalogProducts.css";

function CatalogProducts() {
  const { slug, catalogId } = useParams();
  const { setCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `  http://localhost:5000/api/products/catalog/${catalogId}`
        );
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [catalogId]);

  const addToCart = async (product) => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      alert("Please login first");
      return;
    }

    setAddingId(product._id);
    try {
      await fetch(`  http://localhost:5000/api/cart/${product.shop}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });
      const res = await fetch(`  http://localhost:5000/api/cart/${product.shop}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// 🔥 ADD THIS
if (res.status === 401) {
  localStorage.removeItem("customerToken");
  alert("Session expired. Please login again.");
  window.location.href = "/login";
  return;
}

      const cartRes = await fetch(
        `  http://localhost:5000/api/cart/${product.shop}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCart(cartData.items || []);
      }

      alert("Added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="catalog-products">
        <div className="catalog-products-skeleton">
          <div className="skeleton-title"></div>
          <div className="catalog-product-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="product-skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-products">
      <h2 className="catalog-products-title">Products</h2>

      {products.length === 0 ? (
        <div className="catalog-products-empty">
          <span>🛍️</span>
          <p>No products in this category yet</p>
        </div>
      ) : (
        <div className="catalog-product-grid">
          {products.map((product) => (
            <article key={product._id} className="catalog-product-card">
              <div className="catalog-product-image-wrap">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <div className="catalog-product-placeholder">📦</div>
                )}
              </div>
              <div className="catalog-product-info">
                <h3>{product.name}</h3>
                <p className="catalog-product-price">₹ {product.price}</p>
                <button
                  className="catalog-add-btn"
                  onClick={() => addToCart(product)}
                  disabled={addingId === product._id}
                >
                  {addingId === product._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogProducts;
