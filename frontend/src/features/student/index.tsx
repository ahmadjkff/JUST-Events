// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import MyEvents from "./pages/MyEvents";
import ProtectedRoute from "../../protectedRoutes";
import StudentHome from "./pages/studentHome";

const StudentRoutes: React.FC = () => (
  <Routes>
    <Route
      index
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentHome />
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
