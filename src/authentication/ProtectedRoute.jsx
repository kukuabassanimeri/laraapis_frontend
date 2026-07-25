import React from "react";
import { Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Logout from "./Logout";
import Footer from "../components/Footer";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  //* If no token exists, redirect user to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Top Navigation Header */}
      <Navbar bg="dark" variant="dark" className="shadow-sm py-2">
        <Container fluid className="px-3 px-md-5 d-flex justify-content-between align-items-center">
          <Navbar.Brand
            as={Link}
            to="/dashboard"
            className="text-primary fw-bold fs-4 m-0"
          >
            Yaka Inventory
          </Navbar.Brand>

          {/* Logout Component */}
          <Logout />
        </Container>
      </Navbar>

      {/* Renders active child route */}
      <main className="bg-light min-vh-100">
        <Outlet />
      </main>

      {/* Footer component */}
      <Footer />
    </>
  );
};

export default ProtectedRoute;
