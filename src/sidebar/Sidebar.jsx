import React from "react";
import UserInfo from "./UserInfo";
import Logout from "../authentication/Logout";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import Reports from "./Reports";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column bg-white border-end min-vh-100 shadow-sm"
      style={{ width: "150px", flexShrink: 0 }}
    >
      {/* Top Section: User Info Avatar */}
      <div className="p-3 border-bottom d-flex justify-content-center">
        <UserInfo />
      </div>

      {/* Main Navigation Links */}
      <div className="d-flex flex-column align-items-center gap-3 py-4">
        {/* Dashboard Link */}
        <Link
          to="/dashboard"
          className="btn btn-light rounded-3 d-flex align-items-center justify-content-center text-dark"
          style={{ width: "48px", height: "48px" }}
          title="Dashboard"
        >
          <i className="fa-solid fa-house fs-5"></i>
        </Link>

        {/* Add Product Link */}
        <Link
          to="/add"
          className="btn btn-light rounded-3 d-flex align-items-center justify-content-center text-dark"
          style={{ width: "48px", height: "48px" }}
          title="Add New Product"
        >
          <i className="fa-solid fa-plus fs-5"></i>
        </Link>

        {/* Categories Icon / Component */}
        <Categories />

        {/* Reports Icon / Component */}
        <Reports />
      </div>

      {/* Bottom Section: Logout Button */}
      <div className="mt-auto p-3 border-top d-flex justify-content-center">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;