// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../../protectedRoutes";
import NotFound from "../../pages/NotFound";
import ControlEvents from "./pages/ControlEvents";
import Dashboard from "../../pages/dashboard";

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
    <Route
      path="control-events"
      element={
        <ProtectedRoute>
          <ControlEvents />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AdminRoutes;
