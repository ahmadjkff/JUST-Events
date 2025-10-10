import { Link } from "react-router-dom";
import "../styles/Footer.css";
import AboutUsButton from "./ui/AboutUsButton";
import { useTranslation } from "react-i18next"; 

const Footer = () => {
  const { t } = useTranslation(); 

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">
            © {new Date().getFullYear()} {t("app.name")}. {t("footer.allRightsReserved")}
          </p>
          <Link to="/about-us">
            <AboutUsButton text={t("footer.aboutUs")} size="small" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
