import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const AddProduct = () => {
  //* Context state for authenticated requests
  const { token } = useStateContext();
  const navigate = useNavigate();

  //* State to hold category list fetched from API
  const [categories, setCategories] = useState([]);

  //* State to hold product details (added category_id)
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

  //* Fetch categories on component mount
  useEffect(() => {
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
  }, [token]);

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

        //* Reset form state
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

        //* Redirect to dashboard after brief feedback delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
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

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header Banner */}
            <div className="card-header bg-dark text-white text-center py-4 border-0">
              <h4 className="fw-bold mb-1">Add New Product</h4>
              <p className="small mb-0 opacity-75">
                Enter details to add a new item to your inventory catalog
              </p>
            </div>

            <div className="card-body p-4 p-sm-5 bg-white">
              {/* Alert Feedback */}
              {success && (
                <div
                  className="alert alert-success d-flex align-items-center rounded-3 p-3 mb-4 small"
                  role="alert"
                >
                  <span className="me-2 fw-bold">✓</span>
                  <div>{success}</div>
                </div>
              )}

              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center rounded-3 p-3 mb-4 small"
                  role="alert"
                >
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Image Upload Field */}
                <div className="mb-3">
                  <label
                    htmlFor="image"
                    className="form-label small fw-semibold text-secondary"
                  >
                    Product Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    required
                    onChange={handleProductImage}
                    className="form-control form-control-lg fs-6 py-2 rounded-3"
                  />

                  {/* Image Preview Box */}
                  {imagePreview && (
                    <div className="mt-3 text-center bg-light p-2 rounded-3 border">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="img-fluid rounded-2 object-fit-cover"
                        style={{ maxHeight: "150px" }}
                      />
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="form-label small fw-semibold text-secondary"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Wireless Gaming Mouse"
                    value={productDetails.name}
                    onChange={handleChange}
                    required
                    className="form-control form-control-lg fs-6 py-2 rounded-3"
                  />
                </div>

                {/* Category Selection Dropdown */}
                <div className="mb-3">
                  <label
                    htmlFor="category_id"
                    className="form-label small fw-semibold text-secondary"
                  >
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={productDetails.category_id}
                    onChange={handleChange}
                    required
                    className="form-select form-select-lg fs-6 py-2 rounded-3"
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Description */}
                <div className="mb-3">
                  <label
                    htmlFor="description"
                    className="form-label small fw-semibold text-secondary"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Describe key features, specs, condition..."
                    value={productDetails.description}
                    onChange={handleChange}
                    required
                    className="form-control fs-6 p-3 rounded-3"
                  />
                </div>

                {/* Quantity & Unit Price Row */}
                <div className="row g-3 mb-3">
                  {/* Quantity */}
                  <div className="col-md-6">
                    <label
                      htmlFor="quantity"
                      className="form-label small fw-semibold text-secondary"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="0"
                      placeholder="0"
                      value={productDetails.quantity}
                      onChange={handleChange}
                      required
                      className="form-control form-control-lg fs-6 py-2 rounded-3"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="col-md-6">
                    <label
                      htmlFor="unit_price"
                      className="form-label small fw-semibold text-secondary"
                    >
                      Unit Price
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 fs-6">
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
                        className="form-control form-control-lg fs-6 py-2 rounded-end-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculated Total (Read-only) */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Total Estimated Value
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 fs-6">
                      Ksh
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg fs-6 py-2 bg-light fw-bold text-primary rounded-end-3"
                      value={Number(calculatedTotal).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      readOnly
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-outline-dark btn-lg rounded-3 fs-6 fw-semibold py-2 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving Product...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </button>

                  <Link
                    to="/dashboard"
                    className="btn btn-outline-secondary btn-lg rounded-3 fs-6 fw-semibold py-2"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;