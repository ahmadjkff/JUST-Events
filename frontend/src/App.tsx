import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import AdminRoutes from "./features/admin";
import SupervisorRoutes from "./features/supervisor";
import StudentRoutes from "./features/student";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Sidebar from "./components/Sidebar";
import BrowseEvents from "./pages/browseEvents";
import Profile from "./pages/profile";
import Setting from "./pages/setting";
import Notifications from "./pages/notifications";
import AboutUs from "./pages/aboutUs";
import EventDetails from "./pages/eventDetails";
import RegistredStudents from "./pages/RegistredStudents";
import VolunteeredStudents from "./pages/VolunteeredStudents";

function App() {
  return (
    <Router>
      <Header />
      <div className="flex">
        <Sidebar />

        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/browse-events" element={<BrowseEvents />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/supervisor/*" element={<SupervisorRoutes />} />
            <Route path="/student/*" element={<StudentRoutes />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route
              path="/registred-students/:eventId"
              element={<RegistredStudents />}
            />
            <Route
              path="/volunteered-students/:eventId"
              element={<VolunteeredStudents />}
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Footer />
      <Toaster position="top-center" />
    </Router>
  );
}

export default App;
