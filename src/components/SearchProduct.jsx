const SearchProduct = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="position-relative" style={{ minWidth: "250px" }}>
      <input
        type="text"
        className="form-control form-control-sm pe-4 ps-4 rounded-3"
        placeholder="Search products by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Search Icon */}
      <span
        className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted small"
        style={{ pointerEvents: "none" }}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </span>

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          className="btn btn-link btn-sm position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none pe-2"
          onClick={() => setSearchTerm("")}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchProduct;