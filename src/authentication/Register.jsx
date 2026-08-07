import { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

const Register = () => {
  //* Access global context setters
  const { setToken, setUser } = useStateContext();

  //* State for form fields
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "customer",
  });

  //* UI state
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //* Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //* Helper function to display temporary errors
  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  //* Submit registration to Laravel API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    //* Client-side confirmation check
    if (userDetails.password !== userDetails.password_confirmation) {
      triggerError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user) setUser(data.user);
        if (data.token) setToken(data.token);
      } else {
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          triggerError(data.errors[firstErrorKey][0]);
        } else {
          triggerError(
            data.message || "An error occurred while creating an account."
          );
        }
      }
    } catch (err) {
      triggerError(
        "Unable to connect to the server. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
            {/* Header Banner */}
            <div className="card-header bg-dark text-white text-center py-4 border-0">
              <h4 className="fw-bold mb-1">Create Account</h4>
              <p className="small mb-0 text-white-50">
                Register to manage inventory
              </p>
            </div>

            <div className="card-body p-4 p-sm-5 bg-white">
              {/* Alert Feedback */}
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center mb-4"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                  <div className="small">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="form-label small fw-bold text-uppercase text-secondary"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Drake"
                    value={userDetails.name}
                    onChange={handleChange}
                    className="form-control py-2"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label small fw-bold text-uppercase text-secondary"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={userDetails.email}
                    onChange={handleChange}
                    className="form-control py-2"
                    required
                  />
                </div>

                {/* Account Role Dropdown */}
                <div className="mb-3">
                  <label
                    htmlFor="role"
                    className="form-label small fw-bold text-uppercase text-secondary"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={userDetails.role}
                    onChange={handleChange}
                    className="form-select py-2"
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label small fw-bold text-uppercase text-secondary"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={userDetails.password}
                    onChange={handleChange}
                    className="form-control py-2"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label
                    htmlFor="password_confirmation"
                    className="form-label small fw-bold text-uppercase text-secondary"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="••••••••"
                    value={userDetails.password_confirmation}
                    onChange={handleChange}
                    className="form-control py-2"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2 fw-semibold shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>

            {/* Footer with Navigation Link */}
            <div className="card-footer bg-light text-center py-3 border-top-0">
              <span className="text-muted small">Already have an account? </span>
              <Link
                to="/login"
                className="text-primary text-decoration-none fw-semibold small ms-1"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;