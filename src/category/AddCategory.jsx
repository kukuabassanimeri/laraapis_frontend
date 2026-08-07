import React, { useState } from "react";
import { useStateContext } from "../context/ContextProvider";

const AddCategory = ({ show, handleClose, onSuccess }) => {
  const { token } = useStateContext();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState();

  if (!show) return null;

  const resetForm = () => {
    setName("");
    setError("");
  };

  const onCloseModal = () => {
    resetForm();
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Category added successfully");
        setTimeout(() => {
          setSuccess(null);
          resetForm();
          if (onSuccess) onSuccess(data);
          handleClose();
        }, 3000);
      } else {
        if (data.errors && data.errors.name) {
          setError(data.errors.name[0]);
          setTimeout(() => {
            setError(null);
            handleClose();
          }, 3000);
        } else {
          setError(data.message || "Failed to create category.");
          setTimeout(() => {
            setError(null);
            handleClose();
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Server connection failed. Please try again.");
      setTimeout(() => {
        setError(null);
        handleClose();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold">Add New Category</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCloseModal}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-3">
              {success && (
                <div
                  className="alert alert-success py-2 small rounded-2 mb-3"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-check me-2"></i>
                  {success}
                </div>
              )}
              {error && (
                <div
                  className="alert alert-danger py-2 small rounded-2 mb-3"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-exclamation me-2"></i>
                  {error}
                </div>
              )}

              <div className="mb-2">
                <label
                  htmlFor="categoryName"
                  className="form-label small fw-semibold text-secondary"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  className="form-control rounded-2"
                  placeholder="e.g. Electronics, Footwear..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-footer border-top-0 pt-0">
              <button
                type="submit"
                className="btn btn-dark rounded-2 fw-semibold align-items-center gap-2 w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
