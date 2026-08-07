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
      <button
        type="button"
        className={`btn btn-light rounded-3 d-flex align-items-center justify-content-center text-dark border-0 position-relative ${
          currentCategory ? "active bg-dark text-white" : ""
        }`}
        style={{ width: "48px", height: "48px" }}
        title="Filter by Category"
        data-bs-toggle="dropdown"
        data-bs-display="static"
        aria-expanded="false"
      >
        <i className="fa-solid fa-layer-group fs-5"></i>

        {currentCategory && (
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">Filter Active</span>
          </span>
        )}
      </button>

      <ul
        className="dropdown-menu shadow-lg border-0 rounded-3 p-2 ms-2"
        style={{ minWidth: "180px", zIndex: 1050 }}
      >
        <li className="px-2 py-1 mb-1">
          <small className="fw-bold text-uppercase text-muted fs-7">
            Filter Inventory
          </small>
        </li>

        <li>
          <button
            type="button"
            className={`dropdown-item rounded-2 py-2 d-flex align-items-center justify-content-between ${
              !currentCategory ? "active bg-dark text-white fw-bold" : ""
            }`}
            onClick={() => handleSelectCategory("")}
          >
            <span>All Products</span>
            {!currentCategory && <i className="fa-solid fa-check fs-6"></i>}
          </button>
        </li>

        <li>
          <hr className="dropdown-divider my-1" />
        </li>

        {loading ? (
          <li className="px-3 py-2 text-muted small text-center">
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Loading categories...
          </li>
        ) : categories.length === 0 ? (
          <li className="px-3 py-2 text-muted small text-center">
            No categories available
          </li>
        ) : (
          categories.map((cat) => {
            const isSelected = String(currentCategory) === String(cat.id);
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  className={`dropdown-item rounded-2 py-2 d-flex align-items-center justify-content-between ${
                    isSelected ? "active bg-dark text-white fw-bold" : ""
                  }`}
                  onClick={() => handleSelectCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  {isSelected && <i className="fa-solid fa-check fs-6"></i>}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default Categories;