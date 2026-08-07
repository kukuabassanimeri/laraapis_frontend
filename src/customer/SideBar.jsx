import React from "react";
import { Link, useLocation } from "react-router-dom";
import UserInfo from "../userinfo/UserInfo";
import Logout from "../authentication/Logout";
import Categories from "../category/Categories";

const SideBar = () => {
  const location = useLocation();
  const isDashboardActive = location.pathname === "/dashboard";

  return (
    <aside
      className="d-flex flex-column bg-white border-end min-vh-100 shadow-sm"
      style={{ width: "180px", flexShrink: 0 }}
    >
      {/* Top Section: User Info Avatar Container */}
      <div className="p-3 border-bottom bg-light-subtle d-flex flex-column align-items-center text-center">
        <UserInfo />
      </div>

      {/* Main Navigation Section */}
      <div className="d-flex flex-column justify-content-center flex-grow-1 p-3 align-items-center text-center">
        <nav className="d-flex flex-column gap-2">
          {/* Section Header Label */}
          <span
            className="text-uppercase text-secondary fw-bold px-2 mb-1"
            style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
          >
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

          {/* Categories Component Wrapper */}
          <div className="w-100">
            <Categories />
          </div>
        </nav>

        {/* Bottom Section: Logout */}
        <div className="pt-3 border-top mt-auto">
          <Logout />
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
