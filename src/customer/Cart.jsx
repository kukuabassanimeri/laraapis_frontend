import React from "react";

const Cart = ({ cartItems, onClose, onCartUpdate }) => {
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
            total_price: (item.quantity + 1) * item.unit_price,
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
            total_price: (item.quantity - 1) * item.unit_price,
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

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-3">
          {/* Header */}
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">
              <i className="fa-solid fa-cart-shopping me-2 text-primary"></i>
              Your Shopping Cart
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted mb-0 fs-5">Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th className="text-center">Quantity</th>
                        <th>Total</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-semibold text-dark">{item.name}</td>
                          <td>{Number(item.unit_price).toLocaleString()}</td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <button
                                className="btn btn-outline-secondary btn-sm px-2 py-0"
                                onClick={() => handleDecrease(item.id)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="fw-bold px-1">
                                {item.quantity}
                              </span>
                              <button
                                className="btn btn-outline-secondary btn-sm px-2 py-0"
                                onClick={() => handleIncrease(item.id)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="fw-bold text-success">
                            {Number(item.total_price).toLocaleString()}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-danger btn-sm border-0"
                              onClick={() => handleRemove(item.id)}
                              title="Remove item"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <div>
                    <span className="text-muted me-2 fs-6">Grand Total</span>
                  </div>
                  <div>
                    <span className="fw-bold fs-5 text-success">
                      {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-top-0">
            <button
              type="button"
              className="btn btn-outline-dark rounded-2 px-4 w-100"
              onClick={onClose}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
