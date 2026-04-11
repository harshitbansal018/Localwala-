import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Remove error when user types
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    let newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // 📩 Professional WhatsApp message
    let text = `✨ *New Contact Request - Localwala*\n\n`;
    text += `👤 *Name:* ${formData.name}\n`;
    text += `📧 *Email:* ${formData.email}\n`;
    text += `💬 *Message:*\n${formData.message}\n\n`;
    text += `📌 _Please respond at your earliest convenience._`;

    const encodedText = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/918591707091?text=${encodedText}`;

    setTimeout(() => {
      window.open(whatsappURL, "_blank");

      alert("✅ Redirecting to WhatsApp...");

      setLoading(false);

      setFormData({
        name: "",
        email: "",
        message: "",
      });

    }, 800);
  };

  return (
    <div className="contact-page">
      <div className="contact-overlay">
        <div className="contact-box">
          <h2>Contact Us</h2>
          <p className="contact-subtitle">
            Have questions? Reach out to us instantly via WhatsApp.
          </p>

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            {/* MESSAGE */}
            <textarea
              name="message"
              placeholder="Type your message..."
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <p className="error">{errors.message}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Redirecting..." : "Send via WhatsApp"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;