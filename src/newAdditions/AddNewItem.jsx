import React, { useState } from "react";
import AddCategory from "../category/AddCategory";
import AddProduct from "../dashboard/AddProduct";

const AddNewItem = () => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  return (
    <>
      <div className="dropend position-relative">
        {/* Trigger Button */}
        <button
          type="button"
          className="btn btn-light text-secondary bg-light-subtle d-flex align-items-center justify-content-center rounded-3 transition-all border-0"
          style={{ width: "52px", height: "52px" }}
          title="Create New..."
          data-bs-toggle="dropdown"
          data-bs-display="static"
          aria-expanded="false"
        >
          <i className="fa-solid fa-plus fs-5"></i>
        </button>

        {/* Flyout Dropdown Menu */}
        <ul
          className="dropdown-menu shadow-lg border rounded-3 p-2 ms-2 overflow-hidden"
          style={{ minWidth: "210px", zIndex: 1050 }}
        >
          {/* Header Label */}
          <li className="px-2 py-1 mb-1">
            <span className="extra-small fw-bold text-uppercase text-muted tracking-wider">
              Create New
            </span>
          </li>

          {/* Option 1: Add Category */}
          <li>
            <button
              type="button"
              className="dropdown-item rounded-2 py-2 px-2 my-1 d-flex align-items-center gap-3 text-dark transition-all"
              onClick={() => setShowCategoryModal(true)}
            >
              <div
                className="bg-primary-subtle text-primary rounded-2 p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "36px", height: "36px" }}
              >
                <i className="fa-solid fa-folder-plus fs-6"></i>
              </div>
              <div className="text-start">
                <div className="fw-semibold small lh-1 mb-1">Add Category</div>
              </div>
            </button>
          </li>

          {/* Option 2: Add Product */}
          <li>
            <button
              type="button"
              className="dropdown-item rounded-2 py-2 px-2 my-1 d-flex align-items-center gap-3 text-dark transition-all"
              onClick={() => setShowProductModal(true)}
            >
              <div
                className="bg-success-subtle text-success rounded-2 p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "36px", height: "36px" }}
              >
                <i className="fa-solid fa-box-open fs-6"></i>
              </div>
              <div className="text-start">
                <div className="fw-semibold small lh-1 mb-1">Add Product</div>
              </div>
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
