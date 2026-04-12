import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import "../css/Login.css";
import { apiRequest } from "../utils/APIrequest";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/utils";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const data = await apiRequest({
        url: `${BASE_URL}/users/login`,
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: formData.toString(),
      });

      const userInfo = await apiRequest({
        url: `${BASE_URL}/users/me`,
        method: "GET",
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      localStorage.setItem("current_user", JSON.stringify(userInfo));
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("role", data.role);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout login-layout-simple">
        <section className="login-showcase" aria-hidden="true">
          <div className="login-showcase-brand">
            <span className="login-showcase-mark">R1</span>
            <div>
              <strong>R1 Car Care</strong>
              <small>Staff dashboard</small>
            </div>
          </div>

          <div className="login-showcase-copy">
            <span className="login-kicker">Secure access</span>
            <h1>Simple staff login for daily wash operations.</h1>
            <p>Sign in to manage bookings, customers, packages, and the wash queue.</p>
          </div>

          <div className="login-showcase-note">
            <strong>Staff only</strong>
            <span>Use your assigned credentials to continue.</span>
          </div>
        </section>

        <section className="login-panel">
          <button className="login-back" type="button" onClick={() => navigate("/")}>
            <ChevronLeft size={16} />
            <span>Back to homepage</span>
          </button>

          <div className="login-panel-head">
            <div className="login-brand">
              <span className="login-brand-mark">R1</span>
              <div>
                <strong>R1 Car Care</strong>
                <small>Staff sign in</small>
              </div>
            </div>

            <div>
              <h2 className="login-title">Login</h2>
              <p className="login-subtitle">Enter your username and password to open the dashboard.</p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {errorMessage && (
              <div className="login-error" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="login-actions">
              <button className="btn-login" type="submit">
                Sign In
              </button>
              <span className="login-help">Staff access only</span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
