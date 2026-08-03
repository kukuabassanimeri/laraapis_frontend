import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./route/Router.jsx";
import ContextProvider from "./context/ContextProvider.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={Router} />
    </ContextProvider>
  </StrictMode>,
);
