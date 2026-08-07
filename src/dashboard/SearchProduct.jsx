/**
 * SearchProduct Component
 * @param {string}   searchTerm    Current search input state
 * @param {Function} setSearchTerm Callback to update search input state
 */
const SearchProduct = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="position-relative" style={{ minWidth: "280px", maxWidth: "400px" }}>
      {/* Search Input Field */}
      <input
        type="text"
        className="form-control bg-light-subtle border ps-5 pe-5 rounded-3 py-2 text-dark small shadow-none transition-all"
        placeholder="Search product by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Search Icon */}
      <span
        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
        style={{ pointerEvents: "none" }}
      >
        <i className="fa-solid fa-magnifying-glass fs-6"></i>
      </span>

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          className="btn btn-sm text-muted position-absolute top-50 end-0 translate-middle-y me-2 p-0 d-flex align-items-center justify-content-center rounded-circle hover-bg-light"
          style={{ width: "24px", height: "24px", lineHeight: 1 }}
          onClick={() => setSearchTerm("")}
          title="Clear search"
          aria-label="Clear search"
        >
          <i className="fa-solid fa-xmark fs-6"></i>
        </button>
      )}
    </div>
  );
};

export default SearchProduct;