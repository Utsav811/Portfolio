import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Projects from "./components/Projects";
import NotFound from "./pages/NotFound";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  );
}

export default App;
>>>>>>> 747cae4 (Update portfolio: update name and router fixes)
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Projects from "./components/Projects";
import NotFound from "./pages/NotFound";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  );
}

export default App;
>>>>>>> 747cae4 (Update portfolio: update name and router fixes)
