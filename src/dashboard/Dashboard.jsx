import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DeleteProduct from "./DeleteProduct";
import SearchProduct from "./SearchProduct";
import EditProduct from "./EditProduct";
import Logout from "../authentication/Logout";
import { useStateContext } from "../context/ContextProvider";
import Sidebar from "../sidebar/Sidebar";

const Dashboard = () => {
  //* Context state for authentication
  const { token } = useStateContext();

  //* State variables
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //* Pagination State
  const [pagination, setPagination] = useState({
    prevPageUrl: null,
    nextPageUrl: null,
    currentPage: 1,
  });

  //* Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //* Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null);

  //* Laravel public storage
  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  //* Fetch or Search Products
  const fetchProducts = async (query = "", fetchUrl = null) => {
    setLoading(true);
    setError("");

    try {
      let endpoint = fetchUrl;

      if (!endpoint) {
        endpoint = query.trim()
          ? `http://127.0.0.1:8000/api/products/search/${encodeURIComponent(
              query.trim(),
            )}`
          : "http://127.0.0.1:8000/api/products";
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.data) {
          setProducts(data.data);
          setPagination({
            prevPageUrl: data.prev_page_url,
            nextPageUrl: data.next_page_url,
            currentPage: data.current_page || 1,
          });
        } else {
          setProducts(Array.isArray(data) ? data : []);
          setPagination({
            prevPageUrl: null,
            nextPageUrl: null,
            currentPage: 1,
          });
        }
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

  //* Debounce API call when typing in search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, token]);

  //* Handle Previous / Next button click
  const handlePageChange = (url) => {
    if (url) {
      fetchProducts(searchTerm, url);
    }
  };

  //* Delete Modal Handlers
  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteSuccess = (deletedProductId) => {
    setProducts((prev) => prev.filter((p) => p.id !== deletedProductId));
  };

  //* Edit Modal Handlers
  const handleOpenEditModal = (product) => {
    setEditProductData(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProductData(null);
  };

  const handleEditSuccess = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    handleCloseEditModal();
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 overflow-auto">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 gap-3">
          <div>
            <p className="text-muted small mb-0">
              Manage store, view products, or perform updates
            </p>
          </div>

          {/* Search product */}
          <div className="d-flex align-items-center gap-3">
            <SearchProduct
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {/* Add product */}
            <Link
              to="/add"
              className="btn btn-outline-dark fw-semibold rounded-3 px-3 d-flex align-items-center gap-1"
              title="Add New Product"
            >
              <i className="fa-solid fa-plus"></i>
            </Link>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary me-2" role="status"></div>
            <span className="text-muted">Loading product inventory...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <div>{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
            <p className="text-muted fs-5 mb-0">
              {searchTerm
                ? `No products found matching "${searchTerm}".`
                : "No products found in the database."}
            </p>
          </div>
        )}

        {/* Product Management Table */}
        {!loading && !error && products.length > 0 && (
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="ps-3" style={{ width: "80px" }}>
                      ID
                    </th>
                    <th scope="col" style={{ width: "100px" }}>
                      Image
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit Price</th>
                    <th scope="col">Total Price</th>
                    <th
                      scope="col"
                      className="text-center"
                      style={{ width: "200px" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="ps-3 fw-bold text-secondary">
                        #{product.id}
                      </td>
                      <td>
                        {product.image ? (
                          <img
                            src={`${STORAGE_URL}${product.image}`}
                            alt={product.name}
                            className="rounded border object-fit-cover"
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          <div
                            className="bg-light rounded border d-flex align-items-center justify-content-center text-muted small"
                            style={{ width: "50px", height: "50px" }}
                          >
                            📷
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {product.name}
                        </div>
                      </td>
                      <td style={{ maxWidth: "300px" }}>
                        <div
                          className="text-muted small"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.description || "No description provided."}
                        </div>
                      </td>
                      <td className="fw-bold text-primary">
                        {Number(product.quantity).toLocaleString()}
                      </td>
                      <td className="fw-bold text-primary">
                        {Number(product.unit_price).toLocaleString()}.00
                      </td>
                      <td className="fw-bold text-primary">
                        {Number(product.total_price).toLocaleString()}.00
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning rounded-2"
                            title="Edit Product"
                            onClick={() => handleOpenEditModal(product)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger rounded-2"
                            title="Delete Product"
                            onClick={() => handleOpenDeleteModal(product)}
                          >
                            <i className="fa-solid fa-rectangle-xmark"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center border-top">
              <span className="text-muted small">
                Page{" "}
                <strong className="text-dark">{pagination.currentPage}</strong>
              </span>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary rounded-2 px-3"
                  onClick={() => handlePageChange(pagination.prevPageUrl)}
                  disabled={!pagination.prevPageUrl}
                >
                  <i className="fa-solid fa-chevron-left me-1"></i> Previous
                </button>

                <button
                  className="btn btn-sm btn-outline-primary rounded-2 px-3"
                  onClick={() => handlePageChange(pagination.nextPageUrl)}
                  disabled={!pagination.nextPageUrl}
                >
                  Next <i className="fa-solid fa-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteProduct
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          product={selectedProduct}
          onSuccess={handleDeleteSuccess}
        />

        {/* Edit Product Modal */}
        <EditProduct
          show={showEditModal}
          handleClose={handleCloseEditModal}
          product={editProductData}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
};

export default Dashboard;