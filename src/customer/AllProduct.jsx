import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchProduct from "../dashboard/SearchProduct";
import AddToCart from "./AddToCart";
import Cart from "./Cart"; // Import Cart component
import Footer from "../components/Footer";

const AllProduct = () => {
  //* State variables
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //* Cart state initialized from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("shopping_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  //* Modal/View states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCartView, setShowCartView] = useState(false);

  //* Calculate total count of items in cart
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  //* Callback when cart updates in AddToCart or Cart view
  const handleCartUpdate = (updatedCart) => {
    setCart(updatedCart);
  };

  //* Laravel public storage URL base
  const STORAGE_URL = "http://127.0.0.1:8000/storage";

  //* Helper to format product image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^\/?(storage\/)?/, "");
    return `${STORAGE_URL}/${cleanPath}`;
  };

  //* Fetch or Search Products from Backend API
  const fetchProducts = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const endpoint = query.trim()
        ? `http://127.0.0.1:8000/api/products/search/${encodeURIComponent(query.trim())}`
        : "http://127.0.0.1:8000/api/products";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts(Array.isArray(data) ? data : []);
        }
      } else {
        setError(data.message || "Failed to retrieve products.");
      }
    } catch (err) {
      setError("Could not connect to the Laravel API server.");
      console.error("API Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Main Content Area */}
      <main className="container-fluid py-4 px-md-5 flex-grow-1">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3 gap-3">
          <div>
            <h3 className="fw-bold mb-1 text-dark">
              Yaka Technologies Product Catalog
            </h3>
            <p className="text-muted small mb-0">
              Discover our latest additions and deals just for you
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Search Component */}
            <SearchProduct
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {/* Cart Icon with Dynamic Badge */}
            <button
              className="btn btn-light position-relative border-0 bg-transparent fs-5 p-2"
              onClick={() => setShowCartView(true)}
              title="Open Cart"
            >
              <i className="fa-solid fa-cart-shopping text-dark"></i>
              {totalCartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-6">
                  {totalCartCount}
                </span>
              )}
            </button>
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
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <div>{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
            <p className="text-muted fs-5 mb-0">
              {searchTerm
                ? `No products found matching "${searchTerm}".`
                : "No products found in the catalog."}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
            {products.map((product) => {
              const imageUrl = getImageUrl(product.image);

              return (
                <div key={product.id} className="col d-flex align-items-stretch">
                  <div className="card h-100 w-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column">
                    <div
                      className="position-relative bg-light d-flex align-items-center justify-content-center overflow-hidden"
                      style={{ height: "180px" }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-100 h-100 object-fit-cover hover-image"
                          role="button"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/180?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="text-secondary text-center small p-2">
                          <span className="d-block mb-1 fs-4">📷</span>
                          <span>No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <h6
                          className="card-title text-truncate fw-bold text-dark mb-1"
                          title={product.name}
                        >
                          {product.name}
                        </h6>
                        <p
                          className="card-text text-muted small mb-3"
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

                      <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                        <div>
                          <span
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Price
                          </span>
                          <span className="fw-bold text-success fs-6">
                            Ksh {Number(product.unit_price || 0).toLocaleString()}
                          </span>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary rounded-2 px-2 py-1"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AddToCart Modal */}
        {selectedProduct && (
          <AddToCart
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onCartUpdate={handleCartUpdate}
          />
        )}

        {/* Cart View Modal */}
        {showCartView && (
          <Cart
            cartItems={cart}
            onClose={() => setShowCartView(false)}
            onCartUpdate={handleCartUpdate}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllProduct;