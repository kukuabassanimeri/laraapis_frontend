import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import Footer from "./Footer";
import Header from "./Header";

const DefaultLayout = () => {
  const { token } = useStateContext();

  //* Redirect unauthenticated users to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default DefaultLayout;
