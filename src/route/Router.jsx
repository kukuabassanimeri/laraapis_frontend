import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";
import GuestLayout from "../components/GuestLayout";

//* Pages
import AllProduct from "../customer/AllProduct";
import AddToCart from "../customer/AddToCart";
import Cart from "../customer/Cart";
import Register from "../authentication/Register";
import Login from "../authentication/Login";
import Dashboard from "../dashboard/Dashboard";
import AddProduct from "../components/AddProduct";
import DeleteProduct from "../components/DeleteProduct";
import EditProduct from "../components/EditProduct";
import SearchProduct from "../components/SearchProduct";
import NotFound from "../authentication/NotFound";

const Router = createBrowserRouter([
  //* Routes accessible by guests & logged-in users
  {
    path: "/",
    element: <Navigate to="/allproducts" replace />,
  },
  {
    path: "/allproducts",
    element: <AllProduct />,
  },

  //* GUEST-ONLY ROUTES: Login / Register
  {
    element: <GuestLayout />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },

  //* PROTECTED ROUTES: Requires Login / Auth Guard
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "addtocart",
        element: <AddToCart />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "delete",
            element: <DeleteProduct />,
          },
          {
            path: "edit/:id",
            element: <EditProduct />,
          },
          {
            path: "search",
            element: <SearchProduct />,
          },
        ],
      },
      {
        path: "add",
        element: <AddProduct />,
      },
    ],
  },

  //* 404 / FALLBACK ROUTE
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;
