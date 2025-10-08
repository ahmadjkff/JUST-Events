import React, { useEffect } from "react";
import "../../styles/ui/LanguageToggleSwitch.css";
import { useTranslation } from "react-i18next";

interface LanguageToggleSwitchProps {
  defaultChecked?: boolean;
}

const LanguageToggleSwitch: React.FC<LanguageToggleSwitchProps> = ({
  defaultChecked = false,
}) => {

  const { i18n } = useTranslation();

  useEffect(() => {
    // set document direction and lang attr whenever language changes
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = dir;
    // optional: change font for Arabic
    if (i18n.language === 'ar') {
      document.documentElement.style.fontFamily = "'Cairo', sans-serif";
    } else {
      document.documentElement.style.fontFamily = "'Inter', sans-serif";
    }
  }, [i18n.language]);

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };


  return (
    <div className="checkbox-wrapper-8">
      <input
        type="checkbox"
        id="language-toggle"
        className="tgl tgl-skewed"
        defaultChecked={defaultChecked}
        onChange={(e) => changeLang(e.target.checked ? "en" : "ar")}
      />
      <label
        htmlFor="language-toggle"
        className="tgl-btn"
        data-tg-on="en"
        data-tg-off="ar"
      ></label>
    </div>
  );
};

export default LanguageToggleSwitch;




