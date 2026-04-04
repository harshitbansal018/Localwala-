import { useState } from "react";
import "./Contact.css";

function Contact() {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const handleSubmit = async (e) => {
e.preventDefault();


try {
  const res = await fetch("http://localhost:5000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      message
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Message sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  } else {
    alert(data.message || "Something went wrong");
  }

} catch (error) {
  console.error(error);
  alert("Server error");
}


};

return ( <div className="contact-page"> <div className="contact-overlay"> <div className="contact-box"> <h2>Contact Us</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit">
          Send Message
        </button>

      </form>
    </div>
  </div>
</div>


);
}

export default Contact;
