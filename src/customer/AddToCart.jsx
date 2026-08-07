import React, { useState } from "react";

/**
 * AddToCart Component
 * @param {Object}   product      The product object selected by the customer
 * @param {Function} onClose      Callback to close the modal
 * @param {Function} onCartUpdate Callback to notify parent components
 */
const AddToCart = ({ product, onClose, onCartUpdate }) => {
  //* State for selected quantity
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(null);

  if (!product) return null;

  //* Parse price from product data
  const unitPrice = Number(product.unit_price || 0);
  const totalPrice = unitPrice * quantity;

  //* Laravel public storage base URL
  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  //* Handle Quantity Adjustments
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  //* Save item to LocalStorage Cart
  const handleConfirmAddToCart = () => {
    //* Get current cart array from localStorage
    const existingCart =
      JSON.parse(localStorage.getItem("shopping_cart")) || [];

    //* Check if the product is already in the cart
    const existingIndex = existingCart.findIndex(
      (item) => item.id === product.id,
    );

    let updatedCart = [...existingCart];

    if (existingIndex > -1) {
      //* Product exists -> add the new quantity to current quantity
      const newQty = updatedCart[existingIndex].quantity + quantity;
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: newQty,
        total_price: newQty * unitPrice,
      };
    } else {
      //* Product doesn't exist -> push new item object
      const newItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        unit_price: unitPrice,
        quantity: quantity,
        total_price: totalPrice,
      };
      updatedCart.push(newItem);
    }

    //* Save updated array back to localStorage
    localStorage.setItem("shopping_cart", JSON.stringify(updatedCart));

    //* Notify parent component
    if (onCartUpdate) {
      onCartUpdate(updatedCart);
    }

    //* Trigger success alert & auto-close
    setSuccess("Product added successfully to the cart.");
    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 2000);
  };

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  return (
    <div
      className="modal show d-block fade show"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light py-3 px-4 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center">
                <i className="fa-solid fa-cart-plus fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">
                  Add to Cart
                </h5>
                <span className="text-muted extra-small">
                  Specify the quantity you wish to add
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
              disabled={!!success}
            ></button>
          </div>

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

            {/* Product Summary Card */}
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border mb-4">
              {product.image ? (
                <img
                  src={`${STORAGE_URL}${product.image}`}
                  alt={product.name}
                  className="rounded-3 border object-fit-cover shadow-sm flex-shrink-0"
                  style={{ width: "64px", height: "64px" }}
                />
              ) : (
                <div
                  className="bg-white rounded-3 border d-flex align-items-center justify-content-center text-muted flex-shrink-0"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="fa-solid fa-box fs-4 text-black-50"></i>
                </div>
              )}

              <div className="flex-grow-1 overflow-hidden">
                <h6 className="fw-bold text-dark text-truncate mb-1">
                  {product.name}
                </h6>
                <div className="text-secondary small">
                  Unit Price:{" "}
                  <span className="fw-bold text-dark">
                    Ksh {unitPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4 text-center">
              <label className="form-label text-muted small fw-medium mb-2">
                Select Quantity
              </label>
              <div className="d-flex justify-content-center">
                <div
                  className="input-group border rounded-3 overflow-hidden shadow-sm"
                  style={{ width: "160px" }}
                >
                  <button
                    className="btn btn-light text-dark border-0 px-3"
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || !!success}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <span className="form-control text-center bg-white border-0 fw-bold fs-5 py-2">
                    {quantity}
                  </span>
                  <button
                    className="btn btn-light text-dark border-0 px-3"
                    type="button"
                    onClick={handleIncrease}
                    disabled={!!success}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Total Box */}
            <div className="bg-primary-subtle bg-opacity-50 p-3 rounded-3 border border-primary-subtle text-center">
              <span className="text-muted small d-block mb-1">
                Calculated Total
              </span>
              <span className="fw-bold text-primary fs-3">
                <small className="fs-6 me-1 text-muted">Ksh</small>
                {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer bg-light p-3 border-top d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary rounded-3 px-4 py-2 flex-grow-1 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 w-100"
              onClick={handleConfirmAddToCart}
              disabled={!!success}
            >
              <i className="fa-solid fa-cart-plus"></i>
              Confirm Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
