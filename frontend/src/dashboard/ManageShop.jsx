import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ManageShop.css";

function ManageShop() {
  const { shopId } = useParams();

  const [catalogs, setCatalogs] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState("");

  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [newCatalogName, setNewCatalogName] = useState("");

  const token = localStorage.getItem("token");

  /* ===========================
     FETCH CATALOGS
  =========================== */
  const fetchCatalogs = async () => {
    const res = await fetch(
      `https://localwala-1.onrender.com/api/catalogs/shop/${shopId}`
    );
    const data = await res.json();
    if (Array.isArray(data)) {
      setCatalogs(data);
    }
  };

  /* ===========================
     FETCH PRODUCTS
  =========================== */
  const fetchProducts = async (catalogId) => {
    if (!catalogId) return;

    const res = await fetch(
      `https://localwala-1.onrender.com/api/products/catalog/${catalogId}`
    );

    const data = await res.json();

    if (Array.isArray(data)) {
      setProducts(data);
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, [shopId]);

  /* ===========================
     ADD CATALOG
  =========================== */
  const handleAddCatalog = async () => {
    if (!newCatalogName) return;

    await fetch(
      `https://localwala-1.onrender.com/api/catalogs/${shopId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCatalogName }),
      }
    );

    setNewCatalogName("");
    fetchCatalogs();
  };

  /* ===========================
     DELETE CATALOG
  =========================== */
  const handleDeleteCatalog = async (catalogId) => {
    const confirmDelete = window.confirm(
      "Delete this catalog and all its products?"
    );
    if (!confirmDelete) return;

    await fetch(
      `https://localwala-1.onrender.com/api/catalogs/${catalogId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedCatalog("");
    setProducts([]);
    fetchCatalogs();
  };

  /* ===========================
     ADD / UPDATE PRODUCT
  =========================== */
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!selectedCatalog) {
      alert("Select catalog first");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("catalog", selectedCatalog);

    if (image) {
      formData.append("image", image);
    }

    let res;
    if (editingId) {
      res = await fetch(
        `https://localwala-1.onrender.com/api/products/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
    } else {
      res = await fetch(
        `https://localwala-1.onrender.com/api/products/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || `Error ${res.status}: ${res.statusText}`);
      return;
    }

    // Reset form
    setProductName("");
    setPrice("");
    setStock(1);
    setImage(null);
    setPreview(null);
    setEditingId(null);

    fetchProducts(selectedCatalog);
  };

  /* ===========================
     DELETE PRODUCT
  =========================== */
  const handleDeleteProduct = async (productId) => {
    await fetch(
      `https://localwala-1.onrender.com/api/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchProducts(selectedCatalog);
  };

  /* ===========================
     EDIT PRODUCT
  =========================== */
  const handleEditProduct = (product) => {
    setProductName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setEditingId(product._id);

    // ✅ FIXED (Cloudinary)
    setPreview(product.image || null);
  };

  return (
    <div className="manage-shop-container">
      <div className="manage-shop-header">
        <h2>Manage Catalog & Products</h2>
        <Link to="/dashboard/plans" className="upgrade-link">
          Upgrade Plan
        </Link>
      </div>

      {/* ADD CATALOG */}
      <div className="catalog-section">
        <input
          type="text"
          placeholder="New Catalog Name"
          value={newCatalogName}
          onChange={(e) =>
            setNewCatalogName(e.target.value)
          }
        />
        <button onClick={handleAddCatalog}>
          Add Catalog
        </button>
      </div>

      <hr />

      {/* CATALOG LIST */}
      <div className="catalog-list">
        {catalogs.map((catalog) => (
          <div
            key={catalog._id}
            className={`catalog-item ${
              selectedCatalog === catalog._id
                ? "active"
                : ""
            }`}
          >
            <span
              onClick={() => {
                setSelectedCatalog(catalog._id);
                fetchProducts(catalog._id);
              }}
            >
              {catalog.name}
            </span>

            <button
              onClick={() =>
                handleDeleteCatalog(catalog._id)
              }
              className="delete-btn"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      <hr />

      {/* PRODUCT SECTION */}
      {selectedCatalog && (
        <>
          <form
            onSubmit={handleSaveProduct}
            className="product-form"
          >
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                if (file) {
                  setPreview(
                    URL.createObjectURL(file)
                  );
                }
              }}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="image-preview"
              />
            )}

            <button type="submit">
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>
          </form>

          <hr />

          <div className="product-grid">
            {products.map((product) => (
              <div
                key={product._id}
                className="product-card"
              >
                {/* ✅ FIXED (Cloudinary) */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                )}

                <h3>{product.name}</h3>
                <p>₹ {product.price}</p>
                <p>Stock: {product.stock}</p>

                <div className="product-actions">
                  <button
                    onClick={() =>
                      handleEditProduct(product)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProduct(product._id)
                    }
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageShop;