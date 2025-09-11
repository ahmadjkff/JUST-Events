import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import "../styles/globals.css";
import "../styles/LoginForm.css";
import { useAuth } from "../context/auth/AuthContext";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    // setLoading(true);
    // setErrorMessage(null);

    // try {

    //   const result = await login(formData.email, formData.password);
    //   const loggedInUser = result.data.user;


    //   if (loggedInUser.role === "admin") {
    //     navigate("/admin"); 
    //   } else if (loggedInUser.role === "supervisor") {
    //     navigate("/supervisor"); 
    //   } else if (loggedInUser.role === "student") {
    //     navigate("/student"); 
    //   } else {
    //     navigate("/");
    //   }

    // } catch (err: any) {
    //   console.error("Login failed:", err);
    //   setErrorMessage(err.message || "Login failed. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

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

              {errorMessage && (
                <p className="error-message" style={{ color: "red", marginTop: "10px" }}>
                  {errorMessage}
                </p>
              )}

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}