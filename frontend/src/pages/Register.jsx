import { useState } from 'react'
import './Register.css'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!formData.dateOfBirth) {
      setError('Please enter your date of birth.')
      return
    }

    if (!formData.gender) {
      setError('Please select your gender.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8081/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            password: formData.password,
          }),
        }
      )

      const data = await response.text()

      if (!response.ok) {
        throw new Error(data || 'Registration failed.')
      }

      setMessage(data)

      setFormData({
        name: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-logo">
          Medora
        </div>

        <h1>
          Create your account
        </h1>

        <p className="register-subtitle">
          Create an account to get personalized
          laboratory result information.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">
              Date of birth
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">
                Select your gender
              </option>

              <option value="MALE">
                Male
              </option>

              <option value="FEMALE">
                Female
              </option>

              <option value="OTHER">
                Other
              </option>

              <option value="PREFER_NOT_TO_SAY">
                Prefer not to say
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create Account'}
          </button>

        </form>

        <p className="login-text">
          Already have an account?{' '}
          <a href="/login">
            Sign in
          </a>
        </p>

      </div>

    </div>
  )
}

export default Register