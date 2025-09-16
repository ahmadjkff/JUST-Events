// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "../../protectedRoutes";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import NotFound from "../../pages/NotFound";

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
    <Route
      path="events"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <Events />
        </ProtectedRoute>
      }
    />
    <Route
      path="settings"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default SupervisorRoutes;
