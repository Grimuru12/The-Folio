import { Link } from 'react-router-dom';
import tempImg from '../assets/temp-img.jpg';

function About() {
  return (
    <main className="main">
      {/* Self Introduction */}
      <div className="content">
        <h2>Introduction</h2>
        <br />
        <p>Hi, my name is <strong>John Gerald J. Buca.</strong></p>
        <p>a Full Stack Game Developer, and welcome to my student portfolio website.</p>
        <br />
        <p>I am a <strong>Computer Science</strong> student, who excels in <strong>Java Object Oriented Programming, C#/C++ base games</strong> and <strong>Gdscripts</strong>. <br />
          I make Indie games, databases, and mobile apps. I debug and solves bugs, and secures accumulated datas.</p>
      </div>

      {/* Topic */}
      <section className="sectional">
        <h2>What I Love About Coding</h2>

        <div className="flexbox">
          <div>
            <img src={tempImg} alt="Me" />
            <img src={tempImg} alt="Me" />
          </div>
          <div>
            <p>
              I love coding because it allows me to solve problems creatively and build
              things from scratch. <br /> Writing code feels like solving a puzzle, and it's
              rewarding to see my ideas come to life as real applications or websites.
            </p>
          </div>
        </div>
      </section>

      {/* My Journey */}
      <section className="sectional">
        <h2>My Journey with Coding</h2>
        <p>
          My journey with coding started with curiosity and has grown into a strong
          interest in technology. Over time, I have learned new languages, practiced
          regularly, and worked on small projects to improve my skills.
        </p>
      </section>

      <div className="flexbox">
        {/* Timeline */}
        <div className="box">
          <section className="sectional">
            <h2>My Learning Timeline</h2>

            <ol>
              <li>Discovered coding and learned basic computer concepts</li>
              <li>Started with HTML and CSS to build simple web pages</li>
              <li>Learned JavaScript to add interactivity to websites</li>
              <li>Worked on small personal projects and practice exercises</li>
              <li>Continuing to learn more advanced topics and tools</li>
            </ol>
          </section>
        </div>

        {/* Projects */}
        <div className="box">
          <section className="sectional">
            <h2>Projects in work</h2>

            <ol>
              <li>a Platformer game</li>
              <li>a Website</li>
            </ol>
          </section>
        </div>
      </div>

      <div className="sectional">
        <Link to="/game">Try a simple Game?</Link>
      </div>

      {/* Privacy Policy & shortcut email */}
      <footer className="privacy">
        Email: <a href="mailto:jgbuca_dummy@gmail.com" title="Send a mail to: jgbuca_dummy@gmail.com">jgbuca_dummy@gmail.com</a>
        Privacy: <a href="#privacy-policy" style={{ textDecoration: 'none' }}>&copy; 2026 - Portfolio - Privacy Policy</a>
      </footer>
    </main>
  );
}

export default About;