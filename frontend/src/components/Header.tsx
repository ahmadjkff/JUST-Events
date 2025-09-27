import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/Button";
import "../styles/Header.css";
import DarkModeToggleSwitch from "./ui/DarkModeToggleSwitch";

const Header = () => {
  const handleToggle = (checked: boolean) => {
    console.log("Toggle is now:", checked ? "ON" : "OFF");
  };
  const [language, setLanguage] = useState<"en" | "ar">("en");


  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Just Events
          </Link>

          <div className="header-actions">
            <DarkModeToggleSwitch
              onChange={handleToggle}
            />
            <Button onClick={toggleLanguage}>
              {language === "en" ? "AR" : "EN"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


