// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import MyEvents from "./pages/MyEvents";
import ProtectedRoute from "../../protectedRoutes";
import NotFound from "../../pages/NotFound";
import MyCertificates from "./pages/myCertificates";
import MyCompletedEvents from "./pages/MyCompletedEvents";

const StudentRoutes: React.FC = () => (
  <Routes>
    <Route
      path="my-events"
      element={
        <ProtectedRoute allowedRoles={["student", "supervisor"]}>
          <MyEvents />
        </ProtectedRoute>
      }
    />
    <Route
      path="my-completed-events"
      element={
        <ProtectedRoute allowedRoles={["student", "supervisor"]}>
          <MyCompletedEvents />
        </ProtectedRoute>
      }
    />
    <Route
      path="my-certificates"
      element={
        <ProtectedRoute allowedRoles={["student", "supervisor"]}>
          <MyCertificates />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default StudentRoutes;
