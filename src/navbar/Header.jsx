import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-primary fw-bold">
            E-comm
          </Navbar.Brand>
          <Nav className="me-auto navbar-Wrapper">
            <Link to="/add" className="nav-link">
              Add Product
            </Link>
            <Link to="/update" className="nav-link">
              Update Product
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
