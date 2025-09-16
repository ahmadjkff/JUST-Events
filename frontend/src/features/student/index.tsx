// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import MyEvents from "./pages/MyEvents";
import ProtectedRoute from "../../protectedRoutes";
import BrowseEvents from "../../pages/browseEvents";
import Profile from "../../pages/profile";
import Setting from "../../pages/setting";
import NotFound from "../../pages/NotFound";

const StudentRoutes: React.FC = () => (
  <Routes>
    <Route
      path="setting"
      element={
        <ProtectedRoute allowedRoles={["student", "supervisor"]}>
          <Setting />
        </ProtectedRoute>
      }
    />
    <Route
      path="profile"
      element={
        <ProtectedRoute allowedRoles={["student", "supervisor"]}>
          <Profile />
        </ProtectedRoute>
      }
    />
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
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default StudentRoutes;
