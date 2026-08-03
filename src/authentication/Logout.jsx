import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useStateContext } from "../context/ContextProvider";

const Logout = () => {
  const { token, setToken, setUser } = useStateContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      if (token) {
        //* Send revoke request to Laravel Sanctum endpoint
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
      //* Reset context state (setToken automatically updates LocalStorage)
      setUser({});
      setToken(null);
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline-danger"
      size="sm"
      className="fw-semibold px-1 py-1 ms-2 d-flex align-items-center"
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
        <>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </>
      )}
    </Button>
  );
};

export default Logout;