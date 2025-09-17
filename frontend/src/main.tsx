import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AuthProvider from "./context/auth/AuthProvider.tsx";
import EventProvider from "./context/event/EventProvider";
import "./main.css";
import SupervisorProvider from "./context/supervisor/SupervisorProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SupervisorProvider>
        <EventProvider>
          <App />
        </EventProvider>
      </SupervisorProvider>
    </AuthProvider>
  </StrictMode>
);
