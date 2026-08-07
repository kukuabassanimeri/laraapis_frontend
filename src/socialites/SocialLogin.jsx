import React, { useState } from "react";

const SocialLogin = () => {
  const [redirecting, setRedirecting] = useState(false);

  const handleSocialLogin = (provider) => {
    setRedirecting(true);
    window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/redirect`;
  };

  return (
    <div>
      {/* Divider */}
      <div className="d-flex align-items-center my-4">
        <hr className="flex-grow-1 m-0 text-secondary opacity-25" />
        <span className="px-3 text-secondary small fw-bold text-uppercase">OR</span>
        <hr className="flex-grow-1 m-0 text-secondary opacity-25" />
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        disabled={redirecting}
        onClick={() => handleSocialLogin("google")}
        className="btn btn-outline-secondary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
      >
        {redirecting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            Redirecting to Google...
          </>
        ) : (
          <>
            <i className="bi bi-google text-danger fs-6"></i>
            Continue with Google
          </>
        )}
      </button>
    </div>
  );
};

export default SocialLogin;