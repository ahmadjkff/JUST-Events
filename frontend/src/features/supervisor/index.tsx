// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "../../protectedRoutes";

const SupervisorRoutes: React.FC = () => (
  <Routes>
    <Route
      path="dashboard"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default SupervisorRoutes;
