import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  // ✅ state (you were missing this)
  const [login, setLogin] = useState({ email: "", password: "" });
  
  // Captcha state
  const [captchaText, setCaptchaText] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setCaptchaAnswer(result);
    setUserCaptcha("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userCaptcha !== captchaAnswer) {
      alert("Incorrect CAPTCHA answer!");
      generateCaptcha();
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: login.email,
          password: login.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("userName", data.name);
        //Authentication state management
        //sm - track the user data and login status in localStorage for session persistence across page reloads and browser sessions. This allows the app to remember the user and maintain their logged-in state until they choose to log out or clear their browser data.
        localStorage.setItem("currentUser", data.email);
        localStorage.setItem("loggedIn", "true");
//error handling - alert for successful login and invalid credentials
        alert("Login Successful!");
        navigate("/dashboard"); // keep safe (or "/dashboard" if exists)
      } else {
        alert("Invalid Credentials");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  // ✅ return INSIDE function
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

          <div style={{ marginTop: '15px', marginBottom: '10px' }}>
            <label>Type the characters shown</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ 
                padding: '8px 15px', 
                background: `repeating-linear-gradient(
                  45deg,
                  #f1f5f9,
                  #f1f5f9 10px,
                  #e2e8f0 10px,
                  #e2e8f0 20px
                )`,
                borderRadius: '4px', 
                fontWeight: 'bolder',
                letterSpacing: '4px',
                fontSize: '24px',
                fontFamily: 'monospace',
                color: '#475569',
                userSelect: 'none',
                fontStyle: 'italic',
                textDecoration: 'line-through'
              }}>{captchaText}</span>
              <input
                style={{ marginBottom: '0', width: '100px' }}
                type="text"
                placeholder="Captcha"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                required
              />
              <span style={{ cursor: 'pointer', fontSize: '20px' }} onClick={generateCaptcha} title="Refresh Captcha">🔄</span>
            </div>
          </div>

          <p className="forgot" style={{ cursor: 'pointer' }} onClick={() => navigate("/forgot-password")}>Forgot Password?</p>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
