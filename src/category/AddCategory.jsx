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
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1060,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light py-3 px-4 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                <i className="fa-solid fa-folder-plus fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">
                  Add New Category
                </h5>
                <span className="text-muted extra-small">
                  Group your products logically
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onCloseModal}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Body */}
            <div className="modal-body p-4">
              {/* Success Alert */}
              {success && (
                <div
                  className="alert alert-success d-flex align-items-center gap-2 py-3 px-3 rounded-3 border-0 shadow-sm mb-4"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-check fs-5"></i>
                  <div className="fw-medium small">{success}</div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center gap-2 py-3 px-3 rounded-3 border-0 shadow-sm mb-4"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-exclamation fs-5"></i>
                  <div className="fw-medium small">{error}</div>
                </div>
              )}

              {/* Category Input */}
              <div className="mb-2">
                <label
                  htmlFor="categoryName"
                  className="form-label text-muted small fw-medium mb-2"
                >
                  Category Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3 px-3">
                    <i className="fa-solid fa-tag"></i>
                  </span>
                  <input
                    type="text"
                    id="categoryName"
                    className="form-control border-start-0 rounded-end-3 py-2 text-dark small shadow-none"
                    placeholder="e.g. Beverages, Electronics, Footwear..."
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
            </div>

            {/* Footer */}
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
                    Saving...
                  </>
                ) : (
                  <>Save Category</>
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
