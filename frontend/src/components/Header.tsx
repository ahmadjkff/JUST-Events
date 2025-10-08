import { Link } from "react-router-dom";
import "../styles/Header.css";
import DarkModeToggleSwitch from "./ui/DarkModeToggleSwitch";
import LanguageToggleSwitch from "./ui/LanguageToggleSwitch";
import { useAuth } from "../context/auth/AuthContext";

const Header = () => {
  const { user } = useAuth();

  const DarkModeHandleToggle = (checked: boolean) => {
    console.log("Toggle is now:", checked ? "ON" : "OFF");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link
            to={user?.role === "admin" ? "/admin/dashboard" : "/"}
            className="logo"
          >
            Just Events
          </Link>
          <div className="header-actions">
            <DarkModeToggleSwitch onChange={DarkModeHandleToggle} />
            <LanguageToggleSwitch/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
