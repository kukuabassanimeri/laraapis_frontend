import React, { useState } from "react";

/**
 * AddToCart Component
 * @param {Object}  The product object selected by the customer
 * @param {Function}    Callback to close the modal
 * @param {Function}    Callback to notify parent components
 */

const AddToCart = ({ product, onClose, onCartUpdate }) => {
  //* State for selected quantity
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(null);

  if (!product) return null;

  //* Parse price from product data
  const unitPrice = Number(product.unit_price || 0);
  const totalPrice = unitPrice * quantity;

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

    //* Close the modal
    setSuccess("Product added successfully to the cart.");
    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 3000);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          {/* Modal Header */}
          <div className="modal-header border-bottom-0 pb-0 justify-content-center">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body text-center px-4 py-3">
            
            {/* Success message */}
            {success && (
              <div
                className="alert alert-success d-flex align-items-center rounded-3 p-3 mb-4 small"
                role="alert"
              >
                <span className="me-2 fw-bold">✓</span>
                <div>{success}</div>
              </div>
            )}

            <h6 className="fw-bold mb-1 text-primary">{product.name}</h6>
            <p className="text-muted small mb-3">
              Unit Price:{" "}
              <span className="fw-semibold">
                Ksh {unitPrice.toLocaleString()}
              </span>
            </p>

            {/* Quantity Controls (+ / -) */}
            <div className="d-flex justify-content-center align-items-center gap-3 my-4">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 rounded-2"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <i className="fa-solid fa-minus"></i>
              </button>

              <span className="fw-bold fs-5 px-3 min-w-40">{quantity}</span>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 rounded-2"
                onClick={handleIncrease}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>

            {/* Calculated Total Price Container */}
            <div className="bg-light p-3 rounded-3 border">
              <span className="text-muted d-block small">Calculated Total</span>
              <span className="fw-bold text-success fs-4">
                Ksh {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
            <button
              type="button"
              className="btn btn-primary rounded-2 px-4 fw-semibold w-100"
              onClick={handleConfirmAddToCart}
            >
              <i className="fa-solid fa-cart-plus me-2"></i> Confirm Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
