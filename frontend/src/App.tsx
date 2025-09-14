import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminRoutes from "./features/admin";
import SupervisorRoutes from "./features/supervisor";
import StudentRoutes from "./features/student";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProtectedRoute from "./protectedRoutes";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/supervisor/*" element={<SupervisorRoutes />} />
        <Route path="/student/*" element={<StudentRoutes />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
