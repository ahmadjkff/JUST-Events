import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminRoutes from "./features/admin";
import SupervisorRoutes from "./features/supervisor";
import StudentRoutes from "./features/student";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/supervisor/*" element={<SupervisorRoutes />} />
        <Route path="/student/*" element={<StudentRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
