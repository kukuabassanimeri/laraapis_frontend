import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DeleteProduct from "./DeleteProduct";
import SearchProduct from "./SearchProduct";
import EditProduct from "./EditProduct";
import { useStateContext } from "../context/ContextProvider";
import Sidebar from "../sidebar/Sidebar";

const Dashboard = () => {
  //* Context state for authentication
  const { token } = useStateContext();

  //* URL Query Parameters (for Category Filter)
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

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
        let baseUrl = query.trim()
          ? `http://127.0.0.1:8000/api/products/search/${encodeURIComponent(query.trim())}`
          : "http://127.0.0.1:8000/api/products";

        const url = new URL(baseUrl);

        if (categoryParam) {
          url.searchParams.append("category_id", categoryParam);
        }

        endpoint = url.toString();
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

  //* Re-fetch products when search term, category filter, or auth token changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categoryParam, token]);

  //* Clear active category filter
  const handleClearCategoryFilter = () => {
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  //* Handle Previous / Next pagination button click
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
      <div className="flex-grow-1 p-3 p-md-4 overflow-auto">
        {/* Header Card */}
        <div className="bg-white p-3 p-md-4 rounded-3 shadow-sm border mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold text-dark mb-0">Product Inventory</h4>
              </div>
              <p className="text-secondary small mb-0 mt-1">
                Manage store inventory, view products, or perform stock updates
              </p>
            </div>

            {/* Search component */}
            <div className="d-flex align-items-center">
              <SearchProduct
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>

          {/* Active Category Filter Banner */}
          {categoryParam && (
            <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top">
              <span className="text-muted small">Filtered by Category ID:</span>
              <span className="badge bg-dark text-white fw-medium d-flex align-items-center gap-2 px-2 py-1">
                #{categoryParam}
                <i
                  className="fa-solid fa-xmark cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={handleClearCategoryFilter}
                  title="Remove filter"
                ></i>
              </span>
              <button
                className="btn btn-link btn-sm text-decoration-none p-0 ms-2 text-muted small"
                onClick={handleClearCategoryFilter}
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <div
              className="spinner-border text-primary mb-2"
              role="status"
            ></div>
            <span className="text-muted small fw-medium">
              Loading inventory records...
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
          <div className="text-center py-5 bg-white rounded-3 shadow-sm border my-2">
            <i className="fa-solid fa-folder-open fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-secondary mb-1">No Products Found</h5>
            <p className="text-muted small mb-0">
              {searchTerm
                ? `No products found matching "${searchTerm}".`
                : categoryParam
                  ? "No products available under this category."
                  : "No products currently exist in the database."}
            </p>
            {categoryParam && (
              <button
                className="btn btn-sm btn-outline-secondary mt-3 rounded-2"
                onClick={handleClearCategoryFilter}
              >
                Clear Category Filter
              </button>
            )}
          </div>
        )}

        {/* Product Management Table */}
        {!loading && !error && products.length > 0 && (
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  className="bg-light border-bottom text-uppercase text-secondary"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
                >
                  <tr>
                    <th
                      scope="col"
                      className="ps-4 py-3"
                      style={{ width: "70px" }}
                    >
                      ID
                    </th>
                    <th scope="col" className="py-3" style={{ width: "80px" }}>
                      Image
                    </th>
                    <th scope="col" className="py-3">
                      Name
                    </th>
                    <th scope="col" className="py-3">
                      Description
                    </th>
                    <th scope="col" className="py-3">
                      Category
                    </th>
                    <th scope="col" className="py-3 text-end">
                      Quantity
                    </th>
                    <th scope="col" className="py-3 text-end">
                      Unit Price
                    </th>
                    <th scope="col" className="py-3 text-end">
                      Total Price
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-center pe-4"
                      style={{ width: "130px" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {products.map((product) => {
                    const categoryName =
                      typeof product.category === "object"
                        ? product.category?.name || "Uncategorized"
                        : product.category || "Uncategorized";

                    return (
                      <tr key={product.id}>
                        {/* ID */}
                        <td className="ps-4 fw-bold text-secondary small">
                          #{product.id}
                        </td>

                        {/* Image Thumbnail */}
                        <td>
                          {product.image ? (
                            <img
                              src={`${STORAGE_URL}${product.image}`}
                              alt={product.name}
                              className="rounded-2 border object-fit-cover shadow-sm"
                              style={{ width: "44px", height: "44px" }}
                            />
                          ) : (
                            <div
                              className="bg-light rounded-2 border d-flex align-items-center justify-content-center text-muted"
                              style={{ width: "44px", height: "44px" }}
                            >
                              <i className="fa-solid fa-image text-black-50"></i>
                            </div>
                          )}
                        </td>

                        {/* Product Name */}
                        <td>
                          <div
                            className="fw-semibold text-dark text-truncate"
                            style={{ maxWidth: "180px" }}
                          >
                            {product.name}
                          </div>
                        </td>

                        {/* Description */}
                        <td style={{ maxWidth: "260px" }}>
                          <div
                            className="text-secondary small"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: "1.3",
                            }}
                          >
                            {product.description || "No description provided."}
                          </div>
                        </td>

                        {/* Category */}
                        <td>
                          <span className="badge bg-light text-dark border fw-normal px-2 py-1">
                            {categoryName}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="fw-semibold text-dark text-end">
                          {Number(product.quantity).toLocaleString()}
                        </td>

                        {/* Unit Price */}
                        <td className="fw-semibold text-dark text-end">
                          <span className="text-muted extra-small me-1">
                            Ksh
                          </span>
                          {Number(product.unit_price).toLocaleString()}
                        </td>

                        {/* Total Price */}
                        <td className="fw-bold text-primary text-end">
                          <span className="text-muted extra-small me-1">
                            Ksh
                          </span>
                          {Number(product.total_price).toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="pe-4">
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn btn-sm btn-light border text-warning hover-warning rounded-2 px-2 py-1"
                              title="Edit Product"
                              onClick={() => handleOpenEditModal(product)}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-light border text-danger hover-danger rounded-2 px-2 py-1"
                              title="Delete Product"
                              onClick={() => handleOpenDeleteModal(product)}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="card-footer bg-white py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 border-top">
              <span className="text-muted small">
                Showing Page{" "}
                <strong className="text-dark">{pagination.currentPage}</strong>
              </span>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary rounded-2 px-3 d-flex align-items-center gap-1"
                  onClick={() => handlePageChange(pagination.prevPageUrl)}
                  disabled={!pagination.prevPageUrl}
                >
                  <i className="fa-solid fa-chevron-left small"></i> Previous
                </button>

                <button
                  className="btn btn-sm btn-outline-primary rounded-2 px-3 d-flex align-items-center gap-1"
                  onClick={() => handlePageChange(pagination.nextPageUrl)}
                  disabled={!pagination.nextPageUrl}
                >
                  Next <i className="fa-solid fa-chevron-right small"></i>
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
