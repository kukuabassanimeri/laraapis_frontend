import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";
import Register from "./authentication/Register";
import Login from "./authentication/Login";
import AdminDashboard from "./admindashboard/AdminDashboard";
import ProtectedRoute from "./authentication/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Inventory App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/update/:id" element={<UpdateProduct />} />
        </Route>

        {/* Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
