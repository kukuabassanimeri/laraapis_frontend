import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ onLoginSuccess }) => {
  //* State to hold user login details
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  //* Navigation hook
  const navigate = useNavigate();

  //* Success, error, and loading states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //* Handle input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //* Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginDetails),
      });

      const data = await response.json();

      if (response.ok) {
        //* Save the Sanctum token
        localStorage.setItem("token", data.token);

        setSuccess("Login successful! Redirecting...");
        setError(null);

        //* Clear the login input fields
        setLoginDetails({
          email: "",
          password: "",
        });

        //* Notify parent component if callback exists
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        //* Navigate after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(
          data.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header Banner */}
            <div className="card-header bg-primary text-white text-center py-4 border-0">
              <h4 className="fw-bold mb-1">Welcome Back</h4>
              <p className="small mb-0 opacity-75">
                Sign in to continue shopping
              </p>
            </div>

            <div className="card-body p-4 p-sm-5 bg-white">
              {/* Alert Feedback */}
              {success && (
                <div
                  className="alert alert-success d-flex align-items-center rounded-3 p-3 mb-4"
                  role="alert"
                >
                  <span className="me-2">✓</span>
                  <div>{success}</div>
                </div>
              )}

              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center rounded-3 p-3 mb-4"
                  role="alert"
                >
                  <span className="me-2">⚠️</span>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* User Email */}
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label small fw-semibold text-secondary"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={loginDetails.email}
                    onChange={handleChange}
                    className="form-control form-control-lg fs-6 py-2 rounded-3"
                    required
                  />
                </div>

                {/* User Password */}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="form-label small fw-semibold text-secondary"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={loginDetails.password}
                    onChange={handleChange}
                    className="form-control form-control-lg fs-6 py-2 rounded-3"
                    required
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fs-6 fw-semibold py-2 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing In...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>

            {/* Footer with Navigation Link */}
            <div className="card-footer bg-light text-center py-3 border-0">
              <span className="text-muted small">Don't have an account? </span>
              <Link
                to="/register"
                className="text-primary text-decoration-none fw-semibold small"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
