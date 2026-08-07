import React from "react";
import { Link, useLocation } from "react-router-dom";
import UserInfo from "../userinfo/UserInfo";
import Logout from "../authentication/Logout";
import Categories from "../category/Categories";
import Reports from "../reports/Reports";
import AddNewItem from "../newAdditions/AddNewItem";

const Sidebar = () => {
  const location = useLocation();
  const isDashboardActive = location.pathname === "/dashboard";

  return (
    <aside
      className="d-flex flex-column bg-white border-end vh-100 sticky-top shadow-sm"
      style={{ width: "180px", flexShrink: 0, zIndex: 1020 }}
    >
      {/* Top Section: User Info Avatar */}
      <div className="p-3 border-bottom d-flex justify-content-center bg-light-subtle">
        <UserInfo />
      </div>

      {/* Main Navigation Section */}
      <div className="d-flex flex-column align-items-center gap-3 py-4 flex-grow-1 overflow-y-auto">
        {/* Navigation Section Label */}
        <span className="text-uppercase extra-small text-muted fw-bold tracking-wider px-2">
          Menu
        </span>

        {/* Dashboard Link */}
        <Link
          to="/dashboard"
          className={`btn d-flex align-items-center justify-content-center rounded-3 transition-all ${
            isDashboardActive
              ? "btn-primary text-white shadow-sm"
              : "btn-light text-secondary border-0 bg-light-subtle"
          }`}
          style={{ width: "52px", height: "52px" }}
          title="Dashboard"
        >
          <i className="fa-solid fa-house fs-5"></i>
        </Link>

        {/* Add Dropdown (Category & Product) */}
        <div className="d-flex justify-content-center w-100">
          <AddNewItem />
        </div>

        {/* Categories Component / Icon */}
        <div className="d-flex justify-content-center w-100">
          <Categories />
        </div>

        {/* Reports Component / Icon */}
        <div className="d-flex justify-content-center w-100">
          <Reports />
        </div>
      </div>

      {/* Bottom Section: Logout Button */}
      <div className="mt-auto p-3 border-top bg-light-subtle d-flex justify-content-center">
        <Logout />
      </div>
    </aside>
  );
};

export default Sidebar;