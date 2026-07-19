import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="contact-container">
      <h1>Contact Me</h1>

      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>
        <strong>Name:</strong> {name}
      </p>

      <p>
        <strong>Character Count:</strong> {name.length}
      </p>

      <button onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? "Hide Help" : "Show Help"}
      </button>

      {showHelp && (
        <p>
          Please enter your full name in the text box above.
        </p>
      )}
    </div>
  );
}

export default Contact;