import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

const Categories = () => {
  const { token } = useStateContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
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
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleSelectCategory = (categoryId) => {
    if (categoryId) {
      searchParams.set("category", categoryId);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="dropend position-relative">
      {/* Trigger Button */}
      <button
        type="button"
        className={`btn d-flex align-items-center justify-content-center rounded-3 transition-all border-0 position-relative ${
          currentCategory
            ? "btn-primary text-white shadow-sm"
            : "btn-light text-secondary bg-light-subtle"
        }`}
        style={{ width: "52px", height: "52px" }}
        title="Filter by Category"
        data-bs-toggle="dropdown"
        data-bs-display="static"
        aria-expanded="false"
      >
        <i className="fa-solid fa-layer-group fs-5"></i>

        {/* Active Filter Badge */}
        {currentCategory && (
          <span
            className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-2 border-white rounded-circle"
            style={{ width: "12px", height: "12px" }}
          >
            <span className="visually-hidden">Filter Active</span>
          </span>
        )}
      </button>

      {/* Flyout Dropdown Menu */}
      <ul
        className="dropdown-menu shadow-lg border rounded-3 p-2 ms-2 overflow-hidden"
        style={{ minWidth: "210px", zIndex: 1050 }}
      >
        {/* Menu Header */}
        <li className="px-2 py-1 mb-1 d-flex align-items-center justify-content-between">
          <span className="extra-small fw-bold text-uppercase text-muted tracking-wider">
            Filter Inventory
          </span>
          {currentCategory && (
            <span className="badge bg-primary-subtle text-primary extra-small rounded-pill px-2">
              Active
            </span>
          )}
        </li>

        {/* Option: All Products */}
        <li>
          <button
            type="button"
            className={`dropdown-item rounded-2 py-2 px-3 my-1 d-flex align-items-center justify-content-between transition-all ${
              !currentCategory
                ? "active bg-primary text-white fw-semibold"
                : "text-dark"
            }`}
            onClick={() => handleSelectCategory("")}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-boxes-stacked fs-6 opacity-75"></i>
              <span>All Products</span>
            </div>
            {!currentCategory && <i className="fa-solid fa-check fs-6"></i>}
          </button>
        </li>

        <li>
          <hr className="dropdown-divider my-2 opacity-50" />
        </li>

        {/* Categories List Section */}
        <div
          className="overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "240px" }}
        >
          {loading ? (
            <li className="px-3 py-3 text-muted small text-center d-flex align-items-center justify-content-center gap-2">
              <span
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              ></span>
              <span>Loading...</span>
            </li>
          ) : categories.length === 0 ? (
            <li className="px-3 py-3 text-muted small text-center">
              <i className="fa-solid fa-folder-open d-block fs-5 text-black-50 mb-1"></i>
              No categories found
            </li>
          ) : (
            categories.map((cat) => {
              const isSelected = String(currentCategory) === String(cat.id);
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 my-1 d-flex align-items-center justify-content-between transition-all ${
                      isSelected
                        ? "active bg-primary text-white fw-semibold"
                        : "text-dark"
                    }`}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    <span className="text-truncate me-2">{cat.name}</span>
                    {isSelected && <i className="fa-solid fa-check fs-6"></i>}
                  </button>
                </li>
              );
            })
          )}
        </div>
      </ul>
    </div>
  );
};

export default Categories;