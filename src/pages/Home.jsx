import { useState } from "react";
import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import "../App.css";

const skillList = [
  "Python",
  "JavaScript",
  "React",
  "HTML/CSS",
  "C",
  "C++",
  "Java",
  "Node.js",
  "MongoDB",
  "MySQL",
  "NumPy",
  "Pandas",
  "Matplotlib",
  "OpenCV",
  "Seaborn",
  "MediaPipe",
  "TensorFlow",
  "Git & GitHub",
];

function Home() {
  // State for showing/hiding the About section
  const [showAbout, setShowAbout] = useState(true);

  return (
    <div className="app">
      <Header
        name="Utsav's Portfolio"
        themeColor="#334155"
      />

      <main>
        {/* Hide/Show About Button */}
        <button
          onClick={() => setShowAbout(!showAbout)}
        >
          {showAbout ? "Hide About" : "Show About"}
        </button>

        {/* About Section */}
        {showAbout && <About />}

        {/* Skills Section */}
        <Skills skillList={skillList} />
      </main>

      <Footer />
    </div>
  );
}

export default Home;