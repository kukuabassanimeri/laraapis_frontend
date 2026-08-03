import React from "react";
import { useStateContext } from "../context/ContextProvider";

const UserInfo = () => {
  const { user } = useStateContext();

  return (
    <div className="d-flex flex-column align-items-center text-center">
        
      {/* Circle Icon Container */}
      <div
        className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center border border-primary-subtle mb-1"
        style={{ width: "42px", height: "42px" }}
        title={user?.name || "User Profile"}
      >
        <i className="fa-solid fa-user fs-5" role="button"></i>
      </div>

      {/* User Name Below */}
      <span
        className="text-dark fw-semibold small text-truncate"
        style={{ maxWidth: "70px" }}
        title={user?.name || "Guest"}
      >
        {user?.name || "Guest"}
      </span>
    </div>
  );
};

export default UserInfo;
