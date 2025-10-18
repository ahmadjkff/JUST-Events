import React, { useState, useEffect } from "react";
import "../../styles/ui/DarkModeToggleSwitch.css";

interface ToggleSwitchProps {
  onChange?: (checked: boolean) => void;
}

const DarkModeToggleSwitch: React.FC<ToggleSwitchProps> = ({ onChange }) => {
  const [checked, setChecked] = useState(false);

  // Check if dark mode is enabled on initial load
  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setChecked(isDarkMode);
    if (isDarkMode) {
      document.body.classList.add("dark"); // Apply dark mode
    }
  }, []);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    
    // Update local storage to persist the state
    localStorage.setItem("darkMode", newValue.toString());

    if (newValue) {
      document.body.classList.add("dark"); // Apply dark mode
    } else {
      document.body.classList.remove("dark"); // Remove dark mode
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="toggle-switch">
      <label className="switch-label">
        <input
          type="checkbox"
          className="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default DarkModeToggleSwitch;
