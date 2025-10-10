import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../styles/globals.css";
import "../styles/LoginForm.css";
import { useAuth } from "../context/auth/AuthContext";
import { Button } from "../components/ui/Button";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { t } = useTranslation();
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
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setErrorMessage(result.message ?? t("login.errorDefault"));
      setLoading(false);
      return;
    }

    if (result.userRole === "admin") navigate("/admin/dashboard");
    else navigate("/");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="login-container">
        <div className="container">
          <div className="login-form-wrapper">
            <h2 className="login-form-title">
              {t("login.welcomeTitle")}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {t("login.emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder={t("login.emailPlaceholder")}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  {t("login.passwordLabel")}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder={t("login.passwordPlaceholder")}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {errorMessage && (
                <p
                  className="error-message"
                  style={{ color: "red", marginTop: "10px" }}
                >
                  {errorMessage}
                </p>
              )}

              <div className="form-actions">
                <Button type="submit" variant="default" disabled={loading}>
                  {loading ? t("login.signingIn") : t("login.signIn")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
