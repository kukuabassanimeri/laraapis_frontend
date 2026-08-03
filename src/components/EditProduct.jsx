import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
        setSuccess("Product updated successfully!");

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
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow rounded-3 border-0">
          {/* Modal Header */}
          <div className="modal-header border-bottom py-3">
            <h5 className="modal-title fw-bold text-dark">
              Edit Product #{product.id}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={submitting}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {/* Feedback Alerts */}
            {error && <div className="alert alert-danger small">{error}</div>}
            {success && (
              <div className="alert alert-success small">{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Product Name & Slug Row */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validationErrors.name ? "is-invalid" : ""
                    }`}
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
                  <label className="form-label fw-semibold small text-secondary">
                    Slug
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validationErrors.slug ? "is-invalid" : ""
                    }`}
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
                <label className="form-label fw-semibold small text-secondary">
                  Description
                </label>
                <textarea
                  className={`form-control ${
                    validationErrors.description ? "is-invalid" : ""
                  }`}
                  rows="3"
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

              {/* Quantity & Price Row */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${
                      validationErrors.quantity ? "is-invalid" : ""
                    }`}
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
                  <label className="form-label fw-semibold small text-secondary">
                    Unit Price (Ksh)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`form-control ${
                      validationErrors.unit_price ? "is-invalid" : ""
                    }`}
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

              {/* Image Input & Preview */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Product Image
                </label>
                <input
                  type="file"
                  className={`form-control ${
                    validationErrors.image ? "is-invalid" : ""
                  }`}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {validationErrors.image && (
                  <div className="invalid-feedback">
                    {validationErrors.image[0]}
                  </div>
                )}

                {previewImage && (
                  <div className="mt-3">
                    <p className="text-muted small mb-1">Preview:</p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="rounded border object-fit-cover"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="modal-footer px-0 pb-0 pt-3 border-top d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-2"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-2 fw-semibold px-4"
                  disabled={submitting}
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
