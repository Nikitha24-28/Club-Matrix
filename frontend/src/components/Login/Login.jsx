import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      if (location.state.email) {
        setEmail(location.state.email);
      }
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const role = response.data.role;
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      toast.success("Login successful! Welcome back to Club Matrix");

      if (role === "ADMIN") {
        window.location.href = "/AdminDashboard";
      } else {
        window.location.href = "/CommunityPage";
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Login failed");
      } else {
        setError("Server error. Please try again.");
      }

      toast.error(
        error.response?.data?.error ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1 className="login-title">Club Matrix</h1>
            <p className="login-subtitle">Sign in to continue</p>
          </div>

          <div className="login-card">
            {error && (
              <div className="error-alert">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="signup-section">
              <p className="signup-text">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="signup-link"
                  onClick={() => navigate("/signup")}
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Connect. Collaborate. Create.</h2>
          <p className="hero-description">
            Join our community and unlock endless possibilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;