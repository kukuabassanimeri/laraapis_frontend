import { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";

const AddProduct = ({ show, handleClose, onSuccess }) => {
  //* Context state for authenticated requests
  const { token } = useStateContext();

  //* State to hold category list fetched from API
  const [categories, setCategories] = useState([]);

  //* State to hold product details
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    category_id: "",
    quantity: "",
    unit_price: "",
  });

  //* State to hold product image & local preview URL
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  //* Errors, success, and loading state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  //* Reset form fields and clean up image memory
  const resetForm = () => {
    setProductDetails({
      name: "",
      description: "",
      category_id: "",
      quantity: "",
      unit_price: "",
    });
    setProductImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setError(null);
    setSuccess(null);
  };

  //* Close modal & reset form state
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  //* Fetch categories when modal opens
  useEffect(() => {
    if (!show) return;

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCategories(data.data || data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, [token, show]);

  //* Helper function to generate a slug from the product name
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  //* Calculate dynamic total price for the read-only UI
  const calculatedTotal = (
    (parseFloat(productDetails.quantity) || 0) *
    (parseFloat(productDetails.unit_price) || 0)
  ).toFixed(2);

  //* Handle text input & select change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
  };

  //* Handle image input change & generate preview
  const handleProductImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  //* Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("name", productDetails.name);
      formData.append("slug", createSlug(productDetails.name));
      formData.append("description", productDetails.description);
      formData.append("category_id", productDetails.category_id);
      formData.append("quantity", productDetails.quantity);
      formData.append("unit_price", productDetails.unit_price);

      if (productImage) {
        formData.append("image", productImage);
      }

      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product successfully added to inventory.");

        if (onSuccess) {
          onSuccess(data);
        }

        //* Close modal after brief feedback
        setTimeout(() => {
          handleModalClose();
        }, 3000);
      } else {
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          setError(data.errors[firstErrorKey][0]);
        } else {
          setError(data.message || "Failed to add product.");
        }
      }
    } catch (err) {
      setError("Unable to connect to the server. Please check your network.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1060,
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-light py-3 px-4 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                <i className="fa-solid fa-box-open fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">
                  Add New Product
                </h5>
                <span className="text-muted extra-small">
                  Add a new item to your inventory catalog
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={handleModalClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Modal Body */}
            <div className="modal-body p-4 bg-white">
              {/* Alert Feedback */}
              {success && (
                <div
                  className="alert alert-success d-flex align-items-center gap-2 py-3 px-3 rounded-3 border-0 shadow-sm mb-4"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-check fs-5"></i>
                  <div className="fw-medium small">{success}</div>
                </div>
              )}

              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center gap-2 py-3 px-3 rounded-3 border-0 shadow-sm mb-4"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-exclamation fs-5"></i>
                  <div className="fw-medium small">{error}</div>
                </div>
              )}

              {/* Product Name & Category Row */}
              <div className="row g-3 mb-3">
                {/* Product Name */}
                <div className="col-md-6">
                  <label
                    htmlFor="name"
                    className="form-label text-muted small fw-medium mb-2"
                  >
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3">
                      <i className="fa-solid fa-tag"></i>
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Wireless Gaming Mouse"
                      value={productDetails.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="form-control border-start-0 rounded-end-3 py-2 text-dark small shadow-none"
                    />
                  </div>
                </div>

                {/* Category Selection Dropdown */}
                <div className="col-md-6">
                  <label
                    htmlFor="category_id"
                    className="form-label text-muted small fw-medium mb-2"
                  >
                    Category <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3">
                      <i className="fa-solid fa-layer-group"></i>
                    </span>
                    <select
                      id="category_id"
                      name="category_id"
                      value={productDetails.category_id}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="form-select border-start-0 rounded-end-3 py-2 text-dark small shadow-none"
                    >
                      <option value="">Select a Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Upload Field & Preview */}
              <div className="mb-3">
                <label
                  htmlFor="image"
                  className="form-label text-muted small fw-medium mb-2"
                >
                  Product Image <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3">
                    <i className="fa-solid fa-image"></i>
                  </span>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    required
                    onChange={handleProductImage}
                    disabled={loading}
                    className="form-control border-start-0 rounded-end-3 py-2 text-dark small shadow-none"
                  />
                </div>

                {/* Image Preview Box */}
                {imagePreview && (
                  <div className="mt-3 p-2 bg-light border rounded-3 d-flex align-items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="rounded-2 object-fit-cover shadow-sm"
                      style={{ width: "70px", height: "70px" }}
                    />
                    <div>
                      <div className="extra-small text-muted fw-semibold uppercase mb-1">
                        Selected Preview
                      </div>
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                        <i className="fa-solid fa-circle-check me-1"></i> Ready to
                        upload
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div className="mb-3">
                <label
                  htmlFor="description"
                  className="form-label text-muted small fw-medium mb-2"
                >
                  Description <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3 align-items-start pt-2">
                    <i className="fa-solid fa-align-left"></i>
                  </span>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Describe key features, specs, condition..."
                    value={productDetails.description}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="form-control border-start-0 rounded-end-3 py-2 text-dark small shadow-none"
                  />
                </div>
              </div>

              {/* Quantity & Unit Price Row */}
              <div className="row g-3 mb-3">
                {/* Quantity */}
                <div className="col-md-6">
                  <label
                    htmlFor="quantity"
                    className="form-label text-muted small fw-medium mb-2"
                  >
                    Quantity <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3">
                      <i className="fa-solid fa-boxes-stacked"></i>
                    </span>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="0"
                      placeholder="0"
                      value={productDetails.quantity}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="form-control border-start-0 rounded-end-3 py-2 text-dark small shadow-none"
                    />
                  </div>
                </div>

                {/* Unit Price */}
                <div className="col-md-6">
                  <label
                    htmlFor="unit_price"
                    className="form-label text-muted small fw-medium mb-2"
                  >
                    Unit Price <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3 small fw-semibold">
                      Ksh
                    </span>
                    <input
                      type="number"
                      id="unit_price"
                      name="unit_price"
                      min="0"
                      placeholder="0.00"
                      value={productDetails.unit_price}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="form-control border-start-0 rounded-end-3 py-2 text-dark small shadow-none"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Total (Read-only) */}
              <div className="mb-2">
                <label className="form-label text-muted small fw-medium mb-2">
                  Total Estimated Value
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3">
                    <i className="fa-solid fa-calculator"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 rounded-end-3 py-2 bg-light fw-bold text-primary small shadow-none"
                    value={`Ksh ${Number(calculatedTotal).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}`}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light p-3 border-top gap-2">
              
              <button
                type="submit"
                className="btn btn-primary rounded-3 px-4 py-2 flex-grow-1 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                    Saving Product...
                  </>
                ) : (
                  <>
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;