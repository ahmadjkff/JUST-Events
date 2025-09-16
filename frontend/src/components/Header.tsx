import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Just Events
          </Link>
          {/* TO DO: add dark mode and language button */}
          <h1 className="header-title">buttons</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
