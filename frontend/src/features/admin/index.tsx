import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../protectedRoutes";
import NotFound from "../../pages/NotFound";
import ControlEvents from "./pages/ControlEvents";
import ManageRoles from "./pages/ManageRoles";
import Dashboard from "./pages/Dashboard";
import VolunteerControl from "./pages/VolunteerControl";
import AdminStatistics from "./pages/AdminStatistics";

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
        <ProtectedRoute allowedRoles={["admin"]}>
          <ControlEvents />
        </ProtectedRoute>
      }
    />
    <Route
      path="manage-roles"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <ManageRoles />
        </ProtectedRoute>
      }
    />
    <Route
      path="volunteer-control"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <VolunteerControl />
        </ProtectedRoute>
      }
    />
    <Route
      path="statistics"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminStatistics />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AdminRoutes;
