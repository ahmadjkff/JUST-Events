// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import MyEvents from "./pages/MyEvents";
import ProtectedRoute from "../../protectedRoutes";
import NotFound from "../../pages/NotFound";


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
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default StudentRoutes;
