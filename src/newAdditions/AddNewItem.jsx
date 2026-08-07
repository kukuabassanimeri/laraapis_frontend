import React, { useState } from "react";
import AddCategory from "../category/AddCategory";
import AddProduct from "../dashboard/AddProduct";

const AddNewItem = () => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  return (
    <>
      <div className="dropend position-relative">
        <button
          type="button"
          className="btn btn-light rounded-3 d-flex align-items-center justify-content-center text-dark border-0"
          style={{ width: "48px", height: "48px" }}
          title="Add New..."
          data-bs-toggle="dropdown"
          data-bs-display="static"
          aria-expanded="false"
        >
          <i className="fa-solid fa-plus fs-5"></i>
        </button>

        <ul
          className="dropdown-menu shadow-lg border-0 rounded-3 p-2 ms-2"
          style={{ minWidth: "180px", zIndex: 1050 }}
        >
          <li className="px-2 py-1 mb-1">
            <small className="fw-bold text-uppercase text-muted fs-7">
              Create New
            </small>
          </li>

          {/* Option 1: Add Category */}
          <li>
            <button
              type="button"
              className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-dark"
              onClick={() => setShowCategoryModal(true)}
            >
              <i className="fa-solid fa-folder-plus text-dark"></i>
              <span>Add Category</span>
            </button>
          </li>

          {/* Option 2: Add Product */}
          <li>
            <button
              type="button"
              className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-dark"
              onClick={() => setShowProductModal(true)}
            >
              <i className="fa-solid fa-box-open text-dark"></i>
              <span>Add Product</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Add Category Modal */}
      <AddCategory
        show={showCategoryModal}
        handleClose={() => setShowCategoryModal(false)}
        onSuccess={(newCategory) => {
          console.log("Created category successfully:", newCategory);
        }}
      />

      {/* Add Product Modal */}
      <AddProduct
        show={showProductModal}
        handleClose={() => setShowProductModal(false)}
        onSuccess={(newProduct) => {
          console.log("Created product successfully:", newProduct);
        }}
      />
    </>
  );
};

export default AddNewItem;