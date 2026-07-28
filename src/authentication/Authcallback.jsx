import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Authcallback = ({ onLoginSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.setItem("token", token);

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      navigate("/dashboard", { replace: true });
    } else if (error) {
      navigate("/login?error=" + encodeURIComponent(error), { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, onLoginSuccess]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Completing authentication...</span>
      </div>
    </div>
  );
};

export default Authcallback;