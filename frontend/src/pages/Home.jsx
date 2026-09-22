import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">

        <Link to="/" className="home-logo">
          Medora
        </Link>

        <div className="home-nav-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#tests">Tests</a>
          <a href="#about">About</a>
        </div>

        <Link to="/login" className="home-nav-button">
          Get Started
        </Link>

      </nav>


      {/* ================= HERO ================= */}
      <section id="home" className="home-hero">

        <div className="hero-left">

          <div className="hero-label">
            <span className="label-dot"></span>
            SMARTER HEALTH GUIDANCE
          </div>

          <h1>
            Understand your
            <span> laboratory results.</span>
          </h1>

          <p className="hero-text">
            Medora helps you understand your laboratory
            test results through simple, clear and accessible
            health information.
          </p>

          <div className="hero-actions">

            <Link
              to="/login"
              className="hero-primary-button"
            >
              Get Started
              <span>→</span>
            </Link>

            <a
              href="#how-it-works"
              className="hero-secondary-button"
            >
              Learn More
            </a>

          </div>

          <div className="hero-note">
            <span>✓</span>
            Simple & easy to understand
          </div>

        </div>


        {/* ================= HERO VISUAL ================= */}
        <div className="hero-visual">

          <div className="visual-glow"></div>

          <div className="health-card main-health-card">

            <div className="health-card-top">

              <div>
                <span className="small-label">
                  LABORATORY REPORT
                </span>

                <h3>
                  Blood Test
                </h3>
              </div>

              <div className="health-icon">
                +
              </div>

            </div>


            <div className="result-row">

              <div>
                <span>Hemoglobin</span>
                <small>g/dL</small>
              </div>

              <div className="result-value">
                13.8
              </div>

              <div className="result-status">
                Within range
              </div>

            </div>


            <div className="result-row">

              <div>
                <span>Glucose</span>
                <small>mg/dL</small>
              </div>

              <div className="result-value">
                96
              </div>

              <div className="result-status">
                Within range
              </div>

            </div>


            <div className="result-row">

              <div>
                <span>Creatinine</span>
                <small>mg/dL</small>
              </div>

              <div className="result-value">
                0.9
              </div>

              <div className="result-status">
                Within range
              </div>

            </div>


            <div className="card-footer">
              <span className="footer-check">✓</span>
              Results analyzed successfully
            </div>

          </div>


          <div className="floating-card floating-card-top">

            <div className="floating-icon">
              ✓
            </div>

            <div>
              <strong>Easy to understand</strong>
              <span>Clear explanations</span>
            </div>

          </div>


          <div className="floating-card floating-card-bottom">

            <div className="floating-number">
              6
            </div>

            <div>
              <strong>Test categories</strong>
              <span>Available in Medora</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= TRUST STRIP ================= */}
      <section className="trust-strip">

        <div>
          <strong>6+</strong>
          <span>Laboratory Tests</span>
        </div>

        <div>
          <strong>Simple</strong>
          <span>Health Information</span>
        </div>

        <div>
          <strong>AI</strong>
          <span>Assisted Guidance</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Accessible</span>
        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="how-section"
      >

        <div className="section-intro">

          <span className="section-tag">
            HOW IT WORKS
          </span>

          <h2>
            Understanding your results
            <span> made simpler.</span>
          </h2>

          <p>
            Medora turns laboratory values into simple,
            easy-to-understand information.
          </p>

        </div>


        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              +
            </div>

            <h3>
              Enter your results
            </h3>

            <p>
              Enter the values shown on your
              laboratory report.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              ◉
            </div>

            <h3>
              Analyze
            </h3>

            <p>
              Medora compares your results with
              appropriate reference ranges.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              ✓
            </div>

            <h3>
              Understand
            </h3>

            <p>
              Get clear information about what
              your reported values mean.
            </p>

          </div>

        </div>

      </section>


      {/* ================= TESTS ================= */}
      <section
        id="tests"
        className="tests-section"
      >

        <div className="section-intro">

          <span className="section-tag">
            LABORATORY TESTS
          </span>

          <h2>
            Explore your
            <span> test results.</span>
          </h2>

          <p>
            Medora supports several common laboratory
            test categories.
          </p>

        </div>


        <div className="tests-grid">

          <div className="test-card">
            <div className="test-icon">🩸</div>
            <h3>Complete Blood Count</h3>
            <p>
              Understand important blood cell
              measurements.
            </p>
          </div>


          <div className="test-card">
            <div className="test-icon">🩸</div>
            <h3>Blood Glucose</h3>
            <p>
              Review your blood sugar measurements
              and reference ranges.
            </p>
          </div>


          <div className="test-card">
            <div className="test-icon">❤️</div>
            <h3>Lipid Profile</h3>
            <p>
              Understand cholesterol and
              triglyceride results.
            </p>
          </div>


          <div className="test-card">
            <div className="test-icon">🧪</div>
            <h3>Liver Function</h3>
            <p>
              Review commonly reported liver
              function measurements.
            </p>
          </div>


          <div className="test-card">
            <div className="test-icon">🧪</div>
            <h3>Kidney Function</h3>
            <p>
              Understand important kidney
              function measurements.
            </p>
          </div>


          <div className="test-card">
            <div className="test-icon">🦋</div>
            <h3>Thyroid Function</h3>
            <p>
              Review thyroid-related laboratory
              measurements.
            </p>
          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="about-section"
      >

        <div className="about-content">

          <span className="section-tag">
            ABOUT MEDORA
          </span>

          <h2>
            Health information
            <span> made easier.</span>
          </h2>

          <p>
            Laboratory reports can contain many unfamiliar
            numbers, abbreviations and reference ranges.
            Medora is designed to make these results easier
            to understand by presenting them in a simple
            and accessible way.
          </p>

          <p>
            Medora provides general health information and
            is not intended to replace professional medical
            advice, diagnosis or treatment.
          </p>

          <Link
            to="/login"
            className="about-button"
          >
            Explore Medora →
          </Link>

        </div>


        <div className="about-visual">

          <div className="about-circle circle-one"></div>
          <div className="about-circle circle-two"></div>

          <div className="about-center-card">

            <div className="about-center-icon">
              +
            </div>

            <strong>
              Medora
            </strong>

            <span>
              Health guidance made simpler
            </span>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div>

          <span className="section-tag">
            GET STARTED
          </span>

          <h2>
            Ready to understand
            <span> your results?</span>
          </h2>

          <p>
            Start exploring your laboratory results
            with Medora.
          </p>

          <Link
            to="/login"
            className="cta-button"
          >
            Get Started →
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="footer-logo">
          Medora
        </div>

        <p>
          Health guidance made simpler.
        </p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#tests">Laboratory Tests</a>
        </div>

        <div className="footer-bottom">
          © 2026 Medora. General health information only.
        </div>

      </footer>

    </div>
  )
}

export default Home