import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";

const EditProduct = ({ show, handleClose, product, onSuccess }) => {
  //* Context state for authentication
  const { token } = useStateContext();

  //* Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [image, setImage] = useState(null);

  //* Success & Error message states
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  //* UI State
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  //* Helper function to generate slug from product name
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setDescription(product.description || "");
      setQuantity(product.quantity || "");
      setUnitPrice(product.unit_price || "");
      setImage(null);
      setError("");
      setSuccess(null);
      setValidationErrors({});

      if (product.image) {
        setPreviewImage(`${STORAGE_URL}${product.image}`);
      } else {
        setPreviewImage(null);
      }
    }
  }, [product]);

  //* Handle Name change & update slug dynamically
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(createSlug(val));
  };

  //* Handle File Upload & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(null);
    setValidationErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("unit_price", unitPrice);

    if (image) {
      formData.append("image", image);
    }

    formData.append("_method", "PUT");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${product.id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product updated successfully.");

        setTimeout(() => {
          setSuccess(null);
          onSuccess(data);
        }, 1200);
      } else if (response.status === 422) {
        setValidationErrors(data.errors || {});
        setError("Please check the form for validation errors.");
      } else {
        setError(data.message || "Failed to update product.");
      }
    } catch (err) {
      setError("An error occurred while communicating with the server.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show || !product) return null;

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
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          {/* Modal Header */}
          <div className="modal-header bg-light">
            <div className="d-flex align-items-center gap-2">
              <h5 className="modal-title fw-bold mb-0">Edit Product</h5>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                #{product.id}
              </span>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={submitting}
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

            <form onSubmit={handleSubmit}>
              {/* Name & Slug Grid */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-secondary">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.name ? "is-invalid" : ""}`}
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                  {validationErrors.name && (
                    <div className="invalid-feedback">
                      {validationErrors.name[0]}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-secondary">
                    Slug
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.slug ? "is-invalid" : ""}`}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                  {validationErrors.slug && (
                    <div className="invalid-feedback">
                      {validationErrors.slug[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-secondary">
                  Description
                </label>
                <textarea
                  rows="3"
                  className={`form-control ${validationErrors.description ? "is-invalid" : ""}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                {validationErrors.description && (
                  <div className="invalid-feedback">
                    {validationErrors.description[0]}
                  </div>
                )}
              </div>

              {/* Quantity & Price Grid */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-secondary">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${validationErrors.quantity ? "is-invalid" : ""}`}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                  {validationErrors.quantity && (
                    <div className="invalid-feedback">
                      {validationErrors.quantity[0]}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-secondary">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`form-control ${validationErrors.unit_price ? "is-invalid" : ""}`}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    required
                  />
                  {validationErrors.unit_price && (
                    <div className="invalid-feedback">
                      {validationErrors.unit_price[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Image & Preview */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-secondary">
                  Product Image
                </label>
                <div className="card p-3 bg-light border">
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`form-control ${validationErrors.image ? "is-invalid" : ""}`}
                    />

                    {previewImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {validationErrors.image && (
                    <div className="text-danger small mt-1">
                      {validationErrors.image[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div className="justify-content-end align-items-center gap-2 pt-3 border-top">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary px-4 w-100"
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
