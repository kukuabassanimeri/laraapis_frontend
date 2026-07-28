import React from "react";

const SocialLogin = () => {
    
  //* Trigger Socialite redirect
  const handleSocialLogin = (provider) => {
    window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/redirect`;
  };

  return (
    <div>
      {/* Divider */}
      <div className="d-flex align-items-center my-4">
        <hr className="flex-grow-1" />
        <span className="px-2 text-muted small">OR</span>
        <hr className="flex-grow-1" />
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        className="btn btn-outline-dark btn-lg w-100 rounded-3 fs-6 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2"
      >
        <i className="fa-brands fa-google text-danger fs-5"></i>
        Sign in with Google
      </button>
    </div>
  );
};

export default SocialLogin;