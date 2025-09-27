import React, { useState } from "react";
import "../../styles/ui/DarkModeToggleSwitch.css";

interface ToggleSwitchProps {
  onChange?: (checked: boolean) => void;
}

const DarkModeToggleSwitch: React.FC<ToggleSwitchProps> = ({ onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
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