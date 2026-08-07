import React from "react";

const Cart = ({ cartItems = [], onClose, onCartUpdate }) => {
  //* Save cart state changes to localStorage and notify parent
  const updateStorageAndState = (updatedCart) => {
    localStorage.setItem("shopping_cart", JSON.stringify(updatedCart));
    if (onCartUpdate) {
      onCartUpdate(updatedCart);
    }
  };

  //* Increase item quantity
  const handleIncrease = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
            total_price: (item.quantity + 1) * Number(item.unit_price),
          }
        : item,
    );
    updateStorageAndState(updated);
  };

  //* Decrease item quantity
  const handleDecrease = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? {
            ...item,
            quantity: item.quantity - 1,
            total_price: (item.quantity - 1) * Number(item.unit_price),
          }
        : item,
    );
    updateStorageAndState(updated);
  };

  //* Remove a single item
  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateStorageAndState(updated);
  };

  //* Grand total calculation
  const grandTotal = cartItems.reduce(
    (acc, item) => acc + Number(item.total_price || 0),
    0,
  );

  //* Total item count in cart
  const totalItemCount = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0,
  );

  //* Laravel public storage base URL
  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  return (
    <div
      className="modal show d-block fade show"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light py-3 px-4 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center">
                <i className="fa-solid fa-cart-shopping fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">
                  Shopping Cart
                </h5>
                <span className="text-muted extra-small">
                  {totalItemCount} {totalItemCount === 1 ? "item" : "items"} in
                  your cart
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="text-center py-5 px-4">
                <div
                  className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fa-solid fa-basket-shopping fs-1 text-secondary"></i>
                </div>
                <h5 className="fw-bold text-dark mb-1">Your cart is empty</h5>
                <p className="text-muted small mb-4">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
            ) : (
              /* Cart Items Table */
              <div className="table-responsive" style={{ maxHeight: "380px" }}>
                <table className="table table-hover align-middle mb-0">
                  <thead
                    className="bg-light sticky-top text-uppercase text-secondary"
                    style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
                  >
                    <tr>
                      <th scope="col" className="ps-4 py-3">
                        Product
                      </th>
                      <th scope="col" className="py-3 text-end">
                        Price
                      </th>
                      <th
                        scope="col"
                        className="py-3 text-center"
                        style={{ width: "150px" }}
                      >
                        Quantity
                      </th>
                      <th scope="col" className="py-3 text-end">
                        Total
                      </th>
                      <th
                        scope="col"
                        className="py-3 text-center pe-4"
                        style={{ width: "60px" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="border-top-0">
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        {/* Product Info */}
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {item.image ? (
                              <img
                                src={`${STORAGE_URL}${item.image}`}
                                alt={item.name}
                                className="rounded-3 border object-fit-cover shadow-sm"
                                style={{ width: "48px", height: "48px" }}
                              />
                            ) : (
                              <div
                                className="bg-light rounded-3 border d-flex align-items-center justify-content-center text-muted"
                                style={{ width: "48px", height: "48px" }}
                              >
                                <i className="fa-solid fa-box text-black-50"></i>
                              </div>
                            )}
                            <div>
                              <div
                                className="fw-semibold text-dark text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Unit Price */}
                        <td className="text-end fw-semibold text-secondary">
                          <span className="extra-small text-muted me-1">
                            Ksh
                          </span>
                          {Number(item.unit_price).toLocaleString()}
                        </td>

                        {/* Quantity Controls */}
                        <td>
                          <div className="d-flex justify-content-center">
                            <div
                              className="input-group input-group-sm border rounded-3 overflow-hidden style-group"
                              style={{ width: "110px" }}
                            >
                              <button
                                className="btn btn-light text-dark border-0 px-2"
                                type="button"
                                onClick={() => handleDecrease(item.id)}
                                disabled={item.quantity <= 1}
                              >
                                <i className="fa-solid fa-minus extra-small"></i>
                              </button>
                              <span className="form-control text-center bg-white border-0 fw-bold px-1 py-1">
                                {item.quantity}
                              </span>
                              <button
                                className="btn btn-light text-dark border-0 px-2"
                                type="button"
                                onClick={() => handleIncrease(item.id)}
                              >
                                <i className="fa-solid fa-plus extra-small"></i>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Line Item Total */}
                        <td className="text-end fw-bold text-dark">
                          <span className="extra-small text-muted me-1">
                            Ksh
                          </span>
                          {Number(item.total_price).toLocaleString()}
                        </td>

                        {/* Remove Action */}
                        <td className="text-center pe-4">
                          <button
                            className="btn btn-sm btn-light text-danger border rounded-2 p-2"
                            onClick={() => handleRemove(item.id)}
                            title="Remove item"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="modal-footer bg-light p-4 flex-column align-items-stretch border-top">
              {/* Grand Total Row */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="text-dark fw-bold fs-6">Subtotal</span>
                  <p className="text-muted extra-small mb-0">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>
                <div className="text-end">
                  <span className="fs-4 fw-bold text-primary">
                    <small className="fs-6 me-1 text-muted">Ksh</small>
                    {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <button
                  type="button"
                  className="btn btn-primary rounded-3 px-4 py-2 flex-grow-1 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 w-100"
                  onClick={onClose}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
