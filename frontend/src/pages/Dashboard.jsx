import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const storedUser = JSON.parse(
    localStorage.getItem('medoraUser')
  )

  const userName = storedUser?.name || 'User'

  const handleLogout = () => {
    localStorage.removeItem('medoraUser')
    navigate('/login')
  }

  const tests = [
    {
      title: 'Complete Blood Count',
      shortName: 'CBC',
      description:
        'Analyze red blood cells, white blood cells, hemoglobin and platelets.',
      path: '/test-results/cbc',
    },
    {
      title: 'Blood Glucose',
      shortName: 'Glucose',
      description:
        'Understand your blood glucose results and reference ranges.',
      path: '/test-results/blood-glucose',
    },
    {
      title: 'Lipid Profile',
      shortName: 'Lipid',
      description:
        'Review cholesterol and triglyceride results.',
      path: '/test-results/lipid',
    },
    {
      title: 'Liver Function',
      shortName: 'LFT',
      description:
        'Understand important liver function test results.',
      path: '/test-results/lft',
    },
    {
      title: 'Kidney Function',
      shortName: 'Kidney',
      description:
        'Review kidney-related laboratory parameters.',
      path: '/test-results/kidney',
    },
    {
      title: 'Thyroid Function',
      shortName: 'Thyroid',
      description:
        'Understand thyroid hormone and antibody results.',
      path: '/test-results/thyroid',
    },
  ]

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <Link
          to="/"
          className="dashboard-logo"
        >
          Medora
        </Link>

        <div className="dashboard-nav-right">

          <Link
            to="/"
            className="home-link"
          >
            Home
          </Link>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN CONTENT */}

      <main className="dashboard-container">

        {/* WELCOME */}

        <section className="welcome-section">

          <div>

            <p className="dashboard-label">
              YOUR DASHBOARD
            </p>

            <h1>
              Welcome back, {userName}
            </h1>

            <p>
              Manage your laboratory reports and
              understand your health information
              in one place.
            </p>

          </div>

          <div className="welcome-icon">
            +
          </div>

        </section>


        {/* QUICK ANALYSIS */}

        <section className="quick-section">

          <div className="section-title">

            <div>

              <p className="dashboard-label">
                QUICK ANALYSIS
              </p>

              <h2>
                Analyze a laboratory report
              </h2>

            </div>

            <Link
              to="/test-results"
              className="view-all-link"
            >
              View all →
            </Link>

          </div>


          <div className="quick-card">

            <div className="quick-icon">
              +
            </div>

            <div className="quick-content">

              <h3>
                Start a new analysis
              </h3>

              <p>
                Select a laboratory test and enter
                the values from your report to get
                easy-to-understand information.
              </p>

            </div>

            <Link
              to="/test-results"
              className="quick-button"
            >
              Start Analysis
            </Link>

          </div>

        </section>


        {/* RECENT REPORTS */}

        <section className="recent-section">

          <div className="section-title">

            <div>

              <p className="dashboard-label">
                YOUR REPORTS
              </p>

              <h2>
                Recent reports
              </h2>

            </div>

          </div>


          <div className="empty-reports">

            <div className="empty-icon">
              ✓
            </div>

            <h3>
              No recent reports
            </h3>

            <p>
              Your analyzed laboratory reports
              will appear here.
            </p>

            <Link
              to="/test-results"
              className="secondary-button"
            >
              Analyze your first report
            </Link>

          </div>

        </section>


        {/* AVAILABLE TESTS */}

        <section className="tests-section">

          <div className="section-title">

            <div>

              <p className="dashboard-label">
                LABORATORY REPORTS
              </p>

              <h2>
                Available tests
              </h2>

              <p>
                Choose a test to enter and analyze
                your laboratory results.
              </p>

            </div>

          </div>


          <div className="tests-grid">

            {tests.map((test) => (

              <Link
                to={test.path}
                className="test-card"
                key={test.shortName}
              >

                <div className="test-card-top">

                  <div className="test-icon">
                    +
                  </div>

                  <span>
                    →
                  </span>

                </div>

                <h3>
                  {test.title}
                </h3>

                <p>
                  {test.description}
                </p>

                <div className="test-action">
                  Analyze {test.shortName}
                </div>

              </Link>

            ))}

          </div>

        </section>


        {/* PROFILE */}

        <section className="profile-section">

          <div className="profile-content">

            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>

              <p className="dashboard-label">
                YOUR PROFILE
              </p>

              <h2>
                {userName}
              </h2>

              <p>
                {storedUser?.email ||
                  'Your account information'}
              </p>

            </div>

          </div>

          <button
            className="profile-logout"
            onClick={handleLogout}
          >
            Sign out
          </button>

        </section>


        {/* DISCLAIMER */}

        <div className="dashboard-disclaimer">

          <strong>
            Health information notice
          </strong>

          <p>
            Medora provides general health information
            to help you understand laboratory results.
            It does not provide a medical diagnosis.
            Always consult a qualified healthcare
            professional for medical advice.
          </p>

        </div>

      </main>


      {/* FOOTER */}

      <footer className="dashboard-footer">

        <p>
          © 2026 Medora. Health guidance made simpler.
        </p>

      </footer>

    </div>
  )
}

export default Dashboard