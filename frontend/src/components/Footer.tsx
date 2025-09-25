import { Link } from "react-router-dom"
import "../styles/Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">© 2024 Just Events. All rights reserved.</p>
          <Link to="/about-us" className="footer-button">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
