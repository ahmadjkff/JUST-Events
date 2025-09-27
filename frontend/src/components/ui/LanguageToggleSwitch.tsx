import React from "react";
import "../../styles/ui/LanguageToggleSwitch.css";


interface LanguageToggleSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const LanguageToggleSwitch: React.FC<LanguageToggleSwitchProps> = ({
  defaultChecked = false,
  onChange,
}) => {
  return (
    <div className="checkbox-wrapper-8">
      <input
        type="checkbox"
        id="language-toggle"
        className="tgl tgl-skewed"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      <label
        htmlFor="language-toggle"
        className="tgl-btn"
        data-tg-on="EN"
        data-tg-off="AR"
      ></label>
    </div>
  );
};

export default LanguageToggleSwitch;
