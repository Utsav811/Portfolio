const projects = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A React + Vite portfolio built with reusable components.',
  },
  {
    id: 2,
    title: 'Task Tracker App',
    description: 'A simple to-do list app using React state and props.',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Displays live weather data fetched from a public API.',
  },
]

function Projects() {
  return (
    <section className="projects" id="projects">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <div className="project-card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects
