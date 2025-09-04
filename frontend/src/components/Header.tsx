"use client"
import "../styles/Header.css"

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo">
            Just Events
          </a>
          <h1 className="header-title">Login</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
