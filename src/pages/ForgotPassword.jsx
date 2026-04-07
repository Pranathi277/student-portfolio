import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("OTP sent! Please check your email (or backend console if testing locally).");
        setStep(2);
      } else {
        alert(data.message || "Error sending OTP");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Password reset successfully! You can now login.");
        navigate("/");
      } else {
        alert(data.message || "Invalid OTP or error resetting password");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo-box">🔒</div>
        <h2>Reset Password</h2>
        <p className="subtitle">Recover your Student Projects account</p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <label>Registered Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p className="forgot" onClick={() => navigate("/")} style={{cursor: 'pointer', textAlign: 'center', marginTop: '15px'}}>
              Back to Login
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset & Save Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
