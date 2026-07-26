import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>

      {" | "}

      <Link to="/projects">Projects</Link>

      {" | "}

      <Link to="/contact">Contact</Link>
    </nav>
  );
}

export default NavBar;
>>>>>>> 747cae4 (Update portfolio: update name and router fixes)
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>

      {" | "}

      <Link to="/projects">
        Projects
      </Link>

      {" | "}

      <Link to="/contact">
        Contact
      </Link>
    </nav>
  );
}

export default NavBar;
 747cae4 (Update portfolio: update name and router fixes)
