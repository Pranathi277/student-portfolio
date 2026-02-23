import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === login.email &&
      storedUser.password === login.password
    ) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", login.email);
      // Store user name if available
      if (storedUser.name) {
        localStorage.setItem("userName", storedUser.name);
      }
      navigate("/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo-box">🎓</div>
        <h2>Student Projects</h2>
        <p className="subtitle">Portfolio Platform</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            required
          />

          <p className="forgot">Forgot Password?</p>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-text">
          Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}