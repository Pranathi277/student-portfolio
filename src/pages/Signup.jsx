import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          summary: "New User",
        }),
      });

      if (response.ok) {
        const savedUser = await response.json();
        // Since it's just signup, maybe they need to login or we log them in implicitly
        // We'll just guide them to login to be safe, or log them in directly
        localStorage.setItem("user", JSON.stringify(savedUser));
        localStorage.setItem("userName", savedUser.name);
        
        alert("Signup Successful! You can now login.");
        navigate("/");
      } else {
        alert("Signup failed. Email might already be in use.");
      }
    } catch (error) {
      console.error("Backend error:", error);
      alert("Server error. Please try again later.");
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

          <button type="submit" className="login-btn">Sign Up</button>
        </form>

        <p className="signup-text">
          Already have an account? <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}
