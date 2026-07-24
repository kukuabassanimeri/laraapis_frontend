import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DeleteProduct = ({ show, handleClose, product, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!product) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

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

      const data = await response.json();

      if (response.ok) {
        onSuccess(product.id);
        handleClose();
      } else {
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-danger fs-5 fw-bold d-flex align-items-center gap-2">
          Confirm Product Deletion
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-3">
        {error && (
          <div className="alert alert-danger py-2 mb-3 small">{error}</div>
        )}
        <p className="mb-1 text-dark">
          Are you sure you want to delete this product?
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={loading}
          className="d-flex align-items-center gap-2 w-100 justify-content-center"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <span>Delete</span>
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProduct;
