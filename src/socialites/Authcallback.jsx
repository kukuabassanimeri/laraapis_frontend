import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

const Authcallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useStateContext();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token) {
      setToken(token);

      fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load user info.");
          return res.json();
        })
        .then((userData) => {
          setUser(userData);
          navigate("/dashboard", { replace: true });
        })
        .catch((err) => {
          console.error("Auth Callback Error:", err);
          setErrorMsg("Failed to complete login. Please try again.");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, setToken, setUser]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      {errorMsg ? (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      ) : (
        <>
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">
              Completing authentication...
            </span>
          </div>
          <p className="text-secondary fw-semibold">
            Finalizing Social Login...
          </p>
        </>
      )}
    </div>
  );
};

export default Authcallback;
