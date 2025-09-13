import "../styles/Header.css"

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo">
            Just Events
          </a>
          {/* TO DO: add dark mode and language button */}
          <h1 className="header-title">buttons</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
