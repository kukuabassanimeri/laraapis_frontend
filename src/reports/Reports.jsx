import React from "react";
import { Link, useLocation } from "react-router-dom";

const Reports = () => {
  const location = useLocation();
  const isReportsActive = location.pathname === "/reports";

  return (
    <Link
      to="/reports"
      className={`btn d-flex align-items-center justify-content-center rounded-3 transition-all border-0 ${
        isReportsActive
          ? "btn-primary text-white shadow-sm"
          : "btn-light text-secondary bg-light-subtle"
      }`}
      style={{ width: "52px", height: "52px" }}
      title="Reports"
    >
      <i className="fa-solid fa-chart-line fs-5"></i>
    </Link>
  );
};

export default Reports;
