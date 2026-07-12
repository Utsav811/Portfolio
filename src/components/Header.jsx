function Header({ name, themeColor }) {
  return (
    <header className="site-header" style={{ backgroundColor: themeColor }}>
      <h1>{name}</h1>
      <p className="tagline">Welcome to my personal portfolio page</p>
    </header>
  )
}

export default Header
