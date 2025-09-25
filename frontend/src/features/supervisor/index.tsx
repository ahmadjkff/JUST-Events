// src/pages/admin/index.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "../../protectedRoutes";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import NotFound from "../../pages/NotFound";
import EventForm from "./pages/CreateEvent";
import EditForm from "./pages/EditEvents";
import SupervisorApplications from "./pages/SupervisorApplications";
import EventCard from "./pages/EventCard";
import EventApplications from "./pages/EventApplications";

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
      path="create-event"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <EventForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="edit-event/:eventId"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <EditForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="control-applications"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <SupervisorApplications />
        </ProtectedRoute>
      }
    />
    <Route
      path="/event/:eventId"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <EventCard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/event/:eventId/applications"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <EventApplications />
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
