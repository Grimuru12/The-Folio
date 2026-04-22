import { useState } from 'react';
import { validateContactForm } from '../utils/formValidation';

function Contact() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateContactForm(formData);
    
    if (Object.keys(formErrors).length === 0) {
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      setFormData({ username: '', email: '', message: '' });
      setErrors({});
    } else {
      setErrors(formErrors);
      setSubmitMessage('');
    }
  };

  return (
    <main className="main">
      <div className="container-contact">
        <h1>Get In Touch</h1>
        
        {/* Contact Information Section */}
        <div className="sectional">
          <h2>Contact Information</h2>
          <div className="flexbox">
            <div className="box">
              <h3>Direct Contact</h3>
              <p>
                <strong>Email:</strong> <a href="mailto:jgbuca_dummy@gmail.com">jgbuca_dummy@gmail.com</a>
              </p>
              <p>
                <strong>Phone:</strong> 0909-###-####
              </p>
              <p>
                <strong>Social:</strong> Twitter/X Account
              </p>
            </div>
            <div className="box">
              <h3>My Projects</h3>
              <p>
                <a href="#projects">Platformer Game</a>
              </p>
              <p>
                <a href="#projects">Portfolio Website</a>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form and Map Section */}
        <div className="flexbox">
          {/* Email/Message Form */}
          <div className="container-email">
            <form onSubmit={handleSubmit}>
              <h2>Send Me a Message</h2>
              <div className="login">
                <label htmlFor="username">Your Name</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>
              <div className="login">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="login">
                <label htmlFor="message">Message</label>
                <input
                  type="text"
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                />
                {errors.message && <span className="error">{errors.message}</span>}
              </div>

              <button type="submit">Send Message</button>
              {submitMessage && <div className="success-message">{submitMessage}</div>}
            </form>
          </div>

          {/* Map */}
          <div className="container-email">
            <h2>Working Location</h2>
            <iframe
              title="Map"
              width="100%"
              height="350"
              style={{ border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '8px' }}
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-5, -5, 5, 5&layer=mapnik&marker=0,0"
            ></iframe>
          </div>
        </div>

        {/* Resources Section */}
        <div className="sectional">
          <h2>Useful Resources</h2>
          <table>
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Description</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MDN Web Docs</td>
                <td>Trusted documentation and learning resources for web technologies.</td>
                <td><a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">Visit</a></td>
              </tr>
              <tr>
                <td>Stack Overflow</td>
                <td>Developer community for asking and answering programming questions.</td>
                <td><a href="https://stackoverflow.com" target="_blank" rel="noopener noreferrer">Visit</a></td>
              </tr>
              <tr>
                <td>freeCodeCamp</td>
                <td>Free platform offering coding tutorials, projects, and certifications.</td>
                <td><a href="https://www.freecodecamp.org" target="_blank" rel="noopener noreferrer">Visit</a></td>
              </tr>
              <tr>
                <td>GitHub</td>
                <td>Platform for hosting, sharing, and collaborating on code repositories.</td>
                <td><a href="https://github.com" target="_blank" rel="noopener noreferrer">Visit</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Policy & shortcut email */}
      <footer className="privacy">
        <p>
          Email: <a href="mailto:jgbuca_dummy@gmail.com">jgbuca_dummy@gmail.com</a>
          <span style={{ margin: '0 16px' }}>•</span>
          <a href="#privacy-policy">&copy; 2026 - Portfolio - Privacy Policy</a>
        </p>
      </footer>
    </main>
  );
}

export default Contact;