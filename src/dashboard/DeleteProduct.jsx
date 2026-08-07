import React, { useState } from "react";
import { useStateContext } from "../context/ContextProvider";

const DeleteProduct = ({ show, handleClose, product, onSuccess }) => {
  //* Context state for authentication
  const { token } = useStateContext();

  //* UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  if (!show || !product) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        onSuccess(product.id);
        setSuccess("Product deleted successfully.");

        setTimeout(() => {
          setSuccess(null);
          handleClose();
        }, 1500);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Failed to delete the product.");

        setTimeout(() => {
          setError(null);
          handleClose();
        }, 3000);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Network error: Could not reach the API server.");

      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          {/* Modal Header */}
          <div className="modal-header bg-light">
            <div className="d-flex align-items-center gap-2">
              <h5 className="modal-title fw-bold text-danger mb-0">
                Confirm Deletion
              </h5>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">
                #{product.id}
              </span>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {/* Feedback Alerts */}
            {success && (
              <div
                className="alert alert-success d-flex align-items-center"
                role="alert"
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                <div>{success}</div>
              </div>
            )}

            {error && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
              </div>
            )}

            <p className="text-secondary mb-3">
              Are you sure you want to delete this product? This action is
              permanent and cannot be undone.
            </p>

            {/* Product Card Preview */}
            <div className="card p-3 bg-light border-0 rounded-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                {product.image ? (
                  <img
                    src={`${STORAGE_URL}${product.image}`}
                    alt={product.name}
                    className="rounded img-thumbnail flex-shrink-0"
                    style={{
                      width: "56px",
                      height: "56px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center flex-shrink-0 fw-bold border"
                    style={{ width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-box-seam fs-4"></i>
                  </div>
                )}
                <div className="overflow-hidden">
                  <h6 className="fw-bold text-dark mb-1 text-truncate">
                    {product.name}
                  </h6>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    {product.quantity !== undefined && (
                      <span>
                        Qty: <strong>{product.quantity}</strong>
                      </span>
                    )}
                    {product.unit_price && (
                      <>
                        <span>•</span>
                        <span>
                          Price: <strong>Ksh {product.unit_price}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="align-items-center gap-2 pt-3 border-top">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="btn btn-danger px-4 align-items-center gap-2 w-100"
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash3-fill"></i>
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
