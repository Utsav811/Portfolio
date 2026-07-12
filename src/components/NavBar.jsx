import { useState } from 'react'

function NavBar() {
  const sections = ['About', 'Skills', 'Projects', 'Footer']
  const [active, setActive] = useState('About')

  return (
    <nav className="navbar">
      <ul>
        {sections.map((section) => (
          <li
            key={section}
            className={active === section ? 'active' : ''}
            onClick={() => setActive(section)}
          >
            <a href={`#${section.toLowerCase()}`}>{section}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavBar
