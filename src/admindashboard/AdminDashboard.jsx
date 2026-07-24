import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DeleteProduct from "../components/DeleteProduct";

const AdminDashboard = () => {
  //* State variable to hold products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //* Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //* Laravel public storage
  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  //* Fetch products
  const fetchAllProducts = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchAllProducts();
  }, []);

  //* Open Delete Modal for specific product
  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  //* Close Delete Modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  //* Callback when deletion succeeds
  const handleDeleteSuccess = (deletedProductId) => {
    setProducts((prev) => prev.filter((p) => p.id !== deletedProductId));
  };

  return (
    <div className="container-fluid py-4 px-md-5 bg-light min-vh-100">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3 gap-3">
        <div>
          <p className="text-muted small mb-0">
            Manage store, view products, or perform updates
          </p>
        </div>
        <div>
          <Link
            to="/add"
            className="btn btn-primary fw-semibold rounded-3 px-3"
          >
            <i className="fa-solid fa-plus"></i>{" "}
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
            No products found in the database.
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
                  <th scope="col">Price</th>
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
                    {/* ID */}
                    <td className="ps-3 fw-bold text-secondary">
                      #{product.id}
                    </td>

                    {/* Image Thumbnail */}
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

                    {/* Product Name */}
                    <td>
                      <div className="fw-semibold text-dark">
                        {product.name}
                      </div>
                    </td>

                    {/* Description */}
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

                    {/* Price */}
                    <td className="fw-bold text-primary">
                      Ksh {Number(product.price).toLocaleString()}.00
                    </td>

                    {/* Action Controls */}
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {/* View Product */}
                        <Link
                          to={`/product/${product.id}`}
                          className="btn btn-sm btn-outline-info rounded-2"
                          title="View Details"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </Link>

                        {/* Edit Product */}
                        <Link
                          to={`/update/${product.id}`}
                          className="btn btn-sm btn-outline-warning rounded-2"
                          title="Edit Product"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>

                        {/* Delete Product */}
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteProduct
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        product={selectedProduct}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default AdminDashboard;
