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
        <hr className="flex-grow-1" />
        <span className="px-2 text-muted small fw-semibold">OR</span>
        <hr className="flex-grow-1" />
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        disabled={redirecting}
        onClick={() => handleSocialLogin("google")}
        className="btn btn-outline-dark btn-lg w-100 rounded-3 fs-6 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2"
      >
        <i className="fa-brands fa-google text-danger fs-5"></i>
        {redirecting ? "Redirecting to Google..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default SocialLogin;
