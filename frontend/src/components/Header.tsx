import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/Button"; 
import "../styles/Header.css";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

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
            <Button onClick={toggleDarkMode}>
              {darkMode ? "Light" : "Dark"}
            </Button>
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


