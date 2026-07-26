function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <p>Contact: student@example.com</p>
      <p>&copy; {year} Student Portfolio. All rights reserved.</p>
    </footer>
  )
}

export default Footer
