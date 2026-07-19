function Skills({ skillList }) {
  return (
    <section className="skills">
      <h2>My Skills</h2>
      <ul>
        {skillList.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  )
}

export default Skills
