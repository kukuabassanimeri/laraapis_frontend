import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (token) {
        //* Send request to Laravel Sanctum logout endpoint
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Error logging out from server:", err);
    } finally {
      //* Clear token & user info regardless of network response
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoading(false);

      //* Redirect to login page
      navigate("/login");
    }
  };

  return (
    <Button
      variant="outline-danger"
      size="sm"
      className="fw-semibold px-3 py-1 ms-2 d-flex align-items-center gap-2"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span>Logging out...</span>
        </>
      ) : (
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
      )}
    </Button>
  );
};

export default Logout;
