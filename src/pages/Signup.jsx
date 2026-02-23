import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userName", user.name);
    alert("Signup Successful!");
    navigate("/");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo-box">🎓</div>
        <h2>Student Projects</h2>
        <p className="subtitle">Portfolio Platform</p>

        <form onSubmit={handleSignup}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />

          <button type="submit" className="login-btn">Sign Up</button>
        </form>

        <p className="signup-text">
          Already have an account? <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}