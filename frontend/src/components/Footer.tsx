import { Link } from "react-router-dom"
import "../styles/Footer.css"
import AboutUsButton from "./ui/AboutUsButton"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">© 2025 Just Events. All rights reserved.</p>
          <Link to="/about-us" > 
          {/* className="footer-button" */}
            {/* About Us */}
            <AboutUsButton text="About Us" size="small" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
