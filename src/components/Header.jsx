const Header = () => {
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="bg-white border-bottom sticky-top py-2 px-4 shadow-sm"
      style={{ zIndex: 1010 }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between gap-3 px-0">
        {/* Left: Brand Identity */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "38px", height: "38px" }}
            >
              <i className="fa-solid fa-cubes fs-5"></i>
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0 lh-1">Yaka Technologies</h6>
              <span className="text-muted extra-small">Inventory System</span>
            </div>
          </div>
        </div>

        {/* Right: Date Badge & Notifications */}
        <div className="d-flex align-items-center gap-3">
          {/* Current Date Display */}
          <div className="d-none d-lg-flex align-items-center gap-2 text-muted small bg-light py-1.5 px-3 rounded-pill border">
            <i className="fa-regular fa-calendar text-primary"></i>
            <span className="fw-medium">{today}</span>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            className="btn btn-light position-relative rounded-circle border-0 text-secondary d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            title="Notifications"
          >
            <i className="fa-regular fa-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-2 border-white rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
