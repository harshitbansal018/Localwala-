import { useState } from "react";
import { Helmet } from "react-helmet"; // ✅ ADD THIS
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

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
    <>
      {/* 🔥 SEO META TAGS */}
      <Helmet>
        <title>Contact Us - Localwala</title>

        <meta
          name="description"
          content="Contact Localwala to create your online shop or get support. Reach out easily via WhatsApp and grow your local business."
        />

        <meta
          name="keywords"
          content="Contact Localwala, support, local business help, online shop support"
        />

        <meta name="author" content="Localwala" />

        {/* Open Graph */}
        <meta property="og:title" content="Contact Localwala" />
        <meta
          property="og:description"
          content="Have questions? Contact Localwala instantly via WhatsApp."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="contact-page">
        <div className="contact-overlay">
          <div className="contact-box">
            <h2>Contact Us</h2>
            <p className="contact-subtitle">
              Have questions? Reach out to us instantly via WhatsApp.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}

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
    </>
  );
}

export default Contact;