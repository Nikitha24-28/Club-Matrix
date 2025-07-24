import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./Login.css";
import communityHero from "./loginimage.webp";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      {/* Left Side - Login Form */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">Club Matrix</h1>
            <p className="login-subtitle">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {/* Login Card */}
          <div className="login-card">
            <div className="card-header">
              <h2 className="card-title">Sign In</h2>
            </div>
            <div className="card-content">
              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
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
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="contact-admin">
                <p className="contact-text">
                  Don't have an account?{" "}
                  <a href="#" className="contact-link">
                    Contact your administrator
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <img
          src={communityHero}
          alt="Community collaboration"
          className="hero-image"
        />
        <div className="hero-gradient"></div>

        {/* Overlay Content */}
        <div className="hero-content">
          <h2 className="hero-title">
            Connect. Collaborate. Create.
          </h2>
          <p className="hero-description">
            Join our vibrant community and unlock endless possibilities for growth and collaboration.
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;