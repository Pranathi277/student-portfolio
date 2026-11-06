import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../styles/login.css";

export default function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiService.signup({
        name: user.name,
        email: user.email,
        password: user.password,
        summary: "New User",
      });

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userName", result.user.name);
        
        alert("Signup Successful! You can now login.");
        navigate("/");
      } else {
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-text">
          Already have an account? <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}
