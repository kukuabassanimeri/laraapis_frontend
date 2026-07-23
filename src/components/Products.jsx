import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Products = () => {
  //* State variable to hold products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //* Laravel public storage
  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  //* Fetch products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          setError(data.message || "Failed to retrieve products.");
        }
      } catch (err) {
        setError("Could not connect to the Laravel API server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="container-fluid py-4 px-md-5 bg-light min-vh-100">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h3 className="fw-bold mb-1 text-dark">Product Catalog</h3>
          <p className="text-muted small mb-0">
            Discover our latest additions and deals
          </p>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary me-2" role="status"></div>
          <span className="text-muted">Loading products...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-5 bg-white rounded shadow-sm">
          <p className="text-muted fs-5 mb-0">
            No products found in the catalog.
          </p>
        </div>
      )}

      {/* Product Grid (5 Columns on Large Desktop, 4 on Desktop, 3 on Tablet, 2 on Mobile) */}
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
        {products.map((product) => (
          <div key={product.id} className="col d-flex align-items-stretch">
            <div className="card h-100 w-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column hover-shadow transition">
              {/* Product Image Container */}
              <div
                className="position-relative bg-light d-flex align-items-center justify-content-center overflow-hidden"
                style={{ height: "180px" }}
              >
                {product.image ? (
                  <img
                    src={`${STORAGE_URL}${product.image}`}
                    alt={product.name}
                    className="w-100 h-100 object-fit-cover"
                    role="button"
                  />
                ) : (
                  <div className="text-secondary text-center small p-2">
                    <span className="d-block mb-1 fs-4">📷</span>
                    <span>No Image</span>
                  </div>
                )}

                {/* Price Tag Badge */}
                <span className="position-absolute top-0 end-0 bg-dark text-white bg-opacity-75 small px-2 py-1 m-2 rounded">
                  In Stock
                </span>
              </div>

              {/* Card Body */}
              <div className="card-body d-flex flex-column justify-content-between p-3">
                <div>
                  <h6
                    className="card-title text-truncate fw-bold text-dark mb-1"
                    title={product.name}
                  >
                    {product.name}
                  </h6>
                  <p
                    className="card-text text-muted small mb-3 text-multiline-truncate"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "38px",
                    }}
                  >
                    {product.description ||
                      "No description provided for this product."}
                  </p>
                </div>

                {/* Footer with Price and Action Button */}
                <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                  <div>
                    <span
                      className="text-muted d-block"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Price
                    </span>
                    <span className="fw-bold text-success fs-6">
                      Ksh {Number(product.price).toLocaleString()}.00
                    </span>
                  </div>
                  <button className="btn btn-sm btn-outline-primary rounded-2 px-2 py-1">
                    shop
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
