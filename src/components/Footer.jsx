import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-top py-3 px-4 mt-auto">
      <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        {/* Left: Brand & Copyright */}
        <div className="d-flex align-items-center gap-2 text-secondary small">
          <span className="fw-semibold text-dark">Yaka Technologies</span>
          <span className="text-muted">•</span>
          <span>© {currentYear} All Rights Reserved</span>
        </div>

        {/* Right: Utility Links & System Status */}
        <div className="d-flex align-items-center gap-3 small text-muted">
          <a
            href="#privacy"
            className="text-secondary text-decoration-none hover-primary"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
          <span className="text-black-50">•</span>
          <a
            href="#terms"
            className="text-secondary text-decoration-none hover-primary"
            onClick={(e) => e.preventDefault()}
          >
            Terms of Service
          </a>
          <span className="text-black-50">•</span>
          
          {/* Operational Status Badge */}
          <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded-pill border">
            <span
              className="rounded-circle bg-success d-inline-block"
              style={{ width: "6px", height: "6px" }}
            ></span>
            <span className="text-secondary extra-small fw-medium">
              System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;