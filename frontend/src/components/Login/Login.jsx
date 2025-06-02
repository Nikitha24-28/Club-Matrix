import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error message state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      const role = response.data.role;
      localStorage.setItem("role",role);
      role==="ADMIN"?window.location.href="/AdminDashboard":window.location.href="/CommunityPage";
      localStorage.setItem('email', email);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || 'Login failed');
      } else {
        setError('Server error');
      }
    }
  };
  return (
    <div className="loginpage">
      <div className="container">
        <h3 className="content">Club Matrix</h3>
        {error && <p className="error-message">{error}</p>}

       
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-label">Email</label>
          <input
            className="form-input" type="email"
            name="email" placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />

          <label className="form-label">Password</label>
          <input
            className="form-input" type="password"
            name="password" placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input className="submit-button" type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default Login;