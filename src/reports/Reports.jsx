import React from "react";
import { Link } from "react-router-dom";

const Reports = () => {
  return (
    <Link
      to="/reports"
      className="btn btn-light rounded-3 d-flex align-items-center justify-content-center text-dark"
      style={{ width: "48px", height: "48px" }}
      title="Reports"
    >
      <i className="fa-solid fa-chart-line fs-5"></i>
    </Link>
  );
};

export default Reports;