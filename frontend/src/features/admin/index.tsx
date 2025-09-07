// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "../../protectedRoutes";

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route
      path="dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AdminRoutes;
