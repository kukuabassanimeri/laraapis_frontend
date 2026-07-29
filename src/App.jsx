import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";
import Register from "./authentication/Register";
import Login from "./authentication/Login";
import AdminDashboard from "./admindashboard/AdminDashboard";
import ProtectedRoute from "./authentication/ProtectedRoute";
import AllProduct from "./customer/AllProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Public Landing Page */}
        <Route path="/product" element={<AllProduct />}/>
        <Route path="/" element={<Navigate to="/product" replace />} />

        {/* Public Admin Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Inventory App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/update/:id" element={<UpdateProduct />} />
        </Route>

        {/* Redirect Unkown Routes Back to Customer Landing Page */}
        <Route path="*" element={<Navigate to="/product" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
