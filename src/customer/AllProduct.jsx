import React, { useState, useEffect } from "react";
import SearchProduct from "../dashboard/SearchProduct";
import AddToCart from "./AddToCart";
import Cart from "./Cart";
import Footer from "../components/Footer";
import SideBar from "./SideBar";

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
    <>
      <div className="d-flex min-vh-100 bg-light">
        <SideBar />

        {/* Main View Area */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          {/* Header Bar */}
          <div className="bg-white p-3 p-md-4 rounded-3 shadow-sm border mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h4 className="fw-bold text-dark mb-1">
                  Yaka Technologies Product Catalog
                </h4>
                <p className="text-secondary small mb-0">
                  Discover our latest additions and deals just for you
                </p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <SearchProduct
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />

                {/* Cart Icon Button */}
                <button
                  className="btn btn-outline-dark position-relative rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "42px", height: "42px" }}
                  onClick={() => setShowCartView(true)}
                  title="Open Cart"
                >
                  <i className="fa-solid fa-cart-shopping fs-6"></i>
                  {totalCartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="d-flex flex-column justify-content-center align-items-center py-5">
              <div
                className="spinner-border text-primary mb-2"
                role="status"
              ></div>
              <span className="text-muted fw-medium small">
                Loading catalog products...
              </span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 rounded-3 shadow-sm mb-4"
              role="alert"
            >
              <i className="fa-solid fa-circle-exclamation fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm border my-4">
              <i className="fa-solid fa-box-open fs-1 text-muted mb-3 d-block"></i>
              <h5 className="fw-bold text-secondary mb-1">No Products Found</h5>
              <p className="text-muted small mb-0">
                {searchTerm
                  ? `No results matching "${searchTerm}". Try searching for something else.`
                  : "There are currently no products available in the store."}
              </p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
              {products.map((product) => {
                const imageUrl = getImageUrl(product.image);

                return (
                  <div
                    key={product.id}
                    className="col d-flex align-items-stretch"
                  >
                    <div className="card h-100 w-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column transition-all hover-shadow">
                      {/* Product Thumbnail Container */}
                      <div
                        className="position-relative bg-white d-flex align-items-center justify-content-center border-bottom overflow-hidden"
                        style={{ height: "190px" }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-100 h-100 object-fit-contain p-2"
                            role="button"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/180?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="text-secondary text-center small p-2">
                            <i className="fa-solid fa-image fs-2 mb-1 d-block text-black-50"></i>
                            <span className="text-muted extra-small">
                              No image available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content Body */}
                      <div className="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                          <h6
                            className="card-title fw-bold text-dark text-truncate mb-1"
                            title={product.name}
                          >
                            {product.name}
                          </h6>

                          <p
                            className="card-text text-secondary small mb-3"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              minHeight: "36px",
                              lineHeight: "1.3",
                            }}
                          >
                            {product.description ||
                              "No description provided for this product."}
                          </p>
                        </div>

                        {/* Card Bottom: Price & Call to Action */}
                        <div className="pt-2 border-top d-flex align-items-center justify-content-between mt-auto">
                          <div>
                            <span
                              className="text-uppercase fw-bold d-block"
                              style={{
                                fontSize: "0.65rem",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Price
                            </span>
                            <span className="fw-bold text-primary fs-6">
                              Ksh{" "}
                              {Number(product.unit_price || 0).toLocaleString()}
                            </span>
                          </div>

                          <button
                            className="btn btn-sm btn-primary rounded-2 px-3 fw-medium d-flex align-items-center gap-1"
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
      </div>

      <Footer />
    </>
  );
};

export default AllProduct;
