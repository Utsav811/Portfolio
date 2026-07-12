import Header from './components/Header'
import NavBar from './components/NavBar'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Footer from './components/Footer'
import './App.css'

const skillList = ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Git', 'Python', 'NumPy', 'Pandas', 'Seaborn', 'Matplotlib', 'MongoDB', 'SQL', ]

function App() {
  return (
    <div className="app">
      <Header name="Utsav's Portfolio" themeColor="#2563eb" />
      <NavBar />
      <main>
        <About />
        <Skills skillList={skillList} />
        <Projects />
      </main>
      <Footer />
    </div>
  )
}

export default App
