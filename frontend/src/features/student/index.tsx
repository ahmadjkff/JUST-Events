// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import MyEvents from "./pages/MyEvents";
import ProtectedRoute from "../../protectedRoutes";
import BrowseEvents from "../../pages/browseEvents";

const StudentRoutes: React.FC = () => (
  <Routes>
    <Route
      path="browse-events"
      element={
        <ProtectedRoute allowedRoles={["student", "supervisor"]}>
          <BrowseEvents />
        </ProtectedRoute>
      }
    />
    <Route
      path="my-events"
      element={
        <ProtectedRoute allowedRoles={["student", "supervisor"]}>
          <MyEvents />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default StudentRoutes;
