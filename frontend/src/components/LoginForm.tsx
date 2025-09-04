"use client"
import React, { useState } from "react"
import Button from "./Button"
import "../styles/LoginForm.css"

type FormData = {
  email: string
  password: string
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

   
    setTimeout(() => {
      console.log("Login attempt:", formData)
      setLoading(false)
      
    }, 2000)
  }

  return (
    <div className="login-container">
      <div className="container">
        <div className="login-form-wrapper">
          <h2 className="login-form-title">Welcome TO Just Events</h2>
          

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" fullWidth loading={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              {/* <div className="forgot-password">
                <Button variant="link">Forgot your password?</Button>
              </div> */}
            </div>
          </form>

          {/* <div className="signup-link">
            Don&apos;t have an account? <a href="/signup">Sign up here</a>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default LoginForm
