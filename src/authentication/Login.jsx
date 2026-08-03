import { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  //* Access state management from Context
  const { setToken, setUser } = useStateContext();

  //* State to hold user login details
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  //* Feedback and loading states
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //* Handle input changes
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
    setError(null);

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
        //* Save user and token to Context
        setUser(data.user);
        setToken(data.token);
      } else {
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          setError(data.errors[firstErrorKey][0]);
        } else {
          setError(data.message || "Invalid login credentials.");
        }
      }
    } catch (err) {
      setError(
        "Unable to connect to the server. Please check your network connection.",
      );
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
            <div className="card-header bg-dark text-white text-center py-4 border-0">
              <h4 className="fw-bold mb-1">Welcome Back</h4>
              <p className="small mb-0 opacity-75">
                Sign in to manage inventory
              </p>
            </div>

            <div className="card-body p-4 p-sm-5 bg-white">
              {/* Alert Feedback */}
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center rounded-3 p-3 mb-4 small"
                  role="alert"
                >
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email Field */}
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

                {/* Password Field */}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-outline-dark btn-lg w-100 rounded-3 fs-6 fw-semibold py-2 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>

            {/* Navigation Footer */}
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
