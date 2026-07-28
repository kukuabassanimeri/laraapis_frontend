import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  //* State to hold user registration details.
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  //* Navigation hook
  const navigate = useNavigate();

  //* Success, error, and loading states
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //* Handle input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //* Submit registration to Laravel API
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setSuccess("Account successfully created! Redirecting...");
        setError(null);

        // Clear input fields
        setUserDetails({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        });

        //* Redirect to login page after 2s
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(
          data.message || "An error occurred while creating an account.",
        );
      }
    } catch (err) {
      setError(
        "Unable to connect to the server. Please check your connection.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center py-2">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header Banner */}
            <div className="card-header bg-dark text-white text-center py-2 border-0">
              <h4 className="fw-bold mb-1">Create Account</h4>
              <p className="small mb-0 opacity-75">
                Register to manage inventory
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
                  className="alert alert-danger d-flex align-items-center rounded-3 p-2 mb-4"
                  role="alert"
                >
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-2">
                  <label
                    htmlFor="name"
                    className="form-label small fw-semibold text-secondary"
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
                    className="form-control form-control-lg fs-6 py-2 rounded-3"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="mb-2">
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
                    value={userDetails.email}
                    onChange={handleChange}
                    className="form-control form-control-lg fs-6 py-2 rounded-3"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-2">
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
                    value={userDetails.password}
                    onChange={handleChange}
                    className="form-control form-control-lg fs-6 py-2 rounded-3"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-2">
                  <label
                    htmlFor="password_confirmation"
                    className="form-label small fw-semibold text-secondary"
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
                      Creating account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>

            {/* Footer with Navigation Link */}
            <div className="card-footer bg-light text-center py-2 border-0">
              <span className="text-muted small">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary text-decoration-none fw-semibold small"
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
