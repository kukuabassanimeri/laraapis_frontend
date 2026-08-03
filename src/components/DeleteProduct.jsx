import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useStateContext } from "../context/ContextProvider";

const DeleteProduct = ({ show, handleClose, product, onSuccess }) => {
  //* Context state for authentication
  const { token } = useStateContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  if (!product) return null;

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
        handleClose();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Failed to delete the product.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Network error: Could not reach the API server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-danger fs-5 fw-bold">
          Confirm Product Deletion
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-3">
        {error && (
          <div className="alert alert-danger py-2 mb-3 small">{error}</div>
        )}

        <p className="mb-3 text-secondary">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>

        {/* Product Card Preview */}
        <div className="d-flex align-items-center p-2 border rounded-3 bg-light mb-2">
          {product.image ? (
            <img
              src={`${STORAGE_URL}${product.image}`}
              alt={product.name}
              className="rounded object-fit-cover me-3"
              style={{ width: "50px", height: "50px" }}
            />
          ) : (
            <div
              className="rounded bg-secondary text-white d-flex align-items-center justify-content-center me-3 fw-bold"
              style={{ width: "50px", height: "50px" }}
            >
              #
            </div>
          )}
          <div>
            <h6 className="mb-0 fw-bold text-dark">{product.name}</h6>
            <span className="text-muted small">ID: #{product.id}</span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 d-flex gap-2">
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={loading}
          className="d-flex align-items-center justify-content-center gap-2 flex-grow-1 fw-semibold"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" />
              <span>Deleting...</span>
            </>
          ) : (
            "Delete Product"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProduct;
